import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-sm" },
    md: { icon: 32, text: "text-lg" },
    lg: { icon: 48, text: "text-2xl" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Globe icon with fiber streaks */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Blue circle */}
        <circle cx="24" cy="24" r="22" fill="#1E40AF" />
        {/* Fiber optic streaks - white curved lines going from bottom-left to top-right */}
        <path
          d="M10 36 C18 28, 28 18, 38 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10 32 C16 26, 24 20, 36 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M12 38 C20 30, 30 22, 40 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        {/* Small dots at the end of streaks (fiber nodes) */}
        <circle cx="38" cy="12" r="2" fill="white" />
        <circle cx="36" cy="16" r="1.5" fill="white" opacity="0.8" />
        <circle cx="40" cy="16" r="1.5" fill="white" opacity="0.8" />
      </svg>

      {showText && (
        <span className={cn("font-bold tracking-tight", s.text)}>
          <span className="text-[#1E40AF]">FiberFast</span>
          <span className="text-[#DC2626]">USA</span>
        </span>
      )}
    </div>
  )
}
