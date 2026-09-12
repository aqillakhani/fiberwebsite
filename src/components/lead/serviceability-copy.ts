import type { ServiceabilityResult, ServiceabilityStatus } from "@/lib/serviceability/classify";
import type { LeadFormMode } from "./use-lead-form";

/** Honest wording for each lookup outcome. The ISP is named only here — never before the address check. */

export const ISP_DISPLAY_NAMES: Record<string, string> = {
  kinetic: "Kinetic",
  brightspeed: "Brightspeed",
  frontier: "Frontier",
  att: "AT&T",
  ripple: "Ripple",
};

export type ResultTone = "success" | "info" | "neutral";

export interface ResultCopy {
  tone: ResultTone;
  headline: string;
  detail: string;
  cta: string;
}

export const CLOSER_SLA_MINUTES = Number(process.env.NEXT_PUBLIC_CLOSER_SLA_MINUTES ?? 15);

export function ispDisplayName(isp: string | null | undefined): string {
  return isp ? (ISP_DISPLAY_NAMES[isp] ?? isp) : "Fiber";
}

export function resultCopy(result: ServiceabilityResult | null, mode: LeadFormMode, street: string): ResultCopy {
  const status: ServiceabilityStatus = result?.status ?? "unknown";
  const isp = ispDisplayName(result?.isp);
  const isVerified = result?.confidence === "exact" && result.dataQuality === "verified";

  if (status === "live" && isVerified) {
    return mode === "rep"
      ? { tone: "success", headline: `LIVE — ${isp} Fiber`, detail: "Verified at this exact address. Confirm the ISP below.", cta: "Send to closer" }
      : { tone: "success", headline: `Good news — ${isp} Fiber is available at ${street}.`, detail: `A fiber specialist will call you within about ${CLOSER_SLA_MINUTES} minutes to confirm pricing and set up installation.`, cta: "Get my call" };
  }
  if (status === "live") {
    return mode === "rep"
      ? { tone: "success", headline: `LIKELY LIVE — ${isp}`, detail: "Neighboring homes are live; closer verifies on the call.", cta: "Send to closer" }
      : { tone: "success", headline: `${isp} Fiber appears to serve your street.`, detail: `We'll confirm it for your exact address on a quick call — within about ${CLOSER_SLA_MINUTES} minutes.`, cta: "Get my call" };
  }
  if (status === "coming_soon") {
    return mode === "rep"
      ? { tone: "info", headline: `COMING SOON — ${isp}`, detail: "Capture the lead; closer schedules the follow-up for go-live.", cta: "Send to closer" }
      : { tone: "info", headline: `${isp} Fiber is coming to your neighborhood.`, detail: "Get on the list and we'll call you the day it goes live at your address.", cta: "Put me on the list" };
  }
  return mode === "rep"
    ? { tone: "neutral", headline: "NO DATA for this address", detail: "Pick the ISP you're pitching below; the closer checks every provider by hand.", cta: "Send to closer" }
    : { tone: "neutral", headline: "We couldn't confirm fiber here yet.", detail: "Leave your details — we check every fiber provider by hand and call you either way.", cta: "Check for me" };
}
