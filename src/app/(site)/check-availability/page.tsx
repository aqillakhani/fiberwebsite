import type { Metadata } from "next";
import { PhoneCall, ShieldCheck, Timer, Wifi } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { CLOSER_SLA_MINUTES } from "@/components/lead/serviceability-copy";

export const metadata: Metadata = {
  title: "Check Fiber Availability at Your Address | FiberFastUSA",
  description:
    "Enter your address, pick the provider and speed you want, and a specialist calls within minutes with the best promo and price available at your home.",
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
    <main className="bg-treatment-trust">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="heading-display text-3xl text-white sm:text-4xl md:text-5xl">
            Find the best internet offer at your address
          </h1>
          <p className="mt-4 text-lg text-blue-100/85">
            Type your address, pick the provider and speed you want, and a specialist shops every provider at your
            home for the best promo and lowest price — then calls to set everything up.
          </p>
        </div>

        <ul className="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-50">
          {TRUST_SIGNALS.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-fiber-sky" aria-hidden />
              <span className="font-medium">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto max-w-2xl bg-card rounded-2xl border border-white/15 p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] md:p-10">
          <LeadForm source="check-availability" />
        </div>
      </section>
    </main>
  );
}
