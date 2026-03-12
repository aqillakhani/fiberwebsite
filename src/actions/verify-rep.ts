"use server";

import { supabase } from "@/lib/supabase/client";

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

export async function searchRep(query: string): Promise<RepSearchResult> {
  if (!query || query.trim().length < 2) {
    return { success: false, reps: [], error: "Please enter at least 2 characters" };
  }

  try {
    const searchTerm = query.trim();

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

    const reps: SalesRep[] = unique.map((r) => ({
      id: r.id,
      name: r.name,
      employeeId: r.employee_id,
      region: r.region,
      avatarUrl: r.avatar_url,
    }));

    return { success: true, reps };
  } catch (err) {
    console.error("Rep search error:", err);
    return { success: false, reps: [], error: "Search failed. Please try again." };
  }
}
