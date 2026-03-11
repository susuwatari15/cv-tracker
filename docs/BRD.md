# Business Requirements Document (BRD)

## TA Assistant — AI-Powered Talent Acquisition Toolkit

**Document Version:** 1.2  
**Date:** March 2026  
**Author:** Hue Nguyen, TA Manager · Technology Transformation  
**Organization:** Masan Group  
**Status:** Updated — 3-Column Layout Design Added

---

## 1. Executive Summary

TA Assistant is a personal AI-powered web application designed to streamline the end-to-end Talent Acquisition workflow for the Technology Transformation team at Masan Group. Built as a single-page HTML application, it integrates directly with Anthropic's Claude API to give the TA Manager an intelligent toolkit that handles recurring, time-intensive tasks — from writing Job Descriptions and drafting candidate emails to parsing CVs and advising on market salary benchmarks.

A **Settings panel** allows the user to configure the API key and customize the Business Context that is injected into each tool's AI prompt, enabling the assistant's output to stay aligned with the user's organization, team context, and personal profile even as those details evolve over time. All settings are persisted in `localStorage`.

The application uses a **3-column layout**: a fixed sidebar for navigation, a central content area for tool forms and structured outputs, and a persistent AI Chat panel on the right — always accessible regardless of which tool is active in the center column.

---

## 2. Business Context

### 2.1 Background

Recruiting for tech roles (Data Engineering, Software Engineering, Cloud/Infrastructure, Security, ERP) is highly repetitive in its documentation work. TA professionals at Masan Group spend significant time crafting JDs, writing personalized emails, reviewing CVs against requirements, and preparing candidate summaries for hiring managers. These tasks, while critical, are largely templatable and AI-augmentable.

### 2.2 Business Driver

- **Reduce time-on-task** for common TA documents and communications
- **Improve output quality and consistency** across all candidate-facing content
- **Enable one TA manager** to handle the throughput equivalent of a larger team
- **Maintain brand and tone** — semi-formal, human, and tech-savvy — across all communications

### 2.3 Target User

| Attribute  | Detail                                                              |
| ---------- | ------------------------------------------------------------------- |
| Name       | Hue Nguyen                                                          |
| Role       | Talent Acquisition Manager — Technology Transformation              |
| Company    | Masan Group (entities: Masan Tech, Masan Consumer, etc.)            |
| Domain     | Tech Hiring: Data, Software Engineering, Cloud/Infra, Security, ERP |
| Experience | 10+ years in TA, including 10 years at VNG Corporation              |
| Work Style | IC, hands-on, data-driven                                           |
| Language   | Vietnamese (primary), English (tech terminology)                    |

---

## 3. Scope

### 3.1 In Scope

- AI Chat assistant for free-form TA-related queries
- Automated Job Description (JD) generation for tech roles
- Candidate email drafting (multiple email types)
- CV parsing from PDF and image files
- CV vs JD fit evaluation and scoring
- Candidate summary generation for hiring managers
- Market salary benchmarking for Vietnam tech roles
- **Settings panel** for API key management and per-tool Business Context configuration

### 3.2 Out of Scope

- Applicant Tracking System (ATS) integration
- Multi-user / team collaboration features
- Candidate database or long-term data persistence
- Interview scheduling automation
- Analytics and reporting dashboards
- Mobile-native application

---

## 4. UI Layout & Information Architecture

### 4.1 3-Column Layout Overview

The application shell is divided into three persistent columns rendered side by side at full viewport height. No column causes the page to scroll vertically at the document level — each column manages its own internal scroll independently.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TA Assistant                                 │
├──────────────┬──────────────────────────────┬───────────────────────┤
│              │                              │                       │
│   SIDEBAR    │       CONTENT AREA           │     AI CHAT PANEL     │
│  (fixed)     │    (tool-specific forms      │   (always visible,    │
│              │     & structured output)     │    persistent chat)   │
│  280px       │       flex: 1                │      360px            │
│              │                              │                       │
│  Navigation  │  Tool Header                 │  Chat messages        │
│  API key     │  ─────────────               │  ───────────────      │
│  Profile     │  Form inputs                 │  Scrollable history   │
│              │                              │                       │
│              │  Output area                 │  Quick prompts        │
│              │                              │  Input textarea       │
│              │                              │  Send button          │
└──────────────┴──────────────────────────────┴───────────────────────┘
```

### 4.2 Column 1 — Sidebar

| Property   | Detail                                           |
| ---------- | ------------------------------------------------ |
| Width      | Fixed at 280px                                   |
| Background | Dark (near-black ink color `#1a1714`)            |
| Overflow   | Internal vertical scroll for navigation items    |
| Visibility | Hidden on viewports narrower than 720px (mobile) |

**Sidebar Sections (top to bottom):**

1. **Brand Header** — Application logo icon, name ("TA Assistant"), and organization subtitle ("Masan Group · Tech Hiring")
2. **API Key Row** — Password input with a live status dot (gray / green / red) indicating key validity
3. **Navigation** — Grouped list of tools; clicking a tool activates it in the Content Area. Groups:
   - _Công cụ chính:_ Trợ lý AI, CV Parser, Soạn JD, Viết Email UV, Đánh giá CV vs JD
   - _Nội dung:_ Tóm tắt Candidate, Salary Benchmark
   - _Cài đặt:_ Settings
4. **Profile Chip** — Avatar, user name ("Hue Nguyen"), and role ("TA Manager · Tech") pinned at the bottom

### 4.3 Column 2 — Content Area

| Property   | Detail                                                                            |
| ---------- | --------------------------------------------------------------------------------- |
| Width      | Flexible (`flex: 1`), fills all remaining space between Sidebar and AI Chat Panel |
| Background | Warm off-white (`#f7f4ef`)                                                        |
| Overflow   | Internal vertical scroll                                                          |
| Structure  | Tool Header (fixed at top) + Tool Body (scrollable)                               |

**Content Area Sub-sections:**

1. **Tool Header** — Displays the active tool's title and a short description. A token/model badge ("Claude Sonnet 4 · API") is pinned to the right. This bar is always visible and does not scroll with the tool body.
2. **Tool Body** — The working area for the active tool. Only one tool body is visible at a time. Contains:
   - Form inputs (text fields, selects, textareas, file upload zones)
   - Action button (Run / Generate / Parse)
   - Output area (animated result card with copy / clear actions)

**Active tool in Content Area changes** based on the sidebar navigation selection. The AI Chat tool is **not** shown in the Content Area — it lives permanently in Column 3.

### 4.4 Column 3 — AI Chat Panel

| Property   | Detail                                                                                 |
| ---------- | -------------------------------------------------------------------------------------- |
| Width      | Fixed at 360px                                                                         |
| Background | White surface with border separator on the left                                        |
| Overflow   | Chat message list scrolls internally                                                   |
| Visibility | Always present regardless of which tool is active in Column 2                          |
| Purpose    | Provides instant free-form AI assistance without navigating away from the current tool |

**AI Chat Panel Sub-sections (top to bottom):**

1. **Panel Header** — Title ("Trợ lý AI") and brief description, consistent with the tool header style
2. **Message List** — Scrollable conversation thread. Each message shows:
   - Avatar (✦ for assistant, initials for user)
   - Chat bubble with markdown-rendered content
   - User messages aligned right; assistant messages aligned left
3. **Thinking Indicator** — Three animated dots displayed while waiting for API response
4. **Quick Prompts** — A row of clickable pill chips that pre-fill the input with common TA tasks
5. **Input Row** — Auto-resizing textarea + Send button. `Enter` sends; `Shift+Enter` inserts a newline

**Relationship between Column 2 and Column 3:**

The AI Chat panel in Column 3 is context-aware and complements Column 2. For example:

- While working on a JD form in Column 2, the user can simultaneously ask the AI in Column 3 for inspiration or clarification
- The chat maintains its full conversation history across tool switches in Column 2
- The AI Chat tool entry in the sidebar navigation scrolls Column 3 into focus on mobile (where columns collapse)

### 4.5 Layout Behavior & Responsiveness

| Breakpoint          | Behavior                                                                          |
| ------------------- | --------------------------------------------------------------------------------- |
| `> 720px` (desktop) | Full 3-column layout. All columns visible simultaneously                          |
| `≤ 720px` (mobile)  | Sidebar hidden. Content Area and AI Chat Panel stack or Column 2 takes full width |

**Column sizing rules:**

- Sidebar: `width: 280px; min-width: 280px; flex-shrink: 0`
- AI Chat Panel: `width: 360px; min-width: 360px; flex-shrink: 0`
- Content Area: `flex: 1` — absorbs all remaining horizontal space

**Scroll isolation:** Each column manages its own scroll container. Scrolling in the Content Area does not affect the Chat Panel and vice versa.

---

## 5. Functional Requirements

### 5.1 Tool Navigation

| ID     | Requirement                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NAV-01 | The application shall render a 3-column layout: Sidebar (Column 1), Content Area (Column 2), AI Chat Panel (Column 3) — see §4 for full layout specification |
| NAV-02 | The sidebar shall provide persistent navigation listing all available tools                                                                                  |
| NAV-03 | The active tool shall be visually highlighted in the sidebar navigation                                                                                      |
| NAV-04 | Selecting a tool in the sidebar shall update the Content Area (Column 2); the AI Chat Panel (Column 3) shall remain unchanged                                |
| NAV-05 | Each tool shall display its name and a short description in the Content Area tool header when selected                                                       |
| NAV-06 | Navigation shall group tools into logical sections: **Công cụ chính** (Core Tools) and **Nội dung** (Content)                                                |
| NAV-07 | A **Settings** entry shall appear in the sidebar navigation, accessible at all times                                                                         |

### 5.2 API Key Management

| ID     | Requirement                                                                                                                         |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| API-01 | The user shall be able to input their Anthropic API key via a password field in the sidebar                                         |
| API-02 | The API key shall be persisted in `localStorage` so it survives page reloads                                                        |
| API-03 | A visual status indicator (dot) shall reflect the key validation state: neutral (empty), green (valid format), red (invalid format) |
| API-04 | All action buttons across all tools shall be disabled until a valid API key is present                                              |
| API-05 | Key validation shall check for the `sk-ant-` prefix as a minimum format check                                                       |
| API-06 | The API key shall also be editable from within the Settings panel (see §5.10)                                                       |

### 5.3 AI Chat (Trợ lý AI)

| ID      | Requirement                                                                                                                                                                        |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CHAT-01 | The AI Chat shall be rendered permanently in Column 3 (the right-hand panel) and shall remain visible and interactive at all times, regardless of which tool is active in Column 2 |
| CHAT-02 | The user shall be able to send free-form text messages to the AI assistant                                                                                                         |
| CHAT-03 | The assistant shall respond in Vietnamese, in a semi-formal and friendly tone                                                                                                      |
| CHAT-04 | The chat interface shall maintain full conversation history within the session and shall not reset when the user switches tools in Column 2                                        |
| CHAT-05 | The assistant shall be contextualized as a personal TA assistant for Hue Nguyen at Masan Group, specialized in tech hiring in the Vietnam market                                   |
| CHAT-06 | A set of quick-prompt chips shall be displayed above the input to suggest common tasks                                                                                             |
| CHAT-07 | Pressing `Enter` shall send the message; `Shift+Enter` shall insert a newline                                                                                                      |
| CHAT-08 | The textarea shall auto-resize as the user types, up to a maximum height                                                                                                           |
| CHAT-09 | A "thinking" animation (three bouncing dots) shall be displayed while awaiting the API response                                                                                    |
| CHAT-10 | Assistant responses shall render basic markdown: bold, italic, inline code, headers, and unordered lists                                                                           |

**Quick Prompt Examples:**

- Soạn JD Data Engineer Senior
- Email mời phỏng vấn
- Salary range Cloud Architect HCM
- Candidate fit checklist cho ERP BA
- Template reject email thân thiện

### 5.4 CV Parser

| ID     | Requirement                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| CVP-01 | The user shall be able to upload one or more CV files simultaneously                                                            |
| CVP-02 | Supported file formats: PDF, JPG, JPEG, PNG                                                                                     |
| CVP-03 | Upload shall support both click-to-browse and drag-and-drop interactions                                                        |
| CVP-04 | Uploaded file names shall be displayed in a confirmation pill after selection                                                   |
| CVP-05 | The user shall be able to select which fields to extract using toggleable chip controls                                         |
| CVP-06 | The tool shall send each CV file to the Claude API as a base64-encoded document or image and receive a structured JSON response |
| CVP-07 | Parsed results shall be displayed as individual labeled cards in a responsive grid                                              |
| CVP-08 | The tool shall generate a tab-separated data row suitable for pasting directly into Excel                                       |
| CVP-09 | The user shall be able to copy the tab-separated data to the clipboard                                                          |
| CVP-10 | The user shall be able to download results as a UTF-8 encoded CSV file                                                          |
| CVP-11 | When parsing multiple CVs, a progress indicator shall display the current file count (e.g., "Parsing 2/5...")                   |

**Extractable Fields:**

| Field Key         | Label               |
| ----------------- | ------------------- |
| `name`            | Họ và tên           |
| `phone`           | SĐT                 |
| `email`           | Email               |
| `location`        | Địa chỉ             |
| `current_company` | Công ty hiện tại    |
| `current_title`   | Vị trí hiện tại     |
| `years_exp`       | Số năm kinh nghiệm  |
| `skills`          | Skills / Tech Stack |
| `education`       | Học vấn             |
| `expected_salary` | Lương mong muốn     |
| `summary`         | Tóm tắt nhanh       |

### 5.5 JD Writer (Soạn JD)

| ID    | Requirement                                                                                                                      |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| JD-01 | The user shall provide the job title (required), level, entity/BU, salary range, tech stack, and team context                    |
| JD-02 | Level options: Junior, Mid, Senior, Lead, Manager, Head, Director                                                                |
| JD-03 | The AI shall generate a complete JD in Vietnamese with English tech terminology                                                  |
| JD-04 | The generated JD shall follow a standard format: About Us, Role Overview, Responsibilities, Requirements, Nice-to-have, Benefits |
| JD-05 | The tone shall be semi-formal and attractive to engineers/tech talent                                                            |
| JD-06 | The JD shall highlight Masan Group culture: transformation, scale, impact                                                        |
| JD-07 | The output shall be copyable to clipboard                                                                                        |

### 5.6 Email Writer (Viết Email UV)

| ID       | Requirement                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------- |
| EMAIL-01 | The user shall select the email type from a predefined list                                         |
| EMAIL-02 | Candidate name (required) and applied position shall be provided as inputs                          |
| EMAIL-03 | The user shall select the output language: Vietnamese or English                                    |
| EMAIL-04 | An optional free-text field shall allow additional context (e.g., interview time, rejection reason) |
| EMAIL-05 | The AI shall generate a complete email including a subject line                                     |
| EMAIL-06 | The tone shall be semi-formal, personalized — not generic template language                         |
| EMAIL-07 | The sender shall be identified as: Hue Nguyen, TA Manager                                           |
| EMAIL-08 | The output shall be copyable to clipboard                                                           |

**Supported Email Types:**

| Value      | Description                                        |
| ---------- | -------------------------------------------------- |
| `invite`   | Mời phỏng vấn (Interview invitation)               |
| `reject`   | Từ chối ứng viên (Candidate rejection)             |
| `offer`    | Thông báo offer (Offer notification)               |
| `followup` | Follow-up sau phỏng vấn (Post-interview follow-up) |
| `pipeline` | Giữ pipeline — on hold (Pipeline hold)             |

### 5.7 CV vs JD Evaluation (Đánh giá CV vs JD)

| ID      | Requirement                                                                   |
| ------- | ----------------------------------------------------------------------------- |
| EVAL-01 | The user shall paste or type a JD summary/requirements (required)             |
| EVAL-02 | The user shall paste or type the candidate's CV content or summary (required) |
| EVAL-03 | The AI shall return a structured evaluation with the following sections:      |
|         | — **Fit Score**: X/10 with rationale                                          |
|         | — **Điểm mạnh**: Top 3–4 strengths that match the JD                          |
|         | — **Điểm cần clarify**: Gaps or unclear areas                                 |
|         | — **Câu hỏi phỏng vấn gợi ý**: 3–5 recommended interview questions            |
|         | — **Khuyến nghị**: Move forward recommendation with reasoning                 |
| EVAL-04 | The output shall be copyable to clipboard                                     |

### 5.8 Candidate Summary (Tóm tắt Candidate)

| ID     | Requirement                                                                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SUM-01 | The user shall provide the target position (optional) and candidate info (required)                                                                       |
| SUM-02 | The user may optionally include interview round results and feedback                                                                                      |
| SUM-03 | The AI shall generate a concise summary of ~150–200 words, formatted for a busy CTO or Tech Director                                                      |
| SUM-04 | Summary sections: Overall snapshot, Background & notable experience, Skills match, Points to note, Interview results (if provided), Recommended next step |
| SUM-05 | Format: bullet points, scannable — not dense paragraphs                                                                                                   |
| SUM-06 | The output shall be copyable to clipboard                                                                                                                 |

### 5.9 Salary Benchmark (Salary Benchmark)

| ID     | Requirement                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------- |
| SAL-01 | The user shall input: position title (required), level, location, years of experience, and tech stack |
| SAL-02 | Location options: TP.HCM, Hà Nội, Đà Nẵng, Remote                                                     |
| SAL-03 | The AI shall return a structured benchmark report with:                                               |
|        | — **Salary range** (gross/month in VND) segmented as Median / Top 25% / Top 10%                       |
|        | — **Market comparison**: product company vs outsourcing vs startup                                    |
|        | — **Trend**: whether the salary range is growing, stable, or highly competitive                       |
|        | — **Common benefits** beyond base salary                                                              |
|        | — **Recommendation** for Hue when making an offer at Masan                                            |
| SAL-04 | The AI shall note that data is estimated based on Vietnam market knowledge for 2024–2025              |
| SAL-05 | The output shall be copyable to clipboard                                                             |

### 5.10 Settings

The Settings panel is a dedicated tool view accessible from the sidebar. It consolidates API key management and per-tool Business Context configuration in one place. All values are saved to `localStorage` and applied immediately without requiring a page reload.

#### 5.10.1 API Key

| ID     | Requirement                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| SET-01 | The Settings panel shall display the Anthropic API key in an editable password field                                             |
| SET-02 | Changes to the API key in Settings shall sync with the sidebar API key field and vice versa — both inputs reflect the same value |
| SET-03 | The key validation status indicator shall update in real time as the user types in Settings                                      |
| SET-04 | The API key shall be saved to `localStorage` key `ta_api_key`                                                                    |

#### 5.10.2 Business Context Configuration

Business Context is a free-text block that the user can configure per tool. It is appended to the AI system prompt or injected into the tool prompt at call time, allowing the assistant to produce output that reflects the user's current organization, team, role, and preferences.

| ID     | Requirement                                                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SET-05 | The Settings panel shall display a separate Business Context textarea for each of the following tools: AI Chat, Soạn JD, Viết Email UV, Đánh giá CV vs JD, Tóm tắt Candidate, Salary Benchmark    |
| SET-06 | Each Business Context field shall have a descriptive label and placeholder explaining what information is useful to include (e.g., company name, team structure, hiring target, tone preferences) |
| SET-07 | Each Business Context value shall be persisted independently in `localStorage` using a tool-specific key (e.g., `ta_ctx_chat`, `ta_ctx_jd`, `ta_ctx_email`)                                       |
| SET-08 | On page load, each tool shall read its corresponding Business Context from `localStorage` and apply it to subsequent API calls                                                                    |
| SET-09 | When a Business Context field is non-empty, its value shall be appended to the relevant AI prompt at call time, after the static system prompt content                                            |
| SET-10 | The user shall be able to clear any individual Business Context field independently                                                                                                               |
| SET-11 | A **Save Settings** button shall confirm that all values have been written to `localStorage`, triggering a success toast notification                                                             |
| SET-12 | Settings shall be organized into clearly labeled sections: **API Configuration** and **Business Context per Tool**                                                                                |

#### 5.10.3 Default Business Context Values

On first load (before the user customizes), each tool shall use the following built-in defaults that reflect Hue Nguyen's profile at Masan Group. If the user saves custom values, those override the defaults.

| Tool              | Default Context                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI Chat           | Hue Nguyen, TA Manager at Masan Group. Specializes in tech roles (Data, Software Engineering, Cloud, Security, ERP). Vietnam market, TP.HCM. 10+ years TA experience.                                 |
| Soạn JD           | Company: Masan Group — a large conglomerate with entities including Masan Tech, Masan Consumer. Tone: semi-formal, tech-savvy, attractive to engineers. Language: Vietnamese with English tech terms. |
| Viết Email UV     | Sender: Hue Nguyen, TA Manager. Tone: semi-formal, warm, personalized. Not a generic template.                                                                                                        |
| Đánh giá CV vs JD | Focus on tech roles. Provide objective, structured evaluation with fit score, strengths, gaps, and suggested interview questions.                                                                     |
| Tóm tắt Candidate | Summary audience: CTO or Tech Director. Keep to ~150–200 words. Bullet point format. Scannable.                                                                                                       |
| Salary Benchmark  | Market: Vietnam tech sector, 2024–2025. Primary location: TP.HCM. Include product company vs outsourcing vs startup comparison.                                                                       |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID      | Requirement                                                                                  |
| ------- | -------------------------------------------------------------------------------------------- |
| PERF-01 | A loading state ("Đang xử lý...") shall be shown on the action button during API calls       |
| PERF-02 | Output sections shall animate smoothly into view upon receiving results (fade-up transition) |
| PERF-03 | Chat messages shall animate in on appearance                                                 |

### 6.2 Usability

| ID    | Requirement                                                                                                      |
| ----- | ---------------------------------------------------------------------------------------------------------------- |
| UX-01 | Toast notifications shall confirm clipboard copy actions and report errors                                       |
| UX-02 | Toast notifications shall auto-dismiss after 3 seconds                                                           |
| UX-03 | Form validation shall prevent API calls with missing required fields and show a toast error                      |
| UX-04 | Output areas shall include a clear/dismiss button                                                                |
| UX-05 | The sidebar (Column 1) shall be hidden on screens narrower than 720px                                            |
| UX-06 | The AI Chat Panel (Column 3) shall remain accessible on mobile, either as a full-width view or collapsible panel |

### 6.3 Security & Privacy

| ID     | Requirement                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-01 | The API key shall be stored in `localStorage` only — never transmitted to any backend other than the Anthropic API                       |
| SEC-02 | The AI system prompt shall instruct the assistant not to retain or share candidate data or work content                                  |
| SEC-03 | No server-side storage of any user data, candidate data, or API keys                                                                     |
| SEC-04 | Business Context values stored in `localStorage` shall contain no candidate PII — they are intended for organizational/role context only |

### 6.4 Reliability

| ID     | Requirement                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| REL-01 | API errors shall be caught and surfaced as user-readable messages (toast for tools, inline message for chat) |
| REL-02 | All action buttons shall be re-enabled after an API call completes, regardless of success or failure         |

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer            | Technology                                                                        |
| ---------------- | --------------------------------------------------------------------------------- |
| Frontend         | Plain HTML5, CSS3, Vanilla JavaScript (no build step, no frameworks)              |
| AI Engine        | Anthropic Claude API (`claude-sonnet-4-20250514`)                                 |
| API Transport    | Browser `fetch()` with direct calls to `https://api.anthropic.com/v1/messages`    |
| Data Persistence | Browser `localStorage` (API key + per-tool Business Context)                      |
| Fonts            | Google Fonts: Fraunces (serif headings), Epilogue (body), Roboto Mono (monospace) |

### 7.2 API Integration

- **Endpoint:** `POST https://api.anthropic.com/v1/messages`
- **Model:** `claude-sonnet-4-20250514`
- **Authentication:** `x-api-key` header using the user-supplied key
- **API Version:** `2023-06-01`
- **Max Tokens:** 2000 (chat & tools), 1000 (CV parser)
- **Vision/Document Support:** CV files are base64-encoded and sent as `document` (PDF) or `image` (JPG/PNG) content blocks

### 7.3 Data Flow

```
User Input
    │
    ▼
Client-Side Validation
    │
    ▼
Prompt Construction
  ├── Static System Prompt (hardcoded TA assistant persona)
  ├── Business Context (from localStorage, per-tool — user-configured)
  └── Tool-specific template + user-supplied form inputs
    │
    ▼
Anthropic API (Claude Sonnet 4)
    │
    ▼
Response Parsing (plain text → HTML formatting / JSON for CV parser)
    │
    ▼
Rendered Output in UI
```

### 7.4 localStorage Schema

| Key              | Type     | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `ta_api_key`     | `string` | Anthropic API key                        |
| `ta_ctx_chat`    | `string` | Business Context for AI Chat             |
| `ta_ctx_jd`      | `string` | Business Context for JD Writer           |
| `ta_ctx_email`   | `string` | Business Context for Email Writer        |
| `ta_ctx_eval`    | `string` | Business Context for CV vs JD Evaluation |
| `ta_ctx_summary` | `string` | Business Context for Candidate Summary   |
| `ta_ctx_salary`  | `string` | Business Context for Salary Benchmark    |

### 7.5 File Structure

```
ta-assistant/
├── ta-assistant.html   # Complete single-file application
└── docs/
    └── BRD.md          # This document
```

---

## 8. AI System Prompt Behavior

The application configures a persistent system prompt that contextualizes Claude as Hue's personal TA assistant. With the Settings feature, the effective system prompt for each tool call is composed as follows:

```
[Static System Prompt]
  +
[Tool-specific Business Context from localStorage, if non-empty]
```

The static portion is hardcoded and covers the base persona. The Business Context portion is dynamic and user-controlled, allowing the assistant's outputs to remain accurate as the user's organization, team, or preferences change — without modifying the source code.

### 8.1 Key Behavioral Directives (Static System Prompt)

| Directive         | Detail                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| Language          | Always respond in Vietnamese; use natural, semi-formal tone                    |
| Persona           | Knows Hue is TA Manager at Masan Group with 10+ years experience including VNG |
| Domain            | Tech hiring in the Vietnam market (HCM-centric)                                |
| JD Style          | Tech-savvy, engineer-friendly, not overly corporate                            |
| Email Style       | Semi-formal, personalized, authentic — not templated                           |
| CV Evaluation     | Objective, highlight strengths/gaps, provide fit score and interview questions |
| Candidate Summary | Concise, bullet-point format for busy executives                               |
| Salary Data       | Based on Vietnam market 2024–2025 estimates; transparency about uncertainty    |
| Privacy           | No external retention or sharing of candidate or company information           |

---

## 9. Tool Summary Reference

| Tool              | Icon | Key Inputs                                     | Key Outputs                                                     | Business Context |
| ----------------- | ---- | ---------------------------------------------- | --------------------------------------------------------------- | ---------------- |
| AI Chat           | 💬   | Free-form text                                 | Conversational AI responses                                     | ✓ Configurable   |
| CV Parser         | 📄   | PDF/JPG/PNG files + field selection            | Structured data cards + Excel row + CSV download                | —                |
| Soạn JD           | 📝   | Title, level, entity, skills, context          | Full Job Description (Vietnamese)                               | ✓ Configurable   |
| Viết Email UV     | 📧   | Email type, candidate name, position, language | Complete email with subject line                                | ✓ Configurable   |
| Đánh giá CV vs JD | 🔍   | JD text + CV text                              | Fit score, strengths, gaps, interview questions, recommendation | ✓ Configurable   |
| Tóm tắt Candidate | 📋   | Candidate info + interview results             | Executive-friendly candidate brief                              | ✓ Configurable   |
| Salary Benchmark  | 💰   | Position, level, location, experience, skills  | Salary ranges, market comparison, trends, benefits              | ✓ Configurable   |
| **Settings**      | ⚙️   | API key + Business Context per tool            | Persisted configuration in localStorage                         | —                |

> **Note:** CV Parser does not use a Business Context because its output is structured JSON data extraction — tone and organizational context are not applicable.

---

## 10. Assumptions & Constraints

### 10.1 Assumptions

- The user has a valid Anthropic API key with access to Claude Sonnet 4
- CV files are in a readable, text-containing format (not handwritten or image-only with no OCR-friendly content)
- The application is used in a modern Chromium-based or Firefox browser with ES6+ support
- Salary benchmark data accuracy depends on Claude's training data cutoff; numbers should be treated as informed estimates, not sourced data

### 10.2 Constraints

- **Client-side only:** No backend server. All API calls originate from the user's browser. This means the API key is visible in browser DevTools and localStorage — acceptable for a personal/single-user tool
- **Single user:** No authentication or multi-user support
- **Session memory:** Chat history is in-memory only; it resets on page reload
- **Vietnam market focus:** Salary benchmarks and tone are optimized for the Vietnam tech talent market (HCM region primary)
- **Language:** The UI is in Vietnamese; English is used only for tech terminology
- **Business Context length:** Excessively long Business Context values will consume more tokens per API call. Users should keep context concise (recommended: under 300 words per tool)

---

## 11. Glossary

| Term     | Definition                                                                                   |
| -------- | -------------------------------------------------------------------------------------------- |
| TA       | Talent Acquisition — the function responsible for recruiting and hiring                      |
| JD       | Job Description — a formal document describing a role's responsibilities and requirements    |
| CV       | Curriculum Vitae / Resume — a candidate's document summarizing their professional background |
| HM       | Hiring Manager — the person who owns the headcount and makes the final hiring decision       |
| PV       | Phỏng vấn — Interview (Vietnamese)                                                           |
| UV       | Ứng viên — Candidate (Vietnamese)                                                            |
| BU       | Business Unit                                                                                |
| Gross    | Gross salary — before tax deductions                                                         |
| Pipeline | The pool of candidates at various stages of the recruitment funnel                           |
| On Hold  | A candidate who has been assessed but whose process is paused temporarily                    |
| Base64   | Binary-to-text encoding used to transmit file data in JSON API requests                      |

---

## 12. Change Log

| Version | Date       | Change Summary                                                                                                                                                                                                           |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | March 2026 | Initial as-built BRD based on `ta-assistant.html`                                                                                                                                                                        |
| 1.1     | March 2026 | Added Settings feature: API key management panel + per-tool Business Context configuration with localStorage persistence                                                                                                 |
| 1.2     | March 2026 | Added §4 UI Layout & Information Architecture — full 3-column layout specification (Sidebar, Content Area, AI Chat Panel); updated Functional Requirements and Non-Functional Requirements to reference column structure |

---

_This document reflects the intended design including the Settings feature (v1.1). Implementation should be validated against this BRD._
