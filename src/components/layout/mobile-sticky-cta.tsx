"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MobileStickyCtA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const hasScrolled = window.scrollY > 300
      setIsVisible(hasScrolled && !isDismissed)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-white dark:bg-gray-900 border-t border-border shadow-lg pb-safe pt-3 px-4">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <Link href="/check-availability" className="flex-1">
            <Button className="w-full bg-red-600 text-white hover:bg-red-700">
              Check Availability
            </Button>
          </Link>
          <button
            onClick={handleDismiss}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
