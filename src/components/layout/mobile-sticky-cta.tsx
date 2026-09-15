"use client"

import { useEffect, useState, type FormEvent } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

// Pages whose main content IS the form: a sticky bar would only cover the submit button.
const FORM_PAGES = ["/check-availability", "/rep/"]
const SHOW_AFTER_SCROLL_PX = 300
const MIN_ADDRESS_LENGTH = 8

/**
 * Mobile-only sticky bar that takes the address right there, then lands on /check-availability with the
 * address already being checked — one tap instead of scrolling back up to the form.
 */
export function MobileStickyCtA() {
  const pathname = usePathname()
  const router = useRouter()
  const { copy } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [address, setAddress] = useState("")
  const isFormPage = FORM_PAGES.some((page) => pathname.startsWith(page))
  const canSubmit = address.trim().length >= MIN_ADDRESS_LENGTH

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_PX)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isFormPage) return null

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    router.push(`/check-availability?address=${encodeURIComponent(address.trim())}#check`)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-background border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-safe px-4 pt-3 pb-4"
        aria-label={copy.address.label}
      >
        <div className="mx-auto flex max-w-7xl gap-2">
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={copy.address.placeholder}
            aria-label={copy.address.label}
            autoComplete="street-address"
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fiber-sky"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label={copy.address.check}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1 rounded-lg bg-fiber-blue px-4 font-semibold text-white glow-blue disabled:opacity-50"
          >
            {copy.address.check}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  )
}
