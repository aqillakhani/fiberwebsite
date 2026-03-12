import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Gift } from "lucide-react";

import { PLANS, PLAN_INCLUDES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Plans & Pricing | FiberFastUSA",
  description:
    "Simple, transparent pricing with no contracts, no hidden fees, and no data caps. Compare our fiber internet plans and find the perfect speed for your home.",
};

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
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              No contracts. No hidden fees. No data caps.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.isFeatured ? "ring-2 ring-[var(--fiber-orange)] md:scale-105" : ""
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.bestFor}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">${plan.price}</div>
                    <p className="text-sm text-muted-foreground">/month</p>
                    <p className="text-lg font-semibold text-primary">{plan.speed}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {plan.freeMonths !== null && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Zap className="size-3 mr-1" />
                        {plan.freeMonths} Months FREE
                      </Badge>
                    )}
                    {plan.giftCard > 0 && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        <Gift className="size-3 mr-1" />
                        +${plan.giftCard} Visa Gift Card
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex gap-3">
                        <Check className="size-5 flex-shrink-0 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/get-started?plan=${plan.id}`} className="block pt-4">
                    <Button className="w-full" variant={plan.isFeatured ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              All Plans Include
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {PLAN_INCLUDES.map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <Check className="size-6 flex-shrink-0 text-green-600 mt-1" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Compare Plans
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left font-semibold">Feature</th>
                  {PLANS.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Download Speed</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 px-4 text-center">
                      {plan.speed}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Upload Speed</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 px-4 text-center">
                      {plan.speed}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Best For</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 px-4 text-center">
                      {plan.bestFor}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Price</td>
                  {PLANS.map((plan) => (
                    <td key={plan.id} className="py-4 px-4 text-center">
                      ${plan.price}/mo
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pricing Questions?
            </h2>
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to Switch?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check if FiberFastUSA is available at your address and see which plan is perfect for you.
            </p>
            <Link href="/check-availability">
              <Button size="lg" className="gap-2">
                <Zap className="size-5" />
                Check Your Address
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
