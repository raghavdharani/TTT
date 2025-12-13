# Item Maintenance V2 - User Stories

**Document Version:** 1.0  
**Date:** 2025-01-11  
**Status:** Ready for Sprint Planning

---

## Overview

This document organizes all user stories for Item Maintenance V2 into three versions:
- **MVP**: Minimum viable product with core functionality
- **V1**: Enhanced version with improved UX and additional features
- **V2**: Final/complete version with advanced capabilities

Each story follows the format:
- **Story ID**: Unique identifier
- **Title**: Descriptive name
- **User Story**: As a [user type], I want [goal] so that [benefit]
- **Acceptance Criteria**: Detailed requirements
- **Effort**: Estimated story points or days
- **Dependencies**: Related stories

---

## MVP (Minimum Viable Product)

**Goal**: Deliver core functionality that allows users to search, view, edit, and save item data.

**Timeline**: 4-6 weeks  
**Target Users**: Merchandising Managers, Buyers

---

### MVP-001: Global Quick Search

**Story ID**: MVP-001  
**Title**: Global Quick Search  
**Priority**: P0 - Critical  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **merchandising manager**, I want to **search for items by SKU, UPC, Style, Vendor, or Description** so that **I can quickly find the items I need to update**.

**Acceptance Criteria**:
- [ ] Search input field in header bar
- [ ] Search across fields: SKU, UPC, Style, Vendor, Description
- [ ] Debounced search (500ms delay)
- [ ] Search executes automatically or on Enter key
- [ ] Search results display in results table
- [ ] Empty state shown when no results
- [ ] Loading indicator during search
- [ ] Error handling for failed searches

**Technical Notes**:
- Backend: Query builder supports multi-field search
- Frontend: SearchBar component with debouncing
- Performance: Search completes in ≤3 seconds for ≤20K records

**Dependencies**: None

---

### MVP-002: Basic Filter Panel

**Story ID**: MVP-002  
**Title**: Basic Filter Panel  
**Priority**: P0 - Critical  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **buyer**, I want to **filter search results by hierarchy, item details, and pricing** so that **I can narrow down to specific items that need updates**.

**Acceptance Criteria**:
- [ ] Collapsible filter panel on left side
- [ ] Filter sections: Item Details, Hierarchy, Pricing, Status
- [ ] Item Details filters: SKU, Style, Description, Size, Color
- [ ] Hierarchy filters: Department, Class, Sub-Class (single select)
- [ ] Pricing filters: First Cost, Wholesale Cost, Retail Price (min/max)
- [ ] Status filters: Active Code, Status, Season
- [ ] "Apply Filters" button
- [ ] "Clear Filters" button
- [ ] Active filters displayed as badges
- [ ] Filter panel state persists (open/closed)

**Technical Notes**:
- FilterPanel component with accordion sections
- Filter state managed via useFilterState hook
- Filters converted to SearchFilters type for API

**Dependencies**: MVP-001

---

### MVP-003: Results Table Display

**Story ID**: MVP-003  
**Title**: Results Table Display  
**Priority**: P0 - Critical  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **merchandising manager**, I want to **view search results in a table format** so that **I can see all relevant item information at a glance**.

**Acceptance Criteria**:
- [ ] Table displays all 35 standard columns
- [ ] Columns: UPC, First Digits, Vendor, Style, Color Name, Vendor Color, Size, Description, POS Description, First Cost, Wholesale Cost, Retail Price, Markdown Price, Markdown Date, Outlet Price, Outlet Markdown, Outlet Markdown Date, Department, Class, Sub-Class, Sub Dept, Attribute 1-3, Season, Prepack, Last Modified, Alt Style/SKU, Active Code, Status, Available On Web, Stat 3, Item Picture, Employee Price, Web Back Order Eligible
- [ ] Horizontal scrolling for many columns
- [ ] Sticky header row
- [ ] Row hover highlighting
- [ ] Empty state when no results
- [ ] Loading skeleton during data fetch
- [ ] Error state display

**Technical Notes**:
- ResultsGrid component
- Responsive table with horizontal scroll
- Virtual scrolling for large datasets (optional optimization)

**Dependencies**: MVP-001, MVP-002

---

### MVP-004: Inline Cell Editing

**Story ID**: MVP-004  
**Title**: Inline Cell Editing  
**Priority**: P0 - Critical  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **buyer**, I want to **edit item data directly in the table cells** so that **I can quickly update multiple items without navigating to separate edit pages**.

**Acceptance Criteria**:
- [ ] Double-click cell to enter edit mode
- [ ] Text fields: Direct text input
- [ ] Number fields: Numeric input with validation
- [ ] Date fields: Date picker
- [ ] Dropdown fields: Select dropdown with options
- [ ] Enter key saves changes
- [ ] Escape key cancels edit
- [ ] Tab key moves to next editable cell
- [ ] Visual feedback: Yellow highlight for pending changes
- [ ] Read-only fields clearly marked (lock icon, grayed out)
- [ ] Field type detection and appropriate input control

**Technical Notes**:
- SmartEditableCell component
- Field type configuration (text, number, date, dropdown)
- Pending changes tracked in state

**Dependencies**: MVP-003

---

### MVP-005: Row Selection with Checkboxes

**Story ID**: MVP-005  
**Title**: Row Selection with Checkboxes  
**Priority**: P0 - Critical  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **merchandising manager**, I want to **select specific rows using checkboxes** so that **I can save only the items I've modified**.

**Acceptance Criteria**:
- [ ] Checkbox in first column of each row
- [ ] "Select All" checkbox in header
- [ ] Right-click on checkbox shows context menu:
  - [ ] Check All
  - [ ] Uncheck All
  - [ ] Check Selected
  - [ ] Uncheck Selected
- [ ] Visual indication of selected rows
- [ ] Selected row count displayed
- [ ] Selection state persists during scrolling

**Technical Notes**:
- Checkbox component integration
- Selection state managed in ResultsGrid
- Context menu for bulk selection

**Dependencies**: MVP-003

---

### MVP-006: Save Changes (Book Functionality)

**Story ID**: MVP-006  
**Title**: Save Changes (Book Functionality)  
**Priority**: P0 - Critical  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **buyer**, I want to **save my changes to the database** so that **the item updates are persisted and available to other users**.

**Acceptance Criteria**:
- [ ] "Book" or "Save Changes" button in header or results area
- [ ] Button only enabled when:
  - [ ] There are pending changes AND
  - [ ] At least one row is checked
- [ ] Clicking button saves only checked rows
- [ ] Only modified fields are saved (not entire row)
- [ ] Backend validates all changes before saving
- [ ] Transaction-based save (all or nothing per row)
- [ ] Success notification with count of saved rows
- [ ] Error handling: Display errors for failed rows
- [ ] Failed rows remain in pending changes state
- [ ] Successfully saved rows cleared from pending changes
- [ ] Data refreshed from server after save

**Technical Notes**:
- Backend: POST /api/items/bulk-update endpoint
- Request body: Array of { articleId, fields: { fieldName: newValue } }
- Response: { success, updatedCount, failedCount, errors[] }
- Frontend: Collect pending changes for checked rows only

**Dependencies**: MVP-004, MVP-005

---

### MVP-007: Column Visibility Toggle

**Story ID**: MVP-007  
**Title**: Column Visibility Toggle  
**Priority**: P1 - High  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **merchandising manager**, I want to **show or hide columns** so that **I can focus on the fields most relevant to my task**.

**Acceptance Criteria**:
- [ ] Column customization button (gear icon) in header
- [ ] Dialog/modal with list of all columns
- [ ] Checkbox to toggle visibility for each column
- [ ] "Select All" / "Deselect All" buttons
- [ ] Preview of visible columns
- [ ] "Apply" button to save changes
- [ ] "Reset" button to restore defaults
- [ ] Column visibility persists in localStorage
- [ ] Minimum 3 columns must remain visible

**Technical Notes**:
- ColumnCustomizer component
- ColumnConfig type with visible flag
- Persist to localStorage

**Dependencies**: MVP-003

---

### MVP-008: Sort by Column Headers

**Story ID**: MVP-008  
**Title**: Sort by Column Headers  
**Priority**: P1 - High  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **buyer**, I want to **sort results by clicking column headers** so that **I can organize data in the order that makes sense for my workflow**.

**Acceptance Criteria**:
- [ ] Click column header to sort ascending
- [ ] Click again to sort descending
- [ ] Click third time to remove sort
- [ ] Sort indicator (arrow icon) in header
- [ ] Only one column sorted at a time
- [ ] Sort persists when applying new filters
- [ ] Sort state included in saved sessions

**Technical Notes**:
- Sort state in Redux store
- Backend: Sort parameter in SearchRequest
- Frontend: SortControls component

**Dependencies**: MVP-003

---

### MVP-009: Record Count Preview

**Story ID**: MVP-009  
**Title**: Record Count Preview  
**Priority**: P1 - High  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **merchandising manager**, I want to **see how many records match my search criteria** so that **I can decide whether to refine my search before loading results**.

**Acceptance Criteria**:
- [ ] Record count displayed after applying filters
- [ ] Count shown before loading full results
- [ ] Format: "X records found" or "X items match your criteria"
- [ ] "Load Results" button to fetch full data
- [ ] Count updates when filters change
- [ ] Loading indicator during count calculation
- [ ] Error handling if count fails

**Technical Notes**:
- Backend: GET /api/search/count endpoint
- Optimized COUNT query
- RecordCount component

**Dependencies**: MVP-002

---

### MVP-010: Basic Validation

**Story ID**: MVP-010  
**Title**: Basic Validation  
**Priority**: P1 - High  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **buyer**, I want to **receive validation feedback when entering invalid data** so that **I can correct errors before saving**.

**Acceptance Criteria**:
- [ ] Required field validation (if applicable)
- [ ] Number field validation (numeric only, min/max)
- [ ] Date field validation (valid date format)
- [ ] Business rule: Retail Price ≥ Wholesale Cost
- [ ] Visual feedback: Red border on invalid fields
- [ ] Error message tooltip on hover
- [ ] Validation on blur (when leaving field)
- [ ] Save button disabled if validation errors exist
- [ ] Summary of validation errors before save

**Technical Notes**:
- Client-side validation rules
- Validation schema per field type
- Error state in SmartEditableCell

**Dependencies**: MVP-004

---

### MVP-011: Empty State and Error Handling

**Story ID**: MVP-011  
**Title**: Empty State and Error Handling  
**Priority**: P1 - High  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **user**, I want to **see helpful messages when there are no results or errors occur** so that **I understand what happened and what to do next**.

**Acceptance Criteria**:
- [ ] Empty state when no search criteria entered
- [ ] Empty state when search returns no results
- [ ] Empty state suggests refining search
- [ ] Error state for API failures
- [ ] Error state for network issues
- [ ] Error messages are user-friendly (not technical)
- [ ] Retry button for failed operations
- [ ] Loading states for all async operations

**Technical Notes**:
- EmptyState component
- Error boundary for React errors
- Toast notifications for errors

**Dependencies**: MVP-001, MVP-003

---

## V1 (Enhanced Version)

**Goal**: Add enhanced features for improved productivity and user experience.

**Timeline**: 6-8 weeks  
**Target Users**: All user types

---

### V1-001: Saved Search Sessions

**Story ID**: V1-001  
**Title**: Saved Search Sessions  
**Priority**: P1 - High  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **merchandising manager**, I want to **save my search criteria and filters** so that **I can quickly return to frequently used searches**.

**Acceptance Criteria**:
- [ ] "Save Session" button in header
- [ ] Dialog to enter session name
- [ ] Save current: search query, filters, sort, vendor mode
- [ ] List of saved sessions in dropdown
- [ ] Load saved session restores all criteria
- [ ] Delete saved session option
- [ ] Edit session name
- [ ] Auto-restore last session option (configurable)
- [ ] Sessions are user-specific
- [ ] Maximum 50 saved sessions per user

**Technical Notes**:
- Backend: Sessions API (CRUD)
- Database: search_sessions table
- Frontend: SavedSessions component

**Dependencies**: MVP-001, MVP-002

---

### V1-002: Multi-Select Filters

**Story ID**: V1-002  
**Title**: Multi-Select Filters  
**Priority**: P1 - High  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **buyer**, I want to **select multiple values for hierarchy and vendor filters** so that **I can search across multiple departments, classes, or vendors at once**.

**Acceptance Criteria**:
- [ ] Multi-select component for: Department, Class, Sub-Class, Sub-Dept, Attribute 1-3, Color, Vendor
- [ ] Dropdown with checkboxes
- [ ] Display "X selected" when multiple items chosen
- [ ] "Clear all" button
- [ ] Selected items highlighted
- [ ] Search/filter within dropdown for long lists
- [ ] Selected values shown as individual filter badges
- [ ] Backend supports array of values in filters

**Technical Notes**:
- MultiSelect component
- FilterValues interface updated for arrays
- SearchFilters type supports string[]

**Dependencies**: MVP-002

---

### V1-003: Modify Options Menu (Copy, Fill, Undo)

**Story ID**: V1-003  
**Title**: Modify Options Menu  
**Priority**: P1 - High  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **category analyst**, I want to **use column-level operations like copy, fill, and undo** so that **I can efficiently update multiple rows at once**.

**Acceptance Criteria**:
- [ ] Three-dot menu icon in column headers
- [ ] Menu options:
  - [ ] Copy All - Copy all values in column
  - [ ] Copy Selected - Copy values from selected rows
  - [ ] Paste - Paste copied values to selected rows
  - [ ] Fill All - Fill all rows with entered value
  - [ ] Fill Selected - Fill selected rows with entered value
  - [ ] Undo All - Revert all changes in column
  - [ ] Undo Selected - Revert changes in selected rows
- [ ] For value fields (price, cost):
  - [ ] % Off All - Apply percentage discount to all rows
  - [ ] % Off Selected - Apply percentage discount to selected rows
  - [ ] % Increase All - Apply percentage increase to all rows
  - [ ] % Increase Selected - Apply percentage increase to selected rows
- [ ] Dialog prompts for Fill and Percentage operations
- [ ] Validation before applying operations
- [ ] Visual feedback for applied operations

**Technical Notes**:
- ModifyOptionsMenu component
- Clipboard state management
- Percentage calculation logic

**Dependencies**: MVP-004, MVP-005

---

### V1-004: Pending Changes Management

**Story ID**: V1-004  
**Title**: Pending Changes Management  
**Priority**: P1 - High  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **buyer**, I want to **see all my pending changes and confirm or discard them** so that **I have control over what gets saved**.

**Acceptance Criteria**:
- [ ] Pending changes action bar appears when changes exist
- [ ] Bar shows count: "X pending changes"
- [ ] "Discard Changes" button clears all pending changes
- [ ] "Confirm & Save Changes" button saves all changes
- [ ] Yellow highlighting on cells with pending changes
- [ ] Navigation guard warns before leaving with unsaved changes
- [ ] Guard triggers on: page navigation, filter change, session load, vendor mode change
- [ ] Confirmation dialog: "You have unsaved changes. Are you sure?"

**Technical Notes**:
- Pending changes tracked in Map<articleId, Map<field, value>>
- beforeunload event handler
- Confirmation dialogs for navigation

**Dependencies**: MVP-004

---

### V1-005: Group By Functionality

**Story ID**: V1-005  
**Title**: Group By Functionality  
**Priority**: P1 - High  
**Effort**: 10 story points (7 days)

**User Story**:  
As a **merchandising manager**, I want to **group results by Style, Style/Color, or UPC** so that **I can edit items at different aggregation levels**.

**Acceptance Criteria**:
- [ ] Group By selector in header or filter panel
- [ ] Options: "Style", "Style/Color", "UPC (Style/Color/Size)"
- [ ] Default: "UPC (Style/Color/Size)"
- [ ] Style level: One row per unique Style
- [ ] Style/Color level: One row per Style + Color combination
- [ ] UPC level: One row per UPC (current behavior)
- [ ] When field varies within group, show first value
- [ ] Red highlighting for fields that vary within group
- [ ] Tooltip: "This field varies across items in this group"
- [ ] Read-only fields based on group level:
  - [ ] Style level: Color read-only if varies
  - [ ] Style/Color level: Size suppressed (not shown)
- [ ] Backend supports GROUP BY in queries
- [ ] Metadata returned indicating varying fields

**Technical Notes**:
- Backend: Query builder GROUP BY support
- SearchRequest includes groupBy config
- ResultsGrid handles grouped data structure

**Dependencies**: MVP-003, MVP-004

---

### V1-006: Activity Filters

**Story ID**: V1-006  
**Title**: Activity Filters  
**Priority**: P1 - High  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **buyer**, I want to **filter items by inventory activity** so that **I can find items based on stock levels, sales, or receiving activity**.

**Acceptance Criteria**:
- [ ] Activity filter section in filter panel
- [ ] Filters with enable/disable toggle:
  - [ ] On Hand: Any / No (with enable toggle)
  - [ ] On Order: Any / No (with enable toggle)
  - [ ] Sales: Any / No + Date range (with enable toggle)
  - [ ] Returns: Any / No + Date range (with enable toggle)
  - [ ] Receiving: Any / No + Date range (with enable toggle)
  - [ ] Transfers: Any / No + Date range (with enable toggle)
  - [ ] Distributions: Any / No + Date range (with enable toggle)
- [ ] Date range picker for activity filters
- [ ] Backend joins with inventory and transaction tables
- [ ] Filters applied to search query

**Technical Notes**:
- ActivitySection component
- Backend: Query builder joins inventory/transaction tables
- Date range handling

**Dependencies**: MVP-002

---

### V1-007: Wild Card Search

**Story ID**: V1-007  
**Title**: Wild Card Search  
**Priority**: P2 - Medium  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **merchandising manager**, I want to **use wildcard characters in my search** so that **I can find items with partial matches**.

**Acceptance Criteria**:
- [ ] Support `*` wildcard in search query
- [ ] Examples: "ABC*", "*XYZ", "A*B"
- [ ] Works in: SKU, UPC, Style, Description, Vendor fields
- [ ] Converted to SQL LIKE pattern
- [ ] Help text or tooltip explains wildcard usage
- [ ] Example shown in search placeholder

**Technical Notes**:
- Backend: Wildcard pattern parsing
- SQL LIKE query generation
- Escape special characters

**Dependencies**: MVP-001

---

### V1-008: Search Record Limit

**Story ID**: V1-008  
**Title**: Search Record Limit  
**Priority**: P2 - Medium  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **system**, I want to **enforce a maximum record limit on searches** so that **I can maintain performance and prevent system overload**.

**Acceptance Criteria**:
- [ ] Maximum limit: 20,000 records (configurable)
- [ ] Check count before executing full query
- [ ] If count exceeds limit, return error immediately
- [ ] Error message: "Search returned X records, exceeding limit of 20,000. Please refine your search."
- [ ] Suggestions for refining search
- [ ] No partial results returned

**Technical Notes**:
- Backend: Count check before search
- Error response with helpful message
- Frontend: Error handling and display

**Dependencies**: MVP-001, MVP-009

---

### V1-009: Book Confirmation Screen

**Story ID**: V1-009  
**Title**: Book Confirmation Screen  
**Priority**: P2 - Medium  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **buyer**, I want to **review a summary of changes before saving** so that **I can verify what will be updated**.

**Acceptance Criteria**:
- [ ] Confirmation dialog appears when clicking "Book"
- [ ] Dialog shows:
  - [ ] Number of rows to be updated
  - [ ] List of fields being changed (with counts)
  - [ ] Preview of first 5 changes (optional)
- [ ] Actions: "Confirm & Save", "Cancel", "Review Changes"
- [ ] "Review Changes" shows full list in expandable section
- [ ] Validation warnings displayed if any
- [ ] Post-save: Success message with count
- [ ] Post-save: Error summary if partial failure

**Technical Notes**:
- BookConfirmationDialog component
- Change summary calculation
- Integration with save flow

**Dependencies**: MVP-006

---

### V1-010: Column Reordering

**Story ID**: V1-010  
**Title**: Column Reordering  
**Priority**: P2 - Medium  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **merchandising manager**, I want to **reorder columns by dragging** so that **I can arrange fields in the order that makes sense for my workflow**.

**Acceptance Criteria**:
- [ ] Drag handle icon in column header
- [ ] Drag column to new position
- [ ] Visual feedback during drag (ghost image)
- [ ] Drop indicator shows insertion point
- [ ] Column order persists in localStorage
- [ ] Reset to default order option
- [ ] Up/Down arrow buttons as alternative to drag

**Technical Notes**:
- Drag-and-drop implementation
- Column order state management
- Persistence in localStorage

**Dependencies**: MVP-007

---

### V1-011: Print Functionality

**Story ID**: V1-011  
**Title**: Print Functionality  
**Priority**: P2 - Medium  
**Effort**: 2 story points (1 day)

**User Story**:  
As a **merchandising manager**, I want to **print the current results table** so that **I can have a physical copy for reference or meetings**.

**Acceptance Criteria**:
- [ ] "Print" button in header
- [ ] Print dialog opens browser print dialog
- [ ] Print stylesheet formats table for 8.5x11 paper
- [ ] Includes: Search criteria header, visible columns only, current sort
- [ ] Page breaks handled appropriately
- [ ] Header row repeats on each page
- [ ] Footer with page numbers and date

**Technical Notes**:
- CSS print media queries
- Print stylesheet
- Browser print API

**Dependencies**: MVP-003

---

### V1-012: Secondary Vendor Mode

**Story ID**: V1-012  
**Title**: Secondary Vendor Mode  
**Priority**: P2 - Medium  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **vendor relations manager**, I want to **switch to secondary vendor mode** so that **I can edit only vendor-specific fields and pricing**.

**Acceptance Criteria**:
- [ ] Vendor mode toggle in header (Primary / Secondary)
- [ ] Secondary mode shows only secondary vendor fields
- [ ] Editable fields in secondary mode:
  - [ ] Secondary vendor pricing fields
  - [ ] Status fields (Active Code, Status)
- [ ] Read-only fields: All hierarchy, item details, primary pricing
- [ ] Visual indicator: Amber border on editable fields
- [ ] Info banner: "You are editing secondary vendor data"
- [ ] Banner positioned inline with Results header
- [ ] Mode persists in saved sessions

**Technical Notes**:
- Vendor mode state in Redux
- Conditional field editing logic
- Secondary vendor data structure

**Dependencies**: MVP-003, MVP-004

---

### V1-013: Enhanced Validation Rules

**Story ID**: V1-013  
**Title**: Enhanced Validation Rules  
**Priority**: P2 - Medium  
**Effort**: 4 story points (3 days)

**User Story**:  
As a **system**, I want to **enforce comprehensive validation rules** so that **data integrity is maintained**.

**Acceptance Criteria**:
- [ ] Field-level validation rules:
  - [ ] UPC: 10 digits, numeric only
  - [ ] Prices: Positive numbers, 2 decimal places
  - [ ] Dates: Valid date format, not in future (where applicable)
  - [ ] Status codes: Valid values from reference table
  - [ ] Hierarchy: Valid department/class combinations
- [ ] Business rules:
  - [ ] Retail Price ≥ Wholesale Cost
  - [ ] Retail Price ≥ First Cost
  - [ ] Markdown Price ≤ Retail Price
  - [ ] Outlet Price ≤ Retail Price
- [ ] Cross-field validation
- [ ] Validation errors prevent save
- [ ] Error summary before save
- [ ] Field-level error messages

**Technical Notes**:
- Validation schema (Zod)
- Client and server-side validation
- Error aggregation

**Dependencies**: MVP-010

---

### V1-014: Keyboard Shortcuts

**Story ID**: V1-014  
**Title**: Keyboard Shortcuts  
**Priority**: P3 - Low  
**Effort**: 3 story points (2 days)

**User Story**:  
As a **power user**, I want to **use keyboard shortcuts** so that **I can work more efficiently**.

**Acceptance Criteria**:
- [ ] `Ctrl/Cmd + S`: Save changes
- [ ] `Ctrl/Cmd + Z`: Undo last change
- [ ] `Ctrl/Cmd + Y`: Redo last change
- [ ] `Ctrl/Cmd + F`: Focus search input
- [ ] `Ctrl/Cmd + A`: Select all rows
- [ ] `Esc`: Cancel edit, close dialogs
- [ ] `Enter`: Save edit, confirm dialogs
- [ ] `Tab`: Move to next editable cell
- [ ] `Shift + Tab`: Move to previous editable cell
- [ ] Shortcuts displayed in help menu or tooltip

**Technical Notes**:
- Keyboard event handlers
- Shortcut registry
- Help documentation

**Dependencies**: MVP-004, MVP-006

---

## V2 (Final/Complete Version)

**Goal**: Advanced features for enterprise-grade capabilities and maximum productivity.

**Timeline**: 8-10 weeks  
**Target Users**: All user types, including administrators

---

### V2-001: Field Configuration System

**Story ID**: V2-001  
**Title**: Field Configuration System  
**Priority**: P2 - Medium  
**Effort**: 13 story points (8 days)

**User Story**:  
As an **administrator**, I want to **configure which fields are available and their labels** so that **the system can be customized per client needs**.

**Acceptance Criteria**:
- [ ] Admin interface for field configuration
- [ ] Add/remove columns from available list
- [ ] Change column labels
- [ ] Set default column order
- [ ] Configure field types (text, number, date, dropdown)
- [ ] Configure validation rules per field
- [ ] Per-client configurations
- [ ] Version control for configurations
- [ ] Preview changes before applying
- [ ] Rollback to previous configuration
- [ ] Configuration stored in database
- [ ] Frontend loads configuration on app start

**Technical Notes**:
- Backend: Field configuration module
- Database: field_configurations table
- Admin UI component
- Runtime configuration loading

**Dependencies**: MVP-003, MVP-007

---

### V2-002: Audit Trail and Change History

**Story ID**: V2-002  
**Title**: Audit Trail and Change History  
**Priority**: P1 - High  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **merchandising manager**, I want to **view the change history for any item** so that **I can track who made what changes and when**.

**Acceptance Criteria**:
- [ ] Every field change logged to audit_log table
- [ ] Log includes: user, timestamp, IP address, field name, old value, new value
- [ ] "View History" option on item rows (right-click or menu)
- [ ] Change history modal/side panel
- [ ] Filter by: user, date range, field
- [ ] Timeline view of changes
- [ ] Side-by-side comparison view
- [ ] Export audit log
- [ ] Audit log retention policy (configurable)
- [ ] Search within audit log

**Technical Notes**:
- Backend: Audit logging service
- Database: audit_log table
- Frontend: ChangeHistory component
- Comparison view component

**Dependencies**: MVP-006

---

### V2-003: Advanced Column Features

**Story ID**: V2-003  
**Title**: Advanced Column Features  
**Priority**: P2 - Medium  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **power user**, I want to **pin columns, resize columns, and save column presets** so that **I can optimize my workspace for different tasks**.

**Acceptance Criteria**:
- [ ] Column width resizing:
  - [ ] Drag column border to resize
  - [ ] Double-click to auto-fit
  - [ ] Minimum/maximum width constraints
  - [ ] Widths persist in localStorage
- [ ] Column pinning:
  - [ ] Pin up to 3 columns to left
  - [ ] Pinned columns stay visible when scrolling
  - [ ] Visual indicator for pinned columns
  - [ ] Unpin option
- [ ] Column presets:
  - [ ] Save current column configuration as named preset
  - [ ] Quick switch between presets
  - [ ] Default preset per user role
  - [ ] Share presets with team (optional)
- [ ] Column grouping (optional):
  - [ ] Group related columns visually
  - [ ] Expand/collapse column groups

**Technical Notes**:
- Resize handles on column headers
- Pin state management
- Preset storage (localStorage or backend)

**Dependencies**: V1-010

---

### V2-004: Advanced Batch Operations

**Story ID**: V2-004  
**Title**: Advanced Batch Operations  
**Priority**: P2 - Medium  
**Effort**: 10 story points (6 days)

**User Story**:  
As a **category analyst**, I want to **perform advanced batch operations** so that **I can efficiently update large sets of items**.

**Acceptance Criteria**:
- [ ] Bulk Edit Dialog:
  - [ ] Select multiple rows
  - [ ] Edit common fields in bulk
  - [ ] Preview changes before applying
  - [ ] Validation before save
- [ ] Excel-style Copy/Paste:
  - [ ] Copy selected cells to clipboard
  - [ ] Paste from clipboard (CSV format)
  - [ ] Validate pasted data
  - [ ] Show paste preview
  - [ ] Handle mismatched data gracefully
- [ ] Template Operations:
  - [ ] Save row as template
  - [ ] Apply template to selected rows
  - [ ] Merge template with existing data
  - [ ] Template library management
- [ ] Bulk Status Changes:
  - [ ] Change Active Code for multiple items
  - [ ] Change Status for multiple items
  - [ ] Change Season for multiple items
- [ ] Bulk Hierarchy Updates:
  - [ ] Reclassify multiple items to new department/class
  - [ ] Preview hierarchy changes
  - [ ] Validation for hierarchy rules

**Technical Notes**:
- Clipboard API integration
- CSV parsing
- Template storage
- Bulk operation validation

**Dependencies**: V1-003

---

### V2-005: Export Functionality

**Story ID**: V2-005  
**Title**: Export Functionality  
**Priority**: P2 - Medium  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **merchandising manager**, I want to **export results to CSV, Excel, or PDF** so that **I can share data with stakeholders or use it in other tools**.

**Acceptance Criteria**:
- [ ] Export button in header
- [ ] Export options dialog:
  - [ ] Format: CSV, Excel (XLSX), PDF
  - [ ] Scope: All results or selected rows only
  - [ ] Columns: All visible or select specific columns
  - [ ] Include search criteria in header
- [ ] CSV Export:
  - [ ] Comma-separated values
  - [ ] UTF-8 encoding
  - [ ] Headers in first row
- [ ] Excel Export:
  - [ ] XLSX format
  - [ ] Multiple sheets for large datasets
  - [ ] Formatted cells (dates, currency)
  - [ ] Frozen header row
- [ ] PDF Export:
  - [ ] Formatted report layout
  - [ ] Search criteria header
  - [ ] Page breaks
  - [ ] Table formatting
- [ ] Export limits:
  - [ ] Maximum 50,000 rows
  - [ ] Progress indicator for large exports
  - [ ] Email export option for very large datasets
- [ ] Export history (optional)

**Technical Notes**:
- Backend: Export service
- Libraries: xlsx (Excel), pdfkit (PDF)
- Streaming for large exports
- Progress tracking

**Dependencies**: MVP-003

---

### V2-006: Advanced Search Features

**Story ID**: V2-006  
**Title**: Advanced Search Features  
**Priority**: P2 - Medium  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **power user**, I want to **use advanced search capabilities** so that **I can create complex queries efficiently**.

**Acceptance Criteria**:
- [ ] Search History:
  - [ ] Show recent searches with timestamps
  - [ ] Pin favorite searches
  - [ ] Delete search history
  - [ ] Search within history
- [ ] Search Suggestions:
  - [ ] Autocomplete from recent searches
  - [ ] Autocomplete from database (popular searches)
  - [ ] Show result count in suggestions
  - [ ] Keyboard navigation in suggestions
- [ ] Advanced Search Builder:
  - [ ] Visual query builder
  - [ ] Combine multiple criteria with AND/OR logic
  - [ ] Nested conditions
  - [ ] Save complex searches as templates
  - [ ] Share search templates
- [ ] Search Analytics (optional):
  - [ ] Track popular searches
  - [ ] Suggest related searches
  - [ ] Search performance metrics

**Technical Notes**:
- Search history storage
- Autocomplete service
- Query builder component
- Search analytics tracking

**Dependencies**: MVP-001, V1-001

---

### V2-007: Undo/Redo Stack

**Story ID**: V2-007  
**Title**: Undo/Redo Stack  
**Priority**: P2 - Medium  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **buyer**, I want to **undo and redo my changes** so that **I can easily correct mistakes or experiment with different values**.

**Acceptance Criteria**:
- [ ] Undo stack stores last 50 actions
- [ ] Each cell edit is one action
- [ ] Bulk operations are one action
- [ ] `Ctrl/Cmd + Z` undoes last action
- [ ] `Ctrl/Cmd + Y` redoes last undone action
- [ ] Undo/redo buttons in toolbar
- [ ] Visual feedback when undoing/redoing
- [ ] Undo/redo history visible (optional)
- [ ] Stack cleared on save
- [ ] Stack cleared on discard

**Technical Notes**:
- Action stack data structure
- State management for undo/redo
- Keyboard shortcuts

**Dependencies**: MVP-004

---

### V2-008: Performance Optimizations

**Story ID**: V2-008  
**Title**: Performance Optimizations  
**Priority**: P1 - High  
**Effort**: 10 story points (6 days)

**User Story**:  
As a **user**, I want the **application to be fast and responsive** so that **I can work efficiently even with large datasets**.

**Acceptance Criteria**:
- [ ] Virtual scrolling for large result sets (10K+ rows)
- [ ] Lazy loading of results (load more on scroll)
- [ ] Debounced search input (already implemented)
- [ ] Optimized re-renders (React.memo, useMemo)
- [ ] Code splitting for large components
- [ ] Image lazy loading for item pictures
- [ ] Caching of reference data (departments, classes, etc.)
- [ ] Backend query optimization:
  - [ ] Indexed columns
  - [ ] Query result caching (Redis)
  - [ ] Pagination for large results
- [ ] Performance metrics:
  - [ ] Search time < 3 seconds for 20K records
  - [ ] Save time < 5 seconds for 1K rows
  - [ ] UI responsiveness < 100ms

**Technical Notes**:
- React Virtual (virtual scrolling)
- React Query (caching)
- Backend: Query optimization, indexing
- Performance monitoring

**Dependencies**: MVP-001, MVP-003, MVP-006

---

### V2-009: Role-Based Permissions

**Story ID**: V2-009  
**Title**: Role-Based Permissions  
**Priority**: P2 - Medium  
**Effort**: 8 story points (5 days)

**User Story**:  
As an **administrator**, I want to **control what users can see and edit** so that **data security and access control is maintained**.

**Acceptance Criteria**:
- [ ] Role definitions: Admin, Manager, Buyer, Viewer
- [ ] Permission matrix:
  - [ ] View items
  - [ ] Edit items
  - [ ] Save changes
  - [ ] Delete items (if applicable)
  - [ ] Export data
  - [ ] Configure fields
  - [ ] View audit logs
- [ ] Field-level permissions:
  - [ ] Hide sensitive fields from certain roles
  - [ ] Make fields read-only for certain roles
- [ ] UI adapts based on permissions:
  - [ ] Hide buttons user can't use
  - [ ] Disable fields user can't edit
  - [ ] Show permission indicators
- [ ] Backend enforces permissions
- [ ] Permission changes take effect immediately

**Technical Notes**:
- Backend: Permission middleware
- Frontend: Permission hooks
- Role-based UI rendering

**Dependencies**: MVP-004, MVP-006

---

### V2-010: Data Import

**Story ID**: V2-010  
**Title**: Data Import  
**Priority**: P3 - Low  
**Effort**: 13 story points (8 days)

**User Story**:  
As a **merchandising manager**, I want to **import item data from Excel or CSV** so that **I can bulk update items from external sources**.

**Acceptance Criteria**:
- [ ] Import button in header (admin only)
- [ ] File upload dialog
- [ ] Supported formats: CSV, Excel (XLSX)
- [ ] File validation:
  - [ ] Check file format
  - [ ] Validate column headers
  - [ ] Check required fields
- [ ] Import preview:
  - [ ] Show first 10 rows
  - [ ] Highlight errors
  - [ ] Show mapping (file columns to system fields)
- [ ] Column mapping:
  - [ ] Map file columns to system fields
  - [ ] Handle missing columns
  - [ ] Handle extra columns
- [ ] Import options:
  - [ ] Update existing items (match by UPC)
  - [ ] Create new items
  - [ ] Skip errors or stop on first error
- [ ] Import execution:
  - [ ] Progress indicator
  - [ ] Validation during import
  - [ ] Error reporting
  - [ ] Success summary
- [ ] Import history

**Technical Notes**:
- File upload handling
- CSV/Excel parsing
- Validation service
- Import queue (for large files)

**Dependencies**: MVP-006

---

### V2-011: Notifications and Alerts

**Story ID**: V2-011  
**Title**: Notifications and Alerts  
**Priority**: P3 - Low  
**Effort**: 5 story points (3 days)

**User Story**:  
As a **user**, I want to **receive notifications about important events** so that **I stay informed about system activities**.

**Acceptance Criteria**:
- [ ] Toast notifications for:
  - [ ] Successful saves
  - [ ] Failed saves
  - [ ] Import completion
  - [ ] Export completion
- [ ] Notification center (optional):
  - [ ] List of recent notifications
  - [ ] Mark as read
  - [ ] Clear all
- [ ] Email notifications (optional):
  - [ ] Daily summary of changes
  - [ ] Error alerts
  - [ ] System maintenance notices
- [ ] In-app alerts:
  - [ ] System maintenance warnings
  - [ ] Data sync status
  - [ ] Performance warnings

**Technical Notes**:
- Toast notification library
- Notification service
- Email service (optional)

**Dependencies**: MVP-006

---

### V2-012: Mobile Responsive Design

**Story ID**: V2-012  
**Title**: Mobile Responsive Design  
**Priority**: P3 - Low  
**Effort**: 8 story points (5 days)

**User Story**:  
As a **mobile user**, I want to **access the application on my tablet or phone** so that **I can view and make quick edits while away from my desk**.

**Acceptance Criteria**:
- [ ] Responsive layout for tablets (768px+)
- [ ] Responsive layout for phones (375px+)
- [ ] Filter panel becomes drawer/modal on mobile
- [ ] Table becomes card view on mobile
- [ ] Touch-friendly controls (larger buttons)
- [ ] Swipe gestures for navigation
- [ ] Optimized for portrait and landscape
- [ ] Performance maintained on mobile devices

**Technical Notes**:
- Responsive CSS (Tailwind breakpoints)
- Mobile-first design approach
- Touch event handling

**Dependencies**: All MVP and V1 features

---

### V2-013: Advanced Analytics Dashboard

**Story ID**: V2-013  
**Title**: Advanced Analytics Dashboard  
**Priority**: P3 - Low  
**Effort**: 13 story points (8 days)

**User Story**:  
As a **merchandising manager**, I want to **view analytics about item data and changes** so that **I can make data-driven decisions**.

**Acceptance Criteria**:
- [ ] Analytics dashboard page
- [ ] Metrics:
  - [ ] Total items by department/class
  - [ ] Items updated in last 7/30 days
  - [ ] Most active users
  - [ ] Most edited fields
  - [ ] Average time to update items
- [ ] Charts and graphs:
  - [ ] Bar charts for item counts
  - [ ] Line charts for trends
  - [ ] Pie charts for distributions
- [ ] Filters:
  - [ ] Date range
  - [ ] Department/Class
  - [ ] User
- [ ] Export analytics data
- [ ] Scheduled reports (optional)

**Technical Notes**:
- Analytics service
- Chart library (Chart.js, Recharts)
- Dashboard component

**Dependencies**: V2-002

---

## Story Summary

### MVP Stories (11 stories)
- **Total Effort**: ~40 story points (~25 days)
- **Timeline**: 4-6 weeks
- **Critical Path**: MVP-001 → MVP-002 → MVP-003 → MVP-004 → MVP-005 → MVP-006

### V1 Stories (14 stories)
- **Total Effort**: ~60 story points (~38 days)
- **Timeline**: 6-8 weeks
- **Key Features**: Saved sessions, multi-select, modify options, group by, activity filters

### V2 Stories (13 stories)
- **Total Effort**: ~110 story points (~70 days)
- **Timeline**: 8-10 weeks
- **Key Features**: Field configuration, audit trail, advanced features, performance, permissions

### Grand Total
- **Total Stories**: 38
- **Total Effort**: ~210 story points (~133 days)
- **Total Timeline**: 18-24 weeks (4.5-6 months)

---

## Dependencies Map

```
MVP:
MVP-001 (Search) → MVP-002 (Filters) → MVP-003 (Results)
MVP-003 → MVP-004 (Editing) → MVP-005 (Selection) → MVP-006 (Save)
MVP-003 → MVP-007 (Columns) → MVP-008 (Sort)
MVP-002 → MVP-009 (Count)

V1:
V1-001 (Sessions) → depends on MVP-001, MVP-002
V1-002 (Multi-select) → depends on MVP-002
V1-003 (Modify) → depends on MVP-004, MVP-005
V1-004 (Pending) → depends on MVP-004
V1-005 (Group By) → depends on MVP-003, MVP-004
V1-006 (Activity) → depends on MVP-002
V1-010 (Reorder) → depends on MVP-007

V2:
V2-001 (Field Config) → depends on MVP-003, MVP-007
V2-002 (Audit) → depends on MVP-006
V2-003 (Advanced Columns) → depends on V1-010
V2-004 (Batch Ops) → depends on V1-003
V2-005 (Export) → depends on MVP-003
V2-006 (Advanced Search) → depends on MVP-001, V1-001
V2-007 (Undo/Redo) → depends on MVP-004
V2-008 (Performance) → depends on MVP-001, MVP-003, MVP-006
V2-009 (Permissions) → depends on MVP-004, MVP-006
V2-012 (Mobile) → depends on all MVP and V1
```

---

## Notes for Sprint Planning

1. **MVP must be completed before V1**: V1 features build on MVP foundation
2. **V1 should be completed before V2**: V2 features enhance V1 capabilities
3. **Some V2 features can be parallelized**: Performance, permissions, and analytics can be developed in parallel
4. **Critical path**: Focus on MVP-001 through MVP-006 for initial release
5. **Story points are estimates**: Adjust based on team velocity and complexity
6. **Dependencies matter**: Plan sprints considering story dependencies

---

**Document Owner**: Product Team  
**Last Updated**: 2025-01-11  
**Next Review**: After MVP completion

