"use client"

import { ShieldCheck, Headphones, BadgeDollarSign, Clock, Wifi, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

type TrustCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  iconBg: string
  delay: number
  isVisible: boolean
}

function TrustCard({ icon, title, description, iconBg, delay, isVisible }: TrustCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-gray-100 dark:border-border bg-white dark:bg-card transition-all duration-700 hover:border-fiber-teal/30 hover:shadow-md",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className={cn("flex items-center justify-center w-12 h-12 rounded-full", iconBg)}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-foreground">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function TrustSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-20 md:py-28 bg-white white-section">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={cn(
            "heading-section text-foreground text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          Why Families Trust FiberFastUSA
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          <TrustCard
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-teal"
            title="Licensed & Insured"
            description="Fully licensed and insured for your peace of mind"
            delay={0}
            isVisible={isVisible}
          />
          <TrustCard
            icon={<Headphones className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-blue"
            title="24/7 Local Support"
            description="Real people, not bots — available around the clock"
            delay={100}
            isVisible={isVisible}
          />
          <TrustCard
            icon={<BadgeDollarSign className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-success"
            title="No Hidden Fees"
            description="The price you see is the price you pay, every month"
            delay={200}
            isVisible={isVisible}
          />
          <TrustCard
            icon={<Clock className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-teal"
            title="99.9% Uptime"
            description="Enterprise-grade reliability for your home"
            delay={300}
            isVisible={isVisible}
          />
          <TrustCard
            icon={<Wifi className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-blue"
            title="Free Installation"
            description="Professional setup at no extra cost"
            delay={400}
            isVisible={isVisible}
          />
          <TrustCard
            icon={<Award className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-success"
            title="30-Day Guarantee"
            description="Not satisfied? Full refund, no questions asked"
            delay={500}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  )
}
