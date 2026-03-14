"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!started) return
    const steps = 40
    const increment = target / steps
    const stepDuration = duration / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.round(current))
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [started, target, duration])

  return <>{count.toLocaleString()}</>
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-32 lg:py-40">
      {/* Background with gradient and grid overlay */}
      <div className="absolute inset-0 hero-gradient bg-grid-white" />

      {/* Animated fiber streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="fiber-streak fiber-streak-1" />
        <div className="fiber-streak fiber-streak-2" />
        <div className="fiber-streak fiber-streak-3" />
      </div>

      {/* Pulsing radial glow behind speed card */}
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[500px] rounded-full hero-glow-orb pointer-events-none hidden md:block" />

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center">
            <h1
              className={cn(
                "heading-display text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 leading-tight text-white hero-heading-shadow transition-all duration-700",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              <span className="hero-line sm:whitespace-nowrap">Ultra-Fast Fiber</span>
              <br />
              <span className="hero-line sm:whitespace-nowrap">Built for You</span>
            </h1>

            <p
              className={cn(
                "text-lg md:text-xl text-white/90 mb-3 leading-relaxed max-w-xl transition-all duration-700 delay-100",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              Blazing symmetric speeds up to 7 Gbps. Stream, game, and work from home — all at the same time, without a hiccup.
            </p>

            <p
              className={cn(
                "text-base text-white/70 mb-8 max-w-xl transition-all duration-700 delay-150",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              No contracts. No data caps. No hidden fees. Starting at $34.99/mo.
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4 mb-3 transition-all duration-700 delay-200",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              <Link href="/check-availability" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 md:px-10 gap-2 min-h-[56px] text-lg font-semibold shadow-lg shadow-red-600/30 cta-pulse"
                >
                  See If You Qualify
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-8 md:px-10 min-h-[56px] text-lg font-bold"
                >
                  View Plans
                </Button>
              </Link>
            </div>

            {/* Microcopy below CTAs */}
            <p
              className={cn(
                "text-sm text-white/60 mb-10 transition-all duration-700 delay-250",
                mounted ? "opacity-100" : "opacity-0"
              )}
            >
              Takes less than 30 seconds
            </p>

            {/* Social proof badges */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-4 transition-all duration-700 delay-300",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full pulse-green" />
                <span className="text-sm font-medium text-white/80">Trusted by 10,000+ homes</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                <span className="text-amber-400 text-sm">&#9733;</span>
                <span className="text-sm font-medium text-white/80">4.9 average rating</span>
              </div>
            </div>
          </div>

          {/* Right side - Speed visualization */}
          <div className="flex items-center justify-center">
            <Link
              href="/why-fiber#speed-comparison"
              className={cn(
                "block w-full max-w-sm p-6 md:p-8 rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-700 delay-200 hover:shadow-xl hover:scale-[1.02] cursor-pointer",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {/* Speed indicator */}
              <div className="mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-1">
                    Up to <AnimatedCounter target={7} duration={1200} /> Gbps
                  </div>
                  <div className="text-sm text-gray-500 font-semibold">Download & Upload Speed</div>
                </div>
              </div>

              {/* Speed comparison bars */}
              <div className="space-y-5 mb-6">
                {/* Bar 1 - Tower/Satellite */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Tower / Satellite</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Download</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: mounted ? "8%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-black mt-0.5">25 Mbps</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Upload</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: mounted ? "4%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-black mt-0.5">3 Mbps</div>
                    </div>
                  </div>
                </div>

                {/* Bar 2 - Copper Cable */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Copper Cable</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Download</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out delay-200"
                          style={{ width: mounted ? "30%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-black mt-0.5">700 Mbps</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Upload</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out delay-200"
                          style={{ width: mounted ? "5%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-black mt-0.5">10 Mbps</div>
                    </div>
                  </div>
                </div>

                {/* Bar 3 - Fiber Optic */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-black font-bold uppercase tracking-wide">Fiber Optic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Download</div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fiber-blue to-fiber-teal rounded-full transition-all duration-1200 ease-out delay-400 hero-elite-bar"
                          style={{ width: mounted ? "100%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-fiber-teal mt-0.5">7,000 Mbps</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold mb-1">Upload</div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fiber-blue to-fiber-teal rounded-full transition-all duration-1200 ease-out delay-500 hero-elite-bar"
                          style={{ width: mounted ? "100%" : "0%" }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-fiber-teal mt-0.5">7,000 Mbps</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symmetric label */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-black">Symmetric Upload & Download</div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">Only fiber gives you the same speed both ways</div>
                  <div className="text-xs text-fiber-teal mt-2 font-bold">Click to see full comparison &rarr;</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
