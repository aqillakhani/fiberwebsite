"use server";

import { cookies, headers } from "next/headers";

import {
  ATTRIBUTION_COOKIE,
  FBC_COOKIE,
  FBP_COOKIE,
  REP_COOKIE,
  REP_MODE_COOKIE,
  type StoredAttribution,
} from "@/lib/attribution-cookies";
import { deliverLead } from "@/lib/leads/deliver-lead";
import { formatLeadNumber } from "@/lib/leads/lead-record";
import { insertLead, type LeadRequestContext } from "@/lib/leads/persist-lead";
import { checkServiceability } from "@/lib/serviceability/check";
import type { ServiceabilityResult, ServiceabilityStatus } from "@/lib/serviceability/classify";
import { leadSchema, type LeadData, type LeadInput } from "@/lib/validations/lead-schema";

export interface LeadSubmitSuccess {
  success: true;
  leadId: string;
  leadNumber: string;
  serviceabilityStatus: ServiceabilityStatus;
  isp: string | null;
}
export interface LeadSubmitFailure {
  success: false;
  error: string;
}
export type LeadSubmitResult = LeadSubmitSuccess | LeadSubmitFailure;

const GENERIC_ERROR = "Something went wrong saving your request. Please try again or call us.";
const HONEYPOT_LEAD_NUMBER = "FF-0000";

export async function submitLead(input: LeadInput): Promise<LeadSubmitResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  if (parsed.data.website) return { success: true, leadId: "", leadNumber: HONEYPOT_LEAD_NUMBER, serviceabilityStatus: "unknown", isp: null };

  const context = await readRequestContext();
  const serviceability = await lookupServiceability(parsed.data);

  try {
    const lead = await insertLead(parsed.data, context, serviceability);
    await deliverLead(lead, { ip: context.ip, userAgent: context.userAgent, sourceUrl: context.sourceUrl });
    return {
      success: true,
      leadId: lead.id,
      leadNumber: formatLeadNumber(lead.lead_number),
      serviceabilityStatus: serviceability?.status ?? "unknown",
      isp: serviceability?.isp ?? null,
    };
  } catch (error) {
    console.error("[leads] submit failed", error);
    return { success: false, error: GENERIC_ERROR };
  }
}

async function lookupServiceability(data: LeadData): Promise<ServiceabilityResult | null> {
  try {
    return await checkServiceability({
      address: `${data.serviceAddress}, ${data.city} ${data.state} ${data.zip}`,
      lat: data.lat,
      lon: data.lon,
    });
  } catch (error) {
    console.error("[leads] serviceability lookup failed; storing lead without snapshot", error);
    return null;
  }
}

async function readRequestContext(): Promise<LeadRequestContext & { sourceUrl: string }> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return {
    repSlug: cookieStore.get(REP_COOKIE)?.value ?? null,
    isRepMode: cookieStore.get(REP_MODE_COOKIE)?.value === "1",
    attribution: parseAttribution(cookieStore.get(ATTRIBUTION_COOKIE)?.value),
    fbc: cookieStore.get(FBC_COOKIE)?.value ?? null,
    fbp: cookieStore.get(FBP_COOKIE)?.value ?? null,
    ip: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip"),
    userAgent: headerStore.get("user-agent"),
    sourceUrl: headerStore.get("referer") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com",
  };
}

function parseAttribution(raw: string | undefined): StoredAttribution | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAttribution;
  } catch {
    return null;
  }
}
