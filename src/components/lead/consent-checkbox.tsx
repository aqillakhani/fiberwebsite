"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
  checked: boolean;
  error: string | undefined;
  large: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * TCPA express written consent. Deliberately a native checkbox: unchecked by default, full text visible,
 * large tap target in rep mode. The text version is stored with the lead (see lib/consent.ts).
 */
export function ConsentCheckbox({ checked, error, large, onChange }: ConsentCheckboxProps) {
  const { copy } = useLanguage();
  return (
    <div className="space-y-1">
      <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3", error ? "border-fiber-red bg-fiber-red-light" : "border-gray-200 bg-gray-50")}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby="consent-text"
          className={cn("mt-0.5 shrink-0 accent-fiber-blue", large ? "size-6" : "size-5")}
        />
        <span id="consent-text" className={cn("leading-snug text-gray-700", large ? "text-sm" : "text-xs")}>
          {copy.consentText}
        </span>
      </label>
      {error && <p role="alert" className="text-sm text-fiber-red">{error}</p>}
    </div>
  );
}
