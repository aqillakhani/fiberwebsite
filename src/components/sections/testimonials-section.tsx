import Link from "next/link"
import { Star } from "lucide-react"
import { TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const featuredTestimonials = TESTIMONIALS.filter((t) => t.isFeatured).slice(0, 3)

  return (
    <section className="w-full py-16 md:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="heading-section text-foreground text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {featuredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card-premium bg-card rounded-xl border border-border p-6 md:p-8 flex flex-col h-full"
            >
              {/* Decorative quote mark */}
              <div className="text-5xl text-fiber-blue/20 font-serif leading-none mb-2">
                &ldquo;
              </div>

              {/* Quote text */}
              <p className="text-foreground leading-relaxed mb-6 flex-grow">
                {testimonial.quote}
              </p>

              {/* Star rating */}
              <div className="mb-6">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Customer info with border separator */}
              <div className="border-t border-border pt-6">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.city}, {testimonial.state}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Read More Reviews link */}
        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-teal transition-colors font-semibold"
          >
            Read More Reviews →
          </Link>
        </div>
      </div>
    </section>
  )
}
