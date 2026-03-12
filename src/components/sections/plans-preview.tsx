import Link from "next/link"
import { Zap, Gift } from "lucide-react"
import { PLANS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PlansPreviewSection() {
  const displayedPlans = PLANS.slice(0, 3)

  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-fiber-blue-dark text-center mb-12">
          Simple, Transparent Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayedPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative",
                plan.isFeatured && "md:scale-105 md:z-10"
              )}
            >
              {plan.isFeatured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-fiber-orange text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={cn(
                  "flex flex-col h-full",
                  plan.isFeatured && "ring-2 ring-fiber-orange"
                )}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-fiber-blue-dark">
                    {plan.name}
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    {plan.bestFor}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-fiber-blue-dark">
                      ${plan.price}
                      <span className="text-lg text-gray-600 font-normal">
                        /mo
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.freeMonths !== null && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <Zap className="size-3 mr-1" />
                        {plan.freeMonths} Months FREE
                      </Badge>
                    )}
                    {plan.giftCard > 0 && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        <Gift className="size-3 mr-1" />
                        +${plan.giftCard} Gift Card
                      </Badge>
                    )}
                  </div>

                  <div className="text-lg font-semibold text-gray-800 mb-4">
                    {plan.speed}
                  </div>

                  <p className="text-sm text-gray-600">
                    {plan.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing">
            <Button
              size="lg"
              className="bg-fiber-blue hover:bg-fiber-blue-dark text-white"
            >
              View All Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
