import type { Metadata } from "next"
import Link from "next/link"
import { Check, Zap, Gift, Infinity } from "lucide-react"

import { PLANS, PLAN_INCLUDES } from "@/lib/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PlanRecommender } from "@/components/ui/plan-recommender"

export const metadata: Metadata = {
  title: "Plans & Pricing | FiberFastUSA",
  description:
    "Simple, transparent pricing with no contracts, no hidden fees, and no data caps. Compare our fiber internet plans and find the perfect speed for your home.",
  openGraph: {
    title: "Plans & Pricing | FiberFastUSA",
    description: "Fiber internet from $34.99/mo. No contracts, no data caps, no hidden fees.",
  },
}

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FiberFastUSA Internet Plans",
  itemListElement: PLANS.map((plan, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: `FiberFastUSA ${plan.name}`,
      description: plan.description,
      offers: {
        "@type": "Offer",
        price: plan.price,
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: `https://fiberfastusa.com/check-availability?plan=${plan.id}`,
      },
    },
  })),
}

export default function PricingPage() {
  const pricingFAQ = [
    {
      question: "Are there hidden fees?",
      answer:
        "Absolutely not. The price you see is the price you pay. No installation fees, no equipment charges, no surprise costs. We believe in complete transparency.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, anytime. Since we don't require contracts, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect on your next billing cycle.",
    },
    {
      question: "Is there a contract?",
      answer:
        "No contracts, ever. All FiberFastUSA plans are month-to-month. You can cancel anytime with zero early termination fees. We earn your business every month.",
    },
    {
      question: "Do you offer discounts for annual commitment?",
      answer:
        "We keep our pricing simple and fair. You get the same great rate every month without long-term commitment. No need to lock in when our service speaks for itself.",
    },
    {
      question: "What happens if I move?",
      answer:
        "If you move to an area we serve, we'll transfer your service for free. If we're not available at your new address yet, you can cancel with no fees.",
    },
  ]

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-display text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              No contracts. No hidden fees. No data caps. Just blazing-fast fiber internet
              at prices that make sense.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card-premium bg-card rounded-xl border p-6 flex flex-col relative ${
                  plan.isFeatured
                    ? "gradient-border border-2 lg:scale-105 lg:-my-2 shadow-lg"
                    : "border-border"
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-fiber-red px-3 py-1 text-xs font-semibold text-white">
                      <Zap className="size-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="text-2xl font-bold text-fiber-red mb-1">
                  {plan.speed}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground italic mb-2">
                  {plan.bestFor}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-fiber-red/10 px-2.5 py-0.5 text-xs font-semibold text-fiber-red mb-2">
                  <Infinity className="size-3" /> Unlimited Data
                </span>

                <div className="text-4xl font-bold text-foreground mb-1">
                  ${plan.price}
                  <span className="text-sm text-muted-foreground font-normal ml-1">/mo</span>
                </div>

                <div className="flex flex-wrap gap-2 my-4">
                  {plan.freeMonths !== null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-fiber-success/10 px-3 py-1 text-xs font-semibold text-fiber-success">
                      <Zap className="size-3" />
                      {plan.freeMonths} Months FREE
                    </span>
                  )}
                  {plan.giftCard > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-fiber-red/10 px-3 py-1 text-xs font-semibold text-fiber-red">
                      <Gift className="size-3" />
                      +${plan.giftCard} Visa Gift Card
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="size-4 text-fiber-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/check-availability?plan=${plan.id}`}
                  className={`inline-flex items-center justify-center w-full h-11 px-4 rounded-lg text-sm font-semibold transition-all ${
                    plan.isFeatured
                      ? "bg-fiber-red text-white hover:bg-fiber-red/90 glow-teal"
                      : "border border-border hover:bg-accent text-foreground"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              All Plans Include
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every FiberFastUSA plan comes with these features at no extra cost.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {PLAN_INCLUDES.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card rounded-lg border border-border p-4">
                <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Not sure which plan is right for you? Compare features side by side.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl border border-border overflow-hidden">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Feature</th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className={`px-6 py-4 text-center font-semibold ${
                        plan.isFeatured ? "text-fiber-red" : "text-foreground"
                      }`}
                    >
                      {plan.name}
                      {plan.isFeatured && (
                        <span className="block text-xs text-fiber-red/70 font-normal mt-0.5">
                          Most Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Data Cap</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-fiber-success">
                      Unlimited
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Download Speed</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm">
                      {plan.speed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Upload Speed</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm">
                      {plan.speed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Best For</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {plan.bestFor}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Gift Card</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm">
                      {plan.giftCard > 0 ? `$${plan.giftCard}` : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Free Months</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm">
                      {plan.freeMonths ? `${plan.freeMonths} months` : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Price</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className={`px-6 py-4 text-center font-semibold ${
                      plan.isFeatured ? "text-fiber-red" : "text-foreground"
                    }`}>
                      ${plan.price}/mo
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              All plans include free installation, free Wi-Fi router, no data caps, and no contracts.
            </p>
            <p className="text-xs text-muted-foreground">
              Visa gift cards are delivered approximately 3 months after installation via email or mail — your choice.
            </p>
          </div>
        </div>
      </section>

      {/* Not Sure CTA + Plan Recommender */}
      <section className="py-16 md:py-20 bg-treatment-showcase">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Not Sure Which Plan Is Right?
            </h2>
            <p className="text-lg text-muted-foreground">
              Answer two quick questions and we&apos;ll recommend the best plan for you.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <PlanRecommender />
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Pricing Questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <Accordion className="w-full">
            {pricingFAQ.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Switch to Fiber?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Check if FiberFastUSA is available at your address and get connected today.
          </p>
          <Link
            href="/check-availability"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-red text-white font-semibold hover:bg-fiber-red/90 transition-all glow-teal gap-2"
          >
            <Zap className="size-5" />
            Check Your Address
          </Link>
        </div>
      </section>
    </main>
  )
}
