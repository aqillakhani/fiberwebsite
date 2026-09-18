import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Meta Lead Ads webhook plumbing: signature check, payload walk, Graph fetch, and mapping of a raw
 * instant-form submission onto our lead shape. Pure functions except `fetchMetaLead` (network).
 */

export const META_GRAPH_VERSION = "v21.0";
const GRAPH_TIMEOUT_MS = 8000;
const LEAD_FIELDS = "id,created_time,field_data,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,platform,is_organic";
const PHONE_DIGITS = 10;
const ZIP_DIGITS = 5;

export interface LeadgenChange {
  leadgenId: string;
  pageId: string | null;
  formId: string | null;
  adId: string | null;
  createdTime: number | null;
}

/** Subset of the Graph `Lead` node we read. */
export interface MetaGraphLead {
  id: string;
  created_time?: string;
  field_data?: ReadonlyArray<{ name: string; values?: ReadonlyArray<string> }>;
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id?: string;
  platform?: string;
  is_organic?: boolean;
}

export interface MappedMetaLead {
  metaLeadId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string | null;
  serviceAddress: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  currentProvider: string | null;
  formAnswers: Record<string, string>;
  source: string;
  utm: { campaign: string | null; content: string | null; term: string | null };
  ids: { form: string | null; ad: string | null; adset: string | null; campaign: string | null };
}

export function verifyMetaSignature(rawBody: string, signatureHeader: string | null, appSecret: string | undefined): boolean {
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const presented = signatureHeader.slice("sha256=".length);
  if (presented.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(presented, "utf8"), Buffer.from(expected, "utf8"));
}

/** Walks `entry[].changes[]` and returns every leadgen event, ignoring anything else Meta might send. */
export function extractLeadgenChanges(payload: unknown): LeadgenChange[] {
  if (!isRecord(payload) || payload.object !== "page" || !Array.isArray(payload.entry)) return [];
  return payload.entry.flatMap((entry) => {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) return [];
    return entry.changes.flatMap((change) => {
      if (!isRecord(change) || change.field !== "leadgen" || !isRecord(change.value)) return [];
      const value = change.value;
      const leadgenId = asString(value.leadgen_id);
      if (!leadgenId) return [];
      return [{
        leadgenId,
        pageId: asString(value.page_id),
        formId: asString(value.form_id),
        adId: asString(value.ad_id),
        createdTime: typeof value.created_time === "number" ? value.created_time : null,
      }];
    });
  });
}

export async function fetchMetaLead(leadgenId: string, pageAccessToken: string): Promise<MetaGraphLead> {
  const url = new URL(`https://graph.facebook.com/${META_GRAPH_VERSION}/${leadgenId}`);
  url.searchParams.set("fields", LEAD_FIELDS);
  url.searchParams.set("access_token", pageAccessToken);
  const response = await fetch(url, { signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`Graph lead fetch ${leadgenId} responded ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return (await response.json()) as MetaGraphLead;
}

/**
 * Meta's standard field names (`full_name`, `phone_number`, `street_address`, `zip_code`…) plus whatever
 * custom questions the form carries. Unknown questions are kept verbatim in `formAnswers`.
 */
export function mapMetaLead(lead: MetaGraphLead): MappedMetaLead {
  const answers = Object.fromEntries((lead.field_data ?? []).map((field) => [field.name, (field.values ?? []).join(", ").trim()]));
  const take = (...names: string[]): string | null => {
    for (const name of names) {
      const value = answers[name];
      if (value) return value;
    }
    return null;
  };
  const { firstName, lastName } = splitName(take("first_name"), take("last_name"), take("full_name"));
  const street = take("street_address", "address", "full_address") ?? "";
  const standard = new Set(["first_name", "last_name", "full_name", "email", "phone_number", "phone", "street_address", "address", "full_address", "city", "state", "province", "zip_code", "post_code", "zip"]);
  return {
    metaLeadId: lead.id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    phone: normalizePhone(take("phone_number", "phone") ?? ""),
    email: take("email"),
    serviceAddress: street || "(no street given — ask on the call)",
    city: take("city"),
    state: normalizeState(take("state", "province")),
    zip: normalizeZip(take("zip_code", "post_code", "zip")),
    currentProvider: take("current_provider", "current_internet_provider", "who_is_your_current_internet_provider?"),
    formAnswers: Object.fromEntries(Object.entries(answers).filter(([name]) => !standard.has(name))),
    source: `meta-form:${lead.form_id ?? "unknown"}`,
    utm: { campaign: lead.campaign_name ?? null, content: lead.ad_name ?? null, term: lead.adset_name ?? null },
    ids: { form: lead.form_id ?? null, ad: lead.ad_id ?? null, adset: lead.adset_id ?? null, campaign: lead.campaign_id ?? null },
  };
}

function splitName(first: string | null, last: string | null, full: string | null): { firstName: string; lastName: string } {
  if (first || last) return { firstName: first ?? "", lastName: last ?? "" };
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Facebook", lastName: "Lead" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === PHONE_DIGITS + 1 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

function normalizeZip(raw: string | null): string | null {
  const digits = raw?.replace(/\D/g, "") ?? "";
  return digits.length >= ZIP_DIGITS ? digits.slice(0, ZIP_DIGITS) : null;
}

const STATE_CODES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO", connecticut: "CT",
  delaware: "DE", "district of columbia": "DC", florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL",
  indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT", nebraska: "NE",
  nevada: "NV", "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY", "north carolina": "NC",
  "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT", virginia: "VA",
  washington: "WA", "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
};

function normalizeState(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
  return STATE_CODES[trimmed.toLowerCase()] ?? trimmed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value) return value;
  if (typeof value === "number") return String(value);
  return null;
}
