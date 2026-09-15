import { PhoneCall, ShieldCheck, Timer } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { CLOSER_SLA_MINUTES } from "@/components/lead/serviceability-copy";

const PROOF_POINTS = [
  { Icon: Timer, text: `A fiber specialist calls within ~${CLOSER_SLA_MINUTES} min` },
  { Icon: ShieldCheck, text: "We work with almost every provider and shop them all for you" },
  { Icon: PhoneCall, text: "No payment or signature online. Everything is confirmed on your call." },
];

/** Server-rendered: the headline and the form shell are in the HTML before any JavaScript runs. */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#EFF6FF_0%,_transparent_55%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:items-center md:py-24 lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-fiber-blue-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fiber-blue">
            Best internet deal, found for you
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            The best internet offer at <span className="text-fiber-blue">your address</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Type your address, pick the provider and speed you want, and we find the best promo and lowest price
            available to you — fiber first, from almost every provider. A specialist calls to set it up.
          </p>
          <ul className="mt-8 space-y-3">
            {PROOF_POINTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                <Icon className="mt-0.5 size-5 shrink-0 text-fiber-blue" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div id="check" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(30,64,175,0.35)] sm:p-7">
          <h2 className="text-lg font-bold text-gray-900">Check your address</h2>
          <p className="mb-4 text-sm text-gray-500">Free, takes about a minute. No payment online.</p>
          <LeadForm source="home-hero" />
        </div>
      </div>
    </section>
  );
}
