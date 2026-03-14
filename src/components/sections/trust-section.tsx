"use client"

import { ShieldCheck, Headphones, BadgeDollarSign, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

type TrustSignalProps = {
  icon: React.ReactNode
  label: string
  iconBg: string
  delay: number
  isVisible: boolean
}

function TrustSignal({ icon, label, iconBg, delay, isVisible }: TrustSignalProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-3 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className={cn("flex items-center justify-center w-12 h-12 rounded-full", iconBg)}>
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">
        {label}
      </p>
    </div>
  )
}

export default function TrustSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-12 md:py-16 bg-white white-section">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <TrustSignal
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-teal"
            label="Licensed & Insured"
            delay={0}
            isVisible={isVisible}
          />
          <TrustSignal
            icon={<Headphones className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-blue"
            label="Local 24/7 Support"
            delay={100}
            isVisible={isVisible}
          />
          <TrustSignal
            icon={<BadgeDollarSign className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-success"
            label="30-Day Money-Back"
            delay={200}
            isVisible={isVisible}
          />
          <TrustSignal
            icon={<MapPin className="w-6 h-6 text-white" />}
            iconBg="bg-fiber-teal"
            label="Serving Nationwide"
            delay={300}
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  )
}
