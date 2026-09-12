import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCtA } from "@/components/layout/mobile-sticky-cta";
import { RepBanner } from "@/components/layout/rep-banner";

/** Public site chrome. Door mode (/door/:slug) lives outside this group and renders logo-only. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <RepBanner />
      {children}
      <Footer />
      <MobileStickyCtA />
    </>
  );
}
