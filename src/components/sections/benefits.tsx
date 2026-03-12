import Link from "next/link"
import { Zap, Shield, Infinity } from "lucide-react"
import { cn } from "@/lib/utils"

type BenefitCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}

function BenefitCard({ icon, title, description, iconColor }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 md:p-8">
      <div className={cn(
        "flex items-center justify-center w-16 h-16 rounded-full mb-4",
        iconColor
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-fiber-blue-dark mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}

export default function BenefitsSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-fiber-blue-dark text-center mb-12">
          Why Choose Fiber?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white shadow-md rounded-xl">
            <BenefitCard
              icon={<Zap className="w-8 h-8 text-white" />}
              title="Blazing Fast Speeds"
              description="Up to 7 Gbps symmetric. No throttling, ever."
              iconColor="bg-amber-500"
            />
          </div>

          <div className="bg-white shadow-md rounded-xl">
            <BenefitCard
              icon={<Shield className="w-8 h-8 text-white" />}
              title="Ultra Reliable"
              description="99.9% uptime with a dedicated fiber line to your home."
              iconColor="bg-emerald-500"
            />
          </div>

          <div className="bg-white shadow-md rounded-xl">
            <BenefitCard
              icon={<Infinity className="w-8 h-8 text-white" />}
              title="No Data Caps"
              description="Unlimited data. No slowdowns. No surprises on your bill."
              iconColor="bg-blue-500"
            />
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/why-fiber"
            className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-blue-dark font-semibold transition-colors"
          >
            Learn more about fiber →
          </Link>
        </div>
      </div>
    </section>
  )
}
