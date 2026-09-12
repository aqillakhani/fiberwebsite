import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { AttributionProvider } from "@/components/providers/attribution-provider";
import { SERVICE_STATES } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FiberFastUSA | Is fiber live at your address?",
  description:
    "Type your address and get a real answer about fiber internet at your home. No contracts, no data caps, free installation. A specialist calls you back within minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Placeholders like "G-XXXX" / "0000…" must never reach production: only well-formed ids load a script.
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.match(/^G-[A-Z0-9]{6,}$/) ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.match(/^[1-9]\d{9,}$/) ? process.env.NEXT_PUBLIC_META_PIXEL_ID : undefined;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FiberFastUSA",
              url: "https://fiberfastusa.com",
              logo: "https://fiberfastusa.com/logo.png",
              description:
                "FiberFastUSA helps customers explore fiber internet options and switch to faster, more reliable service.",
              telephone: "(469) 428-5942",
              areaServed: SERVICE_STATES.map((name) => ({ "@type": "State", name })),
            }),
          }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        {pixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="font-sans">
        <AttributionProvider>{children}</AttributionProvider>
      </body>
    </html>
  );
}
