# UI Visual Guide: Contextual Search Workspace

## 🎨 Complete UI Layout

### Top Header Bar
```
┌────────────────────────────────────────────────────────────────────┐
│ 🏠 Home > 📦 Merchandising > Item Maintenance                      │
│                                                                      │
│ Item Maintenance    [🔍 Search by SKU, UPC, or description...] [🔽]│
└────────────────────────────────────────────────────────────────────┘
```
- **Color**: White background with subtle shadow
- **Breadcrumb**: Gray text, blue on hover
- **Search Bar**: Centered, max-width, blue focus ring
- **Filter Button**: Blue background when active

---

### Main Layout (Side-by-Side)

```
┌──────────────┬────────────────────────────────────────────────────┐
│ FILTER       │ MAIN CONTENT                                        │
│ PANEL        │                                                     │
│ (320px)      │ [Search Bar] [Sort Controls] [Saved Searches]      │
│              │                                                     │
│ ┌──────────┐ │ Active Filters: [Dept: 01 ×] [Vendor: A ×]         │
│ │ Filters  │ │                                                     │
│ │     [×]  │ │ ┌─────────────────────────────────────────────┐    │
│ ├──────────┤ │ │ 1,234 records found      [Load Results]     │    │
│ │          │ │ └─────────────────────────────────────────────┘    │
│ │ Item     │ │                                                     │
│ │ Details  │ │ [Results Grid - Placeholder]                      │
│ │ ▼        │ │                                                     │
│ │ • SKU    │ │                                                     │
│ │ • Desc   │ │                                                     │
│ │ • Size   │ │                                                     │
│ │ • Color  │ │                                                     │
│ │          │ │                                                     │
│ │ Hierarchy││                                                     │
│ │ ▼        │ │                                                     │
│ │ • Dept   │ │                                                     │
│ │ • Class  │ │                                                     │
│ │ • Sub    │ │                                                     │
│ │          │ │                                                     │
│ │ [Apply]  │ │                                                     │
│ │ [Reset]  │ │                                                     │
│ └──────────┘ │                                                     │
└──────────────┴────────────────────────────────────────────────────┘
```

---

## 📱 Component Details

### 1. Header Bar Component
**Location**: Top of page
**Features**:
- Breadcrumb navigation (Home > Merchandising > Item Maintenance)
- Page title: "Item Maintenance"
- Global search input with search icon
- Filter toggle button (blue when active)

**Visual Style**:
- White background (#FFFFFF)
- Border bottom (gray-200)
- Shadow-sm
- Padding: 24px horizontal, 16px vertical

---

### 2. Filter Panel Component
**Location**: Left sidebar (320px width)
**State**: Collapsible (can be hidden)

**Sections** (Accordion-based):
1. **Item Details** (expanded by default)
   - SKU/UPC text input
   - Description text input
   - Size dropdown
   - Color text input

2. **Hierarchy** (expanded by default)
   - Department dropdown
   - Class dropdown
   - Subclass dropdown

3. **Vendor**
   - Vendor Name dropdown
   - Vendor Color text input
   - Vendor Mode (Primary/Secondary radio buttons)

4. **Pricing**
   - Wholesale Price (Min/Max number inputs)
   - Retail Price (Min/Max number inputs)
   - Markdown Price (Min/Max number inputs)

5. **Status & Attributes**
   - Active Code dropdown
   - Season dropdown
   - Label/Ticket dropdown

6. **Dates**
   - Preset buttons (Today, Last 7/30/90 days)
   - Last Modified Date (From/To date pickers)
   - Creation Date (From/To date pickers)

**Actions**:
- "Apply Filters" button (blue, full-width)
- "Reset" button (outline, full-width)

**Visual Style**:
- White background
- Border right (gray-200)
- Scrollable content area
- Rounded sections (rounded-lg)

---

### 3. Main Content Area

#### Search Bar Row
- **Search Input**: With search icon, debounced, "Search" button
- **Sort Controls**: Field dropdown + Direction dropdown
- **Saved Searches Button**: Opens dialog

#### Active Filters Bar
- **Display**: Only shows when filters are applied
- **Format**: Chips/badges with × button
- **Example**: `[Department: 01 ×] [Vendor: A ×]`

#### Record Count Preview
- **Display**: "X records found"
- **Action**: "Load Results" button (blue)
- **Background**: Gray-50

#### Results Area
- **Placeholder**: "Results Grid Area"
- **Note**: ItemsDataGrid component (out of scope)

---

## 🎨 Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Button | Blue | #1976D2 |
| Primary Hover | Dark Blue | #1565C0 |
| Background | Light Gray | #F9FAFB |
| Border | Gray | #E5E7EB |
| Text Primary | Dark Gray | #111827 |
| Text Secondary | Medium Gray | #374151 |
| Text Tertiary | Light Gray | #6B7280 |

---

## 🔄 Interactive States

### Search Bar
- **Default**: Gray border
- **Focus**: Blue border (#1976D2) + blue ring
- **History Dropdown**: Appears on focus (if history exists)
- **Autocomplete**: Shows suggestions below input

### Filter Panel
- **Open**: Visible, 320px width
- **Closed**: Hidden (filter button shows blue background)
- **Accordion**: Expand/collapse sections
- **Inputs**: All controlled, update filter state

### Buttons
- **Primary**: Blue background, white text
- **Hover**: Darker blue
- **Outline**: White background, gray border
- **Hover (Outline)**: Light gray background

### Active Filters
- **Chip**: Gray background, rounded-full
- **Hover (×)**: Darker gray background
- **Click ×**: Removes filter, updates search

---

## 📐 Spacing & Typography

### Spacing
- **Padding**: 16px (p-4), 24px (p-6)
- **Gap**: 8px (gap-2), 16px (gap-4)
- **Border Radius**: 8px (rounded-lg)

### Typography
- **Headings**: font-semibold, text-gray-900
- **Labels**: text-sm, text-gray-700
- **Body**: text-gray-600
- **Placeholders**: text-gray-500

---

## 🖼️ Visual Preview

A static HTML preview has been created at:
**`item-maintenance-v2/frontend/public/preview.html`**

Open this file in a browser to see a visual representation of the UI!

---

## ✨ Key Features Visible

1. ✅ **Clean, Modern Design** - Matches design prototype
2. ✅ **Organized Layout** - Filter panel + main content
3. ✅ **Clear Hierarchy** - Header, filters, content
4. ✅ **Interactive Elements** - Buttons, inputs, dropdowns
5. ✅ **Active States** - Visual feedback on interactions
6. ✅ **Responsive Ready** - Flexbox layout

---

## 🚀 To See It Live

1. **Static Preview**: Open `frontend/public/preview.html` in browser
2. **Full App**: 
   ```bash
   cd item-maintenance-v2/frontend
   npm install
   npm run dev
   ```

The UI is fully implemented and ready to use! 🎉

