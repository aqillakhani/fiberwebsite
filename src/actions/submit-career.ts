"use server"

import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const careerSchema = z.object({
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

export type CareerFormData = z.infer<typeof careerSchema>

export type CareerResult = {
  readonly success: boolean
  readonly error?: string
}

export async function submitCareerApplication(data: CareerFormData): Promise<CareerResult> {
  const parsed = careerSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    }
  }

  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("career_applications").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      state: parsed.data.state,
      experience: parsed.data.experience ?? "",
      why_interested: parsed.data.whyInterested,
    })

    if (error) {
      console.error("Supabase career insert error:", error)
      return { success: false, error: "Something went wrong. Please try again." }
    }

    return { success: true }
  } catch (err) {
    console.error("Career submission error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
