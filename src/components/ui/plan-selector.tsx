"use client";

import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PlanSelectorProps {
  onSelect: (planId: string) => void;
  selectedPlanId?: string;
  showAll?: boolean;
}

export function PlanSelector({
  onSelect,
  selectedPlanId,
  showAll = false,
}: PlanSelectorProps) {
  const displayPlans = showAll ? PLANS : PLANS.slice(0, 4);

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4">
        {displayPlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isFeatured = plan.isFeatured;

          return (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={cn(
                "relative w-full rounded-lg p-5 text-left transition-all duration-200",
                "border-2 border-border hover:border-fiber-blue/30",
                isFeatured && "bg-gradient-to-br from-fiber-blue-light to-transparent",
                isSelected &&
                  isFeatured &&
                  "border-fiber-blue bg-gradient-to-br from-fiber-blue-light to-transparent ring-2 ring-fiber-blue ring-offset-2",
                isSelected &&
                  !isFeatured &&
                  "border-fiber-blue ring-2 ring-fiber-blue ring-offset-2",
              )}
            >
              {/* Featured badge */}
              {isFeatured && (
                <div className="absolute -top-3 right-4 inline-block bg-fiber-yellow px-3 py-1 text-xs font-semibold text-black rounded-full">
                  Most Popular
                </div>
              )}

              {/* Radio indicator */}
              <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-border">
                {isSelected && (
                  <div className="absolute inset-1 rounded-full bg-fiber-blue" />
                )}
              </div>

              {/* Plan content */}
              <div className="pr-12">
                {/* Plan name and speed */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.speed}</p>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {plan.giftCard > 0 && (
                    <span className="inline-block bg-green-100 px-2 py-1 text-xs font-medium text-green-800 rounded">
                      ${plan.giftCard} Gift Card
                    </span>
                  )}
                  {plan.freeMonths && plan.freeMonths > 0 && (
                    <span className="inline-block bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 rounded">
                      {plan.freeMonths} Months Free
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Not sure? Our most popular plan is <span className="font-semibold">Gig 1</span>
        </p>
      </div>
    </div>
  );
}
