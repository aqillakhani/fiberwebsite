import Link from "next/link";
import { Check, Gift, PhoneCall, ShieldCheck, Tag } from "lucide-react";

import { NETWORKS, promoLabel, type NetworkCatalog, type RatePlan } from "@/data/isp-plans";
import { cn } from "@/lib/utils";

interface NetworkPlansProps {
  /** Show fewer plans per network (home page / rep page). */
  compact?: boolean;
}

const COMPACT_PLAN_COUNT = 3;

/**
 * Plans grouped by fiber network. Which network applies is decided by the address check, never by this page,
 * so every section links back to it. Networks without a rate card we may publish say so plainly.
 */
export function NetworkPlans({ compact = false }: NetworkPlansProps) {
  return (
    <div className="space-y-6">
      <nav aria-label="Fiber networks" className="flex flex-wrap gap-2">
        {NETWORKS.map((network) => (
          <a
            key={network.id}
            href={`#network-${network.id}`}
            className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-800 hover:border-fiber-blue hover:text-fiber-blue"
          >
            {network.shortName}
          </a>
        ))}
      </nav>
      {NETWORKS.map((network) => (
        <NetworkSection key={network.id} network={network} compact={compact} />
      ))}
    </div>
  );
}

function NetworkSection({ network, compact }: { network: NetworkCatalog; compact: boolean }) {
  const plans = network.plans ? (compact ? network.plans.slice(0, COMPACT_PLAN_COUNT) : network.plans) : null;
  return (
    <section id={`network-${network.id}`} className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold text-gray-900">{network.name}</h3>
        <p className="text-sm text-gray-500">Sold in {network.states}</p>
      </div>
      <p className="mt-1 text-sm text-gray-600">{network.note}</p>
      {network.includes.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {network.includes.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check className="size-4 text-fiber-success" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
      {plans ? (
        <>
          <div className={cn("mt-6 grid gap-4", compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3", !compact && (plans.length > 5 ? "xl:grid-cols-6" : "xl:grid-cols-5"))}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <PlanFootnote network={network} />
        </>
      ) : (
        <CallToConfirm network={network} />
      )}
    </section>
  );
}

function PlanCard({ plan }: { plan: RatePlan }) {
  const promo = promoLabel(plan);
  return (
    <article className={cn("flex flex-col rounded-xl border p-5", plan.isFeatured ? "border-fiber-blue shadow-md" : "border-gray-200")}>
      <p className="text-sm font-semibold text-fiber-blue">{plan.speed}</p>
      <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
      <p className="mt-2 text-3xl font-extrabold text-gray-900">
        ${plan.price.toFixed(2)}
        <span className="text-sm font-medium text-gray-500">/mo</span>
      </p>
      {plan.listPrice !== null && (
        <p className="text-xs text-gray-500">
          <s>${plan.listPrice.toFixed(2)}</s> without AutoPay
        </p>
      )}
      {promo && (
        <p className="mt-2 inline-flex items-start gap-1.5 rounded-md bg-fiber-red-light px-2 py-1 text-xs font-semibold text-fiber-red">
          <Tag className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {promo}
        </p>
      )}
      <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
        {plan.giftCard !== null && (
          <li className="flex gap-2 font-semibold text-gray-900">
            <Gift className="mt-0.5 size-4 shrink-0 text-fiber-red" aria-hidden />${plan.giftCard} prepaid card
          </li>
        )}
        {plan.priceGuaranteeYears !== null && (
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-fiber-blue" aria-hidden />
            {plan.priceGuaranteeYears}-year price guarantee
          </li>
        )}
        {plan.perks.map((perk) => (
          <li key={perk} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-fiber-success" aria-hidden />
            {perk}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PlanFootnote({ network }: { network: NetworkCatalog }) {
  return (
    <p className="mt-4 text-xs text-gray-500">
      {network.promoNote ? `${network.promoNote} ` : ""}
      Prices read from {network.shortName}&apos;s order page on {network.checkedOn}; taxes extra unless stated. Your exact plans and
      promos are confirmed on the call.
    </p>
  );
}

function CallToConfirm({ network }: { network: NetworkCatalog }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <PhoneCall className="mt-0.5 size-5 shrink-0 text-fiber-blue" aria-hidden />
        <p className="text-sm text-gray-700">
          {network.shortName} pricing depends on your exact address and this month&apos;s promos. Check your address and a specialist
          reads you the current plans on the call — nothing to pay online.
        </p>
      </div>
      <Link href="/check-availability" className="inline-flex h-11 shrink-0 items-center rounded-lg bg-fiber-blue px-5 font-semibold text-white hover:bg-blue-800">
        Check my address
      </Link>
    </div>
  );
}
