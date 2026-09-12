"use client";

import { CheckCircle2, PhoneCall, RotateCcw } from "lucide-react";

import type { LeadSubmitSuccess } from "@/actions/submit-lead";
import { COMPANY } from "@/lib/constants";
import { CLOSER_SLA_MINUTES, ispDisplayName } from "./serviceability-copy";
import type { LeadFormMode } from "./use-lead-form";

interface LeadConfirmationProps {
  mode: LeadFormMode;
  result: LeadSubmitSuccess;
  firstName: string;
  onNextDoor: () => void;
}

export function LeadConfirmation({ mode, result, firstName, onNextDoor }: LeadConfirmationProps) {
  const isRep = mode === "rep";
  const isComingSoon = result.serviceabilityStatus === "coming_soon";
  const isp = ispDisplayName(result.isp);

  return (
    <section aria-live="polite" className="space-y-5 text-center">
      <CheckCircle2 className="mx-auto size-12 text-fiber-success" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Request number</p>
        <p className="font-mono text-3xl font-bold text-gray-900">{result.leadNumber}</p>
      </div>
      <h3 className="text-xl font-bold text-gray-900">
        {isRep ? `Sent to the closing team.` : `Thanks, ${firstName} — you're in the queue.`}
      </h3>
      <p className="mx-auto max-w-md text-sm text-gray-700">
        {isComingSoon
          ? `We'll call the day ${isp} Fiber goes live at this address. Keep this number handy.`
          : isRep
            ? `A closer calls the homeowner within about ${CLOSER_SLA_MINUTES} minutes on a recorded line. Tell them to expect the call.`
            : `A fiber specialist calls you within about ${CLOSER_SLA_MINUTES} minutes from ${COMPANY.phone}. Calls are recorded for quality.`}
      </p>
      {isRep ? (
        <button
          type="button"
          onClick={onNextDoor}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-fiber-blue text-lg font-semibold text-white hover:bg-blue-800"
        >
          <RotateCcw className="size-5" aria-hidden />
          Next door
        </button>
      ) : (
        <a
          href={COMPANY.phoneHref}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 font-semibold text-gray-900 hover:bg-gray-50"
        >
          <PhoneCall className="size-4" aria-hidden />
          Can&apos;t wait? Call {COMPANY.phone}
        </a>
      )}
    </section>
  );
}
