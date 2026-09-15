"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitLead, type LeadSubmitResult, type LeadSubmitSuccess } from "@/actions/submit-lead";
import type { AddressSuggestion } from "@/app/api/address-autocomplete/route";
import { trackLead } from "@/lib/analytics";
import type { ServiceabilityResult } from "@/lib/serviceability/classify";
import { parseCookieHeader } from "@/lib/attribution-cookies";
import { isLanguage, LANGUAGE_COOKIE, LEAD_COPY, type Language } from "@/lib/i18n/lead-copy";
import { enqueuePendingLead, isNetworkFailure } from "@/lib/leads/offline-queue";
import { LEAD_ISPS, leadSchema, type LeadInput, type LeadIsp } from "@/lib/validations/lead-schema";

export type LeadFormStep = "address" | "details" | "done";
export type LeadFormMode = "public" | "rep";

export interface ResolvedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lon?: number;
  /** picked = chosen from suggestions; resolved = geocoder's best match for typed text; typed = parsed locally, no coordinates. */
  accuracy: "picked" | "resolved" | "typed";
}

export interface UseLeadFormOptions {
  mode: LeadFormMode;
  source: string;
  /** Checked automatically once on mount (from the sticky bar's ?address=). */
  initialAddress?: string;
  /** Version of the consent wording currently on screen (English or Spanish); stored with the lead. */
  consentTextVersion: string;
}

export interface LeadFormState {
  step: LeadFormStep;
  form: UseFormReturn<LeadInput>;
  address: ResolvedAddress | null;
  serviceability: ServiceabilityResult | null;
  isCheckingAddress: boolean;
  addressError: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  result: LeadSubmitSuccess | null;
  chooseSuggestion: (suggestion: AddressSuggestion) => Promise<void>;
  resolveTypedAddress: (typed: string) => Promise<void>;
  changeAddress: () => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useLeadForm({ source, initialAddress, consentTextVersion }: UseLeadFormOptions): LeadFormState {
  const [step, setStep] = useState<LeadFormStep>("address");
  const [address, setAddress] = useState<ResolvedAddress | null>(null);
  const [serviceability, setServiceability] = useState<ServiceabilityResult | null>(null);
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadSubmitSuccess | null>(null);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: emptyLead(source),
  });

  const acceptAddress = useCallback(
    async (resolved: ResolvedAddress) => {
      setAddress(resolved);
      form.setValue("serviceAddress", resolved.street);
      form.setValue("city", resolved.city);
      form.setValue("state", resolved.state);
      form.setValue("zip", resolved.zip);
      form.setValue("lat", resolved.lat);
      form.setValue("lon", resolved.lon);
      form.setValue("addressAccuracy", resolved.accuracy);
      const check = await fetchServiceability(resolved);
      setServiceability(check);
      form.setValue("serviceabilityStatus", check?.status ?? "unknown");
      const suggested = toLeadIsp(check?.isp);
      if (suggested) form.setValue("ispDeclared", suggested);
      setStep("details");
    },
    [form]
  );

  const chooseSuggestion = useCallback(
    async (suggestion: AddressSuggestion) => {
      setAddressError(null);
      setIsCheckingAddress(true);
      await acceptAddress({ ...suggestion, lat: toNumber(suggestion.lat), lon: toNumber(suggestion.lon), accuracy: "picked" });
      setIsCheckingAddress(false);
    },
    [acceptAddress]
  );

  const resolveTypedAddress = useCallback(
    async (typed: string) => {
      setAddressError(null);
      setIsCheckingAddress(true);
      const suggestion = await lookupFirstSuggestion(typed);
      const resolved = suggestion
        ? { ...suggestion, lat: toNumber(suggestion.lat), lon: toNumber(suggestion.lon), accuracy: "resolved" as const }
        : parseTypedAddress(typed);
      if (!resolved) {
        setAddressError(LEAD_COPY[readLanguageCookie()].address.unresolved);
        setIsCheckingAddress(false);
        return;
      }
      await acceptAddress(resolved);
      setIsCheckingAddress(false);
    },
    [acceptAddress]
  );

  const autoChecked = useRef(false);
  useEffect(() => {
    if (!initialAddress || autoChecked.current) return;
    autoChecked.current = true;
    void resolveTypedAddress(initialAddress);
  }, [initialAddress, resolveTypedAddress]);

  const submit = useCallback(async () => {
    setSubmitError(null);
    form.setValue("consentTextVersion", consentTextVersion);
    const isValid = await form.trigger();
    if (!isValid) return;
    setIsSubmitting(true);
    const outcome = await submitOrQueue(form.getValues(), serviceability);
    setIsSubmitting(false);
    if (!outcome.success) {
      setSubmitError(outcome.error);
      return;
    }
    if (outcome.queued) {
      setResult(outcome);
      setStep("done");
      return;
    }
    trackLead({ leadId: outcome.leadId, source, status: outcome.serviceabilityStatus, isp: outcome.isp });
    setResult(outcome);
    setStep("done");
  }, [form, source, consentTextVersion, serviceability]);

  const reset = useCallback(() => {
    form.reset(emptyLead(source));
    setAddress(null);
    setServiceability(null);
    setResult(null);
    setSubmitError(null);
    setAddressError(null);
    setStep("address");
  }, [form, source]);

  const changeAddress = useCallback(() => {
    setServiceability(null);
    setStep("address");
  }, []);

  return {
    step, form, address, serviceability, isCheckingAddress, addressError, isSubmitting, submitError, result,
    chooseSuggestion, resolveTypedAddress, changeAddress, submit, reset,
  };
}

function emptyLead(source: string): DefaultValues<LeadInput> {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    serviceAddress: "",
    city: "",
    state: "",
    zip: "",
    consentContact: false,
    consentTextVersion: LEAD_COPY.en.consentTextVersion,
    source,
    website: "",
  };
}

async function fetchServiceability(resolved: ResolvedAddress): Promise<ServiceabilityResult | null> {
  const params = new URLSearchParams({ address: `${resolved.street}, ${resolved.city} ${resolved.state} ${resolved.zip}` });
  if (resolved.lat !== undefined && resolved.lon !== undefined) {
    params.set("lat", String(resolved.lat));
    params.set("lon", String(resolved.lon));
  }
  try {
    const response = await fetch(`/api/serviceability?${params}`);
    return response.ok ? ((await response.json()) as ServiceabilityResult) : null;
  } catch {
    return null;
  }
}

async function lookupFirstSuggestion(typed: string): Promise<AddressSuggestion | null> {
  try {
    const response = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(typed)}`);
    if (!response.ok) return null;
    const body = (await response.json()) as { suggestions: AddressSuggestion[] };
    return body.suggestions[0] ?? null;
  } catch {
    return null;
  }
}

// "123 Main St, Newark OH 43055" / "123 Main St, Newark, OH, 43055" — the geocoder misses many rural
// homes the fiber footprint knows, so a well-formed typed address still gets an exact-hash lookup.
const TYPED_ADDRESS = /^([^,]+),\s*([^,]+?),?\s+([A-Za-z]{2}),?\s+(\d{5})(?:-\d{4})?$/;

function parseTypedAddress(typed: string): ResolvedAddress | null {
  const match = TYPED_ADDRESS.exec(typed.trim());
  if (!match) return null;
  const [, street, city, state, zip] = match;
  return { street: street.trim(), city: city.trim(), state: state.toUpperCase(), zip, accuracy: "typed" };
}

const QUEUED_LEAD_NUMBER = "SAVED";
const OFFLINE_ERROR = "No signal and this phone could not save the lead. Try again when you have service.";

/**
 * Server action first; if the request itself fails (no signal), keep the lead on the device so the
 * canvasser can move on. PendingLeadsSync submits it later through the same action.
 */
async function submitOrQueue(input: LeadInput, serviceability: ServiceabilityResult | null): Promise<LeadSubmitResult> {
  try {
    return await submitLead(input);
  } catch (error) {
    if (!isNetworkFailure(error)) throw error;
    const pending = enqueuePendingLead(input);
    if (!pending) return { success: false, error: OFFLINE_ERROR };
    return { success: true, queued: true, leadId: "", leadNumber: QUEUED_LEAD_NUMBER, serviceabilityStatus: serviceability?.status ?? "unknown", isp: serviceability?.isp ?? null };
  }
}

function readLanguageCookie(): Language {
  const stored = parseCookieHeader(typeof document === "undefined" ? "" : document.cookie)[LANGUAGE_COOKIE];
  return isLanguage(stored) ? stored : "en";
}

function toNumber(raw: string): number | undefined {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Map ISP ids match the form's provider ids; anything else is not pre-selected (the homeowner picks). */
function toLeadIsp(isp: string | null | undefined): LeadIsp | undefined {
  return isp && (LEAD_ISPS as readonly string[]).includes(isp) ? (isp as LeadIsp) : undefined;
}
