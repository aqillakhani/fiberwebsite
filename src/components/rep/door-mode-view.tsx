"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Check } from "lucide-react"

import type { Rep } from "@/lib/reps"
import { PLANS } from "@/lib/constants"
import DoorModeForm from "@/components/forms/door-mode-form"
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"

type DoorModeViewProps = {
  rep: Rep
  prefilledAddress?: string
  prefilledPlan?: string
}

export default function DoorModeView({ rep, prefilledAddress, prefilledPlan }: DoorModeViewProps) {
  const [submitted, setSubmitted] = useState<{
    firstName: string
    planId: string
    date: string
  } | null>(null)

  const firstName = rep.name.split(" ")[0]
  const plan = submitted ? PLANS.find((p) => p.id === submitted.planId) : null

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Minimal header */}
        <header className="border-b border-border px-4 py-3">
          <Link href="/" className="text-lg font-bold text-foreground">
            Fiber<span className="text-fiber-teal">Fast</span>USA
          </Link>
        </header>

        <ConfirmationScreen
          firstName={submitted.firstName}
          repName={firstName}
          selectedPlan={submitted.planId}
          preferredDate={submitted.date}
          giftCardAmount={plan?.giftCard}
          planPrice={plan?.price}
          planName={plan?.name}
          source="door-mode"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header — logo only */}
      <header className="border-b border-border px-4 py-3">
        <Link href="/" className="text-lg font-bold text-foreground">
          Fiber<span className="text-fiber-teal">Fast</span>USA
        </Link>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Rep Identity Bar */}
        <div className="flex items-center gap-4">
          {rep.photo_url ? (
            <div className="relative size-14 rounded-full overflow-hidden flex-shrink-0">
              <Image src={rep.photo_url} alt={rep.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="size-14 rounded-full bg-gradient-to-br from-fiber-blue/30 via-fiber-teal/20 to-fiber-blue/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-foreground/40">
                {firstName[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-foreground">{rep.name}</h1>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-fiber-success" />
              <span className="text-xs font-medium text-fiber-success">
                Verified Representative
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            Hi! I&apos;m {firstName}. Let&apos;s get you connected to fiber internet.
          </h2>
        </div>

        {/* The Form */}
        <DoorModeForm
          repSlug={rep.slug}
          repName={firstName}
          prefilledAddress={prefilledAddress}
          prefilledPlan={prefilledPlan}
          onSuccess={setSubmitted}
        />

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {["No Contract", "Free Install", "No Data Caps", "Free Router"].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 text-fiber-success flex-shrink-0" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <p className="text-xs text-center text-muted-foreground pb-4">
          FiberFastUSA &middot; Your info is only shared with your representative.
        </p>
      </main>
    </div>
  )
}
