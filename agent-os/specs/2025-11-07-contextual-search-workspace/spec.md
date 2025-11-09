# Specification: Contextual Search Workspace

## Goal

Deliver a flexible search interface with adaptive filters that enables merchandising users to quickly find and filter products across SKU, Style, Vendor, and Description fields, with sub-3-second performance for datasets up to 20K records.

## User Stories

- As a merchandising user, I want to search across multiple product fields simultaneously so that I can quickly find products without knowing which specific field contains my search term
- As a merchandising user, I want to apply multiple filters through an organized panel so that I can narrow down large product catalogs to the exact items I need to maintain
- As a merchandising user, I want to see a record count preview before loading results so that I can verify my search criteria will return a manageable dataset

## Specific Requirements

**Global Search Bar**
- Single search input field positioned in header bar, centered with max-width constraint
- Search icon displayed on left side of input field
- Placeholder text: "Search by SKU, UPC, or description..."
- Searches across SKU, Style, Vendor, and Description fields simultaneously with partial matching
- Debounced search with 500ms delay to reduce API calls during typing
- Manual "Search" button as backup trigger option
- Rounded corners (rounded-lg) and primary color focus state (#1976D2)

**Collapsible Filter Panel**
- Sidebar positioned on left side of screen, 320px width when open
- Collapsed by default with toggle button in header bar (Filter icon)
- Active state visual indicator (blue background bg-blue-50 and blue border when open)
- Scrollable content area using ScrollArea component
- Header with "Filters" title and close button (X icon)
- Accordion-based organization with collapsible sections for different filter categories

**Filter Sections - Item Details**
- Accordion section default expanded on initial load
- SKU/UPC text input field
- Description text input field
- Size dropdown select populated from reference data
- Color text input field

**Filter Sections - Hierarchy**
- Accordion section default expanded on initial load
- Department dropdown select populated from `coll` reference table
- Class dropdown select populated from `types` reference table
- Subclass dropdown select with dependent options based on Class selection

**Filter Sections - Vendor**
- Accordion section with Vendor Name dropdown select
- Vendor Color text input field
- Primary/Secondary Vendor mode toggle (radio buttons or switch)
- Auto-expand this section when vendor mode changes

**Filter Sections - Pricing**
- Wholesale Price range with min/max number inputs
- Retail Price range with min/max number inputs
- Markdown Price range with min/max number inputs

**Filter Sections - Status & Attributes**
- Active Code dropdown (Status) with controlled vocabulary values
- Season dropdown select
- Label/Ticket dropdown select

**Filter Sections - Dates**
- Last Modified Date range picker with from/to date selection
- Creation Date range picker with from/to date selection
- Preset buttons for quick selection (Today, Last 7 days, Last 30 days, Last 90 days, This Month, This Year)
- Custom date pickers using Calendar component in Popover
- Date format: "Month Day, Year" (e.g., "November 7, 2025")

**Filter Actions**
- "Apply Filters" button at bottom of panel (primary blue #1976D2, full-width, rounded-lg)
- "Reset" button below Apply (outline variant, full-width, rounded-lg)
- Active filters displayed as removable chips/badges in grid area above results
- Individual filter removal via X icon on each chip

**Record Count Preview**
- Display record count dynamically as filters are applied, before grid loads
- Show count in format: "X records found" or "X results"
- "Load Results" button to fetch actual grid data after verifying count
- Performance target: count query completes ≤3s for ≤20K records

**Search History and Autocomplete**
- Search history dropdown appears below search input when focused
- Shows recent searches (last 10-20 queries)
- Autocomplete suggestions based on partial input matching SKU, Style, Vendor, or Description
- Clicking history item or autocomplete suggestion triggers search
- Clear history option available

**Saved Search Sessions**
- Save current search state (filters, sort order, search query) with a name
- List saved sessions in dropdown or sidebar section
- Load saved session to restore all search criteria
- Update existing saved session
- Delete saved session
- Auto-restore last session option (user preference)

**Advanced Sorting**
- Sort options available in search UI (beyond grid column sorting)
- Sort by: Relevance, Last Modified, Creation Date, Price (ascending/descending)
- Sort controls visible in header or filter panel
- Sort state persists with saved search sessions

**Performance Optimization**
- Backend query optimization using indexed fields for WHERE clauses
- Redis caching for search results with appropriate TTL
- Pagination support (default 1000 records per page)
- Connection pooling for database queries
- Query result counting optimized separately from data fetching

## Visual Design

**`planning/visuals/Retail Dashboard Design`**
- Header bar layout with breadcrumb navigation at top, search bar centered below
- Search input field with search icon on left, rounded corners, max-width 2xl constraint
- Filter panel as collapsible sidebar (320px width) with white background and right border
- Accordion sections with rounded borders, padding, and hover states
- Filter panel header with "Filters" title and X close button
- Apply Filters button (primary blue #1976D2) and Reset button (outline) at panel bottom
- Date picker implementation using Calendar component in Popover overlay
- Dropdown selects with rounded-lg styling and placeholder text
- Number input fields for price ranges displayed side-by-side with gap spacing
- Active filter chips/badges displayed above grid with X removal icons
- Filter toggle button in header with active state (blue background when panel open)
- Scrollable filter content area using ScrollArea component
- Consistent spacing, typography, and color palette throughout (gray text, blue accents)

## Existing Code to Leverage

**Design Prototype Components**
- FilterPanel component structure from `planning/visuals/Retail Dashboard Design/src/components/FilterPanel.tsx` provides complete accordion-based filter organization pattern
- HeaderBar component from `planning/visuals/Retail Dashboard Design/src/components/HeaderBar.tsx` demonstrates search bar placement and filter toggle implementation
- Date picker pattern using Calendar and Popover components from shadcn/ui library
- Filter application and reset logic flow from prototype

**shadcn/ui Component Library**
- Accordion component for collapsible filter sections with multiple items support
- Select component for dropdown fields with searchable options
- Input component for text and number fields with consistent styling
- Calendar and Popover components for date range selection
- Button component with variants (primary, outline) for actions
- ScrollArea component for scrollable filter panel content
- Badge component for active filter chips display

**Backend API Patterns**
- RESTful endpoint design following `/api/search` or `/api/articles/search` pattern
- Query parameters for filtering, sorting, and pagination per API standards
- SearchRequest and SearchResponse TypeScript interfaces for type safety
- Database query builder pattern using Prisma or TypeORM with indexed field optimization
- Redis caching strategy for search results and record counts

## Out of Scope

- Grid rendering and data display (handled by separate ItemsDataGrid component)
- Inline cell editing functionality (MER-1233 - separate feature)
- Real-time validation during editing (MER-1234 - separate feature)
- Mass operations on selected rows (MER-1237 - separate feature)
- Export functionality to CSV/Excel (MER-1248 - separate feature)
- Column visibility and layout customization (MER-1242 - separate feature)
- Item detail drawer or modal (separate component)
- User authentication and authorization logic (handled by existing auth system)
- Database schema changes to existing KWI tables (must work with current structure)
- Multi-vendor mode field restrictions (MER-1254 - V1 feature)

