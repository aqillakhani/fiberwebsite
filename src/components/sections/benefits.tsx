"use client"

import { Zap, Shield, Infinity, Ban, Wifi, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

type BenefitCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
  delay: number
  isVisible: boolean
}

function BenefitCard({ icon, title, description, iconColor, delay, isVisible }: BenefitCardProps) {
  return (
    <div
      className={cn(
        "card-premium flex flex-col items-center text-center p-6 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-700",
        "bg-card",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full mb-4",
        iconColor
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function BenefitsSection() {
  const { ref, isVisible } = useIntersectionObserver()

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Blazing Fast Speeds",
      description: "Up to 7 Gbps symmetric speeds. Stream, game, and work — all at once, all without lag.",
      iconColor: "bg-fiber-blue"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Rock-Solid Reliability",
      description: "99.9% uptime backed by a dedicated fiber line straight to your home. No shared cables.",
      iconColor: "bg-fiber-success"
    },
    {
      icon: <Infinity className="w-6 h-6 text-white" />,
      title: "No Data Caps — Ever",
      description: "Unlimited data with no throttling and no overage charges. Use as much as you want.",
      iconColor: "bg-fiber-blue"
    },
    {
      icon: <Ban className="w-6 h-6 text-white" />,
      title: "No Contracts Required",
      description: "Month-to-month plans with no commitments. Cancel anytime, no fees.",
      iconColor: "bg-fiber-blue"
    },
    {
      icon: <Wifi className="w-6 h-6 text-white" />,
      title: "Free Equipment",
      description: "Every plan includes a free premium Wi-Fi router and professional installation.",
      iconColor: "bg-fiber-blue"
    },
    {
      icon: <Headphones className="w-6 h-6 text-white" />,
      title: "Local Customer Support",
      description: "Real humans answering your calls 24/7. No bots, no runaround, no overseas call centers.",
      iconColor: "bg-fiber-success"
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-treatment-rhythm">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={cn(
          "heading-section text-foreground text-center mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          Why Choose FiberFastUSA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              iconColor={benefit.iconColor}
              delay={index * 100}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
