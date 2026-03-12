import { z } from "zod";

export const leadSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[\d\s\-()+ ]+$/, "Please enter a valid phone number"),
  serviceAddress: z
    .string()
    .min(5, "Please enter your full address")
    .max(200, "Address is too long"),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(50),
  zip: z
    .string()
    .min(5, "Please enter a valid ZIP code")
    .max(10, "ZIP code is too long"),
  useCases: z.array(z.string()).optional(),
  speedInterest: z.string().optional(),
  source: z.string().optional(),
  campaignCode: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  repId: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20)
    .regex(/^[\d\s\-()+ ]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const availabilitySchema = z.object({
  address: z
    .string()
    .min(5, "Please enter your full address")
    .max(200, "Address is too long"),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

export const repSearchSchema = z.object({
  query: z
    .string()
    .min(2, "Please enter at least 2 characters")
    .max(100, "Search query is too long"),
});

export type RepSearchFormData = z.infer<typeof repSearchSchema>;
