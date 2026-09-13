import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { NETWORKS, lowestPrice, type RatePlan } from "@/data/isp-plans";

/** Home page: which networks we sell, and that the address check decides the price list. */
export default function PlansPreviewSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            One address check. {NETWORKS.length} fiber networks.
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Each network sets its own plans and promos. We tell you which one reaches your home, then walk you through
            that network&apos;s prices on the call.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NETWORKS.map((network) => (
            <li key={network.id} className="rounded-xl border border-gray-200 p-5">
              <p className="font-bold text-gray-900">{network.name}</p>
              <p className="mt-1 text-sm text-gray-500">{network.states}</p>
              <p className="mt-2 text-sm text-gray-700">{startingPriceLabel(network.plans)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link href="/pricing" className="inline-flex items-center gap-2 font-semibold text-fiber-blue hover:underline">
            See plans by network <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function startingPriceLabel(plans: readonly RatePlan[] | null): string {
  if (!plans) return "Pricing confirmed on your call";
  return `Plans from $${lowestPrice(plans).toFixed(2)}/mo`;
}
