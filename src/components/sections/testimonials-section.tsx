import Link from "next/link"
import { Star } from "lucide-react"
import { TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const featuredTestimonials = TESTIMONIALS.filter((t) => t.isFeatured).slice(0, 3)

  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-fiber-blue-dark text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <p className="text-gray-700 italic mb-4">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    <StarRating rating={testimonial.rating} />
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    <p className="font-semibold text-fiber-blue-dark">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.city}, {testimonial.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-blue-dark font-semibold transition-colors"
          >
            See All Reviews →
          </Link>
        </div>
      </div>
    </section>
  )
}
