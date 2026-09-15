"use client";

import { cn } from "@/lib/utils";

export interface ChipOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface ChoiceChipsProps<TValue extends string> {
  legend: string;
  options: ReadonlyArray<ChipOption<TValue>>;
  value: TValue | undefined;
  /** Option the map suggests; shown with an "on map" badge. */
  suggested?: string | null;
  error?: string;
  large?: boolean;
  onChange: (value: TValue) => void;
}

/** One-tap single choice. Big enough for a canvasser's thumb in rep mode. */
export function ChoiceChips<TValue extends string>({ legend, options, value, suggested, error, large, onChange }: ChoiceChipsProps<TValue>) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-gray-900">{legend}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const isSuggested = suggested === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative rounded-lg border-2 px-3 text-left font-semibold leading-tight transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fiber-blue focus-visible:ring-offset-2",
                large ? "h-14 text-base" : "min-h-11 py-2 text-sm",
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
      {error && (
        <p role="alert" className="text-sm text-fiber-red">
          {error}
        </p>
      )}
    </fieldset>
  );
}
