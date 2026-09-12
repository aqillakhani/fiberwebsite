/**
 * Browser-side analytics. GA4 (`gtag`) and Meta Pixel (`fbq`) are loaded by the root layout when their
 * public env vars exist. The server sends the matching Meta `Lead` via the Conversions API with the same
 * `eventID`, so Meta deduplicates the pair.
 */

type EventParams = Record<string, string | number | boolean | null | undefined>;

export interface LeadTrackingPayload {
  leadId: string;
  source: string;
  status: string;
  isp: string | null;
}

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") window.gtag("event", eventName, params);
}

export function trackLead({ leadId, source, status, isp }: LeadTrackingPayload): void {
  trackEvent("generate_lead", { lead_id: leadId, source, serviceability_status: status, isp: isp ?? "unknown" });
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: source, content_category: status }, { eventID: leadId });
  }
}

export function trackAddressChecked(status: string, isp: string | null): void {
  trackEvent("address_checked", { serviceability_status: status, isp: isp ?? "unknown" });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
