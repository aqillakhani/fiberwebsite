import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { LeadRecord } from "./lead-record";

export const LEADS_PAGE_SIZE = 200;

/** Newest leads first for the owner's /admin/leads view. */
export async function listRecentLeads(limit = LEADS_PAGE_SIZE): Promise<LeadRecord[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("public_leads").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(`public_leads query failed: ${error.message}`);
  return (data ?? []) as LeadRecord[];
}
