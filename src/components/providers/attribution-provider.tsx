"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { getRepAttribution, setRepAttribution, resolveRepAttribution } from "@/lib/attribution"

type AttributionContextValue = {
  repSlug: string | undefined
}

const AttributionContext = createContext<AttributionContextValue>({ repSlug: undefined })

export function useAttribution() {
  return useContext(AttributionContext)
}

export function AttributionProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [repSlug, setRepSlug] = useState<string | undefined>(undefined)

  useEffect(() => {
    const urlRep = searchParams.get("rep")
    const resolved = resolveRepAttribution(undefined, urlRep)

    // If URL has rep param, always update the cookie
    if (urlRep) {
      setRepAttribution(urlRep)
    }

    // If no URL param but cookie exists, use cookie
    if (!resolved) {
      const cookie = getRepAttribution()
      if (cookie) {
        setRepSlug(cookie)
        return
      }
    }

    setRepSlug(resolved)
  }, [searchParams])

  return (
    <AttributionContext.Provider value={{ repSlug }}>
      {children}
    </AttributionContext.Provider>
  )
}
