type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Meta Pixel
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }
}

export function trackLeadSubmitted(source: string, plan?: string) {
  trackEvent("lead_submitted", { source, plan: plan ?? "none" });
  trackEvent("Lead", { source, content_name: plan ?? "general" });
}

export function trackAvailabilityCheck(address: string) {
  trackEvent("availability_check", { address_partial: address.slice(0, 20) });
}

export function trackPlanSelected(planId: string) {
  trackEvent("plan_selected", { plan: planId });
}

export function trackRepVerified(repId: string) {
  trackEvent("rep_verified", { rep_id: repId });
}

// Type declarations for analytics globals
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}
