import type { Metadata } from "next";
import { Suspense } from "react";
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

export default function GetStartedPage() {
  return (
    <main>
      <section className="py-16 md:py-24">
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
    </main>
  );
}
