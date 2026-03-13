import type { Metadata } from "next"
import Link from "next/link"
import {
  Zap,
  Shield,
  Heart,
  MapPin,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

import { getReps } from "@/lib/reps"

export const metadata: Metadata = {
  title: "About Us | FiberFastUSA",
  description:
    "Learn about FiberFastUSA's mission to bring reliable, fast, and affordable fiber internet to communities across America. Meet our team and discover our story.",
  openGraph: {
    title: "About FiberFastUSA",
    description: "Real people building real internet for communities nationwide.",
  },
}

export default async function AboutPage() {
  const reps = await getReps()

  const serviceRegions = [
    "Denver, CO",
    "Dallas, TX",
    "Phoenix, AZ",
    "Tampa, FL",
    "Nashville, TN",
    "And expanding nationwide",
  ]

  const valuePillars = [
    {
      icon: Zap,
      title: "Speed",
      description:
        "Blazing-fast fiber speeds from 500 Mbps to 7 Gbps with symmetric upload and download.",
    },
    {
      icon: Shield,
      title: "Reliability",
      description:
        "99.9% uptime with dedicated fiber lines — no sharing bandwidth with your neighbors.",
    },
    {
      icon: Heart,
      title: "Simplicity",
      description:
        "No contracts, no hidden fees, no data caps. Just great internet at a fair price.",
    },
  ]

  const trustItems = [
    { icon: CheckCircle, label: "Licensed & Insured" },
    { icon: Users, label: "Local Teams Nationwide" },
    { icon: Award, label: "5,000+ Homes Connected" },
    { icon: CheckCircle, label: "30-Day Money-Back Guarantee" },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Bringing Real Internet to Real People
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              FiberFastUSA started with one simple idea: fiber internet shouldn&apos;t be
              expensive or complicated. We&apos;re building the network America deserves.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe everyone deserves fast, reliable, and affordable internet — no matter
              where they live.
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

      {/* Why We Started */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-foreground mb-6">Why We Started</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We got tired of watching families across America deal with slow cable internet,
            data caps that make no sense, and customer service that doesn&apos;t care. The big
            ISPs promised change, but kept raising prices and lowering service. So we decided
            to build something different.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fiber internet is the future. It&apos;s faster, more reliable, and can actually be
            affordable and simple. That&apos;s what FiberFastUSA stands for — and we&apos;re
            bringing it to communities nationwide, one neighborhood at a time.
          </p>
        </div>
      </section>

      {/* Where We Serve */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Where We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re actively expanding across the United States. New markets added every
              month.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {serviceRegions.map((region) => (
              <div
                key={region}
                className="flex items-center gap-3 bg-card rounded-lg border border-border p-4"
              >
                <MapPin className="size-5 text-fiber-blue flex-shrink-0" />
                <span className="font-medium text-foreground">{region}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/check-availability"
              className="inline-flex items-center gap-2 text-fiber-blue font-semibold hover:underline"
            >
              Check if we serve your area <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24 bg-muted/30">
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

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Real people building real internet for real people.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reps.map((member) => (
              <Link
                key={member.slug}
                href={`/rep/${member.slug}`}
                className="group card-premium bg-card rounded-xl border border-border p-6 block"
              >
                <div className="bg-gradient-to-br from-fiber-blue/10 to-fiber-blue/5 rounded-lg h-36 mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-fiber-blue/30">
                    {member.name.split(" ")[0][0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-fiber-teal transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-fiber-blue font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-fiber-teal">
                  View Profile <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Experience the FiberFastUSA Difference?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Check if fiber internet is available at your address and get started today.
          </p>
          <Link
            href="/check-availability"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-teal text-white font-semibold hover:bg-fiber-teal/90 transition-all glow-teal"
          >
            Check Availability
          </Link>
        </div>
      </section>
    </main>
  )
}
