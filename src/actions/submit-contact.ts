"use server";

import { createServerClient } from "@/lib/supabase/server";
import { contactSchema, type ContactFormData } from "@/lib/validations/schemas";

export type ContactResult = {
  readonly success: boolean;
  readonly error?: string;
};

export async function submitContact(data: ContactFormData): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  try {
    const supabase = createServerClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });

    if (error) {
      console.error("Supabase contact insert error:", error);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact submission error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
