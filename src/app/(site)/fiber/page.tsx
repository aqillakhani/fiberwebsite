import type { Metadata } from "next";
import Link from "next/link";

import { formatHomes, listStates, LOCATIONS, locationPath, totalHomes } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Fiber Internet by City & State | FiberFastUSA",
  description:
    "Every city where our map shows fiber live or available — Kinetic, Brightspeed, Frontier and more. Pick your city, check your address, and a specialist finds your best offer.",
  alternates: { canonical: "/fiber" },
};

const TOP_CITIES = 12;

export default function FiberIndexPage() {
  const states = listStates();
  const totalCities = LOCATIONS.length;
  const homes = LOCATIONS.reduce((sum, location) => sum + totalHomes(location), 0);
  const topCities = [...LOCATIONS].sort((a, b) => totalHomes(b) - totalHomes(a)).slice(0, TOP_CITIES);

  return (
    <main className="min-h-screen">
      <section className="hero-gradient bg-grid-white relative overflow-hidden py-16 md:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white">Fiber internet, city by city.</h1>
            <p className="mt-5 text-xl leading-relaxed text-blue-100/85">
              {formatHomes(homes)} homes across {totalCities} cities in {states.length} states show fiber live or available on our map.
              Pick your city, then check your exact address — we shop every provider for the best offer.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-treatment-rhythm py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-white">Biggest fiber footprints</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topCities.map((location) => (
              <li key={`${location.stateSlug}-${location.slug}`}>
                <Link href={locationPath(location)} className="bg-card card-premium block rounded-xl p-4">
                  <p className="font-bold text-gray-900">
                    {location.city}, {location.state}
                  </p>
                  <p className="text-sm text-gray-500">{formatHomes(totalHomes(location))} homes</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-treatment-emphasis py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-white">Browse by state</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((summary) => (
              <li key={summary.stateSlug}>
                <Link href={`/fiber/${summary.stateSlug}`} className="bg-card card-premium flex items-center justify-between rounded-xl p-4">
                  <span className="font-bold text-gray-900">{summary.stateName}</span>
                  <span className="text-sm text-gray-500">
                    {summary.cities.length} {summary.cities.length === 1 ? "city" : "cities"} · {formatHomes(summary.homes)} homes
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-blue-200/70">
            Counts come from our serviceability map and are refreshed regularly. Availability is confirmed for your exact address on your call.
          </p>
        </div>
      </section>
    </main>
  );
}
