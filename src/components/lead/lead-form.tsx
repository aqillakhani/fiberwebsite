"use client";

import { AddressStep } from "./address-step";
import { ContactStep } from "./contact-step";
import { LeadConfirmation } from "./lead-confirmation";
import { resultCopy } from "./serviceability-copy";
import { ServiceabilityResult } from "./serviceability-result";
import { useLeadForm, type LeadFormMode } from "./use-lead-form";

export interface LeadFormProps {
  /** `public` = homeowner on the site; `rep` = canvasser at the door (bigger targets, ISP chips, "Next door"). */
  mode?: LeadFormMode;
  /** Where on the site this form lives, e.g. "home-hero", "check-availability", "door-mode". */
  source: string;
}

/**
 * The one lead form: address → instant, honest result → contact + consent → request number.
 * Attribution (rep, UTMs) travels in cookies set by middleware, never in props the client can edit.
 */
export function LeadForm({ mode = "public", source }: LeadFormProps) {
  const state = useLeadForm({ mode, source });

  if (state.step === "done" && state.result) {
    const firstName = state.form.getValues("fullName").trim().split(/\s+/)[0] || "there";
    return <LeadConfirmation mode={mode} result={state.result} firstName={firstName} onNextDoor={state.reset} />;
  }

  if (state.step === "details" && state.address) {
    const copy = resultCopy(state.serviceability, mode, state.address.street);
    return (
      <div className="space-y-5">
        <ServiceabilityResult mode={mode} address={state.address} result={state.serviceability} onChangeAddress={state.changeAddress} />
        <ContactStep
          mode={mode}
          form={state.form}
          suggestedIsp={state.serviceability?.isp ?? null}
          ctaLabel={copy.cta}
          isSubmitting={state.isSubmitting}
          submitError={state.submitError}
          onSubmit={state.submit}
        />
      </div>
    );
  }

  return (
    <AddressStep
      mode={mode}
      isChecking={state.isCheckingAddress}
      error={state.addressError}
      onPick={state.chooseSuggestion}
      onResolveTyped={state.resolveTypedAddress}
    />
  );
}
