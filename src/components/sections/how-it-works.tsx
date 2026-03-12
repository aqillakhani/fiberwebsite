import Link from "next/link"
import { MapPin, FileText, Wrench, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

type StepProps = {
  icon: React.ReactNode
  title: string
  description: string
  isLast?: boolean
}

function Step({ icon, title, description, isLast = false }: StepProps) {
  return (
    <div className="flex flex-col items-center relative flex-1">
      {/* Circle with icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-fiber-orange text-white font-bold text-lg mb-4 relative z-10">
        {icon}
      </div>

      {/* Connector line (hidden on mobile, shown on desktop for non-last items) */}
      {!isLast && (
        <div className="hidden md:block absolute top-7 left-[50%] w-full h-0.5 bg-gradient-to-r from-fiber-orange/50 to-fiber-orange/20 z-0" />
      )}

      <h3 className="text-lg font-semibold text-fiber-blue-dark text-center mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        {description}
      </p>
    </div>
  )
}

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Check Your Address",
      description: "See if fiber is available at your location",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Choose Your Plan",
      description: "Pick the speed that fits your needs",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Get Installed",
      description: "Free professional installation at your home",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Enjoy Fast Internet",
      description: "Start streaming, gaming, and working at fiber speed",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-fiber-blue-dark text-center mb-12">
          Get Connected in 4 Easy Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 mb-12">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/get-started">
            <Button
              size="lg"
              className="bg-fiber-blue hover:bg-fiber-blue-dark text-white"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
