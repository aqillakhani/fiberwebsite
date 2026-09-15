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

const PUBLIC_CTA = "Get my best offer";
const REP_CTA = "Send to closer";

export function ispDisplayName(isp: string | null | undefined): string {
  if (!isp) return "Fiber";
  return isp in ISP_LABELS ? ISP_LABELS[isp as LeadIsp] : isp;
}

export function resultCopy(result: ServiceabilityResult | null, mode: LeadFormMode, street: string): ResultCopy {
  const status: ServiceabilityStatus = result?.status ?? "unknown";
  const isp = ispDisplayName(result?.isp);
  const isVerified = result?.confidence === "exact" && result.dataQuality === "verified";

  if (status === "live" && isVerified) {
    return mode === "rep"
      ? { tone: "success", headline: `LIVE — ${isp} fiber`, detail: "Verified at this exact address. Confirm the provider below.", cta: REP_CTA }
      : {
          tone: "success",
          headline: `Good news — fiber is live at ${street}.`,
          detail: `Our map shows ${isp} at this exact address. Tell us which provider and speed you want; we find the best promo available to you.`,
          cta: PUBLIC_CTA,
        };
  }
  if (status === "live") {
    return mode === "rep"
      ? { tone: "success", headline: `LIKELY LIVE — ${isp}`, detail: "Neighboring homes are live; closer verifies on the call.", cta: REP_CTA }
      : {
          tone: "success",
          headline: "Fiber appears to serve your street.",
          detail: `Our map shows ${isp} on nearby homes. Tell us which provider and speed you want; we confirm the best offer on a quick call.`,
          cta: PUBLIC_CTA,
        };
  }
  if (status === "coming_soon") {
    return mode === "rep"
      ? { tone: "info", headline: `COMING SOON — ${isp}`, detail: "Capture the lead; closer schedules the follow-up for go-live.", cta: REP_CTA }
      : {
          tone: "info",
          headline: `${isp} fiber is coming to your neighborhood.`,
          detail: "Tell us what you want and we call you the day it goes live — or sooner if another provider already serves you.",
          cta: "Put me on the list",
        };
  }
  return mode === "rep"
    ? { tone: "neutral", headline: "NO DATA for this address", detail: "Pick the provider you're pitching below; the closer checks every provider by hand.", cta: REP_CTA }
    : {
        tone: "neutral",
        headline: `We'll check every provider at ${street}.`,
        detail: "Tell us which provider and speed you want. A specialist checks all of them by hand and calls you with the best offer.",
        cta: PUBLIC_CTA,
      };
}
