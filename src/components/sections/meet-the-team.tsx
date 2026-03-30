import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TEAM_MEMBERS } from "@/lib/constants"

export default function MeetTheTeam() {
  const reps = TEAM_MEMBERS.map((m) => ({ ...m, photo_url: m.image ?? null, city: null as string | null, state: null as string | null }))

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-section text-foreground mb-4">
            Meet the FiberFastUSA Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team of dedicated professionals is here to help you get connected to fast, reliable fiber internet.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reps.map((rep) => {
            const firstLetter = rep.name.charAt(0).toUpperCase()

            return (
              <div
                key={rep.slug}
                className="card-premium bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full"
              >
                {/* Photo or placeholder — standardized 4:5 portrait */}
                {rep.photo_url ? (
                  <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={rep.photo_url}
                      alt={rep.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gradient-to-br from-fiber-blue/10 via-fiber-blue/5 to-fiber-blue/10 flex items-center justify-center" style={{ aspectRatio: "4/5" }}>
                    <span className="text-5xl font-bold text-fiber-blue/20">
                      {firstLetter}
                    </span>
                  </div>
                )}

                {/* Card content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-foreground">
                    {rep.name}
                  </h3>
                  <p className="text-sm text-fiber-blue font-medium">
                    {rep.role}
                  </p>
                  {(rep.city || rep.state) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {[rep.city, rep.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {rep.bio}
                  </p>
                  <Link
                    href={`/rep/${rep.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-fiber-blue hover:text-fiber-blue transition-colors"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
