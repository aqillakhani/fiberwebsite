"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { submitLead } from "@/actions/submit-lead"

const availabilityFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  serviceAddress: z.string().min(5, "Street address required"),
  zip: z.string().min(5, "ZIP code required").max(10),
})

type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>

export default function AvailabilitySection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
  })

  async function onSubmit(data: AvailabilityFormValues) {
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
      source: "homepage-availability",
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
      <section className="w-full section-navy py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-fiber-success" />
            <h2 className="text-2xl md:text-3xl font-bold text-white heading-section">
              We Got Your Info!
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              A FiberFastUSA representative will reach out shortly to confirm
              availability and help you choose the perfect plan.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full section-navy py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white heading-section mb-3">
            Check If Fiber Is Available at Your Address
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
            Enter your details below and we&apos;ll confirm fiber availability in your area.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                type="tel"
                placeholder="Phone Number"
                autoComplete="tel"
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <input
                {...register("serviceAddress")}
                type="text"
                placeholder="Street Address"
                autoComplete="street-address"
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
              />
              {errors.serviceAddress && (
                <p className="text-red-400 text-xs mt-1">{errors.serviceAddress.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("zip")}
                type="text"
                placeholder="ZIP Code"
                autoComplete="postal-code"
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
              />
              {errors.zip && (
                <p className="text-red-400 text-xs mt-1">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto sm:min-w-[240px] mx-auto flex items-center justify-center gap-2 bg-fiber-teal hover:bg-fiber-teal/90 text-white min-h-[52px] text-base font-semibold glow-teal"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Check Availability
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
