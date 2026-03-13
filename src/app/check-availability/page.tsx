import type { Metadata } from "next";
import { Suspense } from "react";
import { Shield, Zap, Award, Wifi } from "lucide-react";

import QualificationFlow from "@/components/forms/qualification-flow";

export const metadata: Metadata = {
  title: "Check Availability | FiberFastUSA",
  description:
    "Check if FiberFastUSA fiber internet is available at your address. Choose your plan, pick an install date, and get connected.",
  openGraph: {
    title: "Check Your Fiber Availability | FiberFastUSA",
    description: "See if blazing-fast fiber internet is available at your address.",
  },
};

function QualificationFlowWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const address = typeof searchParams.address === "string" ? searchParams.address : undefined;
  const plan = typeof searchParams.plan === "string" ? searchParams.plan : undefined;

  return <QualificationFlow prefilledAddress={address} prefilledPlan={plan} />;
}

export default async function CheckAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const trustSignals = [
    { icon: Zap, label: "Nationwide Fiber Coverage" },
    { icon: Shield, label: "No Contracts" },
    { icon: Wifi, label: "No Data Caps" },
    { icon: Award, label: "Free Installation" },
  ];

  return (
    <main>
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Get Connected to Fiber Internet
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Check availability, choose your plan, and schedule your installation — all in under 2 minutes.
            </p>
          </div>

          {/* Trust Signals */}
          <div className="mx-auto max-w-2xl mb-10">
            <div className="flex flex-wrap justify-center gap-6">
              {trustSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="size-4 text-fiber-success" />
                    <span className="font-medium">{signal.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualification Flow */}
          <div className="mx-auto max-w-2xl">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-sm">
              <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading...</div>}>
                <QualificationFlowWrapper searchParams={resolvedSearchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
