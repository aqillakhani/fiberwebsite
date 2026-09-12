import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { StoredAttribution } from "@/lib/attribution-cookies";
import type { ServiceabilityResult } from "@/lib/serviceability/classify";
import type { LeadData } from "@/lib/validations/lead-schema";
import type { LeadRecord } from "./lead-record";

/** Everything the server knows about the request that the client must not be trusted to supply. */
export interface LeadRequestContext {
  repSlug: string | null;
  isRepMode: boolean;
  attribution: StoredAttribution | null;
  fbc: string | null;
  fbp: string | null;
  ip: string | null;
  userAgent: string | null;
}

export type LeadEventType =
  | "submitted"
  | "consent_captured"
  | "crm_synced"
  | "crm_sync_failed"
  | "notified"
  | "notify_failed"
  | "capi_sent"
  | "capi_failed";

const LEAD_COLUMNS = "*";

export async function insertLead(
  data: LeadData,
  context: LeadRequestContext,
  serviceability: ServiceabilityResult | null
): Promise<LeadRecord> {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("public_leads")
    .insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      service_address: data.serviceAddress,
      city: data.city,
      state: data.state,
      zip: data.zip,
      lat: data.lat ?? null,
      lon: data.lon ?? null,
      address_accuracy: data.addressAccuracy ?? null,
      address_hash: serviceability?.addressHash ?? null,
      isp_declared: data.ispDeclared ?? null,
      current_provider: data.currentProvider ?? null,
      serviceability_status: serviceability?.status ?? null,
      serviceability,
      lead_channel: context.isRepMode || context.repSlug ? "rep" : "web",
      source: data.source,
      rep_slug: context.repSlug,
      rep_id: context.repSlug,
      utm_source: context.attribution?.utm_source ?? null,
      utm_medium: context.attribution?.utm_medium ?? null,
      utm_campaign: context.attribution?.utm_campaign ?? null,
      utm_content: context.attribution?.utm_content ?? null,
      utm_term: context.attribution?.utm_term ?? null,
      fbclid: context.attribution?.fbclid ?? null,
      gclid: context.attribution?.gclid ?? null,
      fbc: context.fbc,
      fbp: context.fbp,
      landing_path: context.attribution?.landing_path ?? null,
      referrer: context.attribution?.referrer ?? null,
      consent_contact: data.consentContact,
      consent_text_version: data.consentTextVersion,
      consent_at: now,
      consent_ip: context.ip,
      consent_user_agent: context.userAgent,
    })
    .select(LEAD_COLUMNS)
    .single();

  if (error || !row) throw new Error(`public_leads insert failed: ${error?.message ?? "no row returned"}`);
  const record = row as LeadRecord;
  await recordLeadEvents(record.id, [
    { type: "submitted", payload: { source: data.source, lead_channel: record.lead_channel } },
    { type: "consent_captured", payload: { version: data.consentTextVersion, ip: context.ip, user_agent: context.userAgent } },
  ]);
  return record;
}

export async function updateLead(leadId: string, patch: Partial<LeadRecord> & Record<string, unknown>): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("public_leads").update(patch).eq("id", leadId);
  if (error) throw new Error(`public_leads update failed: ${error.message}`);
}

export async function recordLeadEvents(
  leadId: string,
  events: ReadonlyArray<{ type: LeadEventType; payload?: Record<string, unknown> }>
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("public_lead_events")
    .insert(events.map((event) => ({ lead_id: leadId, event_type: event.type, payload: event.payload ?? {} })));
  if (error) console.error("[leads] event log insert failed", { leadId, error: error.message });
}

/** Leads whose CRM delivery has not succeeded yet, oldest first — drained by the sync cron. */
export async function listUnsyncedLeads(limit: number): Promise<LeadRecord[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("public_leads")
    .select(LEAD_COLUMNS)
    .neq("crm_sync_status", "synced")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(`public_leads query failed: ${error.message}`);
  return (data ?? []) as LeadRecord[];
}
