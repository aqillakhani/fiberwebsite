"use client"

import Link from "next/link"
import { Check, Zap, Gift } from "lucide-react"
import { PLANS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

export default function PlansPreviewSection() {
  const { ref, isVisible } = useIntersectionObserver()
  const displayedPlans = PLANS.slice(0, 4)

  return (
    <section className="w-full py-16 md:py-24 bg-white white-section">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2 className="heading-section text-foreground mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            All-in pricing with no hidden fees. Free installation. Free router. No contracts.
          </p>
          <p className="text-base font-bold text-fiber-teal">
            Schedule your install today — no payment required upfront.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "relative transition-all duration-700",
                plan.isFeatured && "lg:scale-105 lg:z-10",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : "0ms" }}
            >
              {/* Most Popular Badge */}
              {plan.isFeatured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-fiber-teal text-white border-0 shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Card */}
              <Card
                className={cn(
                  "card-premium flex flex-col h-full rounded-xl transition-all duration-300",
                  plan.isFeatured
                    ? "gradient-border border-2 shadow-lg hover:shadow-xl"
                    : "hover:border-fiber-teal/30"
                )}
              >
                <CardHeader className="pb-3">
                  {/* Plan Speed */}
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-fiber-blue dark:text-fiber-blue">
                      {plan.speed}
                    </div>
                  </div>

                  {/* Plan Name */}
                  <CardTitle className="text-xl text-foreground mb-2">
                    {plan.name}
                  </CardTitle>

                  {/* Best For Tagline */}
                  <p className="text-sm text-muted-foreground italic">
                    {plan.bestFor}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-foreground">
                      ${plan.price}
                      <span className="text-sm text-muted-foreground font-normal ml-1">
                        /mo
                      </span>
                    </div>
                  </div>

                  {/* Badges: Free Months & Gift Card */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {plan.freeMonths !== null && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Zap className="size-3" />
                        {plan.freeMonths} Months FREE
                      </Badge>
                    )}
                    {plan.giftCard > 0 && (
                      <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800 flex items-center gap-1">
                        <Gift className="size-3" />
                        ${plan.giftCard} Gift Card
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-grow">
                    <div className="flex items-start gap-3">
                      <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-foreground">Free Professional Installation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-foreground">Free Wi-Fi Router Included</span>
                    </div>
                    {plan.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/check-availability?plan=${plan.id}`}
                    className={cn(
                      "inline-flex items-center justify-center w-full h-9 px-4 rounded-lg text-sm font-semibold transition-all duration-300",
                      plan.isFeatured
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white text-black border border-gray-300 hover:bg-gray-100 font-bold"
                    )}
                  >
                    Check Availability
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* View All Plans Link */}
        <div
          className={cn(
            "text-center transition-all duration-700 delay-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center text-base font-semibold text-fiber-blue dark:text-fiber-blue hover:underline transition-colors"
          >
            View All Plans
            <span className="ml-2">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
