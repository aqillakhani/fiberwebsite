import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RepSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-fiber-blue-dark mb-3">
            Already Spoke With a Rep?
          </h2>

          <p className="text-gray-600 mb-6 max-w-2xl">
            If a FiberFastUSA representative visited your home or called you, verify them here for your peace of mind.
          </p>

          <Link href="/verify-rep">
            <Button variant="outline" size="lg">
              Verify Your Rep
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
