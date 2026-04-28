"use client";

import { CheckCircle2, Sparkles, Wifi, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getProvidersForState,
  type ProviderResult,
  type ProviderType,
} from "@/lib/providers";

type ProviderResultsProps = {
  state: string;
  city?: string;
  className?: string;
  nextStepLabel?: string;
};

const TYPE_LABELS: Record<ProviderType, string> = {
  fiber: "Fiber",
  cable: "Cable",
  "5g-home": "5G Home",
  satellite: "Satellite",
};

function formatSpeed(mbps: number): string {
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(0)} Gbps`;
  return `${mbps} Mbps`;
}

export function ProviderResults({
  state,
  city,
  className,
  nextStepLabel = "Continue to plan selection below",
}: ProviderResultsProps) {
  if (!state) return null;

  const { results, hasFrontierFiber } = getProvidersForState(state);

  if (results.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm",
          className
        )}
      >
        <p className="font-semibold text-gray-900">
          We&rsquo;re still mapping providers in {state}.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          A FiberFastUSA representative will reach out to confirm what&rsquo;s available at your address.
        </p>
      </div>
    );
  }

  const headlineLocation = city ? `${city}, ${state}` : state;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fiber-blue">
            Providers near {headlineLocation}
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {hasFrontierFiber
              ? "Frontier Fiber is your best option"
              : "Here are providers we found in your area"}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
          <CheckCircle2 className="size-3.5 text-fiber-success" aria-hidden="true" />
          <span>{results.length} found</span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {results.map((result) => (
          <ProviderRow key={result.provider.id} result={result} />
        ))}
      </ul>

      <div className="flex items-start gap-2 rounded-lg bg-fiber-blue/5 border border-fiber-blue/20 p-3">
        <Sparkles className="size-4 text-fiber-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-gray-800">
          <span className="font-semibold">Next:</span> {nextStepLabel}
        </p>
      </div>

      <p className="text-[11px] leading-snug text-gray-500">
        Provider availability varies by address. A FiberFastUSA rep will confirm exact service options when they call.
      </p>
    </div>
  );
}

function ProviderRow({ result }: { result: ProviderResult }) {
  const { provider, recommended, reason } = result;
  const isFiber = provider.type === "fiber";

  return (
    <li
      className={cn(
        "rounded-lg border p-3 transition-colors",
        recommended
          ? "border-fiber-blue bg-gradient-to-r from-fiber-blue/5 to-fiber-teal/5 ring-1 ring-fiber-blue/30"
          : "border-gray-200 bg-white"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg flex-shrink-0",
            recommended
              ? "bg-fiber-blue text-white"
              : isFiber
                ? "bg-fiber-teal/10 text-fiber-teal"
                : "bg-gray-100 text-gray-600"
          )}
        >
          {isFiber ? <Zap className="size-4" /> : <Wifi className="size-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 text-[15px]">{provider.name}</p>
            {recommended && reason && (
              <span className="inline-flex items-center gap-1 rounded-full bg-fiber-blue px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                <Sparkles className="size-3" aria-hidden="true" />
                {reason}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
            <span className="font-medium">{TYPE_LABELS[provider.type]}</span>
            <span aria-hidden="true">·</span>
            <span>Up to {formatSpeed(provider.maxSpeedMbps)}</span>
          </div>
          <p
            className={cn(
              "text-xs mt-1.5 leading-snug",
              recommended ? "text-gray-800 font-medium" : "text-gray-600"
            )}
          >
            {provider.tagline}
          </p>
        </div>
      </div>
    </li>
  );
}
