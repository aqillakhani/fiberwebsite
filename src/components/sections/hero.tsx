import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-fiber-blue-light to-fiber-blue-light/50 py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-fiber-blue-dark mb-4 leading-tight">
            Fiber Internet That Actually Works
          </h1>

          <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl">
            Faster speeds. More reliable. No data caps. Check availability in 10 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/check-availability">
              <Button
                size="lg"
                className="bg-fiber-orange hover:bg-fiber-orange/90 text-white px-6 md:px-8 gap-2"
              >
                Check Your Address
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="px-6 md:px-8"
              >
                View Plans →
              </Button>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/60 px-4 py-2 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Serving 10,000+ homes across Colorado
          </div>
        </div>
      </div>
    </section>
  )
}
