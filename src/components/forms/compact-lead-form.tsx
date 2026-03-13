"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { submitLead } from "@/actions/submit-lead"

const compactLeadSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  serviceAddress: z.string().min(5, "Street address required"),
  zip: z.string().min(5, "ZIP code required").max(10),
})

type CompactLeadValues = z.infer<typeof compactLeadSchema>

type CompactLeadFormProps = {
  repId?: string
  repName?: string
  source?: string
}

export default function CompactLeadForm({ repId, repName, source = "rep-page" }: CompactLeadFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

    const result = await submitLead({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      serviceAddress: data.serviceAddress,
      city: "",
      state: "",
      zip: data.zip,
      source,
      repId: repId,
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsSubmitted(true)
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-fiber-success/30 bg-fiber-success/5 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-fiber-success mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">
          You&apos;re All Set!
        </h3>
        <p className="text-muted-foreground">
          {repName ? `${repName} will` : "A representative will"} reach out shortly to confirm
          availability and get you connected.
        </p>
      </div>
    )
  }

  const inputClasses = "w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-orange focus:border-transparent text-base"

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
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
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
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
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
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <input
            {...register("serviceAddress")}
            type="text"
            placeholder="Street Address"
            autoComplete="street-address"
            className={inputClasses}
          />
          {errors.serviceAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.serviceAddress.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("zip")}
            type="text"
            placeholder="ZIP Code"
            autoComplete="postal-code"
            className={inputClasses}
          />
          {errors.zip && (
            <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
          )}
        </div>
      </div>

      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full flex items-center justify-center gap-2 bg-fiber-orange hover:bg-fiber-orange/90 text-white min-h-[52px] text-base font-semibold glow-orange"
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
