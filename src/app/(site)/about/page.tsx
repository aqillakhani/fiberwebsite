import type { Metadata } from "next"
import Link from "next/link"
import {
  Zap,
  Shield,
  Heart,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  Headphones,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | FiberFastUSA",
  description:
    "Learn about FiberFastUSA's mission to help customers explore fiber internet options and switch to faster, more reliable service across the United States.",
  openGraph: {
    title: "About FiberFastUSA",
    description: "We help customers get connected to faster fiber internet in areas where our team operates.",
  },
}

export default function AboutPage() {
  const valuePillars = [
    {
      icon: Zap,
      title: "Speed",
      description:
        "We connect customers with the fiber network that actually reaches their home — symmetric speeds from 300 Mbps to multi-gig, depending on the network.",
    },
    {
      icon: Shield,
      title: "Simplicity",
      description:
        "We guide customers through every step — from checking availability to choosing the right plan and getting connected.",
    },
    {
      icon: Heart,
      title: "Trust",
      description:
        "No pressure, no gimmicks. We help you understand your options so you can make the best choice for your household.",
    },
  ]

  const trustItems = [
    { icon: CheckCircle, label: "Licensed & Authorized" },
    { icon: Users, label: "Local Field Teams" },
    { icon: Headphones, label: "Guided Support" },
    { icon: CheckCircle, label: "No Contracts Required" },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Helping You Switch to Better Internet
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              FiberFastUSA helps customers explore fiber internet options and make the switch
              to faster, more reliable service — with guidance every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">What We Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make switching to fiber internet simple, clear, and comfortable for customers
              who want better home internet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {valuePillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="card-premium bg-card rounded-xl border border-border p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-fiber-blue/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-7 text-fiber-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-foreground mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We started FiberFastUSA because we saw too many families stuck with slow, expensive
            internet and no clear path to something better. The big providers make the process
            confusing on purpose. We decided to change that.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our team works directly with households to help them understand what fiber internet
            is, whether it&apos;s available in their area, and how to make the switch. We focus
            on making the process easy and transparent — so customers feel confident from the
            first conversation to the moment they&apos;re connected.
          </p>
        </div>
      </section>

      {/* Where We Operate */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Where We Operate</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are an authorized sales partner for fiber networks in 20+ states — Texas, Ohio, Florida and
              North Carolina are our largest. Enter your address and we tell you exactly which fiber reaches your home.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-6">
              <MapPin className="size-6 text-fiber-blue flex-shrink-0" />
              <span className="text-lg font-semibold text-foreground">Authorized partner for Kinetic, Brightspeed and Frontier fiber</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/check-availability"
              className="inline-flex items-center gap-2 text-fiber-sky font-semibold hover:underline"
            >
              Check if we serve your area <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24 bg-treatment-trust">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Why Customers Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 max-w-4xl mx-auto">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-fiber-success/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="size-6 text-fiber-success" />
                  </div>
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Explore Fiber Internet?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Check if fiber is available at your address and let us guide you through the process.
          </p>
          <Link
            href="/check-availability"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-blue text-white font-semibold hover:bg-fiber-blue/90 transition-all glow-blue"
          >
            Check Availability
          </Link>
        </div>
      </section>
    </main>
  )
}
