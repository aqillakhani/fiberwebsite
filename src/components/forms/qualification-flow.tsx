"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { submitLead } from "@/actions/submit-lead"
import { useAttribution } from "@/components/providers/attribution-provider"
import { getSavedAddress, saveAddress } from "@/lib/address-memory"
import { PLANS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"

type QualificationFlowProps = {
  prefilledAddress?: string
  prefilledPlan?: string
}

type FlowData = {
  serviceAddress: string
  city: string
  state: string
  zip: string
  selectedPlan: string
  preferredInstallDate: string
  preferredInstallTime: "morning" | "afternoon" | "no-preference"
  fullName: string
  phone: string
  email: string
}

type StepErrors = Record<string, string>

function getAvailableDates(): { date: Date; label: string; dayName: string }[] {
  const dates: { date: Date; label: string; dayName: string }[] = []
  const today = new Date()
  let daysChecked = 0
  let businessDaysFound = 0

  while (dates.length < 12) {
    daysChecked++
    const candidate = new Date(today)
    candidate.setDate(today.getDate() + daysChecked)
    const day = candidate.getDay()
    if (day === 0 || day === 6) continue
    businessDaysFound++
    if (businessDaysFound <= 3) continue

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    dates.push({
      date: candidate,
      label: `${monthNames[candidate.getMonth()]} ${candidate.getDate()}`,
      dayName: dayNames[candidate.getDay()],
    })
  }

  return dates
}

export default function QualificationFlow({ prefilledAddress, prefilledPlan }: QualificationFlowProps) {
  const { repSlug } = useAttribution()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<StepErrors>({})
  const [useSaved, setUseSaved] = useState(false)

  const [data, setData] = useState<FlowData>({
    serviceAddress: prefilledAddress ?? "",
    city: "",
    state: "",
    zip: "",
    selectedPlan: prefilledPlan ?? "gig-1",
    preferredInstallDate: "",
    preferredInstallTime: "no-preference",
    fullName: "",
    phone: "",
    email: "",
  })

  const [submitted, setSubmitted] = useState<{
    firstName: string
    planId: string
    date: string
  } | null>(null)

  const savedAddress = typeof window !== "undefined" ? getSavedAddress() : null
  const availableDates = getAvailableDates()
  const displayedPlans = PLANS.slice(0, 4)

  useEffect(() => {
    if (savedAddress && !prefilledAddress) {
      setUseSaved(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function applySavedAddress() {
    if (!savedAddress) return
    setData((prev) => ({
      ...prev,
      serviceAddress: savedAddress.serviceAddress,
      city: savedAddress.city,
      state: savedAddress.state,
      zip: savedAddress.zip,
      fullName: savedAddress.fullName,
      email: savedAddress.email,
      phone: savedAddress.phone,
    }))
    setUseSaved(false)
  }

  function updateField<K extends keyof FlowData>(key: K, value: FlowData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validateStep1(): boolean {
    const errs: StepErrors = {}
    if (data.serviceAddress.length < 5) errs.serviceAddress = "Street address required"
    if (data.city.length < 2) errs.city = "City is required"
    if (data.state.length < 2) errs.state = "State is required"
    if (data.zip.length < 5) errs.zip = "ZIP code required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateStep2(): boolean {
    const errs: StepErrors = {}
    if (!data.selectedPlan) errs.selectedPlan = "Please select a plan"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateStep3(): boolean {
    const errs: StepErrors = {}
    if (!data.preferredInstallDate) errs.preferredInstallDate = "Please select an install date"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateStep4(): boolean {
    const errs: StepErrors = {}
    if (data.fullName.length < 2) errs.fullName = "Name is required"
    if (data.phone.length < 10) errs.phone = "Valid phone number required"
    else if (!/^[\d\s\-()+]+$/.test(data.phone)) errs.phone = "Valid phone number required"
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Valid email required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function nextStep() {
    let valid = false
    if (step === 1) valid = validateStep1()
    else if (step === 2) valid = validateStep2()
    else if (step === 3) valid = validateStep3()
    else return

    if (valid) {
      setStep((s) => s + 1)
      setErrors({})
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep((s) => s - 1)
      setErrors({})
    }
  }

  async function handleSubmit() {
    if (!validateStep4()) return

    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: data.serviceAddress,
      city: data.city,
      state: data.state,
      zip: data.zip,
      source: "check-availability",
      repId: repSlug,
      selectedPlan: data.selectedPlan,
      preferredInstallDate: data.preferredInstallDate,
      preferredInstallTime: data.preferredInstallTime,
    })

    setIsSubmitting(false)

    if (result.success) {
      saveAddress({
        serviceAddress: data.serviceAddress,
        city: data.city,
        state: data.state,
        zip: data.zip,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      })
      setSubmitted({
        firstName: data.fullName.split(" ")[0],
        planId: data.selectedPlan,
        date: data.preferredInstallDate,
      })
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (submitted) {
    const plan = PLANS.find((p) => p.id === submitted.planId)
    return (
      <ConfirmationScreen
        firstName={submitted.firstName}
        selectedPlan={submitted.planId}
        preferredDate={submitted.date}
        giftCardAmount={plan?.giftCard}
        planPrice={plan?.price}
        planName={plan?.name}
        source="check-availability"
      />
    )
  }

  const inputClasses =
    "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"

  const steps = ["Address", "Plan", "Install Date", "Your Info"]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isActive = step === stepNum
          const isComplete = step > stepNum

          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full text-sm font-semibold flex-shrink-0",
                  isComplete
                    ? "bg-fiber-success text-white"
                    : isActive
                      ? "bg-fiber-teal text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isComplete ? "bg-fiber-success" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Where do you need service?</h2>
          <p className="text-muted-foreground">Enter your address to check fiber availability.</p>

          {useSaved && savedAddress && (
            <div className="rounded-lg border border-fiber-teal/30 bg-fiber-teal/5 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Welcome back!</p>
              <p className="text-sm text-muted-foreground mb-3">
                Use your saved address: {savedAddress.serviceAddress}, {savedAddress.city}?
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={applySavedAddress}
                  className="bg-fiber-teal hover:bg-fiber-teal/90 text-white"
                >
                  Use Saved Address
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setUseSaved(false)}
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              autoComplete="street-address"
              value={data.serviceAddress}
              onChange={(e) => updateField("serviceAddress", e.target.value)}
              className={inputClasses}
            />
            {errors.serviceAddress && (
              <p className="text-red-500 text-xs">{errors.serviceAddress}</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                autoComplete="address-level2"
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={inputClasses}
              />
              <input
                type="text"
                placeholder="State"
                autoComplete="address-level1"
                value={data.state}
                onChange={(e) => updateField("state", e.target.value)}
                className={inputClasses}
              />
              <input
                type="text"
                placeholder="ZIP"
                autoComplete="postal-code"
                value={data.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                className={inputClasses}
              />
            </div>
            {(errors.city || errors.state || errors.zip) && (
              <p className="text-red-500 text-xs">Please fill in city, state, and ZIP code</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Choose your plan</h2>
          <p className="text-muted-foreground">All plans include free installation, a free Wi-Fi router, and no data caps.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => updateField("selectedPlan", plan.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 text-left transition-all",
                  data.selectedPlan === plan.id
                    ? "border-fiber-teal bg-fiber-teal/5 ring-1 ring-fiber-teal"
                    : "border-border hover:border-fiber-teal/50"
                )}
              >
                {plan.isFeatured && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-fiber-teal text-white px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <div className="font-bold text-foreground">{plan.speed}</div>
                <div className="text-sm text-muted-foreground">{plan.name}</div>
                <div className="text-lg font-bold text-foreground mt-1">
                  ${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                </div>
                {plan.giftCard > 0 && (
                  <div className="text-xs text-fiber-teal font-medium mt-1">
                    +${plan.giftCard} Gift Card
                  </div>
                )}
                {plan.freeMonths !== null && plan.freeMonths > 0 && (
                  <div className="text-xs text-fiber-success font-medium">
                    {plan.freeMonths} Months Free
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.selectedPlan && (
            <p className="text-red-500 text-xs">{errors.selectedPlan}</p>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Not sure? Our most popular plan is <span className="font-semibold">Gig 1</span>
          </p>
        </div>
      )}

      {/* Step 3: Install Date */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">When works best?</h2>
          <p className="text-muted-foreground">Pick a preferred install date. We&apos;ll confirm the exact date when we call you.</p>

          <div className="grid grid-cols-4 gap-2">
            {availableDates.map((d) => {
              const dateStr = d.date.toISOString().split("T")[0]
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => updateField("preferredInstallDate", dateStr)}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all",
                    data.preferredInstallDate === dateStr
                      ? "border-fiber-teal bg-fiber-teal/10 text-fiber-teal font-semibold"
                      : "border-border hover:border-fiber-teal/50 text-foreground"
                  )}
                >
                  <div className="text-[10px] text-muted-foreground">{d.dayName}</div>
                  <div className="text-xs font-medium">{d.label}</div>
                </button>
              )
            })}
          </div>
          {errors.preferredInstallDate && (
            <p className="text-red-500 text-xs">{errors.preferredInstallDate}</p>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time preference</label>
            <div className="flex gap-4">
              {(["morning", "afternoon", "no-preference"] as const).map((time) => (
                <label
                  key={time}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
                >
                  <input
                    type="radio"
                    name="installTime"
                    value={time}
                    checked={data.preferredInstallTime === time}
                    onChange={() => updateField("preferredInstallTime", time)}
                    className="accent-fiber-teal"
                  />
                  {time === "no-preference" ? "Any Time" : time.charAt(0).toUpperCase() + time.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact Info */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Almost there!</h2>
          <p className="text-muted-foreground">Your info is only shared with your FiberFastUSA representative. We never sell your data.</p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              value={data.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={inputClasses}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

            <input
              type="tel"
              placeholder="Phone Number"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClasses}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClasses}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {submitError && (
            <p className="text-red-500 text-sm text-center">{submitError}</p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 bg-fiber-teal hover:bg-fiber-teal/90 text-white min-h-[48px] px-8 font-semibold"
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-fiber-teal hover:bg-fiber-teal/90 text-white min-h-[48px] px-8 font-semibold glow-teal"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Get Connected"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
