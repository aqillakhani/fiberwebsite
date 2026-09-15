import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PROVIDERS } from "@/data/providers";

/** Home page: we shop almost every provider; the address decides which ones apply, so no prices are shown. */
export default function ProvidersSection() {
  return (
    <section className="w-full bg-treatment-emphasis py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="heading-section text-white">One request. Almost every provider.</h2>
          <p className="mt-3 text-lg text-blue-100/85">
            Prices and promos change by address and by month, so we do not publish a price list. Tell us what you want and a
            specialist shops every provider at your address for the best promo and the lowest price.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PROVIDERS.map((provider) => (
            <li key={provider.id} className="bg-card card-premium flex flex-col items-center gap-3 rounded-xl px-4 py-5 text-center">
              <div className="flex h-12 w-full items-center justify-center">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={160}
                  height={48}
                  unoptimized
                  className="h-auto max-h-12 w-auto max-w-[150px] object-contain"
                />
              </div>
              <p className="text-xs text-gray-500">{provider.where}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-blue-200/70">
          Availability depends on your exact address. Provider names and logos are trademarks of their owners; FiberFastUSA is
          an independent sales partner.
        </p>
        <div className="mt-8 text-center">
          <Link href="/check-availability" className="inline-flex items-center gap-2 font-semibold text-fiber-sky hover:underline">
            Find my best offer <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
