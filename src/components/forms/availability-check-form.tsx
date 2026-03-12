"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

import {
  availabilitySchema,
  type AvailabilityFormData,
} from "@/lib/validations/schemas";
import { submitLead } from "@/actions/submit-lead";
import { trackAvailabilityCheck } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormStep = "check" | "result" | "quote";

export function AvailabilityCheckForm() {
  const [step, setStep] = useState<FormStep>("check");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkedAddress, setCheckedAddress] = useState<string>("");

  const {
    register: registerCheck,
    handleSubmit: handleCheckSubmit,
    formState: { errors: checkErrors },
    trigger: triggerCheck,
  } = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    mode: "onBlur",
  });

  const {
    register: registerQuote,
    handleSubmit: handleQuoteSubmit,
    formState: { errors: quoteErrors },
    trigger: triggerQuote,
  } = useForm<Record<string, string>>({
    mode: "onBlur",
  });

  const onCheckSubmit = async (data: AvailabilityFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      trackAvailabilityCheck(data.address);
      setCheckedAddress(data.address);
      setStep("result");
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Availability check error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onQuoteSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitLead({
        serviceAddress: checkedAddress,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: checkedAddress.split(",")[1]?.trim() || "",
        state: checkedAddress.split(",")[2]?.trim().split(" ")[0] || "",
        zip: checkedAddress.split(" ").pop() || "",
        source: "check-availability",
      });

      if (result.success) {
        setStep("check");
        // Show success message
      } else {
        setSubmitError(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Quote submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
      </CardHeader>

      <CardContent>
        {step === "check" && (
          <form onSubmit={handleCheckSubmit(onCheckSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="address">Enter Your Address</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder="123 Main Street, Denver, CO 80202"
                  {...registerCheck("address")}
                  aria-invalid={!!checkErrors.address}
                  onBlur={() => triggerCheck("address")}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              {checkErrors.address && (
                <p className="mt-1 text-sm text-destructive">
                  {checkErrors.address.message}
                </p>
              )}
            </div>

            {submitError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Checking..." : "Check Availability"}
            </Button>
          </form>
        )}

        {step === "result" && (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-lg font-semibold text-green-700">
                Great news!
              </p>
              <p className="text-sm text-green-600">
                We service your area. Get a quote to see our plans.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Get a Quote</h3>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  {...registerQuote("fullName")}
                  aria-invalid={!!quoteErrors.fullName}
                  onBlur={() => triggerQuote("fullName")}
                />
                {quoteErrors.fullName && (
                  <p className="mt-1 text-sm text-destructive">
                    {quoteErrors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...registerQuote("email")}
                  aria-invalid={!!quoteErrors.email}
                  onBlur={() => triggerQuote("email")}
                />
                {quoteErrors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {quoteErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...registerQuote("phone")}
                  aria-invalid={!!quoteErrors.phone}
                  onBlur={() => triggerQuote("phone")}
                />
                {quoteErrors.phone && (
                  <p className="mt-1 text-sm text-destructive">
                    {quoteErrors.phone.message}
                  </p>
                )}
              </div>

              {submitError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("check")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleQuoteSubmit(onQuoteSubmit)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Get Quote"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
