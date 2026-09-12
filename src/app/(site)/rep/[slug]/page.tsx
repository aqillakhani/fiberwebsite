import type { Metadata } from "next"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { Phone, ShieldCheck, QrCode, Download, Check } from "lucide-react"

import { getRepBySlug, getAllRepSlugs } from "@/lib/reps"
import { LeadForm } from "@/components/lead/lead-form"
import { NetworkPlans } from "@/components/plans/network-plans"
import RepFaqSection from "@/components/rep/rep-faq-section"

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
    robots: {
      index: false,
      follow: false,
    },
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
  if (resolvedSearchParams.door === "1") redirect(`/door/${rep.slug}`)

  const firstName = rep.name.split(" ")[0]

  return (
    <main className="min-h-screen">
      {/* ── 1. HERO — Personal intro & trust ── */}
      <section className="section-navy py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Photo + Contact Card */}
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                {rep.photo_url ? (
                  <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={rep.photo_url}
                      alt={rep.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gradient-to-br from-fiber-blue/30 via-fiber-blue/20 to-fiber-blue/30 flex items-center justify-center" style={{ aspectRatio: "4/5" }}>
                    <span className="text-7xl font-bold text-white/30">
                      {firstName[0]}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <a
                    href={`tel:${rep.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                  >
                    <Phone className="size-4 flex-shrink-0" />
                    <span className="font-medium">{rep.phone}</span>
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
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <a
                    href={`/api/qr/${rep.slug}?size=600`}
                    download={`${rep.slug}-qr.png`}
                    className="inline-flex items-center gap-2 text-xs text-white/80 transition-colors hover:text-white"
                  >
                    <Download className="size-3" />
                    QR code
                  </a>
                  <a
                    href={`/api/qr/${rep.slug}/card`}
                    download={`${rep.slug}-card.png`}
                    className="inline-flex items-center gap-2 text-xs text-white/80 transition-colors hover:text-white"
                  >
                    <Download className="size-3" />
                    Digital card
                  </a>
                </div>
              </div>
            </div>

            {/* Rep Info */}
            <div className="md:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-fiber-success/20 px-4 py-1.5">
                <ShieldCheck className="size-4 text-fiber-success" />
                <span className="text-sm font-medium text-fiber-success">
                  Verified FiberFastUSA Representative
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
                  Hi, I&apos;m {firstName}.
                </h1>
                <p className="text-lg text-white/80 leading-relaxed mb-2">
                  I&apos;m here to help you get connected with fast, reliable fiber internet for your home.
                </p>
                <p className="text-base text-white/60 leading-relaxed">
                  Check availability, compare plans, and choose the best option for your household — I&apos;ll guide you through every step.
                </p>
              </div>

              {(rep.city || rep.state) && (
                <p className="text-white/50 text-sm">
                  Serving {[rep.city, rep.state].filter(Boolean).join(", ")}
                </p>
              )}

              <a
                href="#lead-form"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-blue text-white font-semibold hover:bg-fiber-blue/90 transition-all glow-blue"
              >
                Get Started with {firstName}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -- 3. PLANS BY NETWORK -- */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Plans depend on your network</h2>
            <p className="text-muted-foreground">{firstName} checks your address first, then walks you through that network&apos;s plans.</p>
          </div>
          <NetworkPlans compact />
        </div>
      </section>

      {/* ── 4. LEAD FORM — Contact & scheduling ── */}
      <section id="lead-form" className="py-16 md:py-20 scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Get Connected Today
            </h2>
            <p className="text-muted-foreground">
              Check your address below. A FiberFastUSA specialist calls within minutes to confirm availability and pricing.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <LeadForm source="rep-page" />
          </div>
        </div>
      </section>

      {/* ── 6. FAQ — Objection handling ── */}
      <RepFaqSection />

      {/* ── 7. TRUST SIGNALS ── */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "Free Installation",
              "No Contracts",
              "No Data Caps",
              "Recorded, no-pressure calls",
            ].map((item) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <Check className="size-5 text-fiber-success" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BOTTOM CTA ── */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to make the switch?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Let {firstName} help you find the perfect fiber plan for your home.
          </p>
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-blue text-white font-semibold hover:bg-fiber-blue/90 transition-all glow-blue"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </main>
  )
}
