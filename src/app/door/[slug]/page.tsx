import type { Metadata } from "next";
import { notFound } from "next/navigation";

import DoorModeView from "@/components/rep/door-mode-view";
import { getAllRepSlugs, getRepBySlug } from "@/lib/reps";

interface DoorPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Check fiber at this address | FiberFastUSA",
  robots: { index: false, follow: false },
};

export async function generateStaticParams() {
  const slugs = await getAllRepSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Canvasser door mode — reached from the QR badge via /r/:slug (middleware sets the rep cookies). */
export default async function DoorPage({ params }: DoorPageProps) {
  const { slug } = await params;
  const rep = await getRepBySlug(slug);
  if (!rep) notFound();
  return <DoorModeView rep={rep} />;
}
