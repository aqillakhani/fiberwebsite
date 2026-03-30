import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Zap, ArrowRight } from "lucide-react"

import { PLANS } from "@/lib/constants"
import CompactLeadForm from "@/components/forms/compact-lead-form"

type CityData = {
  readonly slug: string
  readonly name: string
  readonly state: string
  readonly stateAbbr: string
  readonly description: string
}

const CITIES: readonly CityData[] = [
  {
    slug: "denver",
    name: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    description: "the Mile High City",
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    description: "the DFW Metroplex",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "Arizona",
    stateAbbr: "AZ",
    description: "the Valley of the Sun",
  },
  {
    slug: "tampa",
    name: "Tampa",
    state: "Florida",
    stateAbbr: "FL",
    description: "the Tampa Bay area",
  },
  {
    slug: "nashville",
    name: "Nashville",
    state: "Tennessee",
    stateAbbr: "TN",
    description: "Music City",
  },
]

function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug)
}

interface CityPageProps {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const cityData = getCityBySlug(city)

  if (!cityData) {
    return {
      title: "Location Not Found | FiberFastUSA",
    }
  }

  return {
    title: `Fiber Internet in ${cityData.name}, ${cityData.stateAbbr} | FiberFastUSA`,
    description: `Get blazing-fast fiber internet in ${cityData.name}, ${cityData.state}. Plans from $34.99/mo with free installation, no contracts, and no data caps.`,
    openGraph: {
      title: `Fiber Internet in ${cityData.name} | FiberFastUSA`,
      description: `Fast, reliable fiber internet now available in ${cityData.name}. Check availability at your address.`,
      url: `/locations/${cityData.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }))
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params
  const cityData = getCityBySlug(city)

  if (!cityData) {
    notFound()
  }

  const topPlans = PLANS.slice(0, 3)

  const cityJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `FiberFastUSA - ${cityData.name}, ${cityData.stateAbbr}`,
    description: `Fiber internet service in ${cityData.name}, ${cityData.state}. Speeds up to 7 Gbps with free installation, no contracts, and no data caps.`,
    url: `https://fiberfastusa.com/locations/${cityData.slug}`,
    telephone: "(469) 428-5942",
    address: {
      "@type": "PostalAddress",
      addressLocality: cityData.name,
      addressRegion: cityData.stateAbbr,
      addressCountry: "US",
    },
    priceRange: "$34.99 - $109.99/mo",
    areaServed: {
      "@type": "City",
      name: cityData.name,
    },
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }}
      />
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-fiber-success/20 px-4 py-1.5 mb-6">
              <Zap className="size-4 text-fiber-success" />
              <span className="text-sm font-medium text-fiber-success">
                Now Available in {cityData.name}
              </span>
            </div>
            <h1 className="heading-display text-white mb-6">
              Fiber Internet in {cityData.name}, {cityData.stateAbbr}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              FiberFastUSA is bringing blazing-fast fiber internet to {cityData.description}.
              Get speeds up to 7 Gbps with free installation, no contracts, and no data caps.
            </p>
          </div>
        </div>
      </section>

      {/* Availability Form */}
      <section id="check" className="py-16 md:py-20 bg-treatment-trust">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-foreground mb-3">
              Check Availability in {cityData.name}
            </h2>
            <p className="text-muted-foreground">
              Enter your address to see if fiber internet is available at your home.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <CompactLeadForm source={`location-${cityData.slug}`} />
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">
              Plans Available in {cityData.name}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All plans include free installation, a free Wi-Fi router, and no data caps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {topPlans.map((plan) => (
              <div
                key={plan.id}
                className={`card-premium bg-card rounded-xl border p-6 ${
                  plan.isFeatured ? "gradient-border border-2" : "border-border"
                }`}
              >
                <div className="text-2xl font-bold text-fiber-blue mb-1">
                  {plan.speed}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground italic mb-4">
                  {plan.bestFor}
                </p>
                <div className="text-3xl font-bold text-foreground mb-4">
                  ${plan.price}
                  <span className="text-sm text-muted-foreground font-normal ml-1">/mo</span>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="size-4 text-fiber-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="#check"
                  className={`inline-flex items-center justify-center w-full h-10 px-4 rounded-lg text-sm font-semibold transition-all ${
                    plan.isFeatured
                      ? "bg-fiber-blue text-white hover:bg-fiber-blue/90"
                      : "border border-border hover:bg-accent text-foreground"
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-base font-semibold text-fiber-blue hover:underline"
            >
              View All Plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Fiber in This City */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-foreground mb-8 text-center">
            Why {cityData.name} Residents Choose Fiber
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Symmetric Speeds",
                desc: `Upload as fast as you download. Perfect for ${cityData.name} remote workers and content creators.`,
              },
              {
                title: "No Data Caps",
                desc: "Stream, game, and work without worrying about data limits or throttling.",
              },
              {
                title: "Free Installation",
                desc: "Professional installation at no cost. Our technicians handle everything.",
              },
              {
                title: "No Contracts",
                desc: "Month-to-month service. Cancel anytime with zero early termination fees.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready for Real Fiber Internet in {cityData.name}?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Check if your address is covered and get connected today.
          </p>
          <a
            href="#check"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-blue text-white font-semibold hover:bg-fiber-blue/90 transition-all glow-blue"
          >
            Check Your Address
          </a>
        </div>
      </section>
    </main>
  )
}
