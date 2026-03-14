"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MobileStickyCtA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-border shadow-[0_-4px_16px_rgba(0,0,0,0.1)] pb-safe pt-3 pb-4 px-4">
        <div className="flex flex-col items-center gap-1.5 max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 font-medium">Check if fiber is available</p>
          <Link href="/check-availability" className="w-full">
            <Button className="w-full bg-red-600 text-white hover:bg-red-700 min-h-[48px] text-base font-semibold">
              See If You Qualify
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
