import type { Metadata } from "next";
import { Phone, Clock } from "lucide-react";

import { COMPANY } from "@/lib/constants";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us | FiberFastUSA",
  description:
    "Get in touch with FiberFastUSA. Call us or send a message. Our team is here to help you get connected to fiber.",
  openGraph: {
    title: "Contact FiberFastUSA",
    description: "Reach out to our friendly team for help with any questions about fiber internet.",
  },
};

export default function ContactPage() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Questions? We&apos;re here to help. Reach out to our friendly team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="flex flex-col justify-center">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-6">
              {/* Phone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="size-6 text-primary" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={COMPANY.phoneHref}
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {COMPANY.phone}
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Give us a call — we love talking about fiber.
                  </p>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="size-6 text-primary" />
                    Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{COMPANY.hours}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Our team is ready to help during these hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
