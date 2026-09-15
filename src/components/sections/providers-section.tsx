import Link from "next/link";
import { ArrowRight, Wifi } from "lucide-react";

import { PROVIDERS } from "@/data/providers";

/** Home page: we shop almost every provider; the address decides which ones apply, so no prices are shown. */
export default function ProvidersSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">One request. Almost every provider.</h2>
          <p className="mt-3 text-lg text-gray-600">
            Prices and promos change by address and by month, so we do not publish a price list. Tell us what you want and a
            specialist shops every provider at your address for the best promo and the lowest price.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDERS.map((provider) => (
            <li key={provider.id} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
              <Wifi className="mt-0.5 size-5 shrink-0 text-fiber-blue" aria-hidden />
              <div>
                <p className="font-bold text-gray-900">{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.where}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-gray-500">
          Availability depends on your exact address. Provider names are trademarks of their owners.
        </p>
        <div className="mt-8 text-center">
          <Link href="/check-availability" className="inline-flex items-center gap-2 font-semibold text-fiber-blue hover:underline">
            Find my best offer <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
