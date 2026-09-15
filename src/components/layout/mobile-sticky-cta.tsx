"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Pages whose main content IS the form: a sticky "go to the form" bar would only cover the submit button.
const FORM_PAGES = ["/check-availability", "/rep/"]

export function MobileStickyCtA() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const isFormPage = FORM_PAGES.some((page) => pathname.startsWith(page))

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isFormPage) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-background border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.1)] pb-safe pt-3 pb-4 px-4">
        <div className="flex flex-col items-center gap-1.5 max-w-7xl mx-auto">
          <p className="text-xs text-muted-foreground font-medium">Find the best internet offer at your address</p>
          <Link href="/check-availability" className="w-full">
            <Button className="w-full bg-fiber-blue text-white hover:bg-fiber-blue/90 min-h-[48px] text-base font-semibold glow-blue">
              Find my offer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
