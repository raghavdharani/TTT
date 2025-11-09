# Spec Requirements: Contextual Search Workspace

## Initial Description

**Epic**: MER-1228 - Item Maintenance V2 - EA MVP  
**Story**: MER-1231: Contextual Search Workspace  
**User Story:** As a merchandising user, I need a flexible search interface that adapts to my workflow so I can quickly find and filter the products I need to maintain.

**Requirements:**
- Global quick search bar supporting:
  - SKU (UPC) search
  - Style number search
  - Vendor search
  - Description keyword search
- Collapsible filter panel with adaptive sections:
  - **Hierarchy Filters:** Department, Class, Sub-class
  - **Activity Filters:** Status, Last Modified Date, Creation Date
  - **Vendor Filters:** Primary Vendor, Secondary Vendor toggle
- Record count preview before loading grid
- Search performance target: ≤ 3s for ≤ 20K records

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming a single search box that searches all fields simultaneously with partial matching (e.g., "ABC123" matches SKU, Style, or Vendor). Is that correct, or should we support field-specific search modes?

**Answer:** Yes, single search box that searches all fields simultaneously with partial matching.

**Q2:** I'm assuming the filter panel should be collapsed by default with clear expand/collapse controls, and auto-expanding relevant sections when vendor mode changes. Is that correct?

**Answer:** Yes, collapsed by default with expand/collapse controls, and auto-expanding relevant sections when vendor mode changes.

**Q3:** I'm assuming the record count shows dynamically as filters are applied, with a "Load Results" button to actually fetch the grid data. Is that correct?

**Answer:** Yes, record count shows dynamically as filters are applied, with a "Load Results" button to fetch grid data.

**Q4:** I'm assuming debounced search with manual "Search" button as backup. Is that correct?

**Answer:** Yes, debounced search with manual "Search" button as backup.

**Q5:** I'm assuming a collapsible sidebar on the left with the search bar at the top. Is that correct?

**Answer:** Yes, collapsible sidebar on the left with search bar at the top.

**Q6:** I'm assuming the Primary/Secondary Vendor toggle is in the Vendor Filters section of the filter panel. Is that correct?

**Answer:** Yes, Primary/Secondary Vendor toggle in the Vendor Filters section.

**Q7:** I'm assuming both preset buttons (Today, Last 7 days, etc.) plus custom date pickers for date filters. Is that correct?

**Answer:** Yes, both preset buttons and custom date pickers.

**Q8:** I'm assuming we're NOT including saved search sessions (that's MER-1232), advanced sorting in the search UI (handled by grid), or search history/autocomplete. Are there other exclusions?

**Answer:** User wants saved search sessions, advanced sorting in search UI, and search history/autocomplete INCLUDED in this feature (not excluded).

### Existing Code to Reference

No similar existing features identified for reference.

### Follow-up Questions

None required.

## Visual Assets

### Files Provided:

**Retail Dashboard Design** (React Application Prototype):
- Complete working React application demonstrating the search workspace design
- Source: Figma design at https://www.figma.com/design/7LJSAkCHb7ZAtIvLWjuviZ/Retail-Dashboard-Design
- Technology: React + TypeScript + Vite + shadcn/ui components

### Visual Insights:

**Layout Structure:**
- Header bar at top with breadcrumb navigation
- Global search bar positioned in header (center, max-width 2xl)
- Collapsible filter panel on left side (320px width when open)
- Main content area with data grid on right
- Fixed action button (FAB) in bottom-right corner

**Search Bar Design:**
- Located in HeaderBar component, centered in header
- Search icon on left side of input
- Placeholder: "Search by SKU, UPC, or description..."
- Rounded corners (rounded-lg)
- Primary color focus: #1976D2 (blue)
- Full-width with max-width constraint

**Filter Panel Design:**
- Collapsible sidebar (w-80 = 320px width)
- White background with border-right
- Header with "Filters" title and close button (X icon)
- Scrollable content area
- Accordion-based organization with multiple sections:
  - Item Details (SKU/UPC, Description, Size, Color)
  - Hierarchy (Department, Class, Subclass)
  - Vendor (Vendor Name, Vendor Color)
  - Pricing (Wholesale Price, Retail Price, Markdown Price - min/max ranges)
  - Status & Attributes (Active Code, Season, Label/Ticket)
  - Dates (Last Modified Date - date range picker)
- Default expanded sections: "item-details" and "hierarchy"
- Apply Filters button (primary blue) and Reset button at bottom
- Uses shadcn/ui components (Accordion, Select, Input, Calendar, Popover)

**Filter Panel Toggle:**
- Filter icon button in header bar
- Active state shows blue background (bg-blue-50) and blue border
- Clicking toggles panel visibility

**Design System:**
- Primary color: #1976D2 (blue), hover: #1565C0
- Uses Tailwind CSS utility classes
- shadcn/ui component library
- Rounded corners (rounded-lg) throughout
- Consistent spacing and typography
- Gray color palette for text and borders

**User Flow:**
1. User types in global search bar (debounced)
2. User can toggle filter panel open/closed
3. User expands/collapses filter accordion sections
4. User applies filters via "Apply Filters" button
5. Active filters displayed (likely as chips/badges in grid area)
6. Record count updates dynamically
7. User clicks "Load Results" to fetch grid data

**Fidelity Level:** High-fidelity working prototype with actual React components

## Requirements Summary

### Functional Requirements

**Global Search:**
- Single search input field in header bar
- Searches across SKU, Style, Vendor, and Description simultaneously
- Partial matching support
- Debounced search (500ms delay suggested)
- Manual "Search" button as backup
- Search icon on left side of input
- Placeholder text: "Search by SKU, UPC, or description..."

**Filter Panel:**
- Collapsible sidebar (320px width when open)
- Located on left side of screen
- Collapsed by default
- Toggle button in header bar (Filter icon)
- Active state visual indicator (blue background when open)
- Scrollable content area
- Accordion-based organization with multiple collapsible sections

**Filter Sections:**
1. **Item Details** (default expanded):
   - SKU/UPC input
   - Description input
   - Size dropdown
   - Color input

2. **Hierarchy** (default expanded):
   - Department dropdown
   - Class dropdown
   - Subclass dropdown

3. **Vendor:**
   - Vendor Name dropdown
   - Vendor Color input
   - Primary/Secondary Vendor toggle (to be added)

4. **Pricing:**
   - Wholesale Price range (min/max)
   - Retail Price range (min/max)
   - Markdown Price range (min/max)

5. **Status & Attributes:**
   - Active Code dropdown (Status)
   - Season dropdown
   - Label/Ticket dropdown

6. **Dates:**
   - Last Modified Date range picker
   - Creation Date range picker (to be added)
   - Preset buttons (Today, Last 7 days, Last 30 days, etc.)
   - Custom date pickers (from/to)

**Filter Actions:**
- "Apply Filters" button (primary blue, full-width)
- "Reset" button (outline, full-width)
- Active filters displayed as chips/badges (in grid area)
- Ability to remove individual active filters

**Record Count Preview:**
- Shows count dynamically as filters are applied
- Displayed before grid loads
- "Load Results" button to fetch actual grid data
- Performance target: ≤3s for ≤20K records

**Additional Features (In Scope):**
- Saved search sessions (MER-1232 functionality included)
- Advanced sorting in search UI (beyond grid sorting)
- Search history/autocomplete functionality

**Auto-Expand Logic:**
- Filter panel sections auto-expand based on vendor mode
- Relevant sections expand when Primary/Secondary Vendor mode changes

### Reusability Opportunities

**Components from Design Prototype:**
- FilterPanel component structure and layout
- HeaderBar component with search bar
- Accordion-based filter organization
- Date picker implementation
- Filter application/reset logic

**UI Components (shadcn/ui):**
- Accordion for collapsible sections
- Select for dropdowns
- Input for text fields
- Calendar and Popover for date pickers
- Button for actions
- ScrollArea for scrollable content

**Backend Patterns to Investigate:**
- Search query builder for multi-field search
- Filter application logic
- Record counting optimization
- Caching strategy for search results

### Scope Boundaries

**In Scope:**
- Global search bar with multi-field search
- Collapsible filter panel with accordion sections
- All filter types specified (Hierarchy, Activity, Vendor, Pricing, Status, Dates)
- Record count preview
- Dynamic filter application
- Filter reset functionality
- Active filter display and removal
- Primary/Secondary Vendor mode toggle
- Date range filters with presets and custom pickers
- Debounced search with manual trigger
- Performance optimization (≤3s for ≤20K records)
- Saved search sessions (MER-1232 included)
- Advanced sorting in search UI
- Search history/autocomplete

**Out of Scope:**
- Grid rendering (handled by separate component)
- Data editing (handled by other features)
- Export functionality (separate feature)
- Column customization (separate feature)

### Technical Considerations

**Frontend:**
- React 18+ with TypeScript
- shadcn/ui component library (matches design prototype)
- Tailwind CSS for styling
- State management for search query, filters, and panel state
- Debouncing implementation for search input

**Backend:**
- Search API endpoint supporting multi-field search
- Filter application logic
- Record count endpoint (optimized, cached)
- Query optimization with indexed fields
- Redis caching for search results
- Pagination support (default 1000 records/page)

**Performance:**
- Search response time: ≤3s for ≤20K records
- Debounced search to reduce API calls
- Query result caching (Redis)
- Indexed database fields for WHERE clauses
- Optimized SQL queries

**Integration Points:**
- KWI database (articles, artven, artvc tables)
- Reference data tables (coll, types, patterns) for dropdowns
- Grid component for displaying results
- Authentication/authorization for user context

**Design System Alignment:**
- Primary color: #1976D2 (blue)
- Rounded corners (rounded-lg)
- Consistent spacing and typography
- shadcn/ui components
- Tailwind CSS utility classes

