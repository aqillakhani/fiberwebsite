import type { ServiceabilityResult } from "@/lib/serviceability/classify";

/** Shape of a `public_leads` row (v2 columns). Kept by hand — the site has no generated Supabase types. */
export interface LeadRecord {
  id: string;
  lead_number: number;
  created_at: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number | null;
  lon: number | null;
  address_accuracy: string | null;
  address_hash: string | null;
  isp_declared: string | null;
  current_provider: string | null;
  serviceability_status: string | null;
  serviceability: ServiceabilityResult | null;
  lead_channel: "web" | "rep" | "meta_form";
  source: string;
  rep_slug: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  gclid: string | null;
  fbc: string | null;
  fbp: string | null;
  landing_path: string | null;
  referrer: string | null;
  consent_contact: boolean;
  consent_text_version: string | null;
  consent_at: string | null;
  consent_ip: string | null;
  consent_user_agent: string | null;
  crm_sync_status: "pending" | "synced" | "failed";
  crm_sync_attempts: number;
  crm_pin_id: string | null;
  notified_at: string | null;
  capi_event_id: string | null;
}

const LEAD_NUMBER_PREFIX = "FF-";

/** What the homeowner and the closer both see: "FF-1042". */
export function formatLeadNumber(leadNumber: number): string {
  return `${LEAD_NUMBER_PREFIX}${leadNumber}`;
}
