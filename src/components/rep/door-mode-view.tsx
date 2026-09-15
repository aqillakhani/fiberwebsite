"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { LanguageToggle } from "@/components/lead/language-toggle";
import { PendingLeadsSync } from "@/components/lead/pending-leads-sync";
import { useLanguage } from "@/components/providers/language-provider";
import { Logo } from "@/components/ui/logo";
import type { Rep } from "@/lib/reps";

interface DoorModeViewProps {
  rep: Rep;
}

/**
 * What a canvasser shows at the door from their QR badge (/r/:slug → here). Logo only, rep identity,
 * the canonical form in rep mode. The rep cookie was set by middleware, so attribution is automatic.
 */
export default function DoorModeView({ rep }: DoorModeViewProps) {
  const firstName = rep.name.split(" ")[0];
  const { copy, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white" lang={language}>
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <Link href="/" aria-label="FiberFastUSA home">
          <Logo tone="dark" />
        </Link>
        <LanguageToggle />
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <PendingLeadsSync />
        <div className="flex items-center gap-4">
          {rep.photo_url ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
              <Image src={rep.photo_url} alt={rep.name} fill className="object-cover" sizes="56px" />
            </div>
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-fiber-blue-light text-2xl font-bold text-fiber-blue">
              {firstName[0]}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-gray-900">{rep.name}</h1>
            <p className="flex items-center gap-1.5 text-xs font-medium text-fiber-success">
              <ShieldCheck className="size-3.5" aria-hidden />
              {copy.door.verified}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-tight text-gray-900">{copy.door.headline}</h2>

        <LeadForm mode="rep" source="door-mode" />

        <ul className="grid grid-cols-2 gap-2 pt-2 text-sm text-gray-600">
          {copy.door.badges.map((badge) => (
            <li key={badge} className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-fiber-success" aria-hidden />
              {badge}
            </li>
          ))}
        </ul>

        <p className="pb-4 text-center text-xs text-gray-500">
          {copy.door.footer}
        </p>
      </main>
    </div>
  );
}
