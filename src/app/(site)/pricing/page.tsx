import type { Metadata } from "next";
import Link from "next/link";

import { NetworkPlans } from "@/components/plans/network-plans";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NETWORKS } from "@/data/isp-plans";

export const metadata: Metadata = {
  title: "Fiber Plans & Pricing by Network | FiberFastUSA",
  description:
    "Fiber plans and pricing depend on which network reaches your address — Kinetic, Brightspeed, Frontier, AT&T, Ripple or T-Mobile Fiber. Check your address to see yours.",
  alternates: { canonical: "/pricing" },
};

const PRICING_FAQ = [
  {
    question: "Why don't you show one price list?",
    answer:
      "Because we are an authorized partner for several fiber networks, and each one sets its own plans and promos. The network at your address decides the price list — that is why every page starts with an address check.",
  },
  {
    question: "Are there hidden fees?",
    answer:
      "The specialist reads you the exact monthly price, any promo, and any equipment or install charge for your network before anything is ordered. Nothing is charged through this website.",
  },
  {
    question: "Is there a contract?",
    answer:
      "The networks we sell today offer month-to-month plans. If a specific plan carries a term, the specialist tells you before you agree to it.",
  },
  {
    question: "How do promos work?",
    answer:
      "Gift cards, free months and price locks change monthly and differ by network and address. We tell you the best one you actually qualify for on the call.",
  },
  {
    question: "What happens if I move?",
    answer:
      "Check the new address the same way. If a network we sell is live there, we set up service; if not, there is no fee to cancel a month-to-month plan.",
  },
];

export default function PricingPage() {
  const networkNames = NETWORKS.map((network) => network.shortName);
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Plans depend on the network at your address
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            We sell {networkNames.slice(0, -1).join(", ")} and {networkNames.at(-1)} fiber. Type your address and we tell you
            which one reaches your home — then you see that network&apos;s plans.
          </p>
          <Link
            href="/check-availability"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-fiber-blue px-6 font-semibold text-white hover:bg-blue-800"
          >
            Check my address
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <NetworkPlans />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Pricing questions</h2>
        <Accordion className="rounded-2xl border border-gray-200 bg-white px-4">
          {PRICING_FAQ.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-gray-900">{item.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
