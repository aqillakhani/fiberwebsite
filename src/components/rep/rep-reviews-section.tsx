"use client"

import { Star } from "lucide-react"

const REVIEWS = [
  {
    quote:
      "The switch to fiber was seamless. My rep walked me through everything and I was connected the same day.",
    name: "Maria G.",
    location: "Dallas, TX",
  },
  {
    quote:
      "Finally got rid of my cable internet. The speed difference is night and day. No more buffering!",
    name: "James T.",
    location: "Denver, CO",
  },
  {
    quote:
      "I was skeptical at first, but the no-contract, no-data-cap deal was real. Best internet I've ever had.",
    name: "Sarah K.",
    location: "Phoenix, AZ",
  },
  {
    quote:
      "My whole family streams, games, and works from home. Fiber handles all of it without breaking a sweat.",
    name: "David R.",
    location: "Tampa, FL",
  },
]

export default function RepReviewsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            What Customers Are Saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from households that made the switch to fiber.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {review.name}
                </p>
                <p className="text-xs text-gray-500">{review.location}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Join thousands of households who&apos;ve made the switch to fiber.
        </p>
      </div>
    </section>
  )
}
