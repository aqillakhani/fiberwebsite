# Component Inventory Reference

Complete catalog of all components, their structure, props, and usage patterns.

## Section Components (Interactive, "use client")

### SpeedVisualization
**File**: `src/components/sections/speed-visualization.tsx`
**Purpose**: Animated speed comparison visualization with 5 internet speed tiers
**Type**: Client component ("use client" directive)

#### Data Structure
```typescript
interface SpeedItem {
  label: string              // e.g., "DSL", "Cable", "FiberFast Gig 7"
  speed: number              // Speed value (e.g., 25, 700, 7000)
  unit: string               // "Mbps" or "Gbps"
  color: string              // Tailwind class (e.g., "bg-red-400/50", "bg-fiber-blue")
  width: string              // Percentage width (e.g., "0.36%", "100%")
  isFiber: boolean           // True for fiber options
  multiplier?: string        // Optional badge text (e.g., "10x faster than cable")
}
```

#### Key Features
- 5 predefined speed tiers: DSL (25 Mbps), Cable (700 Mbps), FiberFast 500, FiberFast Gig 1, FiberFast Gig 7
- Scroll-triggered animations using `useIntersectionObserver` hook
- Staggered animation delays: `${i * 100}ms` per item
- Width animation duration: 1000ms (ease-out)
- Overall section fade-in: 700ms duration

#### Animation Behavior
- Bars animate from 0% to target width
- Fiber bars have shadow glow: `shadow-[0_0_8px_rgba(56,182,255,0.4)]` for top tier
- Multiplier badge appears with conditional visibility
- Height variation: Fiber bars use 100% height, non-fiber use 66% with 2px top margin

#### Color Scheme
| Speed Type | Color Class | Opacity | Glow |
|------------|------------|---------|------|
| DSL | bg-red-400/50 | 50% | None |
| Cable | bg-amber-400/50 | 50% | None |
| FiberFast 500 | bg-fiber-blue | - | None |
| FiberFast Gig 1 | bg-fiber-teal | - | None |
| FiberFast Gig 7 | bg-gradient-to-r from-fiber-blue to-fiber-teal | - | 8px cyan glow |

#### Responsive Behavior
- Section: Full width with white background (`bg-white white-section`)
- Container: `max-w-3xl mx-auto` with padding
- Stacked layout: Space between items `space-y-5`

---

### HeroSection
**File**: `src/components/sections/hero.tsx`
**Purpose**: Landing page hero with animated counter, dual-column layout, speed comparison preview
**Type**: Client component ("use client" directive)
**Props**: None (standalone component)

#### Subcomponent: AnimatedCounter
```typescript
interface AnimatedCounterProps {
  target: number           // Target number to count to (e.g., 7 for 7 Gbps)
  duration?: number        // Animation duration in ms (default: 1500)
}
```
- 40 animation steps over duration
- Incremental counting: `Math.round(current)` at each step
- Starts after 300ms delay

#### Key Features
- Animated fiber streaks in background (3 layers)
- Pulsing radial glow effect (hero-glow-orb class) behind speed card
- Staggered fade-in animations:
  - Heading: Delay 0ms
  - Description text: Delay 100ms
  - CTA buttons: Delay 200ms
  - Social proof badge: Delay 300ms
  - Speed card: Delay 200ms (scale animation: 95% to 100%)

#### Layout Structure
**Grid**: `md:grid-cols-[1fr_1fr]` with `gap-8 lg:gap-12`
- **Left side**: Heading, description, CTA buttons, social proof badge
- **Right side**: Speed comparison card (white bg, rounded, shadow, hover:scale-[1.02])

#### Speed Comparison Card Contents
**Layout**: `grid grid-cols-2 gap-2` for each technology

| Category | Tower/Satellite | Copper Cable | Fiber Optic |
|----------|------------------|--------------|-------------|
| Download | 25 Mbps (8% width) | 700 Mbps (30% width) | 7,000 Mbps (100% width) |
| Upload | 3 Mbps (4% width) | 10 Mbps (5% width) | 7,000 Mbps (100% width) |
| Bar Color | bg-red-400 | bg-amber-400 | bg-gradient-to-r from-fiber-blue to-fiber-teal |
| Bar Height | h-2 | h-2 | h-2.5 |
| Label Color | text-gray-500 | text-gray-500 | text-fiber-teal |

#### CTA Button Specifications
**Primary Button (Check Availability)**
- Class: `bg-red-600 hover:bg-red-700 text-white`
- Size: `min-h-[52px]` responsive padding
- Shadow: `shadow-lg shadow-red-600/30`
- Icon: ArrowRight from lucide-react

**Secondary Button (View Plans)**
- Class: `bg-white text-black hover:bg-gray-100`
- Size: `min-h-[52px]` responsive padding
- Font: `font-bold`

#### Social Proof Badge
- Green pulse indicator: `w-2 h-2 bg-green-500 rounded-full pulse-green`
- Text: "Serving 50+ cities nationwide"
- Styling: `px-4 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm`

---

### WhyFiberSection
**File**: `src/components/sections/why-fiber-section.tsx`
**Purpose**: Feature comparison between DSL, Cable, and Fiber with detailed metrics
**Type**: Client component ("use client" directive)

#### Data Structure
```typescript
interface ComparisonItem {
  type: string                    // "DSL", "Cable", "Fiber"
  icon: LucideReactComponent      // Icon from lucide-react
  speed: string                   // e.g., "Up to 7 Gbps"
  latency: string                 // e.g., "<5ms"
  upload: string                  // e.g., "7 Gbps" or "Symmetric"
  reliability: string             // e.g., "Excellent"
  reliabilityColor: string        // Tailwind color class
  barWidth: string                // "w-[8%]", "w-[25%]", "w-full"
  barColor: string                // Tailwind color class
  cardClass: string               // Additional card styling
}
```

#### Comparison Cards
**Grid**: `grid grid-cols-1 md:grid-cols-3 gap-6`

| Property | DSL | Cable | Fiber |
|----------|-----|-------|-------|
| Icon background | bg-muted | bg-muted | bg-fiber-teal/10 |
| Icon color | text-muted-foreground | text-muted-foreground | text-fiber-teal |
| Speed | Up to 25 Mbps | Up to 700 Mbps | Up to 7 Gbps |
| Latency | 30-60ms | 15-30ms | <5ms |
| Upload | 3 Mbps | 20 Mbps | 7 Gbps |
| Reliability | Poor | Fair | Excellent |
| Reliability Color | text-red-400 | text-amber-400 | text-fiber-success |
| Bar Width | w-[8%] | w-[25%] | w-full |
| Bar Color | bg-red-400/60 | bg-amber-400/60 | bg-gradient-to-r from-fiber-blue to-fiber-teal |
| Card Class | border-border | border-border | gradient-border border-2 scale-[1.02] shadow-lg |
| Badge | None | None | "Best" badge (fiber-teal/10 bg) |

#### Stats Grid
**Layout**: `grid grid-cols-2 md:grid-cols-4 gap-4`
- **Speed**: Zap icon, value "Up to 7 Gbps"
- **Latency**: Clock icon, value "<5ms"
- **Upload**: Upload icon, value "Symmetric"
- **Reliability**: Shield icon, value "99.9% uptime"

#### Animation Pattern
- Section fade-in: 700ms duration
- Staggered card delays: `${i * 150}ms` (slower than speed visualization)
- Bar width animation: 1000ms duration
- Intersection observer triggers animations on scroll

---

## Layout Components

### Header
**File**: `src/components/layout/header.tsx`
**Purpose**: Sticky navigation header with mobile menu, dark mode toggle, rep attribution
**Type**: Client component ("use client" directive)
**Dependencies**: useTheme, useAttribution

#### Responsive Behavior
- **Sticky**: `sticky top-0 z-40`
- **Scroll detection**: Changes styling when `window.scrollY > 0`
  - Scrolled state: `py-2 backdrop-blur-md border-b border-border bg-background/95`
  - Top state: `py-4 border-b border-transparent bg-background`

#### Layout Sections
**Flex layout**: `flex items-center justify-between`

1. **Logo** (Left)
   - Zap icon: `color: var(--fiber-teal)`
   - Text: COMPANY.name
   - Hover: `text-[var(--fiber-teal)]` transition

2. **Rep Attribution Badge** (Center, hidden on mobile)
   - Visibility: `hidden sm:inline-flex`
   - Green dot: `w-1.5 h-1.5 bg-fiber-success rounded-full`
   - Text: "Working with [First Name]"
   - Link: `/rep/${repSlug}`
   - Styling: `bg-fiber-teal/10 text-fiber-teal px-3 py-1 rounded-full`
   - Hover: `bg-fiber-teal/20`

3. **Desktop Navigation** (Center-right, hidden on mobile)
   - Visibility: `hidden lg:flex items-center gap-1`
   - Check Availability link: `text-[var(--fiber-teal)] hover:text-[var(--fiber-teal)]/80`
   - Other nav links: `text-muted-foreground hover:text-foreground`
   - Links from NAV_LINKS constant

4. **Right Section** (Right)
   - Dark mode toggle: `Button variant="ghost" size="icon-sm"` (Moon/Sun icons)
   - Desktop CTA: `hidden lg:block` (red-600 button, Check Availability)
   - Mobile menu: `lg:hidden` (Sheet component)

#### Mobile Menu (Sheet Component)
- **Trigger**: Hamburger icon (MenuIcon, 24px)
- **Width**: `w-full sm:w-80`
- **Content**:
  - Header: Logo + COMPANY.name
  - Navigation: Full link list from NAV_LINKS
  - Footer: CTA buttons + phone number
  - Button styles: red-600 (Check Availability), white (View Plans)

#### Color Scheme
| Element | Color | State |
|---------|-------|-------|
| Logo icon | var(--fiber-teal) | - |
| Check Availability link | var(--fiber-teal) | hover: /80 opacity |
| Dark mode button | muted-foreground | hover: foreground |
| Primary CTA | bg-red-600 | hover: bg-red-700 |

---

### Footer
**File**: `src/components/layout/footer.tsx`
**Purpose**: Footer with company info, organized navigation, social media links
**Type**: Server component (async, no "use client")
**Dependencies**: COMPANY, FOOTER_LINKS constants

#### Layout Structure
**Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`

#### Four Columns
1. **Company Section**
   - Logo + COMPANY.name
   - Tagline/description
   - Phone number (link to COMPANY.phoneHref)
   - Email (link to COMPANY.email)

2. **Company Links**
   - Header: "Company"
   - Links from FOOTER_LINKS.company array
   - Example: About, Careers, Contact
   - Link styling: `text-muted-foreground hover:text-foreground`

3. **Services Links**
   - Header: "Services"
   - Links from FOOTER_LINKS.services array
   - Link styling: `text-muted-foreground hover:text-foreground`

4. **Support Links**
   - Header: "Support"
   - Links from FOOTER_LINKS.support array
   - Link styling: `text-muted-foreground hover:text-foreground`

#### Bottom Section
- **Copyright**: `© ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.`
- **Social media icons** (with links):
  - Facebook (target="_blank", rel="noopener noreferrer")
  - Twitter
  - Instagram
  - LinkedIn
  - Icon color: `text-fiber-teal hover:text-fiber-teal/80`

---

### MobileStickyCtA
**File**: `src/components/layout/mobile-sticky-cta.tsx`
**Purpose**: Fixed bottom CTA bar appearing on scroll on mobile devices
**Type**: Client component ("use client" directive)

#### Visibility Logic
- Appears when: `window.scrollY > 300px` AND `!isDismissed`
- Dismissible: X button to set `isDismissed = true`
- Dismissal persists: Checked on scroll events

#### Styling
- **Position**: `fixed bottom-0 left-0 right-0 z-50 lg:hidden`
- **Background**: `bg-white dark:bg-gray-900`
- **Border**: `border-t border-border`
- **Shadow**: `shadow-lg`
- **Safe area**: `pb-safe` for notched devices, `pt-3 px-4`
- **Transition**: `translate-y-0 opacity-100` (visible) or `translate-y-full opacity-0 pointer-events-none` (hidden)

#### Button Content
- **CTA Button**: Red background (`bg-red-600 hover:bg-red-700`), full width
- **Close button**: X icon (XIcon from lucide-react), `p-2`
- **Layout**: Flex with gap-2, button flex-1, close button p-2

