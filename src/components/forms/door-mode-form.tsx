"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { submitLead } from "@/actions/submit-lead"
import { setRepAttribution } from "@/lib/attribution"
import { saveAddress } from "@/lib/address-memory"
import { trackDoorModeSubmit } from "@/lib/analytics"
import { PLANS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const doorModeSchema = z.object({
  serviceAddress: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code required").max(10),
  selectedPlan: z.string().min(1, "Please select a plan"),
  preferredInstallDate: z.string().min(1, "Please select an install date"),
  preferredInstallTime: z.enum(["morning", "afternoon", "no-preference"]),
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
})

type DoorModeValues = z.infer<typeof doorModeSchema>

type DoorModeFormProps = {
  repSlug: string
  repName: string
  prefilledAddress?: string
  prefilledPlan?: string
  onSuccess: (data: { firstName: string; planId: string; date: string }) => void
}

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

    // Skip weekends
    if (day === 0 || day === 6) continue

    businessDaysFound++

    // Skip first 3 business days (minimum lead time)
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

export default function DoorModeForm({
  repSlug,
  repName,
  prefilledAddress,
  prefilledPlan,
  onSuccess,
}: DoorModeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const availableDates = getAvailableDates()
  const displayedPlans = PLANS.slice(0, 4)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DoorModeValues>({
    resolver: zodResolver(doorModeSchema),
    defaultValues: {
      serviceAddress: prefilledAddress ?? "",
      selectedPlan: prefilledPlan ?? "gig-1",
      preferredInstallTime: "no-preference",
    },
  })

  const selectedPlan = watch("selectedPlan")
  const selectedDate = watch("preferredInstallDate")

  useEffect(() => {
    setRepAttribution(repSlug)
  }, [repSlug])

  async function onSubmit(data: DoorModeValues) {
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
      source: "door-mode",
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
      trackDoorModeSubmit(repSlug, data.selectedPlan)
      onSuccess({
        firstName: data.fullName.split(" ")[0],
        planId: data.selectedPlan,
        date: data.preferredInstallDate,
      })
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  const inputClasses =
    "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Address */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Your Address</label>
        <input
          {...register("serviceAddress")}
          type="text"
          placeholder="Street Address"
          autoComplete="street-address"
          className={inputClasses}
        />
        {errors.serviceAddress && (
          <p className="text-red-500 text-xs">{errors.serviceAddress.message}</p>
        )}
        <div className="grid grid-cols-3 gap-3">
          <input
            {...register("city")}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            className={inputClasses}
          />
          <input
            {...register("state")}
            type="text"
            placeholder="State"
            autoComplete="address-level1"
            className={inputClasses}
          />
          <input
            {...register("zip")}
            type="text"
            placeholder="ZIP"
            autoComplete="postal-code"
            className={inputClasses}
          />
        </div>
        {(errors.city || errors.state || errors.zip) && (
          <p className="text-red-500 text-xs">Please fill in city, state, and ZIP code</p>
        )}
      </div>

      {/* Plan Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Choose Your Plan</label>
        <div className="grid grid-cols-2 gap-2">
          {displayedPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setValue("selectedPlan", plan.id)}
              className={cn(
                "relative p-3 rounded-lg border-2 text-left transition-all",
                selectedPlan === plan.id
                  ? "border-fiber-teal bg-fiber-teal/5 ring-1 ring-fiber-teal"
                  : "border-border hover:border-fiber-teal/50"
              )}
            >
              {plan.isFeatured && (
                <span className="absolute -top-2 right-2 text-[10px] font-bold bg-fiber-teal text-white px-1.5 py-0.5 rounded">
                  Popular
                </span>
              )}
              <div className="font-bold text-sm text-foreground">{plan.speed}</div>
              <div className="text-xs text-muted-foreground">{plan.name}</div>
              <div className="text-sm font-bold text-foreground mt-1">
                ${plan.price}<span className="text-xs font-normal">/mo</span>
              </div>
              {plan.giftCard > 0 && (
                <div className="text-[10px] text-fiber-teal font-medium mt-0.5">
                  +${plan.giftCard} Gift Card
                </div>
              )}
            </button>
          ))}
        </div>
        {errors.selectedPlan && (
          <p className="text-red-500 text-xs">{errors.selectedPlan.message}</p>
        )}
      </div>

      {/* Install Date */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Preferred Install Date</label>
        <div className="grid grid-cols-4 gap-2">
          {availableDates.slice(0, 8).map((d) => {
            const dateStr = d.date.toISOString().split("T")[0]
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setValue("preferredInstallDate", dateStr)}
                className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  selectedDate === dateStr
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
          <p className="text-red-500 text-xs">{errors.preferredInstallDate.message}</p>
        )}

        {/* Time Preference */}
        <div className="flex gap-2">
          {(["morning", "afternoon", "no-preference"] as const).map((time) => (
            <label
              key={time}
              className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer"
            >
              <input
                {...register("preferredInstallTime")}
                type="radio"
                value={time}
                className="accent-fiber-teal"
              />
              {time === "no-preference" ? "Any Time" : time.charAt(0).toUpperCase() + time.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Your Info</label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          className={inputClasses}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs">{errors.fullName.message}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Phone Number"
              autoComplete="tel"
              className={inputClasses}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={inputClasses}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full flex items-center justify-center gap-2 bg-fiber-teal hover:bg-fiber-teal/90 text-white min-h-[52px] text-base font-semibold glow-teal"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          `Get Connected with ${repName}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your info is only shared with your FiberFastUSA representative. We never sell your data.
      </p>
    </form>
  )
}
