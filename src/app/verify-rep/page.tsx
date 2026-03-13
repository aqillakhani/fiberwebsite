import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, Phone, CheckCircle } from "lucide-react";

import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { RepSearchForm } from "@/components/forms/rep-search-form";

export const metadata: Metadata = {
  title: "Verify a Representative | FiberFastUSA",
  description:
    "Search by name or employee ID to confirm your FiberFastUSA representative is authorized. Protect yourself from fraud.",
  openGraph: {
    title: "Verify a Representative | FiberFastUSA",
    description: "Confirm your FiberFastUSA representative is authorized before sharing personal information.",
  },
};

export default function VerifyRepPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-fiber-success/20 flex items-center justify-center">
                <ShieldCheck className="size-8 text-fiber-success" />
              </div>
            </div>
            <h1 className="heading-display text-white mb-4">
              Verify Your Representative
            </h1>
            <p className="text-lg text-white/80">
              Search by name or employee ID to confirm your FiberFastUSA representative is authorized.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <RepSearchForm />
          </div>
        </div>
      </section>

      {/* How Verification Works */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground text-center mb-8">
            How Verification Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Ask for ID",
                desc: "Every FiberFastUSA rep carries a name badge and can provide their employee ID.",
              },
              {
                step: "2",
                title: "Search Here",
                desc: "Enter their name or ID above to confirm they are an authorized representative.",
              },
              {
                step: "3",
                title: "Verify & Proceed",
                desc: "Once verified, you can safely share your information and discuss service options.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-fiber-success text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Warning */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-6">
            <div className="flex gap-3">
              <AlertTriangle className="size-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-lg text-foreground">Protect Yourself</h2>
                <ul className="mt-3 space-y-2">
                  {[
                    "Never provide payment information to an unverified representative",
                    "Legitimate reps will never ask for your Social Security number",
                    "All FiberFastUSA reps carry official identification",
                    "If someone claims to represent FiberFastUSA and is not listed here, contact us immediately",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="size-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Can't Find Rep Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border bg-card p-6 text-center">
            <h3 className="font-semibold text-lg text-foreground">Can&apos;t find your rep?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact us directly to verify any representative or report suspicious activity.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
              <a href={COMPANY.phoneHref}>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Phone className="mr-2 size-4" />
                  {COMPANY.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
