"use client";

import { useState } from "react";
import { CheckCircle2, CloudOff, MessageSquareText, PhoneCall, RotateCcw } from "lucide-react";

import { setContactPreference } from "@/actions/set-contact-preference";
import type { LeadSubmitSuccess } from "@/actions/submit-lead";
import { useLanguage } from "@/components/providers/language-provider";
import { COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CLOSER_SLA_MINUTES, ispDisplayName } from "./serviceability-copy";
import type { LeadFormMode } from "./use-lead-form";

interface LeadConfirmationProps {
  mode: LeadFormMode;
  result: LeadSubmitSuccess;
  firstName: string;
  onNextDoor: () => void;
}

export function LeadConfirmation({ mode, result, firstName, onNextDoor }: LeadConfirmationProps) {
  const { copy } = useLanguage();
  const text = copy.done;
  const isRep = mode === "rep";
  const isComingSoon = result.serviceabilityStatus === "coming_soon";
  const isp = ispDisplayName(result.isp);
  const detail = isComingSoon ? text.comingSoon(isp) : isRep ? text.repNext(CLOSER_SLA_MINUTES) : text.callSoon(CLOSER_SLA_MINUTES, COMPANY.phone);

  if (result.queued) {
    return (
      <section aria-live="polite" className="space-y-5 text-center">
        <CloudOff className="mx-auto size-12 text-amber-500" aria-hidden />
        <h3 className="text-xl font-bold text-gray-900">{text.queuedTitle}</h3>
        <p className="mx-auto max-w-md text-sm text-gray-700">{text.queuedDetail}</p>
        {isRep && <NextDoorButton label={text.nextDoor} onClick={onNextDoor} />}
      </section>
    );
  }

  return (
    <section aria-live="polite" className="space-y-5 text-center">
      <CheckCircle2 className="mx-auto size-12 text-fiber-success" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.requestNumber}</p>
        <p className="font-mono text-3xl font-bold text-gray-900">{result.leadNumber}</p>
      </div>
      <h3 className="text-xl font-bold text-gray-900">{isRep ? text.sentToCloser : text.thanks(firstName)}</h3>
      <p className="mx-auto max-w-md text-sm text-gray-700">{detail}</p>

      {isRep ? <NextDoorButton label={text.nextDoor} onClick={onNextDoor} /> : <HomeownerNextSteps leadId={result.leadId} />}
    </section>
  );
}

function NextDoorButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-fiber-blue text-lg font-semibold text-white hover:bg-blue-800"
    >
      <RotateCcw className="size-5" aria-hidden />
      {label}
    </button>
  );
}

/** What happens next, one-tap call, and a "text me instead" preference that closers see on the lead. */
function HomeownerNextSteps({ leadId }: { leadId: string }) {
  const { copy } = useLanguage();
  const text = copy.done;
  const [textPreference, setTextPreference] = useState<"idle" | "saving" | "saved">("idle");

  const handleTextInstead = async () => {
    setTextPreference("saving");
    const outcome = await setContactPreference({ leadId, preference: "text" });
    setTextPreference(outcome.success ? "saved" : "idle");
  };

  return (
    <div className="space-y-4 text-left">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-gray-900">{text.nextTitle}</p>
        <ol className="space-y-2 text-sm text-gray-700">
          {text.steps(CLOSER_SLA_MINUTES).map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fiber-blue text-xs font-bold text-white">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <a
        href={COMPANY.phoneHref}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-fiber-blue font-semibold text-white hover:bg-blue-800"
      >
        <PhoneCall className="size-4" aria-hidden />
        {text.callNow(COMPANY.phone)}
      </a>
      <button
        type="button"
        onClick={handleTextInstead}
        disabled={textPreference !== "idle"}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border font-semibold",
          textPreference === "saved" ? "border-green-200 bg-green-50 text-fiber-success" : "border-gray-300 text-gray-900 hover:bg-gray-50",
          textPreference === "saving" && "opacity-60"
        )}
      >
        {textPreference === "saved" ? <CheckCircle2 className="size-4" aria-hidden /> : <MessageSquareText className="size-4" aria-hidden />}
        {textPreference === "saved" ? text.textNoted : text.textInstead}
      </button>
    </div>
  );
}
