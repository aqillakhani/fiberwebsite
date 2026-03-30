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
    photo_url: member.image ?? null,
    is_active: true,
  }
}

export async function getReps(): Promise<readonly Rep[]> {
  return TEAM_MEMBERS.map(teamMemberToRep)
}

export async function getRepBySlug(slug: string): Promise<Rep | null> {
  const member = TEAM_MEMBERS.find((m) => m.slug === slug)
  return member ? teamMemberToRep(member) : null
}

export async function getAllRepSlugs(): Promise<string[]> {
  return TEAM_MEMBERS.map((m) => m.slug)
}
