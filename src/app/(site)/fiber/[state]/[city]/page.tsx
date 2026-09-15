import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, PhoneCall } from "lucide-react";

import { LanguageToggle } from "@/components/lead/language-toggle";
import { LeadForm } from "@/components/lead/lead-form";
import { CLOSER_SLA_MINUTES } from "@/components/lead/serviceability-copy";
import { PROVIDERS } from "@/data/providers";
import { COMPANY } from "@/lib/constants";
import {
  findLocation, formatHomes, LOCATIONS, locationPath, nearbyLocations, providerName, totalHomes, type Location, type LocationProvider,
} from "@/lib/locations";

interface CityPageProps {
  params: Promise<{ state: string; city: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com";

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ state: location.stateSlug, city: location.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { state, city } = await params;
  const location = findLocation(state, city);
  if (!location) return {};
  const providers = location.providers.map((provider) => providerName(provider.id)).join(", ");
  return {
    title: `Fiber Internet in ${location.city}, ${location.state} — ${providers} | FiberFastUSA`,
    description: `${formatHomes(totalHomes(location))} homes in ${location.city}, ${location.state} show fiber ${location.verifiedLiveHomes > 0 ? "live" : "available"} (${providers}). Check your address and a specialist finds the best promo and price for you.`,
    alternates: { canonical: locationPath(location) },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { state, city } = await params;
  const location = findLocation(state, city);
  if (!location) notFound();
  const homes = totalHomes(location);
  const isVerified = location.verifiedLiveHomes > 0;
  const nearby = nearbyLocations(location);

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(location)) }} />

      <section className="hero-gradient bg-grid-white relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:items-start md:py-20 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-fiber-sky">
              <Link href="/fiber" className="hover:underline">Fiber</Link> /{" "}
              <Link href={`/fiber/${location.stateSlug}`} className="hover:underline">{location.stateName}</Link> / {location.city}
            </p>
            <h1 className="heading-display mt-3 text-4xl text-white sm:text-5xl">
              Fiber internet in {location.city}, <span className="text-fiber-sky">{location.state}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100/90">{footprintSentence(location)}</p>
            <ul className="mt-6 space-y-3 text-sm text-blue-50">
              {location.providers.map((provider) => (
                <li key={provider.id} className="flex items-start gap-3">
                  {provider.verified ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-fiber-success" aria-hidden />
                  ) : (
                    <Clock className="mt-0.5 size-5 shrink-0 text-fiber-sky" aria-hidden />
                  )}
                  <span>{providerSentence(provider)}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <PhoneCall className="mt-0.5 size-5 shrink-0 text-fiber-sky" aria-hidden />
                <span>A fiber specialist calls within ~{CLOSER_SLA_MINUTES} min and shops every provider at your address for the best promo.</span>
              </li>
            </ul>
            <p className="mt-6 text-xs text-blue-200/70">
              ZIP codes on our map: {location.zips.join(", ")}. Counts are homes on our serviceability map, not a guarantee for every address.
            </p>
          </div>

          <div id="check" className="bg-card scroll-mt-24 rounded-2xl border border-white/15 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Check your {location.city} address</h2>
                <p className="mb-4 text-sm text-gray-500">Free, takes about a minute. No payment online.</p>
              </div>
              <LanguageToggle />
            </div>
            <LeadForm source={`location-${location.stateSlug}-${location.slug}`} />
          </div>
        </div>
      </section>

      <section className="bg-treatment-emphasis py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-white">Providers on the map in {location.city}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {location.providers.map((provider) => {
              const logo = PROVIDERS.find((known) => known.id === provider.id)?.logo;
              return (
                <li key={provider.id} className="bg-card flex items-center gap-4 rounded-xl p-4">
                  {logo && <Image src={logo} alt={providerName(provider.id)} width={120} height={40} unoptimized className="h-auto max-h-10 w-auto max-w-[110px] object-contain" />}
                  <div>
                    <p className="font-bold text-gray-900">{providerName(provider.id)}</p>
                    <p className="text-sm text-gray-500">{providerSentence(provider, false)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-blue-200/70">
            We also shop AT&amp;T Fiber, Spectrum, Xfinity, T-Mobile and other providers that may serve {location.city} but are not on our map yet.
            Provider names and logos are trademarks of their owners; FiberFastUSA is an independent sales partner.
          </p>
        </div>
      </section>

      <section className="bg-treatment-rhythm py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="heading-section text-white">{location.city} fiber questions</h2>
          <dl className="mt-8 space-y-6">
            {faq(location, isVerified).map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-white">{item.q}</dt>
                <dd className="mt-1 text-blue-100/85">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="bg-treatment-emphasis py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="heading-section text-white">More fiber cities in {location.stateName}</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {nearby.map((other) => (
                <li key={other.slug}>
                  <Link href={locationPath(other)} className="bg-card card-premium block rounded-xl p-4">
                    <p className="font-bold text-gray-900">{other.city}</p>
                    <p className="text-sm text-gray-500">{formatHomes(totalHomes(other))} homes</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link href={`/fiber/${location.stateSlug}`} className="font-semibold text-fiber-sky hover:underline">
                All {location.stateName} cities →
              </Link>
            </p>
          </div>
        </section>
      )}
    </main>
  );

  function footprintSentence(loc: Location): string {
    if (loc.verifiedLiveHomes > 0 && loc.availablePerRecordsHomes > 0) {
      return `${formatHomes(loc.verifiedLiveHomes)} homes are verified live on our map and ${formatHomes(loc.availablePerRecordsHomes)} more show fiber available per provider records. Type your address to see which providers reach your home — we find you the best promo.`;
    }
    if (loc.verifiedLiveHomes > 0) {
      return `${formatHomes(loc.verifiedLiveHomes)} homes in ${loc.city} are verified live on our fiber map${loc.comingSoonHomes > 0 ? `, with ${formatHomes(loc.comingSoonHomes)} more coming soon` : ""}. Type your address to see which providers reach your home — we find you the best promo.`;
    }
    return `Provider records show fiber available to ${formatHomes(homes)} homes in ${loc.city}. Type your address and we confirm which providers reach your home and find you the best promo.`;
  }
}

function providerSentence(provider: LocationProvider, withName = true): string {
  const prefix = withName ? `${providerName(provider.id)}: ` : "";
  const soon = provider.comingSoon > 0 ? ` (+${formatHomes(provider.comingSoon)} coming soon)` : "";
  return provider.verified
    ? `${prefix}${formatHomes(provider.homes)} homes verified live${soon}`
    : `${prefix}fiber available to ${formatHomes(provider.homes)} homes per provider records${soon}`;
}

function faq(location: Location, isVerified: boolean): { q: string; a: string }[] {
  const providers = location.providers.map((provider) => providerName(provider.id)).join(" and ");
  return [
    {
      q: `Is fiber internet available at my address in ${location.city}?`,
      a: isVerified
        ? `Our map has verified ${formatHomes(location.verifiedLiveHomes)} live fiber homes in ${location.city} from ${providers}. Fiber is built street by street, so type your exact address above — the answer is instant.`
        : `Provider records show ${providers} fiber available to ${formatHomes(totalHomes(location))} homes in ${location.city}. Fiber is built street by street, so type your exact address above and a specialist confirms it on your call.`,
    },
    {
      q: `How much does fiber cost in ${location.city}, ${location.state}?`,
      a: "Prices and promos change by address and by month, so we do not publish a price list. Tell us the speed you want and a specialist shops every provider at your address for the lowest price and the best promo — free install, no contract and unlimited data where offered.",
    },
    {
      q: "What happens after I check my address?",
      a: `A fiber specialist calls you within about ${CLOSER_SLA_MINUTES} minutes from ${COMPANY.phone}, reads you the best offer, and if you like it places the order and books your installation. Nothing to pay online.`,
    },
  ];
}

function jsonLd(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Fiber internet in ${location.city}, ${location.state}`,
    serviceType: "Fiber internet sales and availability check",
    provider: { "@type": "Organization", name: "FiberFastUSA", url: SITE_URL, telephone: COMPANY.phone },
    areaServed: { "@type": "City", name: location.city, containedInPlace: { "@type": "State", name: location.stateName } },
    url: `${SITE_URL}${locationPath(location)}`,
  };
}
