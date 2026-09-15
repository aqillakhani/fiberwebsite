import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { LeadRecord } from "./lead-record";

export const LEADS_PAGE_SIZE = 200;

export type LeadListItem = LeadRecord & { contact_preference: "text" | "call" | null };

/** Newest leads first for the owner's /admin/leads view, with the homeowner's "text me instead" choice if any. */
export async function listRecentLeads(limit = LEADS_PAGE_SIZE): Promise<LeadListItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("public_leads").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`public_leads query failed: ${error.message}`);
  const leads = (data ?? []) as LeadRecord[];
  const preferences = await contactPreferences(leads.map((lead) => lead.id));
  return leads.map((lead) => ({ ...lead, contact_preference: preferences.get(lead.id) ?? null }));
}

async function contactPreferences(leadIds: string[]): Promise<Map<string, "text" | "call">> {
  if (leadIds.length === 0) return new Map();
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("public_lead_events")
    .select("lead_id, payload, created_at")
    .eq("event_type", "contact_preference")
    .in("lead_id", leadIds)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[leads] contact_preference query failed", error.message);
    return new Map();
  }
  // Latest choice wins (rows are ascending, so later writes overwrite).
  return new Map((data ?? []).map((row) => [row.lead_id as string, (row.payload as { preference: "text" | "call" }).preference]));
}
