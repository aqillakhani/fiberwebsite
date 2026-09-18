import "server-only";

import { META_FORM_CONSENT_VERSION } from "@/lib/consent";
import type { MappedMetaLead } from "@/lib/meta/lead-webhook";
import type { ServiceabilityResult } from "@/lib/serviceability/classify";
import { createServerClient } from "@/lib/supabase/server";
import type { LeadRecord } from "./lead-record";
import { recordLeadEvents } from "./persist-lead";

const META_UTM_SOURCE = "meta";
const META_UTM_MEDIUM = "paid";

export interface MetaLeadInsert {
  record: LeadRecord;
  created: boolean;
}

/** Stores an instant-form lead once; Meta redelivers webhooks, so an existing `meta_lead_id` is a no-op. */
export async function insertMetaLead(lead: MappedMetaLead, serviceability: ServiceabilityResult | null): Promise<MetaLeadInsert> {
  const supabase = createServerClient();
  const { data: existing } = await supabase.from("public_leads").select("*").eq("meta_lead_id", lead.metaLeadId).maybeSingle();
  if (existing) return { record: existing as LeadRecord, created: false };

  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("public_leads")
    .insert({
      meta_lead_id: lead.metaLeadId,
      first_name: lead.firstName,
      last_name: lead.lastName,
      full_name: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      service_address: lead.serviceAddress,
      city: lead.city,
      state: lead.state,
      zip: lead.zip,
      address_hash: serviceability?.addressHash ?? null,
      current_provider: lead.currentProvider,
      serviceability_status: serviceability?.status ?? null,
      serviceability,
      form_answers: lead.formAnswers,
      lead_channel: "meta_form",
      source: lead.source,
      utm_source: META_UTM_SOURCE,
      utm_medium: META_UTM_MEDIUM,
      utm_campaign: lead.utm.campaign,
      utm_content: lead.utm.content,
      utm_term: lead.utm.term,
      consent_contact: true,
      consent_text_version: META_FORM_CONSENT_VERSION,
      consent_at: now,
    })
    .select("*")
    .single();
  if (error || !row) throw new Error(`public_leads insert (meta) failed: ${error?.message ?? "no row returned"}`);

  const record = row as LeadRecord;
  await recordLeadEvents(record.id, [
    { type: "submitted", payload: { source: lead.source, lead_channel: "meta_form", meta: lead.ids } },
    { type: "consent_captured", payload: { version: META_FORM_CONSENT_VERSION, via: "meta_instant_form" } },
  ]);
  return { record, created: true };
}
