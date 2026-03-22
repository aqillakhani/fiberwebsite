import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProviderComponent } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStickyCtA } from "@/components/layout/mobile-sticky-cta";
import { RepBanner } from "@/components/layout/rep-banner";
import { Suspense } from "react";
import { AttributionProvider } from "@/components/providers/attribution-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FiberFastUSA | Fiber Internet That Actually Works",
  description:
    "Experience blazing-fast fiber internet with FiberFastUSA. Gigabit speeds, no data caps, no contracts. Check availability in your area today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" suppressHydrationWarning>
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
              sameAs: [
                "https://facebook.com/fiberfastusa",
                "https://x.com/fiberfastusa",
                "https://instagram.com/fiberfastusa",
                "https://linkedin.com/company/fiberfastusa",
              ],
              areaServed: {
                "@type": "Country",
                name: "United States",
              },
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
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProviderComponent attribute="class" defaultTheme="system" enableSystem>
          <Suspense>
            <AttributionProvider>
              <Header />
              <RepBanner />
              {children}
              <Footer />
              <MobileStickyCtA />
            </AttributionProvider>
          </Suspense>
        </ThemeProviderComponent>
      </body>
    </html>
  );
}
