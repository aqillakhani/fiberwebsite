import { Zap, Shield, Infinity, Ban, Wifi, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

type BenefitCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}

function BenefitCard({ icon, title, description, iconColor }: BenefitCardProps) {
  return (
    <div className={cn(
      "card-premium flex flex-col items-center text-center p-6 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow",
      "bg-card"
    )}>
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
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Blazing Fast Speeds",
      description: "Up to 7 Gbps symmetric speeds. Stream, game, and work — all at once, all without lag.",
      iconColor: "bg-amber-500"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Rock-Solid Reliability",
      description: "99.9% uptime backed by a dedicated fiber line straight to your home. No shared cables.",
      iconColor: "bg-emerald-500"
    },
    {
      icon: <Infinity className="w-6 h-6 text-white" />,
      title: "No Data Caps — Ever",
      description: "Unlimited data with no throttling and no overage charges. Use as much as you want.",
      iconColor: "bg-blue-500"
    },
    {
      icon: <Ban className="w-6 h-6 text-white" />,
      title: "No Contracts Required",
      description: "Month-to-month plans with no commitments. Cancel anytime, no fees.",
      iconColor: "bg-purple-500"
    },
    {
      icon: <Wifi className="w-6 h-6 text-white" />,
      title: "Free Equipment",
      description: "Every plan includes a free premium Wi-Fi router and professional installation.",
      iconColor: "bg-teal-500"
    },
    {
      icon: <Headphones className="w-6 h-6 text-white" />,
      title: "Local Customer Support",
      description: "Real humans answering your calls 24/7. No bots, no runaround, no overseas call centers.",
      iconColor: "bg-rose-500"
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="heading-section text-foreground text-center mb-12">
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
            />
          ))}
        </div>
      </div>
    </section>
  )
}
