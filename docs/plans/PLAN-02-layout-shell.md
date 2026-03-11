# PLAN-02 — Layout & Shell

**Depends on:** PLAN-01  
**Output:** 3-column layout rendered on screen with working sidebar navigation

---

## What to Build

Replicate the HTML's `.shell` → `.sidebar` + `.main` layout, but extended to 3 columns:

```
┌─ Sidebar (280px) ─┬─ Content Area (flex:1) ─┬─ AI Chat Panel (360px) ─┐
│                   │                          │                          │
└───────────────────┴──────────────────────────┴──────────────────────────┘
```

All three columns are full viewport height. Each scrolls independently.  
Sidebar hidden at ≤720px.

---

## Files to Create

### `src/app/layout.tsx`

Root layout — applies fonts, metadata, and wraps with Toaster provider.

```tsx
import type { Metadata } from "next";
import { Fraunces, Epilogue, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// font declarations (see PLAN-01)

export const metadata: Metadata = {
  title: "Hue's TA Assistant",
  description: "AI-Powered Talent Acquisition Toolkit — Masan Group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${fraunces.variable} ${epilogue.variable} ${dmMono.variable}`}
    >
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
```

---

### `src/app/page.tsx`

Simply renders the `AppShell` (client component boundary):

```tsx
import AppShell from "@/components/shared/AppShell";

export default function Home() {
  return <AppShell />;
}
```

---

### `src/components/shared/AppShell.tsx`

**Client component.** Top-level layout container. Renders 3 columns.

```tsx
"use client";

import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import AIChatPanel from "./AIChatPanel";

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ContentArea />
      <AIChatPanel />
    </div>
  );
}
```

---

### `src/components/shared/Sidebar.tsx`

**Client component.**

Structure (top to bottom):

1. Brand header (logo icon `✦`, "TA Assistant", subtitle)
2. API key input row with status dot
3. Navigation items grouped by section
4. Profile chip at bottom

Props: none (reads from Zustand stores)

Key behaviors:

- Active tool highlighted with accent background/border (from `toolStore`)
- Clicking nav item calls `toolStore.setActiveTool(id)`
- API key input reads/writes `apiKeyStore`
- Hidden on mobile: `className="hidden md:flex"` (breakpoint at 720px → use `min-[720px]:flex`)

```tsx
"use client";

const TOOL_GROUPS = [
  {
    label: "Công cụ chính",
    tools: [
      { id: "chat", icon: "💬", label: "Trợ lý AI" },
      { id: "cv-parser", icon: "📄", label: "CV Parser" },
      { id: "jd-writer", icon: "📝", label: "Soạn JD" },
      { id: "email-writer", icon: "📧", label: "Viết Email UV" },
      { id: "cv-eval", icon: "🔍", label: "Đánh giá CV vs JD" },
    ],
  },
  {
    label: "Nội dung",
    tools: [
      { id: "candidate-summary", icon: "📋", label: "Tóm tắt Candidate" },
      { id: "salary-benchmark", icon: "💰", label: "Salary Benchmark" },
    ],
  },
  {
    label: "Cài đặt",
    tools: [{ id: "settings", icon: "⚙️", label: "Settings" }],
  },
];
```

Sidebar width: `w-[280px] min-w-[280px] shrink-0`  
Background: `bg-ink` (the near-black `#1a1714`)

---

### `src/components/shared/ContentArea.tsx`

**Client component.**

Reads `activeTool` from `toolStore` and renders the correct tool container.

Structure:

1. `ToolHeader` (fixed at top — not scrolling)
2. Scrollable tool body area

```tsx
"use client";

import { useToolStore } from "@/stores/toolStore";
import ToolHeader from "./ToolHeader";
import CvParserContainer from "@/features/cv-parser/containers/CvParserContainer";
// ... other containers

const TOOL_MAP = {
  "cv-parser": <CvParserContainer />,
  "jd-writer": <JdWriterContainer />,
  // etc.
  settings: <SettingsContainer />,
};

export default function ContentArea() {
  const activeTool = useToolStore((s) => s.activeTool);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-canvas">
      <ToolHeader />
      <div className="flex-1 overflow-y-auto p-7 md:p-8">
        {TOOL_MAP[activeTool] ?? null}
      </div>
    </div>
  );
}
```

Note: The `chat` tool is **not** rendered here — it lives in Column 3 (`AIChatPanel`).  
If `activeTool === 'chat'`, ContentArea can show a placeholder or the chat-related prompts.

---

### `src/components/shared/AIChatPanel.tsx`

**Client component.** Always visible. Fixed 400px width.

```tsx
"use client";

import ChatContainer from "@/features/chat/containers/ChatContainer";

export default function AIChatPanel() {
  return (
    <div className="w-[400px] min-w-[400px] shrink-0 flex flex-col border-l border-border-default bg-surface overflow-hidden">
      <ChatContainer />
    </div>
  );
}
```

---

### `src/components/shared/ToolHeader.tsx`

Displays the active tool's title, description, and Claude model badge.

```tsx
"use client";

import { useToolStore } from "@/stores/toolStore";

const TOOL_META = {
  "cv-parser": {
    title: "CV Parser",
    desc: "Upload PDF/ảnh CV → AI extract thông tin → copy vào Excel",
  },
  "jd-writer": {
    title: "Soạn JD",
    desc: "Tạo Job Description chuẩn cho tech roles",
  },
  "email-writer": {
    title: "Viết Email Ứng Viên",
    desc: "Mời PV, reject, offer — bán tự động, cá nhân hóa",
  },
  "cv-eval": {
    title: "Đánh giá CV vs JD",
    desc: "Phân tích mức độ phù hợp của ứng viên với vị trí",
  },
  "candidate-summary": {
    title: "Tóm tắt Candidate",
    desc: "Tóm tắt profile cho hiring manager",
  },
  "salary-benchmark": {
    title: "Salary Benchmark",
    desc: "Tư vấn mức lương thị trường tech VN 2024-2025",
  },
  settings: {
    title: "Settings",
    desc: "Cấu hình API key và Business Context cho từng công cụ",
  },
  chat: {
    title: "Trợ lý AI",
    desc: "Chat tự do — hỏi bất cứ điều gì liên quan đến công việc TA",
  },
};
```

Layout: `flex items-center justify-between px-8 py-5 border-b border-border-default bg-surface shrink-0`

---

## Responsive Behavior

| Breakpoint | Sidebar         | Content    | Chat Panel               |
| ---------- | --------------- | ---------- | ------------------------ |
| `>720px`   | Visible (280px) | flex:1     | Visible (360px)          |
| `≤720px`   | Hidden          | Full width | Full width below content |

Use Tailwind's `min-[720px]:flex hidden` on Sidebar.

---

## Verification Checklist

- [ ] 3 columns render side by side at >720px
- [ ] Sidebar is hidden at ≤720px
- [ ] Clicking each nav item updates the content area title
- [ ] Chat panel is always visible (even when another tool is active)
- [ ] Each column scrolls independently (test by adding lots of content)
- [ ] Brand header renders correctly with `font-fraunces` serif font
