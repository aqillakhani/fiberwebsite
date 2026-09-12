"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { REP_COOKIE, REP_MODE_COOKIE, parseCookieHeader } from "@/lib/attribution-cookies";

type AttributionContextValue = {
  /** Canvasser / rep slug, e.g. "oscar-salas". Written by middleware from ?rep= or /r/:slug. */
  repSlug: string | undefined;
  /** True while a canvasser is working a shift from their QR link (ffusa_mode cookie). */
  isRepMode: boolean;
};

const AttributionContext = createContext<AttributionContextValue>({ repSlug: undefined, isRepMode: false });

export function useAttribution(): AttributionContextValue {
  return useContext(AttributionContext);
}

/**
 * Cookies are set server-side by `src/middleware.ts`; this provider only reads them after mount,
 * so it never suspends and never forces the layout into client-side rendering.
 */
export function AttributionProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<AttributionContextValue>({ repSlug: undefined, isRepMode: false });

  useEffect(() => {
    const cookies = parseCookieHeader(document.cookie);
    setValue({ repSlug: cookies[REP_COOKIE] || undefined, isRepMode: cookies[REP_MODE_COOKIE] === "1" });
  }, []);

  return <AttributionContext.Provider value={value}>{children}</AttributionContext.Provider>;
}
