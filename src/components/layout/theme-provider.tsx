"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import type { ThemeProviderProps as NextThemesThemeProviderProps } from "next-themes"

interface ThemeProviderProps extends Omit<NextThemesThemeProviderProps, 'children'> {
  children: ReactNode
}

export function ThemeProviderComponent({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  )
}
