import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { Logo } from "@/components/ui/logo";
import type { Rep } from "@/lib/reps";

interface DoorModeViewProps {
  rep: Rep;
}

const DOOR_BADGES = ["No contract", "Free install", "No data caps", "Nothing to pay today"];

/**
 * What a canvasser shows at the door from their QR badge (/r/:slug → here). Logo only, rep identity,
 * the canonical form in rep mode. The rep cookie was set by middleware, so attribution is automatic.
 */
export default function DoorModeView({ rep }: DoorModeViewProps) {
  const firstName = rep.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <Link href="/" aria-label="FiberFastUSA home">
          <Logo tone="dark" />
        </Link>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
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
              Verified FiberFastUSA representative
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-tight text-gray-900">Let&apos;s see which fiber is live at this address.</h2>

        <LeadForm mode="rep" source="door-mode" />

        <ul className="grid grid-cols-2 gap-2 pt-2 text-sm text-gray-600">
          {DOOR_BADGES.map((badge) => (
            <li key={badge} className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-fiber-success" aria-hidden />
              {badge}
            </li>
          ))}
        </ul>

        <p className="pb-4 text-center text-xs text-gray-500">
          FiberFastUSA · A specialist calls the homeowner on a recorded line.
        </p>
      </main>
    </div>
  );
}
