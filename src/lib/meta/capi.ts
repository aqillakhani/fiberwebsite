import "server-only";

import type { LeadRecord } from "@/lib/leads/lead-record";

/**
 * Meta Conversions API — server-side `Lead` event, deduplicated against the browser Pixel by `event_id`
 * (the lead's uuid, which the client also passes to fbq). Env: `NEXT_PUBLIC_META_PIXEL_ID`,
 * `META_CAPI_ACCESS_TOKEN`, optional `META_TEST_EVENT_CODE` while validating in Events Manager.
 */

const GRAPH_VERSION = "v21.0";
const CAPI_TIMEOUT_MS = 5000;

export interface CapiOutcome {
  sent: boolean;
  eventId: string;
  error?: string;
}

export async function sendLeadEvent(lead: LeadRecord, context: { ip: string | null; userAgent: string | null; sourceUrl: string }): Promise<CapiOutcome> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const eventId = lead.id;
  if (!pixelId || !token) return { sent: false, eventId, error: "Meta CAPI not configured" };

  const [nameParts, email, phone, city, state, zip] = await Promise.all([
    hashNameParts(lead.full_name),
    sha256(lead.email?.toLowerCase().trim()),
    sha256(`1${lead.phone}`),
    sha256(lead.city?.toLowerCase().replace(/[^a-z]/g, "")),
    sha256(lead.state?.toLowerCase()),
    sha256(lead.zip?.slice(0, 5)),
  ]);

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(new Date(lead.created_at).getTime() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: context.sourceUrl,
        user_data: {
          em: email ? [email] : undefined,
          ph: [phone],
          fn: nameParts.first ? [nameParts.first] : undefined,
          ln: nameParts.last ? [nameParts.last] : undefined,
          ct: city ? [city] : undefined,
          st: state ? [state] : undefined,
          zp: zip ? [zip] : undefined,
          country: [await sha256("us")],
          client_ip_address: context.ip ?? undefined,
          client_user_agent: context.userAgent ?? undefined,
          fbc: lead.fbc ?? undefined,
          fbp: lead.fbp ?? undefined,
        },
        custom_data: {
          lead_channel: lead.lead_channel,
          serviceability_status: lead.serviceability_status ?? "unknown",
          isp: lead.serviceability?.isp ?? lead.isp_declared ?? "unknown",
        },
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CAPI_TIMEOUT_MS),
    });
    if (!response.ok) return { sent: false, eventId, error: `Graph API responded ${response.status}: ${(await response.text()).slice(0, 300)}` };
    return { sent: true, eventId };
  } catch (error) {
    return { sent: false, eventId, error: error instanceof Error ? error.message : "CAPI request failed" };
  }
}

async function hashNameParts(fullName: string): Promise<{ first?: string; last?: string }> {
  const parts = fullName.toLowerCase().trim().split(/\s+/);
  const first = parts[0];
  const last = parts.length > 1 ? parts.at(-1) : undefined;
  return { first: await sha256(first), last: await sha256(last) };
}

async function sha256(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
