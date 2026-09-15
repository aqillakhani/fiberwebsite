import type { LeadCopy } from "@/lib/i18n/lead-copy";
import type { ServiceabilityResult, ServiceabilityStatus } from "@/lib/serviceability/classify";
import { ISP_LABELS, type LeadIsp } from "@/lib/validations/lead-schema";
import type { LeadFormMode } from "./use-lead-form";

/** Honest wording for each lookup outcome. The map result is a hint; the homeowner still picks the provider they want. */

export type ResultTone = "success" | "info" | "neutral";

export interface ResultCopy {
  tone: ResultTone;
  headline: string;
  detail: string;
  cta: string;
}

export const CLOSER_SLA_MINUTES = Number(process.env.NEXT_PUBLIC_CLOSER_SLA_MINUTES ?? 15);

// Rep-mode wording stays English: it is the canvasser's screen, not the homeowner's.
const REP_CTA = "Send to closer";

export function ispDisplayName(isp: string | null | undefined): string {
  if (!isp) return "Fiber";
  return isp in ISP_LABELS ? ISP_LABELS[isp as LeadIsp] : isp;
}

export function resultCopy(result: ServiceabilityResult | null, mode: LeadFormMode, street: string, copy: LeadCopy): ResultCopy {
  const status: ServiceabilityStatus = result?.status ?? "unknown";
  const isp = ispDisplayName(result?.isp);
  const isVerified = result?.confidence === "exact" && result.dataQuality === "verified";
  const text = copy.result;

  if (status === "live" && isVerified) {
    return mode === "rep"
      ? { tone: "success", headline: `LIVE — ${isp} fiber`, detail: "Verified at this exact address. Confirm the provider below.", cta: REP_CTA }
      : { tone: "success", ...text.liveVerified(isp, street), cta: text.ctaPublic };
  }
  if (status === "live") {
    return mode === "rep"
      ? { tone: "success", headline: `LIKELY LIVE — ${isp}`, detail: "Neighboring homes are live; closer verifies on the call.", cta: REP_CTA }
      : { tone: "success", ...text.liveNearby(isp), cta: text.ctaPublic };
  }
  if (status === "coming_soon") {
    return mode === "rep"
      ? { tone: "info", headline: `COMING SOON — ${isp}`, detail: "Capture the lead; closer schedules the follow-up for go-live.", cta: REP_CTA }
      : { tone: "info", ...text.comingSoon(isp), cta: text.ctaComingSoon };
  }
  return mode === "rep"
    ? { tone: "neutral", headline: "NO DATA for this address", detail: "Pick the provider you're pitching below; the closer checks every provider by hand.", cta: REP_CTA }
    : { tone: "neutral", ...text.unknown(street), cta: text.ctaPublic };
}
