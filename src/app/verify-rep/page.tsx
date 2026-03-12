import { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Phone } from "lucide-react";

import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { RepSearchForm } from "@/components/forms/rep-search-form";

export const metadata: Metadata = {
  title: "Verify a Representative | FiberFastUSA",
  description:
    "Search by name or employee ID to confirm your FiberFastUSA representative is authorized.",
};

export default function VerifyRepPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Verify Your FiberFastUSA Representative
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Search by name or employee ID to confirm your rep is authorized.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <RepSearchForm />
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex gap-3">
              <AlertCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-lg">Why Verify?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  FiberFastUSA representatives should always be able to provide
                  their name and employee ID. Verification helps protect you from
                  fraud and ensures you&apos;re working with an authorized team member
                  who can properly assist with your service.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Never provide payment information or sign contracts without
                  verifying your representative&apos;s legitimacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Can't Find Rep Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <h3 className="font-semibold text-lg">Can&apos;t find your rep?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact us directly to verify any representative or report a
              suspected fraud incident.
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
