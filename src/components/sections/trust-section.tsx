import { ShieldCheck, Headphones, BadgeDollarSign, MapPin } from "lucide-react"

type TrustSignalProps = {
  icon: React.ReactNode
  label: string
}

function TrustSignal({ icon, label }: TrustSignalProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="text-gray-600">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {label}
      </p>
    </div>
  )
}

export default function TrustSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <TrustSignal
            icon={<ShieldCheck className="w-8 h-8" />}
            label="Licensed & Insured"
          />
          <TrustSignal
            icon={<Headphones className="w-8 h-8" />}
            label="Local 24/7 Support"
          />
          <TrustSignal
            icon={<BadgeDollarSign className="w-8 h-8" />}
            label="30-Day Money-Back"
          />
          <TrustSignal
            icon={<MapPin className="w-8 h-8" />}
            label="Serving Colorado"
          />
        </div>
      </div>
    </section>
  )
}
