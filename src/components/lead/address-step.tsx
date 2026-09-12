"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import type { AddressSuggestion } from "@/app/api/address-autocomplete/route";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { cn } from "@/lib/utils";
import type { LeadFormMode } from "./use-lead-form";

interface AddressStepProps {
  mode: LeadFormMode;
  isChecking: boolean;
  error: string | null;
  onPick: (suggestion: AddressSuggestion) => void;
  onResolveTyped: (typed: string) => void;
}

const MIN_TYPED_LENGTH = 8;

export function AddressStep({ mode, isChecking, error, onPick, onResolveTyped }: AddressStepProps) {
  const [typed, setTyped] = useState("");
  const isRep = mode === "rep";
  const canSubmit = typed.trim().length >= MIN_TYPED_LENGTH && !isChecking;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) onResolveTyped(typed.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-busy={isChecking}>
      <label className="block text-sm font-semibold text-gray-900" htmlFor="lead-address">
        {isRep ? "Homeowner's street address" : "Street address"}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <AddressAutocomplete
          value={typed}
          onValueChange={setTyped}
          onSelect={onPick}
          disabled={isChecking}
          autoFocus={isRep}
          placeholder="123 Main St, City, ST 12345"
          ariaLabel="Street address"
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
          {isChecking ? "Checking" : "Check address"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-fiber-red">{error}</p>
      ) : (
        <p className="text-xs text-gray-500">We check the fiber footprint for this exact address. No credit check, no payment.</p>
      )}
    </form>
  );
}
