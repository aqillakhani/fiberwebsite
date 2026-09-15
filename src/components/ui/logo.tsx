import Image from "next/image"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
  /** "light" = white wordmark for navy surfaces (default); "dark" = brand-blue wordmark for white surfaces. */
  tone?: "light" | "dark"
}

// Sizes derive from the brand sheet: globe is square, wordmark is 682x100.
const SIZES = {
  sm: { globe: 28, wordmark: { width: 123, height: 18 } },
  md: { globe: 40, wordmark: { width: 164, height: 24 } },
  lg: { globe: 56, wordmark: { width: 232, height: 34 } },
} as const

const WORDMARK_SRC = { light: "/brand/wordmark-light.png", dark: "/brand/wordmark.png" } as const

/** The FiberFast USA logo from the brand sheet: globe with fiber streaks + "FiberFast" / "USA" wordmark. */
export function Logo({ className, showText = true, size = "md", tone = "light" }: LogoProps) {
  const dimensions = SIZES[size]

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src="/brand/globe.png" alt="" width={dimensions.globe} height={dimensions.globe} priority className="shrink-0" />
      {showText && (
        <Image
          src={WORDMARK_SRC[tone]}
          alt="FiberFast USA"
          width={dimensions.wordmark.width}
          height={dimensions.wordmark.height}
          priority
          className="shrink-0"
        />
      )}
      {!showText && <span className="sr-only">FiberFast USA</span>}
    </span>
  )
}
