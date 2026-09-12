"use client"

import Link from "next/link"
import { FAQ_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HomepageFAQ() {
  const topFaqs = FAQ_ITEMS.slice(0, 5)

  return (
    <section className="w-full py-16 md:py-24 bg-treatment-rhythm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-10 transition-all duration-700",
            "opacity-100 translate-y-0"
          )}
        >
          <h2 className="heading-section text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about FiberFastUSA.
          </p>
        </div>

        <div
          className={cn(
            "transition-all duration-700 delay-200",
            "opacity-100 translate-y-0"
          )}
        >
          <Accordion className="w-full">
            {topFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-blue transition-colors font-semibold"
          >
            View All FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
