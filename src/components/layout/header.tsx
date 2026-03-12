"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ZapIcon, MenuIcon, SunIcon, MoonIcon } from "lucide-react"

import { COMPANY, NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-[var(--fiber-orange)] transition-colors"
          >
            <ZapIcon
              className="size-5"
              style={{ color: "var(--fiber-orange)" }}
            />
            {COMPANY.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
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

            {/* Desktop Get Started Button */}
            <Link href="/get-started" className="hidden lg:block">
              <Button
                className="bg-[var(--fiber-orange)] text-white hover:bg-[var(--fiber-orange)]/90"
              >
                Get Started
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
                        style={{ color: "var(--fiber-orange)" }}
                      />
                      <span className="font-bold">{COMPANY.name}</span>
                    </div>
                  </SheetHeader>

                  <nav className="flex flex-col gap-2 py-4">
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
                    <Link href="/get-started" className="w-full">
                      <Button
                        className="w-full bg-[var(--fiber-orange)] text-white hover:bg-[var(--fiber-orange)]/90"
                      >
                        Get Started
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
