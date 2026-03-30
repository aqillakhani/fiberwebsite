"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ZapIcon, MenuIcon, SunIcon, MoonIcon } from "lucide-react"

import { COMPANY, NAV_LINKS, TEAM_MEMBERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAttribution } from "@/components/providers/attribution-provider"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { repSlug } = useAttribution()

  // Resolve rep name from slug
  const repMember = repSlug ? TEAM_MEMBERS.find((m) => m.slug === repSlug) : null
  const repDisplayName = repMember ? repMember.name.split(" ")[0] : null

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "py-2 backdrop-blur-md border-b border-border bg-background/95"
          : "py-4 border-b border-transparent bg-background"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-[var(--fiber-red)] transition-colors"
          >
            <ZapIcon
              className="size-5"
              style={{ color: "var(--fiber-red)" }}
            />
            {COMPANY.name}
          </Link>

          {/* Rep Attribution Badge */}
          {repDisplayName && repSlug && (
            <Link
              href={`/rep/${repSlug}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fiber-accent/10 text-fiber-accent text-xs font-medium hover:bg-fiber-accent/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-fiber-success rounded-full" />
              Working with {repDisplayName}
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/check-availability"
              className="px-3 py-2 text-sm font-medium text-[var(--fiber-red)] hover:text-[var(--fiber-red)]/80 transition-colors"
            >
              Check Availability
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Dark mode toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="lg:flex"
              >
                {theme === "dark" ? (
                  <SunIcon className="size-4" />
                ) : (
                  <MoonIcon className="size-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Desktop CTA Button */}
            <Link href="/check-availability" className="hidden lg:block">
              <Button
                className="bg-fiber-red text-white hover:bg-fiber-red/90"
              >
                Check Availability
              </Button>
            </Link>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={<Button variant="ghost" size="icon-sm" />}
                >
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Open menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80">
                  <SheetHeader>
                    <div className="flex items-center gap-2">
                      <ZapIcon
                        className="size-5"
                        style={{ color: "var(--fiber-red)" }}
                      />
                      <span className="font-bold">{COMPANY.name}</span>
                    </div>
                  </SheetHeader>

                  <nav className="flex flex-col gap-2 py-4">
                    <Link
                      href="/check-availability"
                      className="px-3 py-2 text-sm font-medium text-[var(--fiber-red)] hover:text-[var(--fiber-red)]/80 transition-colors"
                    >
                      Check Availability
                    </Link>
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <SheetFooter className="flex flex-col gap-3">
                    <Link href="/check-availability" className="w-full">
                      <Button
                        className="w-full bg-fiber-red text-white hover:bg-fiber-red/90"
                      >
                        Check Availability
                      </Button>
                    </Link>
                    <Link href="/pricing" className="w-full">
                      <Button
                        className="w-full bg-white dark:bg-card text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted border border-border dark:border-border font-bold"
                      >
                        View Plans
                      </Button>
                    </Link>
                    <a
                      href={COMPANY.phoneHref}
                      className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {COMPANY.phone}
                    </a>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
