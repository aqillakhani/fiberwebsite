"use client"

import { useAttribution } from "@/components/providers/attribution-provider"
import { TEAM_MEMBERS } from "@/lib/constants"

export function RepBanner() {
  const { repSlug } = useAttribution()

  if (!repSlug) return null

  const rep = TEAM_MEMBERS.find((m) => m.slug === repSlug)
  const repName = rep?.name ?? repSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="w-full bg-fiber-teal/10 border-b border-fiber-teal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center">
        <p className="text-sm font-medium text-fiber-teal">
          You&apos;re connected with <span className="font-bold">{repName}</span>, your local service specialist
        </p>
      </div>
    </div>
  )
}
