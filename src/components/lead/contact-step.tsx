"use client";

import { Loader2 } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { CURRENT_PROVIDERS, ISP_LABELS, LEAD_ISPS, PREFERRED_SPEEDS, SPEED_LABELS, type LeadInput } from "@/lib/validations/lead-schema";
import { ChoiceChips } from "./choice-chips";
import { ConsentCheckbox } from "./consent-checkbox";
import type { LeadFormMode } from "./use-lead-form";

interface ContactStepProps {
  mode: LeadFormMode;
  form: UseFormReturn<LeadInput>;
  suggestedIsp: string | null;
  ctaLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}

const ISP_OPTIONS = LEAD_ISPS.map((value) => ({ value, label: ISP_LABELS[value] }));
const SPEED_OPTIONS = PREFERRED_SPEEDS.map((value) => ({ value, label: SPEED_LABELS[value] }));

const PROVIDER_LABELS: Record<(typeof CURRENT_PROVIDERS)[number], string> = {
  spectrum: "Spectrum",
  att: "AT&T",
  xfinity: "Xfinity",
  optimum: "Optimum",
  frontier: "Frontier",
  other: "Other",
  none: "No internet right now",
};

export function ContactStep({ mode, form, suggestedIsp, ctaLabel, isSubmitting, submitError, onSubmit }: ContactStepProps) {
  const isRep = mode === "rep";
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const fieldClass = cn(
    "w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400",
    "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fiber-blue aria-invalid:border-fiber-red",
    isRep ? "h-14 text-lg" : "h-12 text-base"
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <Controller
        control={control}
        name="ispDeclared"
        render={({ field }) => (
          <ChoiceChips
            legend={isRep ? "Which provider are you pitching?" : "Which provider do you want?"}
            options={ISP_OPTIONS}
            value={field.value}
            suggested={suggestedIsp}
            error={errors.ispDeclared?.message}
            large={isRep}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="preferredSpeed"
        render={({ field }) => (
          <ChoiceChips
            legend="What speed do you want?"
            options={SPEED_OPTIONS}
            value={field.value}
            error={errors.preferredSpeed?.message}
            large={isRep}
            onChange={field.onChange}
          />
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName?.message}>
          <input {...register("firstName")} autoComplete="given-name" className={fieldClass} aria-invalid={Boolean(errors.firstName)} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName")} autoComplete="family-name" className={fieldClass} aria-invalid={Boolean(errors.lastName)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile number" error={errors.phone?.message} hint="We call this number">
          <input {...register("phone")} type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} aria-invalid={Boolean(errors.phone)} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" inputMode="email" autoComplete="email" className={fieldClass} aria-invalid={Boolean(errors.email)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth (optional)" error={errors.dateOfBirth?.message} hint="Speeds up the order">
          <input {...register("dateOfBirth")} type="date" autoComplete="bday" className={fieldClass} aria-invalid={Boolean(errors.dateOfBirth)} />
        </Field>
        <Field label="Current internet provider (optional)">
          <select {...register("currentProvider", { setValueAs: (value) => value || undefined })} className={fieldClass} defaultValue="">
            <option value="">Select one</option>
            {CURRENT_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>
                {PROVIDER_LABELS[provider]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Website <input {...register("website")} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Controller
        control={control}
        name="consentContact"
        render={({ field }) => (
          <ConsentCheckbox checked={Boolean(field.value)} error={errors.consentContact?.message} large={isRep} onChange={field.onChange} />
        )}
      />

      {submitError && (
        <p role="alert" className="text-sm text-fiber-red">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-fiber-blue font-semibold text-white transition-colors",
          "hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fiber-blue focus-visible:ring-offset-2 disabled:opacity-60",
          isRep ? "h-14 text-lg" : "h-12 text-base"
        )}
      >
        {isSubmitting && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {isSubmitting ? "Sending…" : ctaLabel}
      </button>
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between text-sm font-semibold text-gray-900">
        {label}
        {hint && <span className="text-xs font-normal text-gray-500">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="block text-sm text-fiber-red">
          {error}
        </span>
      )}
    </label>
  );
}
