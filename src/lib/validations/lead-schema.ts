import { z } from "zod";

import { SERVICEABILITY_STATUSES } from "@/lib/serviceability/classify";

/**
 * Canonical lead payload (v2). One schema for the public form, canvasser (rep) mode and the Meta
 * lead-form webhook. Attribution (rep, UTMs, fbc) is NOT part of this payload — the server action
 * reads it from cookies so the client cannot spoof it.
 */

export const LEAD_ISPS = ["kinetic", "brightspeed", "frontier", "att", "ripple", "tmobile", "other", "unknown"] as const;
export type LeadIsp = (typeof LEAD_ISPS)[number];

export const CURRENT_PROVIDERS = ["spectrum", "att", "xfinity", "optimum", "frontier", "other", "none"] as const;

const PHONE_PATTERN = /^[\d\s\-().+]+$/;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 11;

export const phoneSchema = z
  .string()
  .trim()
  .regex(PHONE_PATTERN, "Please enter a valid phone number")
  .transform((raw) => raw.replace(/\D/g, ""))
  .refine((digits) => digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS, "Please enter a 10-digit phone number")
  .transform((digits) => (digits.length === MAX_PHONE_DIGITS && digits.startsWith("1") ? digits.slice(1) : digits));

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: phoneSchema,
  email: z.email("Please enter a valid email address").max(200).optional().or(z.literal("")),
  serviceAddress: z.string().trim().min(5, "Please enter your street address").max(200, "Address is too long"),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().length(2, "Use the two-letter state code").toUpperCase(),
  zip: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/, "Please enter a valid ZIP code"),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  addressAccuracy: z.string().max(40).optional(),
  ispDeclared: z.enum(LEAD_ISPS).optional(),
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
