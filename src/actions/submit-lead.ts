"use server";

import { createServerClient } from "@/lib/supabase/server";
import { leadSchema, type LeadFormData } from "@/lib/validations/schemas";

export type LeadResult = {
  readonly success: boolean;
  readonly error?: string;
};

export async function submitLead(data: LeadFormData): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  try {
    const supabase = createServerClient();

    const { error } = await supabase.from("public_leads").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      service_address: parsed.data.serviceAddress,
      city: parsed.data.city,
      state: parsed.data.state,
      zip: parsed.data.zip,
      use_cases: parsed.data.useCases ?? [],
      speed_interest: parsed.data.speedInterest,
      source: parsed.data.source ?? "get-started",
      campaign_code: parsed.data.campaignCode,
      utm_source: parsed.data.utmSource,
      utm_medium: parsed.data.utmMedium,
      utm_campaign: parsed.data.utmCampaign,
      rep_id: parsed.data.repId,
    });

    if (error) {
      console.error("Supabase lead insert error:", error);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Lead submission error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
