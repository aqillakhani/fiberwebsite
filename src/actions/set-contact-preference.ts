"use server";

import { z } from "zod";

import { createServerClient } from "@/lib/supabase/server";

const CONTACT_PREFERENCES = ["text", "call"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

const inputSchema = z.object({ leadId: z.uuid(), preference: z.enum(CONTACT_PREFERENCES) });

/**
 * Homeowner tapped "Text me instead" on the confirmation screen. Recorded as a lead event (never edits the
 * lead row) so closers see it in /admin/leads and the audit trail keeps the original submission intact.
 */
export async function setContactPreference(input: { leadId: string; preference: ContactPreference }): Promise<{ success: boolean }> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { success: false };
  const supabase = createServerClient();
  const { error } = await supabase
    .from("public_lead_events")
    .insert({ lead_id: parsed.data.leadId, event_type: "contact_preference", payload: { preference: parsed.data.preference } });
  if (error) console.error("[leads] contact_preference insert failed", { leadId: parsed.data.leadId, error: error.message });
  return { success: !error };
}
