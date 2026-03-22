import { createServerClient } from "@/lib/supabase/server"
import { TEAM_MEMBERS } from "@/lib/constants"

export type Rep = {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly role: string
  readonly bio: string
  readonly phone: string
  readonly email: string | null
  readonly city: string | null
  readonly state: string | null
  readonly territory: string | null
  readonly photo_url: string | null
  readonly is_active: boolean
}

function teamMemberToRep(member: (typeof TEAM_MEMBERS)[number]): Rep {
  return {
    id: member.id,
    slug: member.slug,
    name: member.name,
    role: member.role,
    bio: member.bio,
    phone: member.phone,
    email: null,
    city: null,
    state: null,
    territory: null,
    photo_url: null,
    is_active: true,
  }
}

export async function getReps(): Promise<readonly Rep[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("reps")
      .select("id, slug, name, role, bio, phone, email, city, state, territory, photo_url, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error || !data || data.length === 0) {
      return TEAM_MEMBERS.map(teamMemberToRep)
    }

    return data as Rep[]
  } catch {
    return TEAM_MEMBERS.map(teamMemberToRep)
  }
}

export async function getRepBySlug(slug: string): Promise<Rep | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("reps")
      .select("id, slug, name, role, bio, phone, email, city, state, territory, photo_url, is_active")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      const member = TEAM_MEMBERS.find((m) => m.slug === slug)
      return member ? teamMemberToRep(member) : null
    }

    return data as Rep
  } catch {
    const member = TEAM_MEMBERS.find((m) => m.slug === slug)
    return member ? teamMemberToRep(member) : null
  }
}

export async function getAllRepSlugs(): Promise<string[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("reps")
      .select("slug")
      .eq("is_active", true)

    if (error || !data || data.length === 0) {
      return TEAM_MEMBERS.map((m) => m.slug)
    }

    return data.map((r) => r.slug)
  } catch {
    return TEAM_MEMBERS.map((m) => m.slug)
  }
}
