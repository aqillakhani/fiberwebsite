# Clean Multi-Color Rebrand Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebrand FiberFastUSA from dark reddish-black to a clean, white-based, premium multi-color system with real logo and rep photos.

**Architecture:** Update CSS variables in globals.css to light-based palette, replace Zap icon with real logo SVG component, copy rep photos to public/, remove terms page and social links, then update all 30+ component files to use new color tokens.

**Tech Stack:** Next.js 15, Tailwind CSS v4, CSS custom properties, SVG logo component

---

## Task 1: Copy assets to public/
- Copy logo PNG to `public/logo.png`
- Copy 7 rep photos to `public/reps/[slug].jpeg`

## Task 2: Rewrite globals.css color system
- Replace all `:root` and `.dark` variables with clean light-based palette
- Update all utility classes (gradients, glows, treatments) to use new colors
- Remove wave patterns from body

## Task 3: Create logo SVG component
- Build `src/components/ui/logo.tsx` matching the uploaded logo style
- Replace ZapIcon in header.tsx and footer.tsx

## Task 4: Update TEAM_MEMBERS with image paths
- Add `image?: string` field to TeamMember type
- Add image paths for 7 reps with photos

## Task 5: Remove terms page and social links
- Delete `src/app/terms/page.tsx`
- Remove social links from footer.tsx
- Remove terms from FOOTER_LINKS in constants.ts
- Remove socialLinks from layout.tsx schema
- Remove from sitemap

## Task 6: Update all components to new color tokens
- Replace fiber-red with fiber-blue/fiber-teal/fiber-red per context
- Update section backgrounds to light treatments
- Fix all dark: prefix issues for light-first design

## Task 7: Update rep display components to show photos
- Update meet-the-team section to use real photos
- Update rep/[slug] page to show photo
- Fallback to initial-letter avatar when no photo

## Task 8: Build, verify, deploy
