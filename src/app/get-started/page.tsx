import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarCheck, Wifi, CreditCard, Gift } from "lucide-react";
import { GetStartedForm } from "@/components/forms/get-started-form";

export const metadata: Metadata = {
  title: "Get Started | FiberFastUSA",
  description:
    "Sign up for fiber internet in just a few minutes. Fast, simple, and secure. Get connected to blazing-fast speeds today.",
  openGraph: {
    title: "Sign Up for Fiber Internet | FiberFastUSA",
    description: "Get connected to blazing-fast fiber internet in just a few minutes. No contracts, no hassle.",
  },
};

const steps = [
  {
    icon: CalendarCheck,
    title: "Schedule Your Install",
    description: "Pick a date and time that works for you. Installation is always free.",
  },
  {
    icon: Wifi,
    title: "Tech Sets You Up",
    description: "A certified technician comes to your home, sets up your Wi-Fi, and creates your account. Most installs take 2-4 hours.",
  },
  {
    icon: CreditCard,
    title: "Add Your Payment",
    description: "Once you're connected and online, you set up your payment info directly with the provider. We never collect payment or signatures.",
  },
  {
    icon: Gift,
    title: "Get Your Gift Card",
    description: "About 3 months after installation, your Visa gift card arrives by email or mail — you choose how you want to receive it.",
  },
];

export default function GetStartedPage() {
  return (
    <main>
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get Started with FiberFastUSA
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Sign up for fiber internet in just a few minutes.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <Suspense fallback={<div className="text-center text-muted-foreground">Loading form...</div>}>
              <GetStartedForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What Happens Next
            </h2>
            <p className="text-lg text-muted-foreground">
              From signup to surfing — here&apos;s exactly what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fiber-blue/10 flex items-center justify-center">
                      <Icon className="size-5 text-fiber-blue" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-fiber-blue mb-1">Step {index + 1}</div>
                      <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
