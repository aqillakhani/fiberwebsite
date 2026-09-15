"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

/** One tap flips the form between English and Spanish; the choice sticks for a year (cookie). */
export function LanguageToggle({ className }: { className?: string }) {
  const { language, copy, setLanguage } = useLanguage();
  const next = language === "en" ? "es" : "en";
  return (
    <button
      type="button"
      lang={next}
      onClick={() => setLanguage(next)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      <Languages className="size-3.5" aria-hidden />
      {copy.toggleLabel}
    </button>
  );
}
