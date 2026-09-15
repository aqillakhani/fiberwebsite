import { z } from "zod";

import { SERVICEABILITY_STATUSES } from "@/lib/serviceability/classify";

/**
 * Canonical lead payload (v3). One schema for the public form, canvasser (rep) mode and the Meta
 * lead-form webhook. Attribution (rep, UTMs, fbc) is NOT part of this payload — the server action
 * reads it from cookies so the client cannot spoof it.
 */

/** Providers the homeowner can ask for. `best` = "find me the best option at my address". */
export const LEAD_ISPS = [
  "best", "kinetic", "brightspeed", "frontier", "att", "ripple", "tmobile", "metronet", "spectrum", "xfinity",
  "optimum", "verizon", "google", "cox", "other",
] as const;
export type LeadIsp = (typeof LEAD_ISPS)[number];

export const ISP_LABELS: Record<LeadIsp, string> = {
  best: "Find me the best option",
  kinetic: "Kinetic",
  brightspeed: "Brightspeed",
  frontier: "Frontier",
  att: "AT&T Fiber",
  ripple: "Ripple Fiber",
  tmobile: "T-Mobile Fiber",
  metronet: "Metronet",
  spectrum: "Spectrum",
  xfinity: "Xfinity",
  optimum: "Optimum",
  verizon: "Verizon Fios",
  google: "Google Fiber",
  cox: "Cox",
  other: "Other",
};

export const PREFERRED_SPEEDS = ["300", "500", "1000", "2000", "5000", "unsure"] as const;
export type PreferredSpeed = (typeof PREFERRED_SPEEDS)[number];

export const SPEED_LABELS: Record<PreferredSpeed, string> = {
  "300": "Up to 300 Mbps",
  "500": "500 Mbps",
  "1000": "1 Gig",
  "2000": "2 Gig",
  "5000": "5 Gig+",
  unsure: "Not sure — advise me",
};

export const CURRENT_PROVIDERS = ["spectrum", "att", "xfinity", "optimum", "frontier", "other", "none"] as const;

const PHONE_PATTERN = /^[\d\s\-().+]+$/;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 11;
const NAME_MAX = 60;
const MIN_AGE_YEARS = 18;
const MAX_AGE_YEARS = 120;

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_PATTERN, "Please enter a valid phone number")
  .transform((raw) => raw.replace(/\D/g, ""))
  .refine((digits) => digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS, "Please enter a 10-digit phone number")
  .transform((digits) => (digits.length === MAX_PHONE_DIGITS && digits.startsWith("1") ? digits.slice(1) : digits));

/** "YYYY-MM-DD" from a native date input; optional, but must be a real adult birth date when given. */
export const dateOfBirthSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date")
  .refine((value) => {
    const age = yearsSince(value);
    return age !== null && age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
  }, `The account holder must be at least ${MIN_AGE_YEARS}`)
  .optional()
  .or(z.literal(""));

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(NAME_MAX, "First name is too long"),
  lastName: z.string().trim().min(1, "Please enter your last name").max(NAME_MAX, "Last name is too long"),
  phone: phoneSchema,
  email: z.email("Please enter a valid email address").max(200),
  dateOfBirth: dateOfBirthSchema,
  serviceAddress: z.string().trim().min(5, "Please enter your street address").max(200, "Address is too long"),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().length(2, "Use the two-letter state code").toUpperCase(),
  zip: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/, "Please enter a valid ZIP code"),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  addressAccuracy: z.string().max(40).optional(),
  ispDeclared: z.enum(LEAD_ISPS, { error: "Pick a provider, or let us find the best one" }),
  preferredSpeed: z.enum(PREFERRED_SPEEDS, { error: "Pick the speed you want" }),
  currentProvider: z.enum(CURRENT_PROVIDERS).optional(),
  serviceabilityStatus: z.enum(SERVICEABILITY_STATUSES).optional(),
  consentContact: z.boolean().refine((agreed) => agreed, "Please agree so we can call or text you about your request"),
  consentTextVersion: z.string().min(1).max(40),
  source: z.string().trim().min(1).max(60),
  /** Honeypot — real users never fill it. */
  website: z.string().max(0).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

function yearsSince(isoDate: string): number | null {
  const birth = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  const hadBirthdayThisYear =
    now.getUTCMonth() > birth.getUTCMonth() || (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() >= birth.getUTCDate());
  return now.getUTCFullYear() - birth.getUTCFullYear() - (hadBirthdayThisYear ? 0 : 1);
}
