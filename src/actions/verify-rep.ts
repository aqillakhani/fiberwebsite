"use server";

import { supabase } from "@/lib/supabase/client";
import { TEAM_MEMBERS } from "@/lib/constants";

export type SalesRep = {
  readonly id: string;
  readonly name: string;
  readonly employeeId: string;
  readonly region: string;
  readonly avatarUrl: string | null;
};

export type RepSearchResult = {
  readonly success: boolean;
  readonly reps: readonly SalesRep[];
  readonly error?: string;
};

function searchFallbackReps(searchTerm: string): SalesRep[] {
  const lower = searchTerm.toLowerCase();
  return TEAM_MEMBERS
    .filter((m) => m.name.toLowerCase().includes(lower) || m.id.includes(lower))
    .map((m) => ({
      id: m.id,
      name: m.name,
      employeeId: m.id,
      region: "Nationwide",
      avatarUrl: null,
    }));
}

export async function searchRep(query: string): Promise<RepSearchResult> {
  if (!query || query.trim().length < 2) {
    return { success: false, reps: [], error: "Please enter at least 2 characters" };
  }

  const searchTerm = query.trim();

  try {
    // Search by employee ID (exact match with prefix)
    const { data: byId } = await supabase
      .from("public_sales_reps")
      .select("id, name, employee_id, region, avatar_url")
      .eq("is_active", true)
      .ilike("employee_id", `%${searchTerm}%`);

    // Search by name (partial match)
    const { data: byName } = await supabase
      .from("public_sales_reps")
      .select("id, name, employee_id, region, avatar_url")
      .eq("is_active", true)
      .ilike("name", `%${searchTerm}%`);

    const allResults = [...(byId ?? []), ...(byName ?? [])];
    const uniqueMap = new Map(allResults.map((r) => [r.id, r]));
    const unique = Array.from(uniqueMap.values());

    if (unique.length > 0) {
      const reps: SalesRep[] = unique.map((r) => ({
        id: r.id,
        name: r.name,
        employeeId: r.employee_id,
        region: r.region,
        avatarUrl: r.avatar_url,
      }));
      return { success: true, reps };
    }

    // Fallback to local TEAM_MEMBERS when Supabase returns no results
    const fallback = searchFallbackReps(searchTerm);
    if (fallback.length > 0) {
      return { success: true, reps: fallback };
    }

    return { success: false, reps: [], error: "No representative found. Please check the name or ID and try again." };
  } catch (err) {
    console.error("Rep search error:", err);

    // Fallback to local TEAM_MEMBERS when Supabase is unavailable
    const fallback = searchFallbackReps(searchTerm);
    if (fallback.length > 0) {
      return { success: true, reps: fallback };
    }

    return { success: false, reps: [], error: "Search failed. Please try again." };
  }
}
