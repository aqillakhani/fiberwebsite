import type { Metadata } from "next";
import { Zap, Shield, Award } from "lucide-react";

import { AvailabilityCheckForm } from "@/components/forms/availability-check-form";

export const metadata: Metadata = {
  title: "Check Availability | FiberFastUSA",
  description:
    "Check if FiberFastUSA fiber internet is available at your address. Enter your location and get instant results.",
};

export default function CheckAvailabilityPage() {
  const trustSignals = [
    { icon: Zap, label: "Fastest in Colorado" },
    { icon: Shield, label: "Reliable Service" },
    { icon: Award, label: "Top Rated" },
  ];

  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Check If Fiber Is Available at Your Address
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Enter your address and we&apos;ll let you know if FiberFastUSA is in your area.
            </p>
          </div>

          <div className="mx-auto max-w-xl mb-12">
            <AvailabilityCheckForm />
          </div>

          {/* Trust Signals */}
          <div className="mx-auto max-w-2xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {trustSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="flex flex-col items-center text-center">
                    <Icon className="size-8 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{signal.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
