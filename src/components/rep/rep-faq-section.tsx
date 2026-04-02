"use client"

import { FAQ_ITEMS } from "@/lib/constants"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const DISPLAY_COUNT = 6

export default function RepFaqSection() {
  const faqs = FAQ_ITEMS.slice(0, DISPLAY_COUNT)

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Common Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about switching to fiber.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={index} className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="text-base font-semibold text-gray-900 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
