# UI Preview: Contextual Search Workspace

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER BAR (White, Shadow, Border Bottom)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Home > Merchandising > Item Maintenance                                     │
│                                                                               │
│  Item Maintenance    [🔍 Search by SKU, UPC, or description...]  [Filter]    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────────────────────┐
│              │ MAIN CONTENT AREA                                            │
│              ├──────────────────────────────────────────────────────────────┤
│ FILTER       │ [🔍 Search by SKU, UPC, or description...]  [Sort: ▼]  [Saved]│
│ PANEL        │                                                               │
│ (320px)      │ Active Filters: [Department: 01 ×] [Vendor: A ×]             │
│              │                                                               │
│ ┌──────────┐ │ ┌─────────────────────────────────────────────────────────┐   │
│ │ Filters  │ │ │ 1,234 records found                    [Load Results]  │   │
│ │     [×]  │ │ └─────────────────────────────────────────────────────────┘   │
│ ├──────────┤ │                                                               │
│ │          │ │ [Results Grid Area - Out of Scope]                            │
│ │ Item     │ │                                                               │
│ │ Details  │ │                                                               │
│ │ ▼        │ │                                                               │
│ │ • SKU    │ │                                                               │
│ │ • Desc   │ │                                                               │
│ │ • Size   │ │                                                               │
│ │ • Color  │ │                                                               │
│ │          │ │                                                               │
│ │ Hierarchy│ │                                                               │
│ │ ▼        │ │                                                               │
│ │ • Dept   │ │                                                               │
│ │ • Class  │ │                                                               │
│ │ • Sub    │ │                                                               │
│ │          │ │                                                               │
│ │ Vendor   │ │                                                               │
│ │          │ │                                                               │
│ │ Pricing  │ │                                                               │
│ │          │ │                                                               │
│ │ Status   │ │                                                               │
│ │          │ │                                                               │
│ │ Dates    │ │                                                               │
│ │          │ │                                                               │
│ │          │ │                                                               │
│ │ [Apply]  │ │                                                               │
│ │ [Reset]  │ │                                                               │
│ └──────────┘ │                                                               │
│              │                                                               │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Header Bar (Top)
- **Breadcrumb Navigation**: Home > Merchandising > Item Maintenance
- **Page Title**: "Item Maintenance"
- **Global Search Bar**: 
  - Search icon on left
  - Placeholder: "Search by SKU, UPC, or description..."
  - Centered, max-width constraint
- **Filter Toggle Button**: Blue when active

### 2. Filter Panel (Left Sidebar, 320px)
- **Header**: "Filters" with close button (×)
- **Scrollable Content** with 6 accordion sections:
  1. **Item Details** (expanded by default)
     - SKU/UPC input
     - Description input
     - Size dropdown
     - Color input
  
  2. **Hierarchy** (expanded by default)
     - Department dropdown
     - Class dropdown
     - Subclass dropdown
  
  3. **Vendor**
     - Vendor Name dropdown
     - Vendor Color input
     - Vendor Mode (Primary/Secondary radio buttons)
  
  4. **Pricing**
     - Wholesale Price (Min/Max inputs)
     - Retail Price (Min/Max inputs)
     - Markdown Price (Min/Max inputs)
  
  5. **Status & Attributes**
     - Active Code dropdown
     - Season dropdown
     - Label/Ticket dropdown
  
  6. **Dates**
     - Preset buttons (Today, Last 7/30/90 days)
     - Last Modified Date (From/To date pickers)
     - Creation Date (From/To date pickers)

- **Footer Actions**:
  - "Apply Filters" button (blue, full-width)
  - "Reset" button (outline, full-width)

### 3. Main Content Area (Right)
- **Search Bar Row**:
  - Search input (with debouncing)
  - Sort controls (Field: Relevance/Last Modified/etc., Direction: Asc/Desc)
  - Saved Searches button

- **Active Filters Bar** (when filters applied):
  - Shows active filters as removable chips/badges
  - Each chip has × button to remove

- **Record Count Preview**:
  - "X records found"
  - "Load Results" button

- **Results Area**:
  - Loading state
  - Error messages
  - Results grid (out of scope, placeholder)

## Color Scheme

- **Primary Blue**: #1976D2 (buttons, active states)
- **Primary Dark**: #1565C0 (hover states)
- **Background**: Gray-50 (#F9FAFB)
- **Borders**: Gray-200 (#E5E7EB)
- **Text**: Gray-900 (headings), Gray-700 (labels), Gray-600 (body)

## Interactive Features

1. **Search Bar**:
   - Debounced search (500ms)
   - Search history dropdown on focus
   - Autocomplete suggestions
   - Manual "Search" button

2. **Filter Panel**:
   - Collapsible sidebar
   - Accordion sections expand/collapse
   - All inputs are controlled
   - Apply/Reset buttons

3. **Active Filters**:
   - Display as chips
   - Click × to remove
   - Updates search automatically

4. **Saved Sessions**:
   - Dialog to save/load sessions
   - Auto-restore last session on load

## Responsive Design

- **Desktop**: Filter panel side-by-side with content
- **Tablet**: Filter panel can overlay
- **Mobile**: Filter panel full-screen overlay

## Design Notes

- Matches design prototype from `planning/visuals/Retail Dashboard Design`
- Uses Tailwind CSS utility classes
- Rounded corners (rounded-lg) throughout
- Consistent spacing and typography
- Accessible (ARIA labels, keyboard navigation)

