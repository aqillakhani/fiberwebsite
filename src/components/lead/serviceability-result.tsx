"use client";

import { CheckCircle2, Clock, HelpCircle, MapPin } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import type { ServiceabilityResult as ServiceabilityLookup } from "@/lib/serviceability/classify";
import { cn } from "@/lib/utils";
import { resultCopy, type ResultTone } from "./serviceability-copy";
import type { LeadFormMode, ResolvedAddress } from "./use-lead-form";

interface ServiceabilityResultProps {
  mode: LeadFormMode;
  address: ResolvedAddress;
  result: ServiceabilityLookup | null;
  onChangeAddress: () => void;
}

const TONE_STYLES: Record<ResultTone, { card: string; icon: string; Icon: typeof CheckCircle2 }> = {
  success: { card: "border-green-200 bg-green-50", icon: "text-fiber-success", Icon: CheckCircle2 },
  info: { card: "border-amber-200 bg-amber-50", icon: "text-fiber-yellow", Icon: Clock },
  neutral: { card: "border-gray-200 bg-gray-50", icon: "text-gray-500", Icon: HelpCircle },
};

export function ServiceabilityResult({ mode, address, result, onChangeAddress }: ServiceabilityResultProps) {
  const { copy: text } = useLanguage();
  const copy = resultCopy(result, mode, address.street, text);
  const { card, icon, Icon } = TONE_STYLES[copy.tone];

  return (
    <section aria-live="polite" className={cn("rounded-xl border p-4 sm:p-5", card)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-6 shrink-0", icon)} aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">{copy.headline}</h3>
          <p className="mt-1 text-sm text-gray-700">{copy.detail}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden />
              {address.street}, {address.city}, {address.state} {address.zip}
            </span>
            <button type="button" onClick={onChangeAddress} className="font-medium text-fiber-blue underline-offset-2 hover:underline">
              {text.address.changeAddress}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
