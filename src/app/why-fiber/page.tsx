import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckCircle2,
  XCircle,
  Zap,
  Infinity,
  Network,
  Gamepad2,
  Cable,
  Lightbulb,
  Shield,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Why Fiber Internet? | FiberFastUSA",
  description:
    "Discover why fiber internet is the future. Learn how fiber compares to cable and DSL, and who benefits most from fiber connectivity.",
  openGraph: {
    title: "Why Fiber Internet? | FiberFastUSA",
    description: "See how fiber outperforms cable and DSL across every metric that matters.",
  },
}

export default function WhyFiberPage() {
  const benefitCategories = [
    {
      icon: Gamepad2,
      title: "Remote Workers",
      description:
        "Reliable uploads and downloads for video calls, file transfers, and cloud applications.",
    },
    {
      icon: Gamepad2,
      title: "Gamers",
      description: "Ultra-low latency (1-5ms) for competitive gaming without lag.",
    },
    {
      icon: Zap,
      title: "Streamers",
      description:
        "Symmetric speeds mean you can stream and upload to multiple platforms simultaneously.",
    },
    {
      icon: Network,
      title: "Smart Home Users",
      description:
        "Support dozens of connected devices without slowdowns or buffering.",
    },
    {
      icon: Infinity,
      title: "Content Creators",
      description:
        "Upload large video files in minutes instead of hours with symmetric gigabit speeds.",
    },
    {
      icon: CheckCircle2,
      title: "Large Families",
      description:
        "Everyone streams, games, and works at the same time without competition for bandwidth.",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section-navy py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Why Fiber Internet?
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Fiber optic internet uses light to transmit data through thin glass strands,
              delivering speeds and reliability that cable and DSL simply can&apos;t match.
            </p>
          </div>
        </div>
      </section>

      {/* How Fiber Works */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              How Fiber Optic Technology Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding why fiber is fundamentally superior to older internet technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-premium bg-card rounded-xl border border-border p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-fiber-blue/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="size-7 text-fiber-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Light-Based Transmission</h3>
              <p className="text-sm text-muted-foreground">
                Data travels as pulses of light through glass fibers thinner than a human hair.
                Light is the fastest medium possible — nothing beats it.
              </p>
            </div>
            <div className="card-premium bg-card rounded-xl border border-border p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-fiber-teal/10 flex items-center justify-center mx-auto mb-4">
                <Cable className="size-7 text-fiber-teal" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Dedicated Connection</h3>
              <p className="text-sm text-muted-foreground">
                Unlike cable, fiber gives you a dedicated line to your home. No sharing bandwidth
                with neighbors means consistent speeds even during peak hours.
              </p>
            </div>
            <div className="card-premium bg-card rounded-xl border border-border p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-fiber-success/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="size-7 text-fiber-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Future-Proof Infrastructure</h3>
              <p className="text-sm text-muted-foreground">
                Fiber cables can theoretically carry petabits of data. Today&apos;s fiber infrastructure
                will support next-generation speeds without replacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: Fiber vs Cable vs Tower/Satellite */}
      <section id="speed-comparison" className="py-16 md:py-24 bg-treatment-rhythm scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Fiber vs Copper Cable vs Tower/Satellite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how fiber stacks up against older internet technologies across every metric.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl border border-border overflow-hidden">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Feature</th>
                  <th className="px-6 py-4 text-left font-semibold text-fiber-blue">Fiber Optic</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Copper Cable</th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Tower / Satellite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    feature: "Download Speed",
                    fiber: { stat: "7,000 Mbps", text: "Up to 7 Gbps", good: true },
                    cable: { text: "Up to 700 Mbps", bad: true },
                    satellite: { text: "Up to 25 Mbps", bad: true },
                  },
                  {
                    feature: "Upload Speed",
                    fiber: { stat: "7,000 Mbps", text: "Symmetric — same as download", good: true },
                    cable: { text: "10-50 Mbps", bad: true },
                    satellite: { text: "3 Mbps", bad: true },
                  },
                  {
                    feature: "Latency",
                    fiber: { stat: "<5 ms", text: "Ultra-low ping", good: true },
                    cable: { text: "10-30 ms", bad: true },
                    satellite: { text: "500-700 ms", bad: true },
                  },
                  {
                    feature: "Reliability",
                    fiber: { stat: "99.9%", text: "Uptime guarantee", good: true },
                    cable: { text: "Weather/distance dependent", bad: true },
                    satellite: { text: "Weather disruptions common", bad: true },
                  },
                  {
                    feature: "Data Caps",
                    fiber: { stat: "Unlimited", text: "No caps, no throttling", good: true },
                    cable: { text: "Often 1-1.5 TB", bad: true },
                    satellite: { text: "Strict caps (40-150 GB)", bad: true },
                  },
                  {
                    feature: "Technology",
                    fiber: { stat: "Fiber Optic", text: "Light through glass", good: true },
                    cable: { text: "Electrical through copper", ok: true },
                    satellite: { text: "Radio waves to orbit", ok: true },
                  },
                  {
                    feature: "Shared Bandwidth",
                    fiber: { stat: "Dedicated", text: "Your own line to your home", good: true },
                    cable: { text: "Shared with neighbors", bad: true },
                    satellite: { text: "Shared across region", bad: true },
                  },
                  {
                    feature: "Monthly Price",
                    fiber: { stat: "$34.99", text: "Starting price/mo", good: true },
                    cable: { text: "From $49.99/mo", bad: true },
                    satellite: { text: "From $64.99/mo", bad: true },
                  },
                  {
                    feature: "Contract Required",
                    fiber: { stat: "None", text: "Month-to-month, cancel anytime", good: true },
                    cable: { text: "Often 1-2 year contract", bad: true },
                    satellite: { text: "Usually 2 year contract", bad: true },
                  },
                  {
                    feature: "Installation",
                    fiber: { stat: "Free", text: "Professional install included", good: true },
                    cable: { text: "$49-$99 install fee", bad: true },
                    satellite: { text: "$99-$199 install fee", bad: true },
                  },
                  {
                    feature: "Equipment",
                    fiber: { stat: "Free", text: "Wi-Fi router included", good: true },
                    cable: { text: "$10-$15/mo rental", bad: true },
                    satellite: { text: "$10-$25/mo rental", bad: true },
                  },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-4 font-bold text-foreground">{row.feature}</td>
                    <td className="px-6 py-4 bg-fiber-blue/5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-fiber-success flex-shrink-0" />
                        <div>
                          <span className="text-base font-black text-fiber-blue block">{row.fiber.stat}</span>
                          <span className="text-xs text-muted-foreground">{row.fiber.text}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {row.cable.bad ? (
                          <XCircle className="size-5 text-red-500 flex-shrink-0" />
                        ) : null}
                        <span className="text-sm text-muted-foreground">{row.cable.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {row.satellite.bad ? (
                          <XCircle className="size-5 text-red-500 flex-shrink-0" />
                        ) : null}
                        <span className="text-sm text-muted-foreground">{row.satellite.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits of Fiber */}
      <section className="py-16 md:py-24 bg-treatment-emphasis">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Benefits of Fiber
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Symmetric Speeds",
                desc: "Upload equals download speeds. Perfect for video calls and cloud backups.",
              },
              {
                title: "Future-Proof",
                desc: "Fiber infrastructure supports next-gen speeds without replacements.",
              },
              {
                title: "No Congestion",
                desc: "Dedicated line connection, not shared bandwidth with neighbors.",
              },
              {
                title: "Lower Latency",
                desc: "Lightning-fast response times for gaming, video calls, and real-time apps.",
              },
            ].map((item) => (
              <div key={item.title} className="card-premium bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits Most */}
      <section className="py-16 md:py-24 bg-treatment-trust">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Who Benefits Most?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title} className="card-premium bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-fiber-blue/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="size-5 text-fiber-blue" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground pt-1.5">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Common Myths */}
      <section className="py-16 md:py-24 bg-treatment-rhythm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">
              Common Myths About Fiber Internet
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let&apos;s clear up some misconceptions about fiber internet.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                myth: "Fiber internet is too expensive",
                reality:
                  "Fiber plans start at just $34.99/mo — often comparable to or cheaper than cable. Plus, you get symmetric speeds, no data caps, and no hidden fees. When you factor in the total value, fiber is the better deal.",
              },
              {
                myth: "I don&apos;t need that much speed",
                reality:
                  "It&apos;s not just about raw speed — fiber delivers lower latency, more consistent performance, and symmetric uploads. Even basic tasks like video calls and cloud backups benefit dramatically from fiber&apos;s reliability.",
              },
              {
                myth: "Installation is complicated and disruptive",
                reality:
                  "Professional installation typically takes 2-4 hours. Our technicians handle everything, and most customers are online the same day with zero disruption to their daily routine.",
              },
              {
                myth: "Cable internet is just as good",
                reality:
                  "Cable shares bandwidth with your neighbors, causing slowdowns during peak hours. Fiber gives you a dedicated connection with consistent speeds 24/7, plus symmetric upload speeds that cable simply cannot match.",
              },
              {
                myth: "Fiber isn&apos;t available in my area",
                reality:
                  "Fiber networks are expanding rapidly across the United States. Even if it wasn&apos;t available last year, it may be now. Check your address — you might be surprised.",
              },
            ].map((item) => (
              <div
                key={item.myth}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-start gap-4">
                  <XCircle className="size-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Myth: &ldquo;{item.myth}&rdquo;
                    </h3>
                    <div className="flex items-start gap-2 mt-3">
                      <CheckCircle2 className="size-5 text-fiber-success flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-fiber-success">Reality:</span>{" "}
                        {item.reality}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Experience the Fiber Difference
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Ready to upgrade to fiber internet? Check if it&apos;s available at your address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/check-availability"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-blue text-white font-semibold hover:bg-fiber-blue/90 transition-all glow-teal"
            >
              Check Availability
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-all gap-2"
            >
              View Plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
