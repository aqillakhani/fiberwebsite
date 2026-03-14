# Design Patterns & Color Usage

## Tailwind CSS Color Tokens

The fiber website uses a custom color palette defined in the Tailwind configuration. These tokens are consistently applied across all components.

### Primary Color System

| Token | Hex Value | Usage | Components |
|-------|-----------|-------|-----------|
| `fiber-teal` | `#38b6ff` | Primary interactive elements, badges, highlights | Header logo, rep badge, fiber bars, icon accents, hover states |
| `fiber-blue` | `#0066cc` | Secondary accent, links, alternative actions | Hero glow effects, gradient starts, link hover states |
| `fiber-success` | `#10b981` | Success indicators, positive validation | Social proof pulse indicator, reliability "Excellent" label |
| `red-600` | (Tailwind default) | Primary CTA buttons, error states | Check Availability buttons, critical alerts |
| `red-700` | (Tailwind default) | CTA hover states | Button hover backgrounds |
| `amber-400` | (Tailwind default) | Secondary/warning states | Cable internet comparison bars, secondary tier indicators |
| `red-400` | (Tailwind default) | Tertiary tier indicators | DSL comparison bars, low-performance warnings |

### Color Application Patterns

**Primary CTAs:**
```tsx
// Check Availability buttons
className="bg-red-600 hover:bg-red-700 text-white"
// Shadow enhancement for depth
className="shadow-lg shadow-red-600/30"
```

**Accent Highlights:**
```tsx
// Fiber tier indicators and icons
className="text-fiber-teal"
className="bg-fiber-teal/10 text-fiber-teal"  // Soft background variant
```

**Comparison Tiers:**
- DSL: `bg-red-400/50` (low performance)
- Cable: `bg-amber-400/50` (medium performance)
- Fiber: `bg-fiber-blue` or `bg-gradient-to-r from-fiber-blue to-fiber-teal` (premium)

**Dark Mode Support:**
- Components use semantic color names from theme (e.g., `text-foreground`, `bg-card`, `border-border`)
- Background sections use explicit white/dark classes: `bg-white dark:bg-gray-900`
- Ensures accessibility and readability across light/dark themes

---

## Animation Patterns

### Intersection Observer Pattern

All visible section animations use the `useIntersectionObserver` hook for scroll-triggered animations. This pattern:
1. Detects when element enters viewport
2. Triggers staggered animations with precise timing
3. Improves perceived performance (animations only when visible)

**Hook Usage:**
```tsx
const { ref, isVisible } = useIntersectionObserver()

return (
  <section ref={ref} className="...">
    {/* Content triggers animations based on isVisible state */}
  </section>
)
```

### Staggered Animation Timing

Elements within a collection animate sequentially using array index:

```tsx
{items.map((item, i) => (
  <div
    style={{ transitionDelay: isVisible ? `${i * 100}ms` : "0ms" }}
    className={cn(
      "transition-all duration-700",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    )}
  >
    {/* Content */}
  </div>
))}
```

**Timing Values by Component:**
- Speed visualization cards: `i * 100ms` (100ms increments, 5 cards = 400ms total stagger)
- Why Fiber comparison cards: `i * 150ms` (150ms increments, 3 cards = 300ms total stagger)
- Hero content blocks: Fixed `delay-100`, `delay-200`, `delay-300` (100ms, 200ms, 300ms)

### Standard Transition Classes

**Duration:**
- `duration-700` - Standard section reveals (opacity, position)
- `duration-1000` - Progress bars filling (width animations)
- `duration-1200` - Slower, emphasis animations (hero speed bars)

**Easing:**
- `ease-out` - Progress bars and fills (default cubic-bezier(0.4, 0, 0.2, 1))
- No explicit easing specified - uses Tailwind defaults

**Transform Patterns:**

| Pattern | Usage | Animation |
|---------|-------|-----------|
| `translate-y-6` → `translate-y-0` | Vertical slide from below | Content entering viewport |
| `scale-95` → `scale-100` | Zoom from smaller | Card entering (hero speed card) |
| `translate-x-6` → `translate-x-0` | Horizontal slide from right | List items in sequences |
| `opacity-0` → `opacity-100` | Fade in | All reveal animations |

**Special Effects:**
- Hero glow orb: `hero-glow-orb` class (pulsing radial gradient)
- Speed bars: `hero-elite-bar` class (enhanced visual emphasis)
- Fiber streaks: `fiber-streak` animated divs (diagonal lines in background)
- Glow shadows: `shadow-[0_0_8px_rgba(56,182,255,0.4)]` (cyan glow on max-speed bar)

---

## Responsive Grid System

### Mobile-First Progression Pattern

Components follow a consistent responsive progression:

```tsx
// Example: Why Fiber Section
grid grid-cols-1          // Mobile: 1 column
md:grid-cols-3            // Tablet+: 3 columns
gap-6                     // Spacing between items
```

**Common Breakpoint Patterns:**

| Pattern | Mobile | Tablet (md:) | Desktop (lg:) |
|---------|--------|--------------|---------------|
| Single column | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-3` |
| Two column | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-2` |
| Three column | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-3` |
| Two by Two | `grid-cols-2` | `md:grid-cols-2` | `md:grid-cols-4` |
| Full width then side | `flex flex-col` | `md:grid-cols-[1fr_1fr]` | Same as md |

### Padding & Spacing Standards

```tsx
// Container padding
px-4 sm:px-6 lg:px-8        // Horizontal padding scales with screen
py-16 md:py-24 lg:py-40     // Vertical padding scales for sections

// Gap spacing
gap-4, gap-6, gap-8, gap-12 // Spacing between grid items/flex children
```

### Max-Width Containers

```tsx
// Standard page container
max-w-7xl mx-auto            // ~1280px max width, centered
px-4 sm:px-6 lg:px-8         // Responsive horizontal padding
```

---

## Component State Variations

### Hover & Interaction States

**Card Hover:**
```tsx
className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
```

**Button Hover:**
```tsx
// CTA buttons
className="bg-red-600 hover:bg-red-700"

// Secondary buttons
className="bg-white hover:bg-gray-100"
```

**Link Hover:**
```tsx
// Teal links
className="text-fiber-teal hover:text-fiber-teal/80 transition-colors"

// Text links
className="text-muted-foreground hover:text-foreground transition-colors"
```

### Disabled States

Components use opacity and pointer-events for disabled state:
```tsx
className="opacity-50 pointer-events-none"
```

### Loading States

Animated counters and progress bars indicate loading:
- Counters animate from 0 to target value over 1200-1500ms
- Progress bars animate width from 0% to target over 1000-1200ms

---

## Typography Hierarchy

### Heading Classes

| Class | Size | Usage | Examples |
|-------|------|-------|----------|
| `heading-display` | 4xl-7xl | Page titles, hero headlines | Hero h1, page introductions |
| `heading-section` | 2xl-3xl | Section titles | "Why Fiber Beats Everything Else" |
| `text-xl` | 1.25rem | Large body text, intro paragraphs | Hero subheading |
| `text-lg` | 1.125rem | Regular body, section descriptions | Card descriptions |
| `text-sm` | 0.875rem | Labels, captions, small text | Metric labels, timestamps |
| `text-xs` | 0.75rem | Tiny text, badges | Badge text, footnotes |

### Font Weight Standards

```tsx
// Semantic weight usage
font-extrabold      // Hero titles
font-bold           // Section headers, card titles, important text
font-semibold       // Labels, emphasis
font-medium         // Body text emphasis
(default weight)    // Regular body text
```

### Text Color Semantics

```tsx
text-foreground           // Primary text (dark mode aware)
text-muted-foreground     // Secondary, de-emphasized text
text-white/90             // High-contrast on dark backgrounds
text-black                // Explicit black for light backgrounds
text-fiber-teal           // Accent/link color
```

---

## Theme Support (Dark Mode)

### Light/Dark Pattern

Components use semantic color tokens that adapt to theme:

```tsx
// Good: Theme-aware
className="bg-white dark:bg-gray-900 border-border text-foreground"

// Avoid: Hard-coded colors for theme-dependent content
className="bg-white"  // Breaks in dark mode
```

### Explicit Theme Control

```tsx
// Header scroll state handles explicit colors
isScrolled ? "bg-background/95" : "bg-background"

// Mobile CTA uses semantic colors
className="bg-white dark:bg-gray-900"
```

### Theme Toggle Integration

Components use Next Themes (`useTheme` hook) for dark mode toggle:
- Automatically loads saved user preference
- Provides `theme` state and `setTheme` function
- Prevents flash of unstyled content (FOUC) via `mounted` state check

---

## Accessibility Patterns

### Color Contrast

- All text colors meet WCAG AA standards (4.5:1 minimum for normal text)
- Fiber-teal (#38b6ff) on white background: Sufficient contrast
- Red-600 on white background: Sufficient contrast
- Dark text on light backgrounds: All compliant

### Focus States

Buttons and interactive elements include focus outlines:
```tsx
// Implicit via Button component
className="focus:outline-none focus:ring-2 focus:ring-fiber-teal"
```

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Links use `<a>` or Next `<Link>` component
- Buttons use `<button>` or Button component
- Form inputs are properly labeled

### Screen Reader Support

```tsx
<span className="sr-only">Toggle theme</span>  // Hidden visually, read by SR
aria-label="Close"                              // Descriptive labels for icon buttons
```

---

## Special Visual Effects

### Gradient Effects

**Fiber bars (premium tier):**
```tsx
className="bg-gradient-to-r from-fiber-blue to-fiber-teal"
```

**Hero background:**
```tsx
className="hero-gradient bg-grid-white"  // Custom gradient + grid overlay
```

### Shadow & Depth

```tsx
// Card shadows
shadow-lg              // Standard card elevation
shadow-xl              // Emphasized on hover

// Glow effects
shadow-[0_0_8px_rgba(56,182,255,0.4)]  // Cyan glow on speed bars
shadow-lg shadow-red-600/30              // Red glow on CTAs
```

### Backdrop & Blur

```tsx
// Translucent headers
backdrop-blur-md       // Frosted glass effect when scrolled
bg-background/95       // Slight transparency

// Badge backgrounds
bg-fiber-teal/10       // Very subtle background with strong text
```

