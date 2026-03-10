# PLAN-08 — CV Parser Tool

**Depends on:** PLAN-02, PLAN-03, PLAN-04, PLAN-05  
**Output:** CV Parser tool in Column 2 — upload PDF/image, extract fields, copy/download results

---

## What to Build

Mirrors the HTML's `#tool-cv-parser` section:
1. Upload zone (click or drag-and-drop)
2. Field chip toggles (select which fields to extract)
3. Parse button
4. Result cards grid
5. Tab-separated copy row (for Excel)
6. Download CSV button

---

## Files to Create

### `src/features/cv-parser/types/index.ts`

```ts
export interface CvField {
  key: string
  label: string
}

export const CV_FIELDS: CvField[] = [
  { key: 'name', label: 'Họ và tên' },
  { key: 'phone', label: 'SĐT' },
  { key: 'email', label: 'Email' },
  { key: 'location', label: 'Địa chỉ' },
  { key: 'current_company', label: 'Công ty hiện tại' },
  { key: 'current_title', label: 'Vị trí hiện tại' },
  { key: 'years_exp', label: 'Số năm KN' },
  { key: 'skills', label: 'Skills / Tech Stack' },
  { key: 'education', label: 'Học vấn' },
  { key: 'expected_salary', label: 'Lương mong muốn' },
  { key: 'summary', label: 'Tóm tắt nhanh' },
]

export type ParsedCv = Record<string, string | string[] | number | null>
```

---

### `src/features/cv-parser/components/UploadZone.tsx`

Drag-and-drop + click-to-browse file upload area.

Props:
```ts
interface UploadZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}
```

Behaviors (no `useEffect` — use event handlers only):
- `onDragOver` → adds `dragover` state class
- `onDragLeave` → removes it
- `onDrop` → filters to accepted MIME types, calls `onFilesChange`
- `onChange` on hidden `<input type="file">` → calls `onFilesChange`

File pill: shows `{files.map(f => f.name).join(', ')}` when files are selected.

Accepted: `.pdf,.jpg,.jpeg,.png`  
MIME filter: `['application/pdf', 'image/jpeg', 'image/png']`

---

### `src/features/cv-parser/components/FieldChips.tsx`

Toggleable chip group for field selection.

Props:
```ts
interface FieldChipsProps {
  selected: Set<string>
  onToggle: (key: string) => void
}
```

```tsx
{CV_FIELDS.map((field) => (
  <button
    key={field.key}
    onClick={() => onToggle(field.key)}
    className={`px-3 py-[5px] rounded-full text-[11px] font-mono border transition-all
      ${selected.has(field.key)
        ? 'bg-accent-3/10 border-accent-3 text-accent-3'
        : 'border-border-strong text-ink-2 bg-surface hover:border-accent-3 hover:text-accent-3'}`}
  >
    {field.label}
  </button>
))}
```

Default: all fields selected.

---

### `src/features/cv-parser/components/ParsedResultCard.tsx`

Displays one extracted field value.

Props:
```ts
interface ParsedResultCardProps {
  label: string
  fieldKey: string
  value: string | string[] | number | null
}
```

- `null` / empty → italic gray "— không tìm thấy"
- `skills` (array) → render as skill chips (green pills)
- `name` → highlight in accent color + larger weight
- Others → plain text

---

### `src/features/cv-parser/containers/CvParserContainer.tsx`

**Client component.** All logic for the CV parser.

State (using `useState`):
```ts
const [files, setFiles] = useState<File[]>([])
const [selectedFields, setSelectedFields] = useState<Set<string>>(
  new Set(CV_FIELDS.map(f => f.key))
)
const [results, setResults] = useState<ParsedCv[]>([])
const [showOutput, setShowOutput] = useState(false)
const [parseProgress, setParseProgress] = useState('')
```

**Key functions:**

```ts
const toggleField = (key: string) => {
  setSelectedFields(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const getMediaType = (file: File): string => {
  if (file.type === 'application/pdf') return 'application/pdf'
  if (file.type === 'image/png') return 'image/png'
  return 'image/jpeg'
}

const handleParse = async () => {
  if (!files.length) return
  const fieldKeys = Array.from(selectedFields)
  const parsed: ParsedCv[] = []

  for (let i = 0; i < files.length; i++) {
    setParseProgress(`Parsing ${i + 1}/${files.length}...`)
    const b64 = await fileToBase64(files[i])
    const mt = getMediaType(files[i])
    const fieldList = fieldKeys
      .map(k => `- "${k}": ${CV_FIELDS.find(f => f.key === k)?.label ?? k}`)
      .join('\n')

    const prompt = `Bạn là CV parser chuyên nghiệp. Extract thông tin sau từ CV này và trả về JSON thuần (không markdown):\n${fieldList}\nQuy tắc: Nếu không tìm thấy → null. "skills" là array. "years_exp" là số. "summary" là 1-2 câu tiếng Việt.`

    const contentBlock = mt === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: mt, data: b64 } }
      : { type: 'image', source: { type: 'base64', media_type: mt, data: b64 } }

    const result = await call({
      messages: [{ role: 'user', content: [contentBlock, { type: 'text', text: prompt }] }],
      maxTokens: 1000,
    })

    if (result) {
      const json = JSON.parse(result.replace(/```json|```/g, '').trim())
      parsed.push(json)
    }
  }

  setResults(parsed)
  setShowOutput(true)
  toast.success(`✓ Parse xong ${parsed.length} CV!`)
}
```

Note: `callClaude` for CV parser sends `content` as an **array** (not a string) with file + text blocks.  
The `/api/claude` route passes the body directly to Anthropic so this works as-is.

**Excel row generation:**

```ts
const getTabSeparatedRow = (): string => {
  const fieldKeys = Array.from(selectedFields)
  const header = fieldKeys.map(k => CV_FIELDS.find(f => f.key === k)?.label ?? k).join('\t')
  const rows = results.map(r =>
    fieldKeys.map(k => {
      const v = r[k]
      return Array.isArray(v) ? v.join(', ') : (v ?? '')
    }).join('\t')
  )
  return [header, ...rows].join('\n')
}
```

**CSV download:**
```ts
const handleDownload = () => {
  const csv = getTabSeparatedRow().replace(/\t/g, ',')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `cv_parsed_${Date.now()}.csv`
  a.click()
  toast.success('✓ Downloaded!')
}
```

---

## BRD Requirements Covered

| ID | Requirement | Covered |
|----|-------------|:-------:|
| CVP-01 | Upload one or more CV files | ✅ |
| CVP-02 | PDF, JPG, JPEG, PNG | ✅ |
| CVP-03 | Click-to-browse + drag-and-drop | ✅ |
| CVP-04 | File name pill after selection | ✅ |
| CVP-05 | Toggleable chip controls for fields | ✅ |
| CVP-06 | Base64-encoded to Claude API | ✅ |
| CVP-07 | Parsed results as labeled cards in grid | ✅ |
| CVP-08 | Tab-separated row for Excel | ✅ |
| CVP-09 | Copy tab-separated data to clipboard | ✅ |
| CVP-10 | Download as UTF-8 CSV | ✅ |
| CVP-11 | Progress indicator during multi-CV parse | ✅ |

---

## Verification Checklist

- [ ] Click upload zone opens file browser
- [ ] Drag-and-drop accepts PDF and image files
- [ ] File names displayed in pill after selection
- [ ] Chips toggle on/off correctly
- [ ] Parse button shows progress `Parsing 1/2...` for multiple files
- [ ] Results render in card grid with correct labels
- [ ] Skills render as green pill chips
- [ ] Copy Excel row writes tab-separated text to clipboard
- [ ] Download creates a valid CSV file with UTF-8 BOM
- [ ] Error toast shown if API fails
