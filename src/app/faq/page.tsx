import { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";

import { FAQ_ITEMS, COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ | FiberFastUSA",
  description:
    "Find answers to frequently asked questions about FiberFastUSA fiber internet plans, installation, pricing, and service.",
  openGraph: {
    title: "Fiber Internet FAQs | FiberFastUSA",
    description: "Get answers to your top questions about fast, reliable fiber internet service.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about FiberFastUSA
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion>
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold">Still have questions?</h2>
            <p className="mt-2 text-muted-foreground">
              Get in touch with our support team for personalized assistance.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg">Contact Support</Button>
              </Link>
              <a href={COMPANY.phoneHref}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2 size-4" />
                  {COMPANY.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
