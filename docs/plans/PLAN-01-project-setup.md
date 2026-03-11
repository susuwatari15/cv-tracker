# PLAN-01 — Project Setup

**Depends on:** Nothing (start here)  
**Output:** Working Next.js 15 project that builds with `next build`

---

## Step 1 — Scaffold Next.js 15

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

> Run inside `/Users/tcx/code/ta-assistant` (workspace root).  
> Answer "Yes" when asked to initialize in existing directory.

---

## Step 2 — Install Dependencies

```bash
# shadcn/ui CLI (init first if not done)
npx shadcn@latest init

# Add modern-minimal theme
pnpm dlx shadcn@latest add @ss-themes/modern-minimal

# Core packages
pnpm install zustand @hookform/resolvers react-hook-form zod date-fns

# shadcn components needed across the app
npx shadcn@latest add button input textarea select label badge separator toast sonner
```

When prompted by `shadcn init`:

- Style: **Default**
- Base color: **Stone**
- CSS variables: **Yes**

> The `@ss-themes/modern-minimal` theme will add its own CSS variables. See Step 5 for the full theme CSS.

---

## Step 3 — Configure Tailwind Custom Colors (TA Assistant overrides)

Edit `tailwind.config.ts` — add custom color tokens under `theme.extend.colors` for TA Assistant–specific usage (sidebar, output boxes, etc.):

```ts
colors: {
  canvas: {
    DEFAULT: '#f7f4ef',
    2: '#eee9e0',
  },
  surface: '#ffffff',
  border: {
    default: '#e0d8cc',
    strong: '#cec4b4',
  },
  ink: {
    DEFAULT: '#1a1714',
    2: '#6b6458',
    3: '#a09890',
  },
  accent: {
    DEFAULT: '#c4673a',
    hover: '#b55a30',
    2: '#2d6a4f',
    3: '#4a6fa5',
  },
  amber: '#d4a017',
}
```

---

## Step 4 — Configure Fonts (next/font/google)

In `src/app/layout.tsx`, load the three fonts used in the HTML:

```ts
import { Fraunces, Epilogue, DM_Mono } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});
```

Apply all three CSS variables to `<html>` tag. Set `font-family` default to `--font-epilogue` in global CSS.

---

## Step 5 — Global CSS (modern-minimal theme)

Copy the `@ss-themes/modern-minimal` theme CSS into `src/app/globals.css`. Replace or merge with the default `@tailwind` directives. Full theme variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.32 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.32 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.32 0 0);
    --primary: oklch(0.62 0.19 259.76);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.45 0.03 257.68);
    --muted: oklch(0.98 0 0);
    --muted-foreground: oklch(0.55 0.02 264.41);
    --accent: oklch(0.95 0.03 233.56);
    --accent-foreground: oklch(0.38 0.14 265.59);
    --destructive: oklch(0.64 0.21 25.39);
    --border: oklch(0.93 0.01 261.82);
    --input: oklch(0.93 0.01 261.82);
    --ring: oklch(0.62 0.19 259.76);
    --chart-1: oklch(0.62 0.19 259.76);
    --chart-2: oklch(0.55 0.22 262.96);
    --chart-3: oklch(0.49 0.22 264.43);
    --chart-4: oklch(0.42 0.18 265.55);
    --chart-5: oklch(0.38 0.14 265.59);
    --sidebar: oklch(0.98 0 0);
    --sidebar-foreground: oklch(0.14 0 0);
    --sidebar-primary: oklch(0.2 0 0);
    --sidebar-primary-foreground: oklch(0.98 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.2 0 0);
    --sidebar-border: oklch(0.92 0 0);
    --sidebar-ring: oklch(0.71 0 0);

    --font-sans:
      "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
    --font-serif: Source Serif 4, serif;
    --font-mono: JetBrains Mono, monospace;

    --radius: 0.375rem;

    --shadow-2xs: 0 1px 3px 0px oklch(0 0 0 / 0.05);
    --shadow-xs: 0 1px 3px 0px oklch(0 0 0 / 0.05);
    --shadow-sm:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1);
    --shadow:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1);
    --shadow-md:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 2px 4px -1px oklch(0 0 0 / 0.1);
    --shadow-lg:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 4px 6px -1px oklch(0 0 0 / 0.1);
    --shadow-xl:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 8px 10px -1px oklch(0 0 0 / 0.1);
    --shadow-2xl: 0 1px 3px 0px oklch(0 0 0 / 0.25);
  }

  .dark {
    --background: oklch(0.2 0 0);
    --foreground: oklch(0.92 0 0);
    --card: oklch(0.27 0 0);
    --card-foreground: oklch(0.92 0 0);
    --popover: oklch(0.27 0 0);
    --popover-foreground: oklch(0.92 0 0);
    --primary: oklch(0.62 0.19 259.76);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.27 0 0);
    --secondary-foreground: oklch(0.92 0 0);
    --muted: oklch(0.27 0 0);
    --muted-foreground: oklch(0.72 0 0);
    --accent: oklch(0.38 0.14 265.59);
    --accent-foreground: oklch(0.88 0.06 254.63);
    --destructive: oklch(0.64 0.21 25.39);
    --border: oklch(0.37 0 0);
    --input: oklch(0.37 0 0);
    --ring: oklch(0.62 0.19 259.76);
    --chart-1: oklch(0.71 0.14 254.69);
    --chart-2: oklch(0.62 0.19 259.76);
    --chart-3: oklch(0.55 0.22 262.96);
    --chart-4: oklch(0.49 0.22 264.43);
    --chart-5: oklch(0.42 0.18 265.55);
    --sidebar: oklch(0.21 0.01 285.56);
    --sidebar-foreground: oklch(0.99 0 0);
    --sidebar-primary: oklch(0.49 0.24 264.41);
    --sidebar-primary-foreground: oklch(0.99 0 0);
    --sidebar-accent: oklch(0.27 0.01 285.81);
    --sidebar-accent-foreground: oklch(0.99 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.55 0.02 285.76);

    --shadow-2xs: 0 1px 3px 0px oklch(0 0 0 / 0.05);
    --shadow-xs: 0 1px 3px 0px oklch(0 0 0 / 0.05);
    --shadow-sm:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1);
    --shadow:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1);
    --shadow-md:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 2px 4px -1px oklch(0 0 0 / 0.1);
    --shadow-lg:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 4px 6px -1px oklch(0 0 0 / 0.1);
    --shadow-xl:
      0 1px 3px 0px oklch(0 0 0 / 0.1), 0 8px 10px -1px oklch(0 0 0 / 0.1);
    --shadow-2xl: 0 1px 3px 0px oklch(0 0 0 / 0.25);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
```

**TA Assistant overrides** — add after the theme block for BRD design tokens: body background `#f7f4ef`, scrollbar styling, noise texture overlay. Override `--font-sans`, `--font-serif`, `--font-mono` in `:root` if using Fraunces/Epilogue/DM Mono (see Step 4).

---

## Step 6 — Environment Variables

Create `.env.local` at project root:

```
ANTHROPIC_API_KEY=
```

> Leave empty for local dev (user will enter key in UI).  
> On Vercel, set `ANTHROPIC_API_KEY` in project settings → Environment Variables.

Create `.env.example`:

```
ANTHROPIC_API_KEY=your_key_here
```

---

## Step 7 — Create Directory Structure

Run these `mkdir` commands to pre-create all directories from the overview:

```bash
mkdir -p src/app/api/claude
mkdir -p src/components/ui
mkdir -p src/components/shared
mkdir -p src/features/settings/{components,containers,types}
mkdir -p src/features/chat/{components,containers,types}
mkdir -p src/features/cv-parser/{components,containers,types}
mkdir -p src/features/jd-writer/{components,containers,types}
mkdir -p src/features/email-writer/{components,containers,types}
mkdir -p src/features/cv-eval/{components,containers,types}
mkdir -p src/features/candidate-summary/{components,containers,types}
mkdir -p src/features/salary-benchmark/{components,containers,types}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/services
mkdir -p src/stores
mkdir -p src/types
```

---

## Step 8 — Shared Types Scaffold

Create `src/types/index.ts` with:

```ts
export type ToolId =
  | "chat"
  | "cv-parser"
  | "jd-writer"
  | "email-writer"
  | "cv-eval"
  | "candidate-summary"
  | "salary-benchmark"
  | "settings";

export interface ToolMeta {
  id: ToolId;
  label: string;
  icon: string;
  description: string;
  group: "core" | "content" | "config";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ClaudeRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  system?: string;
  maxTokens?: number;
}

export interface ClaudeResponse {
  text: string;
}
```

---

## Verification Checklist

- [ ] `pnpm run dev` starts without errors
- [ ] `pnpm run build` completes without errors
- [ ] `http://localhost:3000` loads a blank page (Next.js default)
- [ ] Tailwind custom colors resolve (test with a simple colored div)
- [ ] Fonts load correctly in browser DevTools → Network → Fonts
- [ ] `.env.local` is gitignored (check `.gitignore`)
