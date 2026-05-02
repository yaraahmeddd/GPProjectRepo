# Member Management Page — UI Specification

> **File:** `src/Page/MemberManagementPage.tsx`  
> **Direction:** RTL (`dir="rtl"`)  
> **Purpose:** Displays, filters, sorts, edits, and manages all club members (regular members + team players) in a unified table view with a slide-out detail panel.

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────┐
│  HEADER  (title + total count + payment alert badge │
│           + tab bar [الجميع|الأعضاء|اللاعبون]       │
│           + refresh button)                         │
├─────────────────────────────────────────────────────┤
│  TOOLBAR  (search input + status filter popover     │
│            + results count)                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TABLE  (sortable columns, skeleton loader,         │
│          50-row pagination, scrollable)             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  PAGINATION BAR  (prev / next + page counter)       │
└─────────────────────────────────────────────────────┘
```

Layout container: `h-[calc(100vh-4rem)] flex flex-col` — fills the full viewport minus the top nav bar; the table scrolls independently inside it.

---

## 1. Header Section

| Property | Value |
|---|---|
| Background | `bg-background` |
| Padding | `px-5 py-3` |
| Border | `border-b border-border` (bottom only) |
| Behaviour | `shrink-0` — fixed height, never collapses |

### Title Row

```
[ Users icon ]  إدارة الأعضاء
إجمالي المحملين: <N>   آخر تحديث: <HH:MM:SS>   🔔 <N> تنبيه دفع
```

| Element | Styles |
|---|---|
| `<h1>` title | `text-xl font-bold tracking-tight flex items-center gap-2` |
| Icon | `Users` — `w-5 h-5 text-primary` |
| Sub-line | `text-xs text-muted-foreground` |
| Payment alert badge | `inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300 px-2.5 py-0.5 text-xs font-bold` — only shown when at least 1 member has a non-active payment |

### Refresh Button (top-right)

```
[ RefreshCw icon ]  تحديث  /  جارٍ التحميل...
```

- Styles: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-xs text-muted-foreground disabled:opacity-40`
- When loading: the `RefreshCw` icon has `animate-spin` class applied; label becomes `جارٍ التحميل...`

### Tab Bar

```
┌──────────────────────────────────┐
│ [ Users ] الجميع <N>  [ UserCheck ] الأعضاء <N>  [ Trophy ] اللاعبون <N> │
└──────────────────────────────────┘
```

| State | Styles |
|---|---|
| **Active tab** | `bg-primary text-primary-foreground shadow-sm px-3 py-1.5 rounded-lg text-xs font-medium` |
| **Inactive tab** | `text-muted-foreground hover:bg-muted px-3 py-1.5 rounded-lg text-xs font-medium` |
| Count badge (active) | `text-[10px] rounded-full px-1.5 py-0 font-bold bg-white/20` |
| Count badge (inactive) | `text-[10px] rounded-full px-1.5 py-0 font-bold bg-muted text-muted-foreground` |

Tabs: `all` → الجميع, `members` → الأعضاء, `players` → اللاعبون

**Player type sub-filter** (only visible when `tab === "players"` and there are > 1 player types):
- Rendered in `mr-auto flex items-center gap-2` container with a `Trophy w-3 h-3 text-muted-foreground` icon
- `<Select>` control: `h-7 w-36 text-xs`

---

## 2. Toolbar Section

| Property | Value |
|---|---|
| Background | `bg-muted/20` |
| Padding | `px-4 py-2.5` |
| Border | `border-b border-border` |
| Layout | `flex items-center gap-3 flex-wrap` |
| Behaviour | `shrink-0` |

### Search Input

- Container: `relative flex-1 min-w-[160px] max-w-[280px]`
- Icon: `Search` positioned at `right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground`
- Input: `pr-9 h-8 text-xs`
- Placeholder: `بحث في الأعضاء...`
- Searches: Arabic name, English name (case-insensitive), national ID, email, phone number

### Status Filter Popover

- Trigger button: `flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs transition-colors`
  - **Default state:** `border-border bg-background text-muted-foreground hover:bg-muted`
  - **Active (filters selected):** `border-primary bg-primary/5 text-primary`
  - `Filter w-3 h-3` icon + الحالة label + active-count bubble `w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold`
- Popover content: `w-52 p-0` with `dir="rtl"`
- Each status row: `flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/60`
  - Checkbox: `w-3.5 h-3.5 rounded accent-primary`
  - Status label: `inline-flex items-center gap-1 text-xs font-medium` in the status's color
  - Count: `mr-auto text-[10px] text-muted-foreground`
- Footer: Clear button `text-xs text-muted-foreground hover:text-foreground`

### Results Count

- Right-aligned: `text-xs text-muted-foreground mr-auto`
- Format: `{N} نتيجة`

---

## 3. Table Section

- Container: `flex-1 overflow-auto`
- Three possible states: **Skeleton Loader**, **Empty**, **Table**

### 3a. Skeleton Loading State

- 8 animated placeholder rows: `animate-pulse`
- Member cell: avatar circle `w-7 h-7 rounded-full bg-muted` + two text blocks `h-2.5 w-20` and `h-2 w-14`
- Other 6 cells: `h-2.5 w-12 bg-muted rounded mx-auto`

### 3b. Empty State

```
لا يوجد نتائج مطابقة لـ "..."   (when search is active)
لا يوجد أعضاء في هذه الفئة       (when tab is empty)
```

- Full-width `<td colSpan={7}>`: `text-center py-12 text-muted-foreground text-sm`

---

## 4. Main Table

```
┌─────────────────┬────────────┬──────────┬──────────┬──────────┬───────────┬───────────┐
│     العضو       │    النوع   │  الهاتف  │  النقاط  │  الحالة  │  التسجيل  │ الإجراءات │
├─────────────────┼────────────┼──────────┼──────────┼──────────┼───────────┼───────────┤
│ [Avatar] الاسم │ [🏆] نوع  │ 01xxxxxx │   500    │  [نشط]   │ ١/١/٢٠٢٥ │ 👁 ✏ ⋯   │
└─────────────────┴────────────┴──────────┴──────────┴──────────┴───────────┴───────────┘
```

### Table Header (`<thead>`)

- Styles: `sticky top-0 bg-muted/70 backdrop-blur border-b border-border z-10`
- All `<th>` cells (via `Th` component): `px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap select-none align-middle`
- Sortable columns get `cursor-pointer hover:text-foreground`
- Sort indicator: `ChevronsUpDown` (inactive) / `ChevronUp` or `ChevronDown` (active, `text-primary`)

| Column | Alignment | Sortable |
|---|---|---|
| العضو | `text-right` | ✅ by `name` |
| النوع | `text-right` | ✅ by `memberType` |
| الهاتف | `text-right` | ❌ |
| النقاط | `text-center` | ✅ by `points` |
| الحالة | `text-center` | ✅ by `status` |
| التسجيل | `text-center` | ✅ by `createdAt` |
| الإجراءات | `text-center` | ❌ |

### Table Body (`<tbody>`)

- `divide-y divide-border` — thin separator between rows
- Row hover: `hover:bg-muted/40 transition-colors group`
- Action icons hidden by default, revealed on hover: `opacity-0 group-hover:opacity-100 transition-opacity`

### Column Details

| Column | Styles | Notes |
|---|---|---|
| العضو (Member) | Avatar `w-7 h-7 rounded-full text-[10px] font-bold text-white` + Arabic name `font-semibold leading-tight truncate max-w-[160px] text-xs` + English name `text-[10px] text-muted-foreground truncate` dir="ltr" | Avatar bg color derived from `id % 10` palette. Shows `PaymentBadge` inline next to name |
| النوع | `text-xs text-muted-foreground whitespace-nowrap` + `Trophy w-3 h-3 text-amber-500` icon for team players | Label truncated `max-w-[100px]` |
| الهاتف | `text-xs tabular-nums text-right text-muted-foreground` in `<span dir="ltr">` | `—` when missing |
| النقاط | `font-semibold tabular-nums text-xs` — amber `text-amber-600` when > 0, else `text-muted-foreground` | `toLocaleString()` formatted |
| الحالة | `text-center` | `<StatusBadge compact />` |
| التسجيل | `text-[10px] text-muted-foreground whitespace-nowrap text-center` | `toLocaleDateString('ar-EG', { year: '2-digit', month: 'numeric', day: 'numeric' })` |
| الإجراءات | `flex items-center justify-center gap-0.5` | 3 icon buttons (see below) |

---

## 5. Badges

### Avatar Color Palette

```typescript
const palette = [
  "#1F3A5F", "#7C3AED", "#065F46", "#92400E", "#9D174D",
  "#1E40AF", "#0369A1", "#6B21A8", "#0F766E", "#B45309",
];
const getColor = (id: string) => palette[parseInt(id, 10) % palette.length];
```

Initials: first character of each word in Arabic name (or English fallback), max 2 characters, uppercase.

### Payment Badge (inline next to member name)

| State | Classes |
|---|---|
| Overdue | `inline-flex items-center rounded-full border border-rose-300 bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 text-[9px] whitespace-nowrap` — text: `⚠ متأخر` |
| Expiring soon (≤ 30 days) | `inline-flex items-center rounded-full border border-amber-300 bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 text-[9px] whitespace-nowrap` — text: `🔔 {N} أيام` |
| Active | Not rendered |

### Status Badge (`StatusBadge` component)

| Status | Color | Background | Border | Icon |
|---|---|---|---|---|
| active — نشط | `text-emerald-700` | `bg-emerald-50` | `border-emerald-200` | `CheckCircle` |
| suspended — موقوف | `text-amber-700` | `bg-amber-50` | `border-amber-200` | `Clock` |
| banned — محظور | `text-red-700` | `bg-red-50` | `border-red-200` | `XCircle` |
| expired — منتهي | `text-slate-600` | `bg-slate-50` | `border-slate-200` | `AlertTriangle` |
| cancelled — ملغى | `text-rose-700` | `bg-rose-50` | `border-rose-200` | `XCircle` |
| pending — قيد المراجعة | `text-blue-700` | `bg-blue-50` | `border-blue-200` | `Clock` |

- Normal size: `px-2.5 py-1 text-[11px]`
- Compact size (table rows): `px-2 py-0.5 text-[10px]`
- Common: `inline-flex items-center gap-1 rounded-full font-semibold border`

---

## 6. Action Buttons (per row)

Three icon-only ghost buttons revealed on row hover, each `variant="ghost" size="icon" className="h-7 w-7"`:

| Button | Icon | Color | Tooltip | Guard |
|---|---|---|---|---|
| عرض التفاصيل | `Eye w-3.5 h-3.5` | `text-blue-600` | عرض التفاصيل | None |
| تعديل | `Pencil w-3.5 h-3.5` | `text-emerald-600` | تعديل | `UPDATE_MEMBER` |
| المزيد (⋯) | `MoreHorizontal w-3.5 h-3.5` | default | — | None |

The **MoreHorizontal** dropdown contains:
- `Shield` — تغيير الحالة (guarded: `MANAGE_MEMBER_BLOCK`)
- `Trash2` — حذف العضو (guarded: `DELETE_MEMBER`, text `text-red-600 focus:text-red-600`)

---

## 7. Pagination Bar

| Property | Value |
|---|---|
| Background | `bg-muted/20` |
| Padding | `px-4 py-2.5` |
| Border | `border-t border-border` |
| Behaviour | `shrink-0` |

- Page size: **50 rows**
- Counter text: `عرض {from}-{to} من {total} · صفحة {page} من {totalPages}` — `text-muted-foreground text-[11px]`
- Prev button: `ChevronRight w-4 h-4` icon + السابق — `size="sm" variant="outline" h-8 gap-1`
- Next button: التالي + `ChevronLeft w-4 h-4` icon — same styles
- Buttons disabled at first/last page

---

## 8. Detail Modal (عرض التفاصيل)

- Trigger: clicking the Eye icon in a row
- Dialog: `max-w-3xl w-full p-0 overflow-hidden` with `maxHeight: '88vh'`
- Direction: `dir="rtl"`

### 8a. Modal Header

```
[ Colored Avatar 56×56 rounded-2xl ]
  الاسم العربي (bold, large)
  English Name (small, ltr, muted)
  [ StatusBadge ] [ نوع العضوية Badge ] [ 🏆 لاعب Badge ]
─────────────────────────────────────────────────────────
[ المعلومات الشخصية ] [ الرياضات ] [ 🖼️ الصور والمستندات ]
```

- Header: `px-6 pt-5 pb-0 border-b border-border bg-gradient-to-r from-primary/5 to-transparent`
- Avatar: `w-14 h-14 rounded-2xl text-base font-bold text-white shadow` — bg from palette
- Tab bar: `flex items-center gap-0 -mb-px`
- **Active tab:** `border-b-2 border-primary text-primary px-4 py-2 text-xs font-medium`
- **Inactive tab:** `border-transparent text-muted-foreground hover:text-foreground px-4 py-2 text-xs font-medium`

### 8b. Tab 1 — المعلومات الشخصية

Two-column grid `grid grid-cols-2 gap-0 divide-x divide-x-reverse divide-border`

**Left column — Personal + Contact:**

Each `Field` component:
- Container: `py-2 border-b border-border/50 last:border-0`
- Label: `text-[10px] text-muted-foreground mb-0.5 font-medium`
- Value: `text-sm font-semibold truncate`

Fields shown (left column):
- `رقم العضو` → `MEM-{id padded to 5 digits}` (ltr)
- `الرقم القومي` (ltr)
- `الجنس`
- `الجنسية`
- `تاريخ الميلاد`
- `التاريخ القومي` (registration date)
- `البريد الإلكتروني` (ltr)
- `رقم الهاتف` (ltr)
- `العنوان`

**Right column — Additional + Payment:**

Fields shown:
- `الحالة الصحية`
- `النقاط`
- `نوع العضوية`

Payment info section (`PAYMENTS_MAP` lookup):
- Section heading: `text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2`
- Card: `rounded-xl border border-border bg-muted/30 overflow-hidden divide-y divide-border`
- Rows: `flex items-center justify-between px-4 py-2.5`
  - Status badge: `text-[11px] font-bold rounded-full border px-2.5 py-0.5`
  - Statuses: active (`bg-emerald-100 text-emerald-700 border-emerald-200`), expiring (`bg-amber-100 text-amber-700 border-amber-200`), overdue (`bg-rose-100 text-rose-700 border-rose-200`)
- Alert banner (non-active): `mt-2 rounded-lg border px-3 py-2 text-xs font-medium flex items-center gap-2`
  - Overdue: `bg-rose-50 border-rose-200 text-rose-700`
  - Expiring: `bg-amber-50 border-amber-200 text-amber-700`

### 8c. Tab 2 — الرياضات

- Section heading: `text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3` + count badge `bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-bold text-[10px]`
- Each sport row: `flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2`
  - `Trophy w-3.5 h-3.5 text-amber-500` + sport name `text-sm font-semibold`
  - Status pill: active `bg-emerald-100 text-emerald-700`, pending `bg-amber-100 text-amber-700`, other `bg-rose-100 text-rose-700`

### 8d. Tab 3 — الصور والمستندات

| Document | Container | Behavior |
|---|---|---|
| الصورة الشخصية | `h-48 w-auto rounded-xl border-2 border-border shadow-md object-cover cursor-zoom-in` | Clickable, opens full-size in new tab |
| بطاقة الرقم القومي (أمام/خلف) | `aspect-[1.6/1] w-full rounded-xl border-2 border-dashed group hover:border-primary/50` | Grid of 2, clickable |
| التقرير الطبي | `min-h-[220px] w-full rounded-xl border-2 border-dashed group hover:border-orange-400/60` | Full-width, clickable |
| Missing file | Dashed border container with icon `Eye h-7 w-7 opacity-40` + text label |

Section headings use `w-1 h-4 rounded-full inline-block` color accent:
- صورة شخصية → `bg-primary`
- بطاقة قومي → `bg-[#1b71bc]`
- تقرير طبي → `bg-orange-500`

### 8e. Modal Footer

- Container: `border-t border-border px-5 py-3 bg-muted/20 shrink-0 flex items-center gap-2`
- **حذف** (left): `variant="destructive" size="sm" gap-1.5` — guarded: `DELETE_MEMBER`
- **تغيير الحالة** (right group): `variant="outline" size="sm" gap-1.5` — guarded: `MANAGE_MEMBER_BLOCK`
- **تعديل** (right group): `size="sm" gap-1.5` — guarded: `UPDATE_MEMBER`

---

## 9. Edit Dialog (تعديل بيانات العضو)

- Size: `max-w-xl`
- Two tabs: `👤 البيانات الشخصية` and `🖼️ الصور والمستندات`
- Tab bar: `flex gap-0 border-b border-border -mx-1`
  - Active: `border-b-2 border-primary text-primary px-4 py-2 text-xs font-medium`
  - Inactive: `border-transparent text-muted-foreground hover:text-foreground px-4 py-2 text-xs font-medium`

**Tab 1 — Personal Info:**

Grid: `grid grid-cols-2 gap-3`

Fields: الاسم الأول (عربي), الاسم الأول (English), الاسم الأخير (عربي), الاسم الأخير (English), الجنس (Select), رقم الهاتف, تاريخ الميلاد (`type="date"`), الجنسية, العنوان (full-width `col-span-2`), الحالة الصحية (full-width `col-span-2`)

**Tab 2 — Documents:**

Each document upload slot:
- Label + existing preview (clickable image or empty placeholder `h-28 rounded-lg border-2 border-dashed`)
- `<input type="file" accept="image/*">` — `h-8 text-xs`

Document slots: الصورة الشخصية, بطاقة الرقم القومي (أمام), بطاقة الرقم القومي (خلف), التقرير الطبي

**Footer:** Save: `size="sm" gap-1.5 min-w-[80px]` — disabled while saving; Cancel: `variant="outline" size="sm"`

---

## 10. Status Change Dialog (تغيير الحالة)

- Size: default Dialog
- Select: new status from STATUS_CONFIG options
- Textarea: optional reason `placeholder="سبب التغيير (اختياري)..." rows={3}`
- Footer: حفظ (disabled while saving) + إلغاء

---

## 11. Delete Confirmation Dialog (تأكيد الحذف)

- Warning text with member name highlighted
- Note: soft delete — sets status to `cancelled` via `PATCH /members/:id/status`
- Footer: تأكيد الحذف `variant="destructive"` + إلغاء `variant="outline"`

---

## 12. Color & Token Reference

| Token | Usage |
|---|---|
| `text-primary` | Active tab indicator, sort icon, section accent |
| `bg-primary` | Active tab background, spinner ring |
| `#1b71bc` | Brand blue — national ID card accent stripe |
| `bg-amber-100 text-amber-700` | Team player icons, expiring payment badges |
| `bg-emerald-50 text-emerald-700` | Active status badge |
| `bg-rose-50 text-rose-700` | Overdue payment banner, banned badge |
| `bg-muted/40` | Row hover background |
| `bg-muted/70 backdrop-blur` | Sticky table header |
| `text-muted-foreground` | Secondary text, column headers, empty states |
| `divide-border` | Row separators in tbody |
| `border-border` | All card/section borders |
| `text-amber-600` | Points value when > 0 |

---

## 13. Data Flow

| Source | Data |
|---|---|
| `GET /members?page=N&limit=100` | Paginated regular members — all pages fetched in sequence on mount |
| `GET /team-members` | All team players in a single call |
| `GET /register/team-member/review-all` | Fallback if `/team-members` fails |
| `GET /members/:id` | Full detail for a regular member (triggered on row click) |
| `GET /team-members/:id` | Full detail for a team player (triggered on row click) |
| `PUT /members/:id` or `PUT /team-members/:id` | Edit save |
| `POST /members/:id/documents` | Document/photo upload (base64 body) |
| `PATCH /members/:id/status` | Status change + soft delete |

---

## 14. Access Control (RoleGuard)

| Action | Required Privilege |
|---|---|
| عرض التفاصيل (Eye icon) | None |
| تعديل (Pencil icon + modal button) | `UPDATE_MEMBER` |
| تغيير الحالة (dropdown + modal button) | `MANAGE_MEMBER_BLOCK` |
| حذف (dropdown + modal button) | `DELETE_MEMBER` |

Buttons wrapped in `<RoleGuard privilege="...">` are hidden entirely if the user lacks the required privilege.

---

## 15. Using the `DataTable` Component

This page implements its own inline `<table>` with custom `Th` sorting headers. For **new pages** built from this spec, prefer the shared `DataTable` component (`src/Component/StaffPagesComponents/ui/data-table.tsx`) with the column definitions below:

```typescript
import { DataTable, ColumnDef } from "../Component/StaffPagesComponents/ui/data-table";

const columns: ColumnDef<MemberRow>[] = [
  {
    header: "العضو",
    className: "text-right w-[200px]",
    cell: (row) => <MemberCell row={row} />,
  },
  {
    header: "النوع",
    className: "text-right",
    cell: (row) => (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {row.isTeamPlayer && <Trophy className="w-3 h-3 text-amber-500 shrink-0" />}
        <span className="truncate max-w-[100px]">{row.memberTypeLabel}</span>
      </div>
    ),
  },
  {
    header: "الهاتف",
    className: "text-right",
    cell: (row) => <span dir="ltr" className="text-xs tabular-nums text-muted-foreground">{row.phone || "—"}</span>,
  },
  {
    header: "النقاط",
    className: "text-center",
    cell: (row) => (
      <span className={`font-semibold tabular-nums text-xs ${row.pointsBalance > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
        {row.pointsBalance.toLocaleString()}
      </span>
    ),
  },
  {
    header: "الحالة",
    className: "text-center",
    cell: (row) => <StatusBadge status={row.status} compact />,
  },
  {
    header: "التسجيل",
    className: "text-center",
    cell: (row) => <span className="text-[10px] text-muted-foreground whitespace-nowrap">{fmtDateShort(row.createdAt)}</span>,
  },
  {
    header: "الإجراءات",
    className: "text-center w-[100px]",
    cell: (row) => <ActionCell row={row} />,
  },
];

// Usage
<DataTable data={pageRows} columns={columns} isLoading={fetching && allRows.length === 0} emptyMessage="لا يوجد أعضاء في هذه الفئة" />
```

> **Note:** The `DataTable` component does not support sortable column headers out of the box. For sort functionality, either extend `DataTable` with a `onSort` prop or keep the inline table with the custom `Th` component as currently implemented.
