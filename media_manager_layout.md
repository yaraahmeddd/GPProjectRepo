# Media Assets - Layout Structure

This document outlines the structural layout of the simplified Media Management page, omitting the sidebar and selection/bulk-action states.

## 1. Page Container
- **Layout:** Full width, centered content with maximum width (e.g., `max-w-7xl`).
- **Padding:** Generous outer margins (`32px` or `p-margin`).

## 2. Header Section
- **Layout:** Flex container (`flex-row`, `justify-between`, `items-center`).
- **Left Side (Titles):**
  - **H1 Page Title:** "Media Assets" (Typography: `headline-lg`, Color: `on-surface`).
  - **Subtitle:** "Manage and organize your company's media files." (Typography: `body-md`, Color: `outline`).
- **Right Side (Primary Action):**
  - **Upload Button:** Solid background (`primary`), Text (`on-primary`), with a cloud upload icon. Dimensions: min-height `48px`, rounded corners (`8px`).

## 3. Filters & Search Bar Section
- **Layout:** Flex container wrapped in a bordered surface card (`bg-surface-container-lowest`, `border-outline-variant`, rounded `xl`), `justify-between`.
- **Left Side (Filter Pills):**
  - Flex row with horizontal scrolling on smaller screens.
  - **Active Pill:** "All Media" (Background: `primary-container`, Text: `on-primary-container`, rounded `full`).
  - **Inactive Pills:** "Images", "Videos", "Documents" (Background: `surface-container-low`, Border: `outline-variant`, rounded `full`).
- **Right Side (Search):**
  - Relative container with a search icon positioned absolute left.
  - **Input Field:** Placeholder "Search files...", padding left for icon, rounded `lg`, focus ring in `primary` color.

## 4. Media Grid Section
- **Layout:** Responsive CSS Grid (`grid-cols-1` mobile, up to `grid-cols-4` on extra-large screens), gap `24px`.
- **Card Structure (Repeated):**
  - **Container:** `bg-surface-container-lowest`, bordered, rounded `xl`, overflow hidden. *NO selection checkbox.*
  - **Media Area:** Aspect ratio 16:9 (`aspect-video`), background `surface-container`.
    - **Overlay:** Badge top-left for media type (e.g., "Image", "Video").
  - **Details Area:** Padding `16px`.
    - **Title:** `headline-sm`, truncated to 1 line.
    - **Metadata:** `label-sm`, color `outline` (e.g., "Added 2 days ago • 4.2 MB").
    - **Actions Container:** Flex row, gap `8px`.
      - **Edit Button:** Ghost style / low surface background.
      - **Remove Button:** Ghost style / error color mapping.
