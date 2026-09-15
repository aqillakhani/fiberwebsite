import "server-only";

import type { LeadRecord } from "@/lib/leads/lead-record";

/**
 * Delivers a lead to the ffdealflow CRM intake endpoint (`POST {FFDEALFLOW_INBOUND_URL}`, shared secret in
 * `INBOUND_WEBHOOK_SECRET`). Contract: fiberfast-marketing/inbound/intake-contract.md. Idempotent on `lead.id`.
 */

const SYNC_TIMEOUT_MS = 8000;

export interface CrmSyncSuccess {
  ok: true;
  pinId: string;
  created: boolean;
}
export interface CrmSyncFailure {
  ok: false;
  error: string;
  /** false when the CRM is simply not configured yet — the cron should not keep retrying that. */
  retryable: boolean;
}
export type CrmSyncResult = CrmSyncSuccess | CrmSyncFailure;

export async function syncLeadToCrm(lead: LeadRecord): Promise<CrmSyncResult> {
  const url = process.env.FFDEALFLOW_INBOUND_URL;
  const secret = process.env.INBOUND_WEBHOOK_SECRET;
  if (!url || !secret) return { ok: false, error: "CRM intake not configured", retryable: false };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-inbound-secret": secret },
      body: JSON.stringify(toIntakePayload(lead)),
      signal: AbortSignal.timeout(SYNC_TIMEOUT_MS),
    });
    if (!response.ok) {
      return { ok: false, error: `CRM intake responded ${response.status}`, retryable: response.status >= 500 || response.status === 429 };
    }
    const body = (await response.json()) as { pin_id?: string; created?: boolean };
    if (!body.pin_id) return { ok: false, error: "CRM intake returned no pin_id", retryable: true };
    return { ok: true, pinId: body.pin_id, created: body.created ?? true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "CRM intake request failed", retryable: true };
  }
}

function toIntakePayload(lead: LeadRecord) {
  return {
    idempotency_key: lead.id,
    lead_number: lead.lead_number,
    lead_channel: lead.lead_channel,
    source: lead.source,
    submitted_at: lead.created_at,
    contact: { full_name: lead.full_name, first_name: lead.first_name, last_name: lead.last_name, phone: lead.phone, email: lead.email, date_of_birth: lead.date_of_birth },
    address: {
      line1: lead.service_address,
      city: lead.city,
      state: lead.state,
      zip: lead.zip,
      lat: lead.lat,
      lon: lead.lon,
      accuracy: lead.address_accuracy,
      address_hash: lead.address_hash,
    },
    isp_declared: lead.isp_declared,
    preferred_speed: lead.preferred_speed,
    current_provider: lead.current_provider,
    serviceability: lead.serviceability,
    rep_slug: lead.rep_slug,
    attribution: {
      utm_source: lead.utm_source,
      utm_medium: lead.utm_medium,
      utm_campaign: lead.utm_campaign,
      utm_content: lead.utm_content,
      utm_term: lead.utm_term,
      fbclid: lead.fbclid,
      gclid: lead.gclid,
      landing_path: lead.landing_path,
      referrer: lead.referrer,
    },
    consent: {
      contact: lead.consent_contact,
      text_version: lead.consent_text_version,
      at: lead.consent_at,
      ip: lead.consent_ip,
      user_agent: lead.consent_user_agent,
    },
  };
}
