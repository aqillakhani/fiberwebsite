"use client";

import { cn } from "@/lib/utils";
import type { LeadIsp } from "@/lib/validations/lead-schema";

interface IspSelectProps {
  value: LeadIsp | undefined;
  suggested: string | null;
  onChange: (isp: LeadIsp) => void;
}

const ISP_OPTIONS: ReadonlyArray<{ value: LeadIsp; label: string }> = [
  { value: "kinetic", label: "Kinetic" },
  { value: "brightspeed", label: "Brightspeed" },
  { value: "frontier", label: "Frontier" },
  { value: "att", label: "AT&T Fiber" },
  { value: "ripple", label: "Ripple" },
  { value: "tmobile", label: "T-Mobile Fiber" },
  { value: "other", label: "Other" },
];

/** Canvasser-only: which fiber they are pitching at this door. Pre-selected from map_pin when we have data. */
export function IspSelect({ value, suggested, onChange }: IspSelectProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-900">Which fiber are you pitching here?</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ISP_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const isSuggested = suggested === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative h-14 rounded-lg border-2 px-3 text-base font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fiber-blue focus-visible:ring-offset-2",
                isSelected ? "border-fiber-blue bg-fiber-blue-light text-fiber-blue" : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
              )}
            >
              {option.label}
              {isSuggested && (
                <span className="absolute -top-2 right-2 rounded-full bg-fiber-success px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  on map
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
