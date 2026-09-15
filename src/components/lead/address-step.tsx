"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import type { AddressSuggestion } from "@/app/api/address-autocomplete/route";
import { useLanguage } from "@/components/providers/language-provider";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { cn } from "@/lib/utils";
import type { LeadFormMode } from "./use-lead-form";

interface AddressStepProps {
  mode: LeadFormMode;
  isChecking: boolean;
  error: string | null;
  onPick: (suggestion: AddressSuggestion) => void;
  onResolveTyped: (typed: string) => void;
  /** Address carried in from the sticky bar (?address=); shown in the field while it is being checked. */
  initialValue?: string;
}

const MIN_TYPED_LENGTH = 8;

export function AddressStep({ mode, isChecking, error, onPick, onResolveTyped, initialValue = "" }: AddressStepProps) {
  const [typed, setTyped] = useState(initialValue);
  const { copy } = useLanguage();
  const isRep = mode === "rep";
  const canSubmit = typed.trim().length >= MIN_TYPED_LENGTH && !isChecking;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) onResolveTyped(typed.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-busy={isChecking}>
      <label className="block text-sm font-semibold text-gray-900" htmlFor="lead-address">
        {isRep ? copy.address.labelRep : copy.address.label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <AddressAutocomplete
          value={typed}
          onValueChange={setTyped}
          onSelect={onPick}
          disabled={isChecking}
          autoFocus={isRep}
          placeholder={copy.address.placeholder}
          ariaLabel={isRep ? copy.address.labelRep : copy.address.label}
          className="flex-1"
          inputClassName={cn(isRep && "h-14 text-lg")}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg bg-fiber-blue px-5 font-semibold text-white transition-colors",
            "hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fiber-blue focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isRep ? "h-14 text-lg" : "h-12"
          )}
        >
          {isChecking ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <ArrowRight className="size-5" aria-hidden />}
          {isChecking ? copy.address.checking : copy.address.check}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-fiber-red">{error}</p>
      ) : (
        <p className="text-xs text-gray-500">{copy.address.hint}</p>
      )}
    </form>
  );
}
