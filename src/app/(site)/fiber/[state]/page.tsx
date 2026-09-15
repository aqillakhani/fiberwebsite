import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findState, formatHomes, listStates, locationPath, providerName, totalHomes } from "@/lib/locations";

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return listStates().map((summary) => ({ state: summary.stateSlug }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const summary = findState((await params).state);
  if (!summary) return {};
  return {
    title: `Fiber Internet in ${summary.stateName} — ${summary.cities.length} Cities | FiberFastUSA`,
    description: `${formatHomes(summary.homes)} homes in ${summary.stateName} show fiber live or available. Find your city, check your address, and get the best promo from every provider.`,
    alternates: { canonical: `/fiber/${summary.stateSlug}` },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const summary = findState((await params).state);
  if (!summary) notFound();
  const providers = [...new Set(summary.cities.flatMap((city) => city.providers.map((provider) => provider.id)))];

  return (
    <main className="min-h-screen">
      <section className="hero-gradient bg-grid-white relative overflow-hidden py-16 md:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-fiber-sky">
            <Link href="/fiber" className="hover:underline">All states</Link> / {summary.state}
          </p>
          <h1 className="heading-display mt-3 text-white">Fiber internet in {summary.stateName}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-blue-100/85">
            {formatHomes(summary.homes)} homes across {summary.cities.length} {summary.cities.length === 1 ? "city" : "cities"} show fiber
            live or available from {providers.map(providerName).join(", ")}. Pick your city to check your address.
          </p>
        </div>
      </section>

      <section className="bg-treatment-emphasis py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.cities.map((location) => (
              <li key={location.slug}>
                <Link href={locationPath(location)} className="bg-card card-premium block rounded-xl p-4">
                  <p className="font-bold text-gray-900">{location.city}</p>
                  <p className="text-sm text-gray-500">
                    {formatHomes(totalHomes(location))} homes · {location.providers.map((provider) => providerName(provider.id)).join(", ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
