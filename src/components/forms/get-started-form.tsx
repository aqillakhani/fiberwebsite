"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PLANS, USE_CASES, COMPANY } from "@/lib/constants";
import { leadSchema, type LeadFormData } from "@/lib/validations/schemas";
import { submitLead } from "@/actions/submit-lead";
import { trackLeadSubmitted } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

type FormStep = 1 | 2 | 3 | 4;

export function GetStartedForm() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recommendedPlanId, setRecommendedPlanId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      speedInterest: searchParams.get("plan") || undefined,
      repId: searchParams.get("rep") || undefined,
    },
  });

  const selectedUseCases = watch("useCases") || [];
  const memoizedSelectedUseCases = selectedUseCases;

  // Auto-recommend plan based on selected use cases
  useEffect(() => {
    if (memoizedSelectedUseCases.length === 0) {
      setRecommendedPlanId(null);
      return;
    }

    const hasGaming = memoizedSelectedUseCases.includes("gaming");
    const hasStreaming = memoizedSelectedUseCases.includes("streaming");
    const hasContent = memoizedSelectedUseCases.includes("content");
    const hasFamily = memoizedSelectedUseCases.includes("family");

    let recommendedId = "fast-500";

    if (hasContent || (hasGaming && hasStreaming)) {
      recommendedId = "gig-2";
    } else if (hasFamily || (hasGaming && hasStreaming)) {
      recommendedId = "gig-1";
    } else if (hasStreaming || hasGaming) {
      recommendedId = "gig-1";
    }

    setRecommendedPlanId(recommendedId);
  }, [memoizedSelectedUseCases]);

  const handleNext = async () => {
    // Validate current step fields
    const fieldsToValidate =
      currentStep === 1
        ? ["serviceAddress", "city", "state", "zip"]
        : currentStep === 2
          ? ["fullName", "email", "phone"]
          : [];

    const isValid = await trigger(
      fieldsToValidate as (keyof LeadFormData)[]
    );

    if (isValid && currentStep < 4) {
      setCurrentStep((step) => (step + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => (step - 1) as FormStep);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitLead({
        ...data,
        speedInterest: recommendedPlanId || data.speedInterest,
        source: "get-started",
      });

      if (result.success) {
        setSubmitSuccess(true);
        trackLeadSubmitted("get-started", recommendedPlanId || undefined);
      } else {
        setSubmitError(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-12 text-center">
          <div className="mb-4 text-5xl">✓</div>
          <h2 className="mb-2 text-2xl font-bold">Thank you!</h2>
          <p className="mb-6 text-muted-foreground">
            A representative will contact you within 2 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            You can also reach us at{" "}
            <a
              href={COMPANY.phoneHref}
              className="font-medium text-primary hover:underline"
            >
              {COMPANY.phone}
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  const progressValue = (currentStep / 4) * 100;
  const recommendedPlan = recommendedPlanId
    ? PLANS.find((p) => p.id === recommendedPlanId)
    : null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="space-y-2">
          <Progress value={progressValue} className="mb-2">
            <ProgressLabel>Step {currentStep} of 4</ProgressLabel>
            <ProgressValue>{Math.round(progressValue)}%</ProgressValue>
          </Progress>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceAddress">Service Address</Label>
                <Input
                  id="serviceAddress"
                  placeholder="123 Main Street"
                  {...register("serviceAddress")}
                  aria-invalid={!!errors.serviceAddress}
                  onBlur={() => trigger("serviceAddress")}
                />
                {errors.serviceAddress && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.serviceAddress.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Denver"
                    {...register("city")}
                    aria-invalid={!!errors.city}
                    onBlur={() => trigger("city")}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CO"
                    maxLength={2}
                    {...register("state")}
                    aria-invalid={!!errors.state}
                    onBlur={() => trigger("state")}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    placeholder="80202"
                    {...register("zip")}
                    aria-invalid={!!errors.zip}
                    onBlur={() => trigger("zip")}
                  />
                  {errors.zip && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  onBlur={() => trigger("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  onBlur={() => trigger("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  onBlur={() => trigger("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Use Cases */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                What will you use fiber for? (Optional)
              </p>
              <div className="space-y-3">
                {USE_CASES.map((useCase) => (
                  <div key={useCase.id} className="flex items-center gap-3">
                    <Checkbox
                      id={useCase.id}
                      checked={selectedUseCases.includes(useCase.id)}
                      onCheckedChange={(checked) => {
                        const newUseCases = checked
                          ? [...selectedUseCases, useCase.id]
                          : selectedUseCases.filter((id) => id !== useCase.id);
                        setValue("useCases", newUseCases);
                      }}
                    />
                    <Label
                      htmlFor={useCase.id}
                      className="cursor-pointer font-normal"
                    >
                      {useCase.label}
                    </Label>
                  </div>
                ))}
              </div>

              {recommendedPlan && (
                <div className="mt-6 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Recommended Plan
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {recommendedPlan.name} - {recommendedPlan.speed}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recommendedPlan.bestFor}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                <h3 className="font-semibold">Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">
                      {watch("serviceAddress")}, {watch("city")}, {watch("state")}{" "}
                      {watch("zip")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{watch("fullName")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{watch("email")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{watch("phone")}</span>
                  </div>
                </div>
              </div>

              {recommendedPlan && (
                <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h3 className="font-semibold">Recommended Plan</h3>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{recommendedPlan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {recommendedPlan.speed} · ${recommendedPlan.price}/month
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Prefer to call?
                </p>
                <a
                  href={COMPANY.phoneHref}
                  className="block font-semibold text-primary hover:underline"
                >
                  {COMPANY.phone}
                </a>
              </div>

              {submitError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex-1"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Get Started"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
