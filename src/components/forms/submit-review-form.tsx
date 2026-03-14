"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SubmitReviewForm() {
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim() || !city.trim() || !state.trim() || !review.trim() || rating === 0) {
      setError("Please fill in all fields and select a rating.")
      return
    }

    // In production this would submit to an API/database
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">&#10003;</div>
        <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your review has been submitted and will appear after moderation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base"
        />
        <input
          type="text"
          placeholder="State (e.g. TX)"
          value={state}
          onChange={(e) => setState(e.target.value)}
          maxLength={2}
          className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base uppercase"
        />
      </div>

      {/* Star Rating */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "size-7",
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Tell us about your experience with FiberFastUSA..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fiber-teal focus:border-transparent text-base resize-none"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold min-h-[48px]"
      >
        Submit Review
      </Button>
    </form>
  )
}
