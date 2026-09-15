"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { parseCookieHeader } from "@/lib/attribution-cookies";
import { isLanguage, LANGUAGE_COOKIE, LANGUAGE_MAX_AGE_SECONDS, LEAD_COPY, type Language, type LeadCopy } from "@/lib/i18n/lead-copy";

interface LanguageContextValue {
  language: Language;
  copy: LeadCopy;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ language: "en", copy: LEAD_COPY.en, setLanguage: () => undefined });

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/**
 * Language for the lead form and door page. English is server-rendered; the `ffusa_lang` cookie
 * (set by middleware from `?lang=es` or by the toggle) switches to Spanish after mount.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = parseCookieHeader(document.cookie)[LANGUAGE_COOKIE];
    if (isLanguage(stored)) setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${LANGUAGE_MAX_AGE_SECONDS}; samesite=lax`;
    setLanguageState(next);
  }, []);

  return <LanguageContext.Provider value={{ language, copy: LEAD_COPY[language], setLanguage }}>{children}</LanguageContext.Provider>;
}
