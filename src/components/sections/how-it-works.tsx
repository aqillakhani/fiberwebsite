import Link from "next/link"
import { MapPin, FileText, Wrench, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

type StepProps = {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  isLast?: boolean
}

function DesktopStep({ number, icon, title, description, isLast = false }: StepProps) {
  return (
    <div className="flex flex-col items-center relative flex-1">
      {/* Connector line between steps (positioned absolutely behind circles) */}
      {!isLast && (
        <div className="absolute top-7 left-1/2 w-[calc(100%+1rem)] h-0.5 border-t-2 border-dashed border-fiber-teal/30 z-0" />
      )}

      {/* Number badge circle */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-fiber-teal text-white font-bold text-lg mb-4 relative z-10 flex-shrink-0">
        {number}
      </div>

      {/* Icon below the number badge */}
      <div className="text-muted-foreground mb-4">
        {icon}
      </div>

      {/* Title and description */}
      <h3 className="text-lg font-semibold text-foreground text-center mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {description}
      </p>
    </div>
  )
}

function MobileStep({ number, icon, title, description }: StepProps) {
  return (
    <div className="flex gap-6 relative">
      {/* Vertical line on the left (except for last item) */}
      <div className="absolute left-6 top-14 w-0.5 h-[calc(100%+1rem)] bg-fiber-teal/30" />

      {/* Number badge and icon */}
      <div className="flex flex-col items-center flex-shrink-0 relative z-10">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-fiber-teal text-white font-bold text-lg mb-4">
          {number}
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>

      {/* Title and description */}
      <div className="pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: <MapPin className="w-6 h-6" />,
      title: "Check Your Address",
      description: "Enter your address to see if fiber is available in your area",
    },
    {
      number: 2,
      icon: <FileText className="w-6 h-6" />,
      title: "Choose Your Plan",
      description: "Pick the speed tier that fits your household's needs",
    },
    {
      number: 3,
      icon: <Wrench className="w-6 h-6" />,
      title: "Schedule Install",
      description: "Free professional installation at a time that works for you",
    },
    {
      number: 4,
      icon: <Wifi className="w-6 h-6" />,
      title: "Get Connected",
      description: "Start streaming, gaming, and working at blazing fiber speeds",
    },
  ]

  return (
    <section className="w-full py-20 md:py-28 bg-white dark:bg-background white-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="heading-section text-foreground text-center mb-12">
          Get Connected in 4 Easy Steps
        </h2>

        {/* Desktop layout: horizontal grid with numbered circles */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-12">
          {steps.map((step, index) => (
            <DesktopStep
              key={index}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Mobile layout: vertical timeline */}
        <div className="md:hidden mb-12 space-y-2">
          {steps.map((step) => (
            <MobileStep
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/* CTA button */}
        <div className="text-center">
          <Link href="/check-availability">
            <Button
              size="lg"
              className="bg-fiber-teal hover:bg-fiber-teal/90 text-white"
            >
              Check Your Address
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
