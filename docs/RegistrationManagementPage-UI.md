# Registration Management Page — UI Specification

> **File:** `src/Page/RegistrationManagementPage.tsx`  
> **Direction:** RTL (`dir="rtl"`)  
> **Purpose:** Manages and approves pending membership registration requests for both regular members and sports-team members.

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────┐
│  HEADER  (page title + counters + refresh button)   │
├─────────────────────────────────────────────────────┤
│  TOOLBAR  (search input + type filter tabs + badge) │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TABLE / EMPTY STATE / LOADING SPINNER              │
│  (scrollable, fills remaining viewport height)      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Layout container: `h-[calc(100vh-4rem)] flex flex-col` — the page fills the full viewport minus the top nav bar, and the table scrolls independently inside it.

---

## 1. Header Section

| Property | Value |
|---|---|
| Background | `bg-background` |
| Padding | `px-6 py-4` |
| Border | `border-b border-border` (bottom only) |
| Behaviour | `shrink-0` — fixed height, never collapses |

### Title Row

```
[ FileText icon ]  طلبات التسجيل
قيد الانتظار: <N> طلب   •  [ Users icon ] أعضاء: N   •  [ Award icon ] أعضاء فريق: N
```

| Element | Styles |
|---|---|
| `<h1>` title | `text-2xl font-bold tracking-tight flex items-center gap-2` |
| Icon | `FileText` — `w-6 h-6 text-primary` |
| Sub-line count | `text-sm text-muted-foreground` |
| Members badge | `text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium` |
| Team members badge | `text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium` |

### Refresh Button (top-right)

```
[ RefreshCw icon ]  تحديث
```

- Styles: `flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm text-muted-foreground disabled:opacity-40`
- When loading: the `RefreshCw` icon has `animate-spin` class applied

---

## 2. Toolbar Section

| Property | Value |
|---|---|
| Background | `bg-muted/20` |
| Padding | `px-6 py-3` |
| Border | `border-b border-border` |
| Layout | `flex items-center gap-3` |
| Behaviour | `shrink-0` |

### Search Input

- Container: `relative flex-1 max-w-sm`
- Icon: `Search` positioned at `right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none`
- Input: `pr-9 h-9` — right padding to clear the icon
- Placeholder: `بحث بالاسم، الرقم القومي، أو الهاتف...`
- Searches: Arabic name, English name (case-insensitive), national ID, phone number

### Type Filter Tabs (Pill Group)

```
┌─────────────────────────────┐
│  الكل  │  أعضاء  │ أعضاء فريق │
└─────────────────────────────┘
```

- Container: `flex items-center gap-1 bg-muted rounded-lg p-0.5`
- **Active tab:** `bg-white shadow-sm text-foreground px-3 py-1.5 rounded-md text-xs font-medium`
- **Inactive tab:** `text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md text-xs font-medium transition-all`
- Options: `all` → الكل, `member` → أعضاء, `team_member` → أعضاء فريق

### Results Count Badge

- `Filter` icon: `w-4 h-4 text-muted-foreground shrink-0`
- Badge: `variant="outline"` with class `text-xs text-muted-foreground` showing `{N} نتيجة`

---

## 3. Table Section

- Container: `flex-1 overflow-auto` with scrollbars hidden (`[&::-webkit-scrollbar]:hidden`, `scrollbarWidth: 'none'`)
- Three possible states: **Loading**, **Empty**, **Table**

### 3a. Loading State

```
        ◌  (spinning ring)
    جارٍ التحميل...
```

- `py-20 text-center text-muted-foreground`
- Spinner: `w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3`
- Label: `text-sm`

### 3b. Empty State

```
     ┌──────────────────┐
     │   UserX  icon    │
     └──────────────────┘
      لا يوجد طلبات حالياً
   لم يتم العثور على طلبات...
```

- `py-20 text-center text-muted-foreground`
- Icon wrapper: `rounded-full bg-muted/30 p-6 mb-4 w-fit mx-auto`
- Icon: `UserX h-12 w-12 text-muted-foreground/50`
- Heading: `text-base font-semibold text-foreground mb-1`
- Sub-text: `text-sm` — changes contextually if a search query is active

---

## 4. Main Table

```
┌────┬──────────────┬──────────────┬──────────────────┬────────────┬──────────┬───────────┬──────────────────────┐
│  # │     الاسم    │  رقم الهاتف  │   الرقم القومي   │تاريخ التسجيل│  النوع  │   الحالة  │       الإجراءات      │
├────┼──────────────┼──────────────┼──────────────────┼────────────┼──────────┼───────────┼──────────────────────┤
│  1 │ أحمد محمد   │  01xxxxxxxx  │  1234567890xxxx  │ ١/١/٢٠٢٥  │ عضو فريق│ قيد الانتظار│ [مراجعة][اعتماد][طباعة]│
│  2 │ سارة علي    │  01xxxxxxxx  │  9876543210xxxx  │ ٢/١/٢٠٢٥  │  عضو   │   نشط    │ [مراجعة][اعتماد][طباعة]│
└────┴──────────────┴──────────────┴──────────────────┴────────────┴──────────┴───────────┴──────────────────────┘
```

### Table Header (`<thead>`)

- Styles: `sticky top-0 bg-muted/70 backdrop-blur border-b border-border z-10`
- All `<th>` cells: `font-semibold text-xs text-muted-foreground whitespace-nowrap align-middle py-3 px-4`
- `#`, الاسم, رقم الهاتف, الرقم القومي, تاريخ التسجيل → `text-right`
- النوع, الحالة, الإجراءات → `text-center`

### Table Body (`<tbody>`)

- `divide-y divide-border` — thin separator between rows
- Row hover: `hover:bg-muted/40 transition-colors`
- Just-approved row: `bg-emerald-500/10` flash highlight

### Column Details

| Column | Styles | Notes |
|---|---|---|
| `#` (index) | `text-sm text-muted-foreground font-mono` | 1-based sequential index |
| الاسم (Name) | Primary name `font-semibold leading-tight`; English sub-name `text-[11px] text-muted-foreground/70 italic tracking-wide` | Shows both Arabic and English name stacked |
| رقم الهاتف | `tabular-nums text-sm text-right` wrapped in `<span dir="ltr">` | LTR forced for phone numbers |
| الرقم القومي | `font-mono text-xs text-right` wrapped in `<span dir="ltr">` | LTR forced for national ID |
| تاريخ التسجيل | `text-sm text-muted-foreground tabular-nums` | `toLocaleDateString('ar-EG')` |
| النوع (Type Badge) | `text-center` | See badge spec below |
| الحالة (Status Badge) | `text-center` | See badge spec below |
| الإجراءات (Actions) | `flex items-center justify-center gap-1.5` | 3 icon-text buttons |

---

## 5. Badges

### Member Type Badge

| Type | Classes |
|---|---|
| عضو فريق (Team) | `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800` + `Award w-3 h-3` icon |
| عضو (Regular) | `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800` + `Users w-3 h-3` icon |

### Status Badge

| Status | Classes |
|---|---|
| نشط (Active) | `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700` |
| قيد الانتظار (Pending) | `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800` |

---

## 6. Action Buttons (per row)

Three buttons in each row's actions cell, each `size="sm"` with `h-8 px-3 gap-1.5`:

| Button | Icon | Text | Variant | Color Scheme | Guard |
|---|---|---|---|---|---|
| مراجعة | `Eye h-3.5 w-3.5` | مراجعة | `outline` | `border-primary/40 text-primary hover:bg-primary/10` | `VIEW_MEMBERS` |
| اعتماد | `Check h-3.5 w-3.5` / `Loader2 animate-spin` | اعتماد / جارٍ... | `outline` | `border-emerald-500/40 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40` | `MANAGE_MEMBERSHIP_REQUEST` |
| طباعة | `Printer h-3.5 w-3.5` | طباعة | `outline` | Default (no special color) | None |

- **اعتماد** is disabled if `record.status === 'active'` or if approval is in progress
- Approval loading state: replaces Check icon with spinning `Loader2`, text becomes `جارٍ...`

---

## 7. Dialogs

### 7a. Review Dialog (مراجعة)

- Size: `max-w-3xl max-h-[90vh] overflow-hidden flex flex-col`
- Has two tabs: **👤 بيانات العضو** and **🖼️ المستندات والصور**
- Active tab indicator: `border-b-2 border-primary text-primary`
- Inactive tab: `border-transparent text-muted-foreground hover:text-foreground`

**Tab 1 — Member Data:**

- Profile header card: `flex items-center gap-4 p-4 bg-muted/40 rounded-xl` with avatar photo (`w-20 h-24 rounded-xl`)
- Data fields grid: `grid grid-cols-1 sm:grid-cols-2 gap-3`, each field in `bg-background border border-border rounded-lg px-4 py-2.5`
  - Label: `text-[11px] text-muted-foreground font-medium mb-0.5`
  - Value: `text-sm font-semibold`
- Fields shown: National ID, Phone, Birthdate (with computed age), Registration date+time, Gender, Social status, Address (full-width `sm:col-span-2`)
- Special data section: `border border-primary/20 bg-primary/5 rounded-xl p-4` — shows membership type, job, and sports teams (team members only)
- Sports teams display: `bg-amber-50 border border-amber-200 rounded-lg` with pill tags `bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full`

**Tab 2 — Documents:**

- Personal photo: centered, `h-48 w-auto rounded-xl border-2 border-border shadow-md`, clickable (opens full-size in new tab)
- National ID front/back: `grid grid-cols-1 sm:grid-cols-2 gap-4`, each in `aspect-[1.6/1]` container with `hover:border-primary/50` transition
- Medical report: full-width `min-h-[220px]` container with `hover:border-orange-400/60` transition
- Missing files show: `FileText` icon + text placeholder inside dashed-border container

**Footer:**
- Approve button: `bg-green-600 hover:bg-green-700 text-white gap-2 px-8` (guarded by `MANAGE_MEMBERSHIP_REQUEST`)
- Close button: `variant="outline" px-8`

---

### 7b. Print Dialog (طباعة)

- Size: `max-w-4xl h-[90vh] overflow-y-auto`
- Print-safe styles: `print:max-w-none print:h-auto print:overflow-visible`
- Printable area ID: `#printable-form` — used by `@media print` CSS isolation

**Print Form Layout:**

```
┌─────────────────────────────────────────┐
│  قيمة الإستمارة (٢٥٠ ج)    [HUC Logo]  │
│                          نادي جامعة حلوان│
├─────────────────────────────────────────┤
│  [Photo]  │  الاسم: ___________________  │
│  [32×40]  │  تاريخ الميلاد: ___________  │
│           │  النوع: ___________________  │
│           │  العنوان: _________________  │
│           │  الحالة الاجتماعية: ○○○○○   │
│           │  الهاتف واتس اب: __________  │
├─────────────────────────────────────────┤
│  إقرار (Declaration paragraph)          │
│  تحريراً في  /  /  20م   |  التوقيع: ___ │
└─────────────────────────────────────────┘
```

- Watermark: `HUC` text at `text-[150px] font-bold opacity-[0.05]` centered behind fields
- Fields use `border-b border-dotted border-black` underline pattern
- Social status: radio-circle row `['اعزب', 'متزوج', 'متزوج ويعول', 'ارمل', 'مطلق']` — filled circle `bg-black` for matched status

---

### 7c. Add Member Dialog (إضافة عضو جديد)

- Size: `max-w-3xl`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Fields: الاسم (عربي), الاسم (English), الرقم القومي, رقم الهاتف, تاريخ الميلاد, النوع (Select), العنوان (full-width), الحالة الاجتماعية (Select), الوظيفة, عدد الأبناء
- Save button: `bg-[#1b71bc] hover:bg-[#1b71bc]/90`

---

## 8. Color & Token Reference

| Token | Usage |
|---|---|
| `text-primary` | Icon accents, review button, active tab indicator |
| `bg-primary` | Spinner ring, section headings |
| `#1b71bc` | Brand blue — Save/Print action buttons (hardcoded) |
| `bg-blue-100 text-blue-800` | Regular member type badge |
| `bg-amber-100 text-amber-800` | Team member type badge & pending status badge |
| `bg-emerald-100 text-emerald-700` | Active status badge |
| `bg-emerald-500/10` | Row flash on successful approval |
| `bg-muted/40` | Row hover background |
| `bg-muted/70 backdrop-blur` | Sticky table header |
| `text-muted-foreground` | Secondary text, column headers, empty states |
| `divide-border` | Row separators in tbody |
| `border-border` | All card/section borders |

---

## 9. Print CSS

Isolated via `@media print`:

```css
body * { visibility: hidden; }
#printable-form, #printable-form * { visibility: visible; }
#printable-form {
  position: fixed;
  left: 0; top: 0;
  width: 100%; height: 100%;
  margin: 0; padding: 2cm;
  background: white;
}
-webkit-print-color-adjust: exact !important;
print-color-adjust: exact !important;
```

---

## 10. Access Control (RoleGuard)

| Action | Required Privilege |
|---|---|
| مراجعة (Review button) | `VIEW_MEMBERS` |
| اعتماد (Approve button — in table row) | `MANAGE_MEMBERSHIP_REQUEST` |
| اعتماد (Approve button — in review dialog footer) | `MANAGE_MEMBERSHIP_REQUEST` |

Buttons wrapped in `<RoleGuard privilege="...">` are hidden entirely if the user lacks the required privilege.
