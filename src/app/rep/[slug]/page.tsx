import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Phone, Mail, Gift, Zap, Star, ShieldCheck, QrCode, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PLANS } from "@/lib/constants"
import { getRepBySlug, getAllRepSlugs } from "@/lib/reps"
import { cn } from "@/lib/utils"
import CompactLeadForm from "@/components/forms/compact-lead-form"
import DoorModeView from "@/components/rep/door-mode-view"

interface RepProfilePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: RepProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const rep = await getRepBySlug(slug)

  if (!rep) {
    return {
      title: "Rep Not Found | FiberFastUSA",
      description: "This sales representative could not be found.",
    }
  }

  return {
    title: `${rep.name} | FiberFastUSA Sales Rep`,
    description: `Meet ${rep.name}, your dedicated FiberFastUSA sales representative. ${rep.bio}`,
    openGraph: {
      title: `${rep.name} - FiberFastUSA Sales Rep`,
      description: `Get connected to fiber internet through ${rep.name} at FiberFastUSA.`,
      url: `/rep/${rep.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllRepSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function RepProfilePage({ params, searchParams }: RepProfilePageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const rep = await getRepBySlug(slug)

  if (!rep) {
    notFound()
  }

  // Door Mode: streamlined conversion flow
  if (resolvedSearchParams.door === "1") {
    const address = typeof resolvedSearchParams.address === "string" ? resolvedSearchParams.address : undefined
    const plan = typeof resolvedSearchParams.plan === "string" ? resolvedSearchParams.plan : undefined
    return <DoorModeView rep={rep} prefilledAddress={address} prefilledPlan={plan} />
  }

  const firstName = rep.name.split(" ")[0]
  const displayedPlans = PLANS.slice(0, 4)

  return (
    <main className="min-h-screen">
      {/* Rep Hero */}
      <section className="section-navy py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Photo + Contact Card */}
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                {/* Photo or Placeholder */}
                {rep.photo_url ? (
                  <div className="aspect-square relative">
                    <Image
                      src={rep.photo_url}
                      alt={rep.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-fiber-blue/30 via-fiber-orange/20 to-fiber-blue/30 flex items-center justify-center">
                    <span className="text-7xl font-bold text-white/30">
                      {firstName[0]}
                    </span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="p-5 space-y-3">
                  <a
                    href={`tel:${rep.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                  >
                    <Phone className="size-4 flex-shrink-0" />
                    <span className="font-medium">{rep.phone}</span>
                  </a>
                  <a
                    href={`mailto:${rep.email}`}
                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors break-all text-sm"
                  >
                    <Mail className="size-4 flex-shrink-0" />
                    <span className="font-medium">{rep.email}</span>
                  </a>
                  {rep.territory && (
                    <p className="text-white/60 text-sm pt-1">
                      Territory: {rep.territory}
                    </p>
                  )}
                </div>
              </div>

              {/* QR Code Download */}
              <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center gap-3 text-white/70 text-sm mb-3">
                  <QrCode className="size-4" />
                  <span className="font-medium">Share this page</span>
                </div>
                <a
                  href={`/api/qr/${rep.slug}?size=600`}
                  download={`${rep.slug}-qr.png`}
                  className="inline-flex items-center gap-2 text-xs text-fiber-orange hover:text-fiber-orange/80 transition-colors"
                >
                  <Download className="size-3" />
                  Download QR Code
                </a>
              </div>
            </div>

            {/* Rep Info */}
            <div className="md:col-span-3 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-fiber-success/20 px-4 py-1.5">
                <ShieldCheck className="size-4 text-fiber-success" />
                <span className="text-sm font-medium text-fiber-success">
                  Verified FiberFastUSA Representative
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
                  {rep.name}
                </h1>
                <p className="text-lg text-fiber-orange font-semibold mb-4">
                  {rep.role}
                </p>
                {(rep.city || rep.state) && (
                  <p className="text-white/60 text-sm mb-4">
                    {[rep.city, rep.state].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="text-lg text-white/80 leading-relaxed">
                  {rep.bio}
                </p>
              </div>

              {/* Scroll to form CTA */}
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-orange text-white font-semibold hover:bg-fiber-orange/90 transition-all glow-orange"
              >
                Get Started with {firstName}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Lead Form */}
      <section id="lead-form" className="py-16 md:py-20 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="heading-section text-foreground mb-3">
              Get Connected Today
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and {firstName} will reach out to confirm availability and help you choose the perfect plan.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <CompactLeadForm
              repId={rep.slug}
              repName={firstName}
              source="rep-page"
            />
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">
              Available Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All plans include free installation, a free Wi-Fi router, and no data caps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedPlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative",
                  plan.isFeatured && "lg:scale-105 lg:z-10"
                )}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-fiber-orange text-white border-0 shadow-md">
                      <Star className="size-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={cn(
                  "card-premium flex flex-col h-full rounded-xl",
                  plan.isFeatured && "gradient-border border-2"
                )}>
                  <CardHeader className="pb-3">
                    <div className="text-2xl font-bold text-fiber-blue">
                      {plan.speed}
                    </div>
                    <CardTitle className="text-xl text-foreground mb-1">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground italic">
                      {plan.bestFor}
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-foreground">
                        ${plan.price}
                        <span className="text-sm text-muted-foreground font-normal ml-1">/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {plan.freeMonths !== null && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Zap className="size-3" />
                          {plan.freeMonths} Months FREE
                        </Badge>
                      )}
                      {plan.giftCard > 0 && (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800 flex items-center gap-1">
                          <Gift className="size-3" />
                          ${plan.giftCard} Gift Card
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2.5 mb-6 flex-grow">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <Check className="size-4 text-fiber-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#lead-form"
                      className={cn(
                        "inline-flex items-center justify-center w-full h-9 px-4 rounded-lg text-sm font-semibold transition-all duration-300",
                        plan.isFeatured
                          ? "bg-fiber-orange text-white hover:bg-fiber-orange/90"
                          : "border border-border hover:bg-accent text-foreground"
                      )}
                    >
                      Sign Up with {firstName}
                    </a>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-base font-semibold text-fiber-blue hover:underline"
            >
              View All Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "Free Installation",
              "No Contracts",
              "No Data Caps",
              "24/7 Support",
            ].map((item) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <Check className="size-5 text-fiber-success" />
                <span className="text-sm font-medium text-foreground">{item}</span>
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
            Not sure which plan?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Let {firstName} help you choose the perfect plan for your needs.
          </p>
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-orange text-white font-semibold hover:bg-fiber-orange/90 transition-all glow-orange"
          >
            Talk to {firstName} Now
          </a>
        </div>
      </section>
    </main>
  )
}
