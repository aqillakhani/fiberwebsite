"use client";

import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getProvidersForState } from "@/lib/providers";

type ProviderResultsProps = {
  state: string;
  className?: string;
  onContinue?: () => void;
  continueLabel?: string;
};

export function ProviderResults({
  state,
  className,
  onContinue,
  continueLabel = "See Plans",
}: ProviderResultsProps) {
  if (!state) return null;

  const { hasFrontierFiber } = getProvidersForState(state);
  if (!hasFrontierFiber) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-fiber-blue/30 bg-white shadow-md overflow-hidden",
        className
      )}
    >
      <div className="h-1 bg-gradient-to-r from-fiber-blue to-fiber-teal" aria-hidden="true" />

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-fiber-blue text-white flex-shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fiber-blue">
              Confirmed
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight mt-0.5">
              Fiber Internet Available at Your Address
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-fiber-blue/[0.06] to-fiber-teal/[0.06] border border-fiber-blue/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-fiber-blue text-white flex-shrink-0">
              <Zap className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 leading-tight">Frontier Fiber</p>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                Symmetric speeds up to 7 Gbps · No data caps · No contracts
              </p>
            </div>
          </div>
        </div>

        {onContinue && (
          <Button
            type="button"
            onClick={onContinue}
            className="w-full bg-fiber-blue hover:bg-fiber-blue/90 text-white min-h-[48px] font-semibold flex items-center justify-center gap-2"
          >
            {continueLabel}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
