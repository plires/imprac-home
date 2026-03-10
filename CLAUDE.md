# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run ESLint
```

No test framework is configured in this project.

## Architecture

This is a Next.js App Router application serving a B2B SPC vinyl flooring catalog (products in Spanish) targeting architects, builders, and interior designers.

**State management lives in `app/page.tsx`** — it's the central hub that holds filter state (`tono`, `ambiente`, `veta`), selected product state, and sheet open/close state. All data flows down via props. There is no global state manager.

**Product data is hardcoded** in `lib/products.ts` as a typed array — no API calls. The `Product` interface defines the shape with Spanish-language fields (e.g., `nombre_comercial`, `tono`, `ambiente`, `intensidad_veta`).

**Filtering is computed with `useMemo`** in `app/page.tsx`, derived from the three filter values and the full products array.

**Component flow:**
- `FilterBar` → emits filter changes up to `page.tsx`
- `ProductGrid` → receives filtered products, emits product selection
- `ProductDetail` → rendered as a Sheet (side drawer) with the selected product; contains `BudgetCalculator` and triggers `QuoteForm`

**UI layer:** shadcn/ui components in `components/ui/` (57 components, do not modify — treat as a library). Custom app components live directly in `components/`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. Design tokens are CSS custom properties in `app/globals.css` using OKLch color space with light/dark mode variants. The `cn()` utility from `lib/utils.ts` merges Tailwind classes.

**Next.js config** disables image optimization (`unoptimized: true`) and ignores TypeScript build errors (`ignoreBuildErrors: true`).
