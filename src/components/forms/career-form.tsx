"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { submitCareerApplication } from "@/actions/submit-career"

const careerFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[\d\s\-()+ ]+$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  experience: z.string().optional(),
  whyInterested: z.string().min(10, "Please tell us why you're interested"),
})

type CareerFormValues = z.infer<typeof careerFormSchema>

export default function CareerForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerFormValues>({
    resolver: zodResolver(careerFormSchema),
  })

  async function onSubmit(data: CareerFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitCareerApplication(data)

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
          Application Received!
        </h3>
        <p className="text-muted-foreground">
          Thanks for your interest in joining FiberFastUSA. We&apos;ll review your
          application and reach out within a few business days.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            {...register("city")}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            className={inputClasses}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
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
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <select
          {...register("experience")}
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>Sales Experience</option>
          <option value="none">No prior sales experience</option>
          <option value="1-2">1-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>

      <div>
        <textarea
          {...register("whyInterested")}
          placeholder="Why are you interested in joining FiberFastUSA?"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fiber-orange focus:border-transparent text-base resize-none"
        />
        {errors.whyInterested && (
          <p className="text-red-500 text-xs mt-1">{errors.whyInterested.message}</p>
        )}
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
            Submit Application
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  )
}
