import type { Metadata } from "next";
import { PhoneCall, ShieldCheck, Timer, Wifi } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { CLOSER_SLA_MINUTES } from "@/components/lead/serviceability-copy";

export const metadata: Metadata = {
  title: "Check Fiber Availability at Your Address | FiberFastUSA",
  description:
    "Enter your street address and see which fiber network is live at your home. A fiber specialist calls within minutes to confirm pricing and book free installation.",
  alternates: { canonical: "/check-availability" },
  openGraph: {
    title: "Check Fiber Availability at Your Address",
    description: "A real answer for your exact address, then a call from a specialist within minutes.",
  },
};

const TRUST_SIGNALS = [
  { Icon: Timer, label: `Specialist calls in ~${CLOSER_SLA_MINUTES} min` },
  { Icon: ShieldCheck, label: "No contracts" },
  { Icon: Wifi, label: "No data caps" },
  { Icon: PhoneCall, label: "Nothing to pay online" },
];

export default function CheckAvailabilityPage() {
  return (
    <main className="bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Is fiber live at your address?
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We check the real fiber footprint for your exact home — not your ZIP code — and tell you which network
            reaches it. Then a specialist calls to set everything up.
          </p>
        </div>

        <ul className="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {TRUST_SIGNALS.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-fiber-blue" aria-hidden />
              <span className="font-medium">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
          <LeadForm source="check-availability" />
        </div>
      </section>
    </main>
  );
}
