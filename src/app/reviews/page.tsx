import { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";

import { TESTIMONIALS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Customer Reviews | FiberFastUSA",
  description:
    "See what our happy customers say about FiberFastUSA fiber internet service. Read real reviews and ratings.",
  openGraph: {
    title: "Real Customer Reviews | FiberFastUSA",
    description: "Read genuine customer reviews. 500+ customers rate us 4.9 stars. 98% would recommend.",
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            What Our Customers Say
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Real feedback from real FiberFastUSA customers.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">4.9</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average Rating
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">500+</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customer Reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">98%</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Would Recommend
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="space-y-3">
                    <StarRating rating={testimonial.rating} />
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.city}, {testimonial.state}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Join our happy customers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the speed and reliability that thousands of Colorado
              families trust.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/get-started">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/check-availability">
                <Button variant="outline" size="lg">
                  Check Availability
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
