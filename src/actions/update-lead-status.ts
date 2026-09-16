"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { LEAD_STATUSES } from "@/lib/leads/lead-status";
import { createServerClient } from "@/lib/supabase/server";

const MAX_NAME = 80;
const MAX_NOTE = 500;

const inputSchema = z.object({
  leadId: z.uuid(),
  status: z.enum(LEAD_STATUSES),
  closerName: z.string().trim().max(MAX_NAME),
  closerNote: z.string().trim().max(MAX_NOTE),
});

export type UpdateLeadStatusInput = z.infer<typeof inputSchema>;
export type UpdateLeadStatusResult = { success: true } | { success: false; error: string };

/**
 * Owner sets a lead's status + which sales rep closed it from /admin/leads. Middleware already gates /admin
 * with HTTP Basic auth; this re-checks the header so the action cannot be called from anywhere else.
 * The status-change trigger writes the audit event; we add one carrying the closer name.
 */
export async function updateLeadStatus(input: UpdateLeadStatusInput): Promise<UpdateLeadStatusResult> {
  if (!isAuthorizedAdmin((await headers()).get("authorization"))) return { success: false, error: "Not signed in" };
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { leadId, status, closerName, closerNote } = parsed.data;

  const supabase = createServerClient();
  const { error } = await supabase
    .from("public_leads")
    .update({ status, closer_name: closerName || null, closer_note: closerNote || null, status_updated_at: new Date().toISOString() })
    .eq("id", leadId);
  if (error) {
    console.error("[leads] status update failed", { leadId, error: error.message });
    return { success: false, error: "Could not save. Try again." };
  }
  await supabase
    .from("public_lead_events")
    .insert({ lead_id: leadId, event_type: "worked_by_owner", payload: { status, closer_name: closerName || null, closer_note: closerNote || null } });
  revalidatePath("/admin/leads");
  return { success: true };
}
