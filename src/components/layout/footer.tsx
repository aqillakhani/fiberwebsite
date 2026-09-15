import Link from "next/link"
import { Logo } from "@/components/ui/logo"

import { COMPANY, FOOTER_LINKS } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="mb-4 inline-flex transition-opacity hover:opacity-80">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {COMPANY.tagline}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={COMPANY.phoneHref}
                className="hover:text-foreground transition-colors"
              >
                {COMPANY.phone}
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.services.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.support.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {COMPANY.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
