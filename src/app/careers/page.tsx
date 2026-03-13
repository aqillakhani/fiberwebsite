import type { Metadata } from "next"
import { DollarSign, Clock, TrendingUp, Users, Check, Zap } from "lucide-react"

import CareerForm from "@/components/forms/career-form"

export const metadata: Metadata = {
  title: "Careers | Join the FiberFastUSA Team",
  description:
    "Join FiberFastUSA as a sales representative. Competitive pay, flexible hours, and the opportunity to help families get connected to fast fiber internet.",
  openGraph: {
    title: "Careers at FiberFastUSA",
    description: "Join our growing team and help bring fiber internet to communities nationwide.",
  },
}

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description: "Uncapped commission structure with base pay. Top reps earn $80K-$120K+ annually.",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Set your own hours and work in your local area. Full-time and part-time positions available.",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunity",
      description: "Clear path to team lead and management roles as we expand into new markets.",
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Supportive team environment with training, mentorship, and regular team events.",
    },
  ]

  const dayInLife = [
    "Connect with homeowners in your assigned territory",
    "Educate families about the benefits of fiber internet",
    "Help customers choose the right plan for their needs",
    "Build lasting relationships in your community",
    "Track your progress with our mobile-friendly tools",
    "Earn commissions on every successful installation",
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-fiber-orange/20 px-4 py-1.5 mb-6">
              <Zap className="size-4 text-fiber-orange" />
              <span className="text-sm font-medium text-fiber-orange">
                We&apos;re Hiring Nationwide
              </span>
            </div>
            <h1 className="heading-display text-white mb-6">
              Join the FiberFastUSA Team
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Help families across America get connected to fast, reliable fiber internet.
              No experience needed — we provide all the training and tools you need to succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Why Join FiberFastUSA?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer more than just a job — we offer a career path with real earning potential and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="card-premium bg-card rounded-xl border border-border p-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-fiber-orange/10 flex items-center justify-center mb-4">
                    <Icon className="size-6 text-fiber-orange" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Day in the Life */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-section text-foreground mb-4">
                What You&apos;ll Do
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                As a FiberFastUSA sales representative, you&apos;ll be the face of our company
                in your community. Here&apos;s what a typical day looks like:
              </p>
              <div className="space-y-4">
                {dayInLife.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="text-xl font-bold text-foreground mb-2">
                No Experience? No Problem.
              </h3>
              <p className="text-muted-foreground mb-6">
                We provide comprehensive training to set you up for success:
              </p>
              <div className="space-y-4">
                {[
                  "Paid training program",
                  "Sales scripts and proven techniques",
                  "Branded materials and QR code system",
                  "Ongoing coaching from experienced leaders",
                  "Mobile tools to track leads and commissions",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Zap className="size-4 text-fiber-orange flex-shrink-0 mt-1" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-foreground mb-3">
              Apply Now
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and our hiring team will be in touch within a few business days.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <CareerForm />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have Questions About the Role?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Reach out to our team and we&apos;ll be happy to answer any questions about
            working with FiberFastUSA.
          </p>
          <a
            href="mailto:careers@fiberfastusa.com"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-orange text-white font-semibold hover:bg-fiber-orange/90 transition-all glow-orange"
          >
            Email careers@fiberfastusa.com
          </a>
        </div>
      </section>
    </main>
  )
}
