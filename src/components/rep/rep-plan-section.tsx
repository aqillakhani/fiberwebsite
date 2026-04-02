"use client"

import { useState } from "react"
import { PLANS } from "@/lib/constants"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Gift, Star, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RepPlanSectionProps {
  repName: string
}

export default function RepPlanSection({ repName }: RepPlanSectionProps) {
  const [openPlanId, setOpenPlanId] = useState<string | null>(null)
  const displayPlans = PLANS.slice(0, 4)

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tap a plan to see full details. All plans include free installation, a free router, and no data caps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPlans.map((plan) => (
            <Sheet
              key={plan.id}
              open={openPlanId === plan.id}
              onOpenChange={(open) => setOpenPlanId(open ? plan.id : null)}
            >
              <SheetTrigger
                className={cn(
                  "relative w-full text-left bg-white rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md cursor-pointer",
                  plan.isFeatured
                    ? "border-blue-400 shadow-md"
                    : "border-gray-200"
                )}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-amber-400 text-black border-0 shadow-sm text-xs">
                      <Star className="size-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700">{plan.speed}</div>
                    <div className="text-base font-semibold text-gray-900 mt-0.5">{plan.name}</div>
                    <div className="text-sm text-gray-500 italic mt-0.5">{plan.bestFor}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                    <div className="text-xs text-gray-500">/mo</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {plan.freeMonths !== null && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                      <Zap className="size-3 mr-1" />
                      {plan.freeMonths} Months FREE
                    </Badge>
                  )}
                  {plan.giftCard > 0 && (
                    <Badge className="bg-teal-100 text-teal-700 border-teal-200 text-xs">
                      <Gift className="size-3 mr-1" />
                      ${plan.giftCard} Gift Card
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-3 text-xs text-blue-600 font-medium">
                  View details <ChevronRight className="size-3" />
                </div>
              </SheetTrigger>

              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                <SheetHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle className="text-xl font-bold text-gray-900">
                        {plan.name} — {plan.speed}
                      </SheetTitle>
                      <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                      <div className="text-xs text-gray-500">/mo</div>
                    </div>
                  </div>
                </SheetHeader>

                {/* Promo badges */}
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  {plan.freeMonths !== null && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                      <Zap className="size-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-700 text-sm">{plan.freeMonths} Months FREE</span>
                    </div>
                  )}
                  {plan.giftCard > 0 && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 flex items-center gap-2">
                      <Gift className="size-4 text-teal-600" />
                      <span className="font-semibold text-teal-700 text-sm">${plan.giftCard} Visa Gift Card</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="px-4 pb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">What&apos;s included:</p>
                  <div className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All plans include */}
                <div className="mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 text-sm mb-2">Every plan includes:</p>
                  <div className="space-y-1 text-sm text-blue-800">
                    {["Free installation", "Free router", "No data caps", "No contracts", "24/7 support"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-4 pb-6 pt-2">
                  <a
                    href="#lead-form"
                    onClick={() => setOpenPlanId(null)}
                    className="flex items-center justify-center w-full h-12 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Sign Up with {repName}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </div>
    </section>
  )
}
