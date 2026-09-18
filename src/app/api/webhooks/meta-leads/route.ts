import { NextResponse } from "next/server";

import { deliverLead } from "@/lib/leads/deliver-lead";
import { insertMetaLead } from "@/lib/leads/persist-meta-lead";
import { extractLeadgenChanges, fetchMetaLead, mapMetaLead, verifyMetaSignature, type MappedMetaLead } from "@/lib/meta/lead-webhook";
import { checkServiceability } from "@/lib/serviceability/check";
import type { ServiceabilityResult } from "@/lib/serviceability/classify";

/**
 * Meta Lead Ads webhook. GET = subscription handshake; POST = one or more `leadgen` events.
 * Each lead is fetched from the Graph API with the Page token, stored in `public_leads`
 * (idempotent on `meta_lead_id`), then fanned out exactly like a website lead (alert, CRM, audit).
 * Env: META_APP_SECRET, META_PAGE_ACCESS_TOKEN, META_WEBHOOK_VERIFY_TOKEN.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_URL = "https://www.facebook.com/";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken || params.get("hub.mode") !== "subscribe" || params.get("hub.verify_token") !== verifyToken) {
    return new Response("Forbidden", { status: 403 });
  }
  return new Response(params.get("hub.challenge") ?? "", { status: 200 });
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  if (!verifyMetaSignature(rawBody, request.headers.get("x-hub-signature-256"), process.env.META_APP_SECRET)) {
    return new Response("Bad signature", { status: 401 });
  }
  const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageToken) return NextResponse.json({ error: "META_PAGE_ACCESS_TOKEN not set" }, { status: 503 });

  const changes = extractLeadgenChanges(safeJson(rawBody));
  const outcomes = await Promise.allSettled(changes.map((change) => ingestLead(change.leadgenId, pageToken)));
  const failures = outcomes.flatMap((outcome) => (outcome.status === "rejected" ? [String(outcome.reason)] : []));
  if (failures.length) console.error("[meta-leads] ingest failures", failures);
  // Always 200 once the signature checks out: Meta retries non-2xx for hours and would re-send the good leads too.
  return NextResponse.json({ received: changes.length, failed: failures.length });
}

async function ingestLead(leadgenId: string, pageToken: string): Promise<void> {
  const mapped = mapMetaLead(await fetchMetaLead(leadgenId, pageToken));
  const { record, created } = await insertMetaLead(mapped, await lookupServiceability(mapped));
  if (!created) return;
  await deliverLead(record, { ip: null, userAgent: null, sourceUrl: SOURCE_URL });
}

async function lookupServiceability(lead: MappedMetaLead): Promise<ServiceabilityResult | null> {
  if (!lead.city && !lead.zip) return null;
  try {
    return await checkServiceability({ address: `${lead.serviceAddress}, ${lead.city ?? ""} ${lead.state ?? ""} ${lead.zip ?? ""}` });
  } catch (error) {
    console.error("[meta-leads] serviceability lookup failed; storing lead without snapshot", error);
    return null;
  }
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
