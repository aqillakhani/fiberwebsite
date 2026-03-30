"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmationScreen } from "@/components/ui/confirmation-screen"
import { submitLead } from "@/actions/submit-lead"
import { useAttribution } from "@/components/providers/attribution-provider"

const compactLeadSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  serviceAddress: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code required").max(10),
})

type CompactLeadValues = z.infer<typeof compactLeadSchema>

type CompactLeadFormProps = {
  repId?: string
  repName?: string
  source?: string
}

export default function CompactLeadForm({ repId, repName, source = "rep-page" }: CompactLeadFormProps) {
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { repSlug } = useAttribution()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompactLeadValues>({
    resolver: zodResolver(compactLeadSchema),
  })

  async function onSubmit(data: CompactLeadValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    const resolvedRepId = repId ?? repSlug

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: data.serviceAddress,
      city: data.city,
      state: data.state,
      zip: data.zip,
      source,
      repId: resolvedRepId,
    })

    setIsSubmitting(false)

    if (result.success) {
      setSubmittedName(data.fullName)
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (submittedName) {
    return (
      <ConfirmationScreen
        firstName={submittedName.split(" ")[0]}
        repName={repName}
        source="rep-page"
      />
    )
  }

  const inputClasses = "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-red focus:border-transparent text-base"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            className={inputClasses}
          />
          {errors.fullName && (
            <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Phone Number"
            autoComplete="tel"
            className={inputClasses}
          />
          {errors.phone && (
            <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          className={inputClasses}
        />
        {errors.email && (
          <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("serviceAddress")}
          type="text"
          placeholder="Street Address"
          autoComplete="street-address"
          className={inputClasses}
        />
        {errors.serviceAddress && (
          <p className="text-destructive text-xs mt-1">{errors.serviceAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <input
            {...register("city")}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            className={inputClasses}
          />
          {errors.city && (
            <p className="text-destructive text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("state")}
            type="text"
            placeholder="State"
            autoComplete="address-level1"
            className={inputClasses}
          />
          {errors.state && (
            <p className="text-destructive text-xs mt-1">{errors.state.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("zip")}
            type="text"
            placeholder="ZIP"
            autoComplete="postal-code"
            className={inputClasses}
          />
          {errors.zip && (
            <p className="text-destructive text-xs mt-1">{errors.zip.message}</p>
          )}
        </div>
      </div>

      {submitError && (
        <p className="text-destructive text-sm text-center">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full flex items-center justify-center gap-2 bg-fiber-red hover:bg-fiber-red/90 text-white min-h-[52px] text-base font-semibold glow-teal"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            {repName ? `Get Started with ${repName}` : "Check Availability"}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  )
}
