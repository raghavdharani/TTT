# Item Maintenance V2 - Functional Specifications

**Document Version:** 1.0  
**Date:** 2025-01-11  
**Status:** Draft for Design & Engineering Review

---

## Executive Summary

This document provides prioritized functional specifications for Item Maintenance V2, comparing the legacy system functionality with the current implementation. Specifications are organized by priority, with **Priority 1** representing features that overlap with the legacy system (must-have for parity), and subsequent priorities based on ease of implementation and business value.

---

## Table of Contents

1. [Legacy System Overview](#legacy-system-overview)
2. [Current Implementation Status](#current-implementation-status)
3. [Feature Comparison Matrix](#feature-comparison-matrix)
4. [Priority 1: Legacy Parity Features](#priority-1-legacy-parity-features)
5. [Priority 2: Enhanced Features](#priority-2-enhanced-features)
6. [Priority 3: New Capabilities](#priority-3-new-capabilities)
7. [Technical Implementation Guidelines](#technical-implementation-guidelines)
8. [Design Considerations](#design-considerations)

---

## Legacy System Overview

### Core Workflow (Primary Vendor Mode)

1. **Search Phase**: User defines search criteria using filters (hierarchy, item details, activity, etc.)
2. **Results Phase**: System displays matching items in a table
3. **Edit Phase**: User makes inline edits to cells
4. **Selection Phase**: User checks boxes for rows to update
5. **Save Phase**: User clicks "Book" to save only checked rows

### Key Legacy Features

#### Search & Filtering
- **Multi-select filters**: Department, Class, Sub-Class, Sub-Dept, Attribute 1-3, Color, Vendor
- **Wild card search**: Supports `*` wildcard in any field
- **Activity filters**: On Hand, On Order, Sales, Returns, Receiving, Transfers, Distributions (with date ranges)
- **Search limit**: System enforces record limit with user notification

#### Results Display
- **Group By options**: Style, Style/Color, or UPC (Style/Color/Size)
- **Column customization**: Reorder, resize, show/hide via drag-and-drop
- **Sort by column**: Click column headers to sort
- **Field configuration**: Configurable via external config file (KWI Customer Success Manager)

#### Editing & Modification
- **Inline cell editing**: Double-click to edit, Enter to save, Esc to cancel
- **Checkbox selection**: Select individual rows for batch operations
- **Modify options** (via column header menu):
  - Copy All / Copy Selected
  - Fill All / Fill Selected
  - Undo All / Undo Selected
  - % Off All / % Off Selected (value fields only)
  - % Increase All / % Increase Selected (value fields only)
- **Change tracking**: Only changed fields are saved to database
- **Visual indicators**: Red highlighting for fields that vary at Style/Color level

#### Save & Validation
- **Book functionality**: Saves only checked rows
- **Book confirmation screen**: Shows summary of changes before final commit
- **Read-only fields**: UPC, Markdown/Outlet Markdown, Markdown Date/Outlet Markdown Date, Color (at Style level), Size (at Style/Color level), Average Cost

#### Additional Features
- **Print functionality**: Export data table to print
- **Cancel button**: Clears changes and returns to search screen
- **Record count preview**: Shows count before loading full results

---

## Current Implementation Status

### ✅ Implemented Features

#### Search & Filtering
- ✅ Global quick search (SKU, UPC, Style, Description, Vendor)
- ✅ Multi-select filters: Department, Class, Sub-Class, Sub-Dept, Attribute 1-3, Color, Vendor
- ✅ Filter sections: Item Details, Hierarchy, Vendor, Pricing, Status, Dates
- ✅ Activity filters UI (needs backend integration)
- ✅ Active filters display with badges
- ✅ Saved search sessions (save/load/delete)
- ✅ Auto-restore last session

#### Results Display
- ✅ Results table with 35 columns (matching legacy output)
- ✅ Column customization: Show/hide, reorder via drag-and-drop
- ✅ Sort by column headers
- ✅ Column configuration persistence (localStorage)
- ✅ Record count display

#### Editing & Modification
- ✅ Inline cell editing with SmartEditableCell
- ✅ Keyboard navigation (Enter to save, Esc to cancel)
- ✅ Checkbox selection (individual and select all)
- ✅ Modify options menu (column header):
  - Copy All / Copy Selected
  - Fill All / Fill Selected
  - Undo All / Undo Selected
  - % Off All / % Off Selected
  - % Increase All / % Increase Selected
- ✅ Pending changes tracking (yellow highlighting)
- ✅ Pending changes action bar (Discard / Confirm & Save)
- ✅ Navigation guard (warns on unsaved changes)

#### Vendor Modes
- ✅ Primary vendor mode (full editing)
- ✅ Secondary vendor mode (price fields and status only)
- ✅ Visual indicators for editable/read-only fields

#### Additional
- ✅ Download functionality (placeholder)
- ✅ Print functionality (placeholder)
- ✅ Responsive filter panel (collapsible)
- ✅ Empty state handling
- ✅ Loading states
- ✅ Error handling

### ❌ Missing Features (Legacy Parity)

1. **Book/Save Functionality**
   - Current: Pending changes tracked but no actual save to database
   - Legacy: "Book" button saves only checked rows
   - Impact: **CRITICAL** - Core functionality missing

2. **Group By Functionality**
   - Current: Always displays at UPC level
   - Legacy: Can group by Style, Style/Color, or UPC
   - Impact: **HIGH** - Affects data aggregation and editing workflow

3. **Wild Card Search**
   - Current: Standard text search
   - Legacy: Supports `*` wildcard (e.g., "ABC*")
   - Impact: **MEDIUM** - User expectation

4. **Activity Filters Backend Integration**
   - Current: UI exists but not connected to backend
   - Legacy: Full activity filtering with date ranges
   - Impact: **HIGH** - Important search capability

5. **Book Confirmation Screen**
   - Current: No confirmation before save
   - Legacy: Shows summary of changes before commit
   - Impact: **MEDIUM** - User safety and verification

6. **Field Configuration System**
   - Current: Hardcoded columns
   - Legacy: Configurable via external file
   - Impact: **LOW** - Admin feature, can be deferred

7. **Red Highlighting for Varying Fields**
   - Current: No indication of field variation at Style/Color level
   - Legacy: Red highlight when field varies within Style/Color
   - Impact: **MEDIUM** - Important for Group By workflow

8. **Search Record Limit**
   - Current: No limit enforcement
   - Legacy: Enforces limit with user notification
   - Impact: **MEDIUM** - Performance and UX

9. **Read-Only Field Enforcement**
   - Current: Some fields marked read-only
   - Legacy: Specific fields read-only based on Group By level
   - Impact: **MEDIUM** - Data integrity

---

## Feature Comparison Matrix

| Feature | Legacy | Current | Priority | Status |
|---------|--------|---------|----------|--------|
| **Search & Filtering** |
| Quick search | ✅ | ✅ | P1 | ✅ Complete |
| Multi-select filters | ✅ | ✅ | P1 | ✅ Complete |
| Wild card search (*) | ✅ | ❌ | P1 | ⏳ Missing |
| Activity filters | ✅ | ⚠️ UI only | P1 | ⏳ Partial |
| Saved sessions | ❌ | ✅ | P2 | ✅ Complete |
| **Results Display** |
| Results table | ✅ | ✅ | P1 | ✅ Complete |
| Column customization | ✅ | ✅ | P1 | ✅ Complete |
| Sort by column | ✅ | ✅ | P1 | ✅ Complete |
| Group By (Style/Color/UPC) | ✅ | ❌ | P1 | ⏳ Missing |
| Record count preview | ✅ | ✅ | P1 | ✅ Complete |
| **Editing** |
| Inline cell editing | ✅ | ✅ | P1 | ✅ Complete |
| Checkbox selection | ✅ | ✅ | P1 | ✅ Complete |
| Modify options menu | ✅ | ✅ | P1 | ✅ Complete |
| Pending changes tracking | ❌ | ✅ | P2 | ✅ Complete |
| Navigation guard | ❌ | ✅ | P2 | ✅ Complete |
| **Save & Validation** |
| Book/Save functionality | ✅ | ❌ | P1 | ⏳ Missing |
| Book confirmation screen | ✅ | ❌ | P1 | ⏳ Missing |
| Change tracking (only changed fields) | ✅ | ✅ | P1 | ✅ Complete |
| Read-only field enforcement | ✅ | ⚠️ Partial | P1 | ⏳ Partial |
| **Additional** |
| Print functionality | ✅ | ⚠️ Placeholder | P1 | ⏳ Partial |
| Download functionality | ❌ | ⚠️ Placeholder | P2 | ⏳ Partial |
| Field configuration system | ✅ | ❌ | P3 | ⏳ Missing |
| Red highlighting (varying fields) | ✅ | ❌ | P2 | ⏳ Missing |
| Search record limit | ✅ | ❌ | P1 | ⏳ Missing |

**Legend:**
- ✅ = Fully implemented
- ⚠️ = Partially implemented
- ❌ = Not implemented
- ⏳ = In progress / Missing

---

## Priority 1: Legacy Parity Features

**Goal**: Achieve functional parity with legacy system for primary vendor mode.

### P1.1: Book/Save Functionality (CRITICAL)

**Status**: ❌ Missing  
**Priority**: P1 - CRITICAL  
**Effort**: Medium (3-5 days)

#### Requirements

1. **Save Button**
   - Location: Header bar or Results grid action bar
   - Label: "Book" or "Save Changes"
   - Behavior: Only enabled when there are pending changes AND at least one row is checked
   - Visual: Primary button style, disabled state when no changes/selection

2. **Save Logic**
   - Only save rows that are checked (via checkbox)
   - Only save fields that have been modified (tracked in `pendingChanges`)
   - Send bulk update request to backend API
   - Handle partial success (some rows succeed, some fail)

3. **Backend API Endpoint**
   ```
   POST /api/items/bulk-update
   Request Body:
   {
     updates: [
       {
         articleId: string,
         fields: {
           fieldName: newValue,
           ...
         }
       },
       ...
     ]
   }
   Response:
   {
     success: boolean,
     updatedCount: number,
     failedCount: number,
     errors?: Array<{ articleId: string, field: string, error: string }>
   }
   ```

4. **Error Handling**
   - Display errors for failed updates
   - Show success count
   - Allow retry for failed items
   - Maintain pending changes for failed items

5. **Post-Save Behavior**
   - Clear pending changes for successfully saved items
   - Refresh data from server
   - Show success notification
   - Maintain user's current view (filters, sort, selection)

#### Technical Implementation

**Frontend:**
- Add "Book" button to ResultsGrid or HeaderBar
- Implement `handleBook` function in ResultsGrid
- Collect checked rows and their pending changes
- Call `onBulkUpdate` prop with structured data
- Handle response and update UI accordingly

**Backend:**
- Create `ItemsController` with `bulkUpdate` endpoint
- Implement transaction-based update logic
- Validate each field update
- Return detailed success/failure response
- Log all changes for audit trail

**Files to Modify:**
- `frontend/src/components/search/ResultsGrid.tsx` - Add Book button and handler
- `frontend/src/App.tsx` - Implement `onBulkUpdate` handler
- `backend/src/modules/items/items.controller.ts` - New controller
- `backend/src/modules/items/items.service.ts` - New service
- `backend/src/modules/items/items.module.ts` - New module

---

### P1.2: Group By Functionality

**Status**: ❌ Missing  
**Priority**: P1 - HIGH  
**Effort**: High (5-7 days)

#### Requirements

1. **Group By Selector**
   - Location: Header bar or Filter panel
   - Options: "Style", "Style/Color", "UPC (Style/Color/Size)"
   - Default: "UPC (Style/Color/Size)"
   - Behavior: Changes how results are aggregated and displayed

2. **Group By Logic**

   **Style Level:**
   - One row per unique Style
   - Aggregates all UPCs with same Style
   - If field varies across UPCs, show first value found
   - Fields that vary: Highlight in red (see P1.7)
   - Read-only fields: Color (if varies), Size (always suppressed)

   **Style/Color Level:**
   - One row per unique Style + Color combination
   - Aggregates all UPCs with same Style + Color
   - If field varies across UPCs, show first value found
   - Fields that vary: Highlight in red
   - Read-only fields: Size (always suppressed)

   **UPC Level:**
   - One row per unique UPC (current behavior)
   - All fields editable (except system fields)

3. **Backend Implementation**
   - Modify query builder to support GROUP BY
   - Aggregate fields appropriately
   - Return metadata about which fields vary within group
   - Handle field selection (first value, average for numeric, etc.)

4. **UI Updates**
   - Update ResultsGrid to handle grouped data
   - Show group indicators (expandable rows?)
   - Display red highlighting for varying fields
   - Adjust editable field logic based on group level

#### Technical Implementation

**Backend:**
```typescript
// Query builder modification
interface GroupByConfig {
  level: 'style' | 'style-color' | 'upc';
}

// Add to SearchRequest
groupBy?: GroupByConfig;

// Query builder logic
if (groupBy.level === 'style') {
  query.groupBy('style');
  // Select first value for each field
  // Track which fields vary
}
```

**Frontend:**
- Add GroupBy selector to HeaderBar or FilterPanel
- Update SearchRequest type to include groupBy
- Modify ResultsGrid to handle grouped results
- Implement red highlighting logic

**Files to Modify:**
- `shared/types/search.ts` - Add GroupByConfig
- `backend/src/modules/search/query-builder.service.ts` - Add grouping logic
- `frontend/src/components/search/HeaderBar.tsx` - Add GroupBy selector
- `frontend/src/components/search/ResultsGrid.tsx` - Handle grouped data

---

### P1.3: Wild Card Search

**Status**: ❌ Missing  
**Priority**: P1 - MEDIUM  
**Effort**: Low (1-2 days)

#### Requirements

1. **Wild Card Support**
   - Pattern: `*` matches any sequence of characters
   - Examples: `ABC*`, `*XYZ`, `A*B`
   - Apply to: All text search fields (SKU, UPC, Style, Description, Vendor)

2. **Implementation**
   - Parse search query for `*` characters
   - Convert to SQL `LIKE` pattern
   - Escape special SQL characters
   - Support multiple wildcards in same query

3. **User Experience**
   - No special UI needed (transparent to user)
   - Document in help text or tooltip
   - Show example in search placeholder

#### Technical Implementation

**Backend:**
```typescript
// In query builder
function buildWildcardPattern(query: string): string {
  // Convert * to SQL %
  // Escape other special characters
  return query.replace(/\*/g, '%').replace(/%/g, '\\%');
}
```

**Files to Modify:**
- `backend/src/modules/search/query-builder.service.ts` - Add wildcard parsing
- `frontend/src/components/search/SearchBar.tsx` - Update placeholder/tooltip

---

### P1.4: Activity Filters Backend Integration

**Status**: ⚠️ UI Only  
**Priority**: P1 - HIGH  
**Effort**: Medium (3-4 days)

#### Requirements

1. **Activity Filter Types**
   - On Hand: Filter by inventory on hand (Any/No)
   - On Order: Filter by items on order (Any/No)
   - Sales: Filter by sales activity within date range (Any/No)
   - Returns: Filter by returns within date range (Any/No)
   - Receiving: Filter by receiving activity within date range (Any/No)
   - Transfers: Filter by transfer activity within date range (Any/No)
   - Distributions: Filter by distribution activity within date range (Any/No)

2. **Backend Query Logic**
   - Join with inventory tables (on_hand, on_order)
   - Join with transaction tables (sales, returns, receiving, transfers)
   - Join with distribution tables
   - Apply date range filters where applicable
   - Handle "Any" vs "No" logic

3. **Database Tables** (KWI schema)
   - Inventory tables: `inventory`, `on_order`
   - Transaction tables: `sales`, `returns`, `receiving`, `transfers`
   - Distribution tables: `distributions`

#### Technical Implementation

**Backend:**
```typescript
// Add to query builder
if (filters.activity?.onHand?.enabled) {
  if (filters.activity.onHand.value === 'No') {
    query.where('inventory.on_hand', '=', 0);
  } else {
    query.where('inventory.on_hand', '>', 0);
  }
}

// Similar logic for other activity filters
```

**Files to Modify:**
- `backend/src/modules/search/query-builder.service.ts` - Add activity filter joins
- `shared/types/search.ts` - Ensure activity filters in SearchFilters
- `frontend/src/components/filters/sections/ActivitySection.tsx` - Already exists, verify integration

---

### P1.5: Book Confirmation Screen

**Status**: ❌ Missing  
**Priority**: P1 - MEDIUM  
**Effort**: Medium (2-3 days)

#### Requirements

1. **Confirmation Dialog**
   - Trigger: When user clicks "Book" button
   - Display: Summary of changes to be saved
   - Content:
     - Number of rows to be updated
     - List of fields being changed (with counts)
     - Preview of first few changes (optional)
   - Actions: "Confirm & Save", "Cancel", "Review Changes"

2. **Change Summary**
   - Group changes by field
   - Show count of rows affected per field
   - Highlight any validation warnings
   - Show estimated save time (if available)

3. **Post-Save Confirmation**
   - Show success message with count
   - Display any errors if partial failure
   - Option to view detailed results

#### Technical Implementation

**Frontend:**
- Create `BookConfirmationDialog` component
- Collect change summary before save
- Display in modal/dialog
- Handle confirm/cancel actions

**Files to Create:**
- `frontend/src/components/search/BookConfirmationDialog.tsx`

**Files to Modify:**
- `frontend/src/components/search/ResultsGrid.tsx` - Integrate confirmation dialog
- `frontend/src/App.tsx` - Handle confirmation flow

---

### P1.6: Search Record Limit

**Status**: ❌ Missing  
**Priority**: P1 - MEDIUM  
**Effort**: Low (1 day)

#### Requirements

1. **Limit Configuration**
   - Default limit: 20,000 records (configurable)
   - Enforced at backend level
   - Return error if limit exceeded

2. **User Notification**
   - Display error message: "Search returned more than [limit] records. Please refine your search criteria."
   - Suggest ways to refine (add filters, use wildcards, etc.)
   - Do not display partial results

3. **Record Count Check**
   - Check count before executing full query
   - If count > limit, return error immediately
   - Optimize count query for performance

#### Technical Implementation

**Backend:**
```typescript
// In search service
const MAX_RECORDS = 20000;

async search(request: SearchRequest) {
  const count = await this.getRecordCount(request);
  if (count > MAX_RECORDS) {
    throw new BadRequestException(
      `Search returned ${count} records, exceeding limit of ${MAX_RECORDS}. Please refine your search.`
    );
  }
  // Proceed with search
}
```

**Frontend:**
- Handle error response
- Display user-friendly error message
- Provide suggestions for refining search

**Files to Modify:**
- `backend/src/modules/search/search.service.ts` - Add limit check
- `frontend/src/App.tsx` - Handle limit error

---

### P1.7: Red Highlighting for Varying Fields

**Status**: ❌ Missing  
**Priority**: P1 - MEDIUM (when Group By is implemented)  
**Effort**: Low (1-2 days)

#### Requirements

1. **Highlighting Logic**
   - When Group By = Style or Style/Color
   - If a field has different values across UPCs in the group
   - Highlight that cell in red
   - Tooltip: "This field varies across items in this group"

2. **Backend Support**
   - Return metadata indicating which fields vary
   - Include in search response

3. **UI Implementation**
   - Apply red background/border to varying cells
   - Show tooltip on hover
   - Visual distinction from pending changes (yellow)

#### Technical Implementation

**Backend:**
```typescript
// In grouped query results
interface GroupedResult {
  // ... fields
  varyingFields?: string[]; // List of field names that vary
}
```

**Frontend:**
- Check `varyingFields` array
- Apply red styling to matching cells
- Add tooltip

**Files to Modify:**
- `backend/src/modules/search/search.service.ts` - Calculate varying fields
- `frontend/src/components/search/ResultsGrid.tsx` - Apply highlighting

---

### P1.8: Read-Only Field Enforcement

**Status**: ⚠️ Partial  
**Priority**: P1 - MEDIUM  
**Effort**: Low (1 day)

#### Requirements

1. **Read-Only Rules** (based on Group By level)

   **Always Read-Only:**
   - UPC
   - First Digits
   - Markdown Date
   - Outlet Markdown Date
   - Last Modified Date
   - Creation Date

   **Read-Only at Style Level:**
   - Color (if varies within style)

   **Read-Only at Style/Color Level:**
   - Size (always suppressed, not shown)

   **Read-Only if Average Cost:**
   - Average Cost / Current Cost (if used)

2. **UI Implementation**
   - Disable editing for read-only fields
   - Visual indicator (grayed out, lock icon)
   - Tooltip explaining why field is read-only

#### Technical Implementation

**Frontend:**
- Update `isEditable` function in ResultsGrid
- Consider Group By level
- Check field variation metadata
- Apply visual styling

**Files to Modify:**
- `frontend/src/components/search/ResultsGrid.tsx` - Update `isEditable` logic

---

### P1.9: Print Functionality

**Status**: ⚠️ Placeholder  
**Priority**: P1 - LOW  
**Effort**: Low (1-2 days)

#### Requirements

1. **Print Functionality**
   - Export current results table to printable format
   - Include all visible columns
   - Include current filters/search criteria as header
   - Format for standard 8.5x11 paper
   - Support browser print dialog

2. **Implementation Options**
   - Option A: Browser print (window.print()) with CSS print styles
   - Option B: Generate PDF on backend
   - Option C: Export to Excel/CSV for printing

3. **Recommended**: Option A (simplest, fastest)

#### Technical Implementation

**Frontend:**
- Create print stylesheet
- Format table for printing
- Include search criteria header
- Trigger browser print dialog

**Files to Create:**
- `frontend/src/styles/print.css`

**Files to Modify:**
- `frontend/src/App.tsx` - Implement `handlePrint` function
- `frontend/src/components/search/HeaderBar.tsx` - Wire up print button

---

## Priority 2: Enhanced Features

**Goal**: Improve upon legacy system with modern UX patterns.

### P2.1: Enhanced Pending Changes Workflow

**Status**: ✅ Implemented  
**Priority**: P2  
**Effort**: N/A (Complete)

**Current Implementation:**
- Pending changes tracked with yellow highlighting
- Action bar with "Discard" and "Confirm & Save" buttons
- Navigation guard prevents accidental data loss
- Change count displayed

**Enhancement Opportunities:**
- Show change preview in confirmation dialog
- Allow partial save (save some changes, keep others pending)
- Undo/redo stack (10+ actions)

---

### P2.2: Advanced Column Customization

**Status**: ✅ Basic implementation  
**Priority**: P2  
**Effort**: Medium (2-3 days)

#### Enhancements

1. **Column Width Resizing**
   - Drag column borders to resize
   - Persist widths in localStorage
   - Minimum/maximum width constraints

2. **Column Pinning**
   - Pin up to 3 columns to left side
   - Always visible when scrolling horizontally
   - Visual indicator for pinned columns

3. **Column Presets**
   - Save column configurations as named presets
   - Quick switch between presets
   - Default preset per user role

#### Technical Implementation

**Frontend:**
- Add resize handles to column headers
- Implement pinning logic
- Create preset management UI
- Persist to backend (user preferences)

**Files to Modify:**
- `frontend/src/components/search/ResultsGrid.tsx` - Add resize/pin logic
- `frontend/src/components/search/ColumnCustomizer.tsx` - Add preset management

---

### P2.3: Enhanced Search Experience

**Status**: ✅ Basic implementation  
**Priority**: P2  
**Effort**: Medium (2-3 days)

#### Enhancements

1. **Search History**
   - Already implemented in SearchBar
   - Enhance: Show recent searches with timestamps
   - Allow pinning favorite searches

2. **Search Suggestions**
   - Autocomplete from recent searches
   - Autocomplete from database (popular searches)
   - Show search result count in suggestions

3. **Advanced Search Builder**
   - Visual query builder
   - Combine multiple criteria with AND/OR logic
   - Save complex searches as templates

---

### P2.4: Batch Operations Enhancement

**Status**: ✅ Basic implementation  
**Priority**: P2  
**Effort**: Medium (2-3 days)

#### Enhancements

1. **Bulk Edit Dialog**
   - Select multiple rows
   - Edit common fields in bulk
   - Preview changes before applying
   - Validation before save

2. **Copy/Paste Enhancement**
   - Support Excel-style copy/paste
   - Paste from clipboard (CSV format)
   - Validate pasted data
   - Show paste preview

3. **Template Operations**
   - Save row as template
   - Apply template to selected rows
   - Merge template with existing data

---

## Priority 3: New Capabilities

**Goal**: Features not in legacy system, prioritized by ease of build.

### P3.1: Field Configuration System

**Status**: ❌ Missing  
**Priority**: P3  
**Effort**: High (5-7 days)

#### Requirements

1. **Admin Configuration Interface**
   - Add/remove columns from available list
   - Change column labels
   - Set default column order
   - Configure field types and validation

2. **Configuration Storage**
   - Database table for field configurations
   - Per-client configurations
   - Version control for configurations

3. **Runtime Application**
   - Load configuration on app start
   - Apply to ResultsGrid dynamically
   - Fallback to default if config missing

#### Technical Implementation

**Backend:**
- Create `field_configurations` table
- Admin API for CRUD operations
- Load and serve configuration to frontend

**Frontend:**
- Load configuration on mount
- Dynamically generate columns
- Apply configuration to ResultsGrid

**Files to Create:**
- `backend/src/modules/field-config/` - New module
- `frontend/src/components/admin/FieldConfigEditor.tsx` - Admin UI

---

### P3.2: Audit Trail & Change History

**Status**: ❌ Missing  
**Priority**: P3  
**Effort**: Medium (3-4 days)

#### Requirements

1. **Change Logging**
   - Log every field change (before/after values)
   - Track user, timestamp, IP address
   - Store in audit_log table

2. **Change History View**
   - View change history for an item
   - Filter by user, date range, field
   - Export audit log

3. **Change Comparison**
   - Side-by-side comparison view
   - Highlight differences
   - Show change timeline

#### Technical Implementation

**Backend:**
- Create `audit_log` table
- Log changes in bulk update service
- Create audit log query API

**Frontend:**
- Create change history component
- Display in modal or side panel
- Implement comparison view

---

### P3.3: Export Functionality

**Status**: ⚠️ Placeholder  
**Priority**: P3  
**Effort**: Medium (2-3 days)

#### Requirements

1. **Export Formats**
   - CSV export
   - Excel export (XLSX)
   - PDF export (formatted report)

2. **Export Options**
   - Export all results or selected rows only
   - Include/exclude specific columns
   - Include search criteria in header

3. **Export Limits**
   - Maximum 50,000 rows for export
   - Show progress for large exports
   - Email export for very large datasets

#### Technical Implementation

**Backend:**
- Create export service
- Generate CSV/Excel/PDF
- Stream large exports

**Frontend:**
- Export dialog with options
- Trigger export API
- Handle file download

---

## Technical Implementation Guidelines

### Code Organization

```
item-maintenance-v2/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── search/          # Search & query building
│   │   │   ├── items/           # Item CRUD operations (NEW)
│   │   │   ├── sessions/        # Saved search sessions
│   │   │   └── field-config/   # Field configuration (P3)
│   │   └── common/
│   │       ├── prisma/          # Database service
│   │       └── redis/           # Cache service
│   └── prisma/
│       └── schema.prisma        # Database schema
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── search/          # Search & results components
│       │   ├── filters/         # Filter components
│       │   └── admin/          # Admin components (P3)
│       ├── services/            # API clients
│       └── store/               # Redux store
└── shared/
    └── types/                   # Shared TypeScript types
```

### API Design Patterns

1. **RESTful Endpoints**
   ```
   GET    /api/search              # Search items
   GET    /api/search/count        # Get record count
   POST   /api/items/bulk-update   # Save changes (NEW)
   GET    /api/sessions            # List saved sessions
   POST   /api/sessions            # Create session
   GET    /api/sessions/:id        # Get session
   DELETE /api/sessions/:id        # Delete session
   ```

2. **Request/Response Format**
   - Consistent error handling
   - Pagination for large result sets
   - Field-level validation errors
   - Transaction support for bulk operations

3. **Error Handling**
   ```typescript
   {
     success: boolean,
     error?: {
       code: string,
       message: string,
       details?: any
     },
     data?: any
   }
   ```

### Database Considerations

1. **Transaction Management**
   - Use database transactions for bulk updates
   - Rollback on any failure
   - Log all changes before commit

2. **Performance Optimization**
   - Index critical columns (UPC, Style, Department, etc.)
   - Use query optimization for Group By
   - Implement pagination for large result sets
   - Cache frequently accessed reference data

3. **Data Integrity**
   - Foreign key constraints
   - Check constraints for business rules
   - Unique constraints where applicable

### Frontend Patterns

1. **State Management**
   - Redux for global state (search, filters, results)
   - Local state for UI-only concerns (modals, dropdowns)
   - Server state via React Query (optional enhancement)

2. **Component Structure**
   - Presentational components (UI only)
   - Container components (logic + state)
   - Custom hooks for reusable logic

3. **Error Boundaries**
   - Wrap major sections in error boundaries
   - Graceful error handling
   - User-friendly error messages

---

## Design Considerations

### Visual Design

1. **Color Scheme**
   - Primary: `#1976D2` (blue)
   - Success: Green for saved changes
   - Warning: Yellow for pending changes
   - Error: Red for validation errors / varying fields
   - Info: Blue for informational messages

2. **Typography**
   - Headers: System font stack, semibold
   - Body: System font stack, regular
   - Code/Data: Monospace for UPCs, IDs

3. **Spacing & Layout**
   - Consistent padding (4px, 8px, 16px, 24px)
   - Grid system for alignment
   - Responsive breakpoints

### Accessibility

1. **WCAG 2.1 Level AA Compliance**
   - Keyboard navigation for all interactions
   - Screen reader support
   - Focus indicators
   - Color contrast ratios

2. **Keyboard Shortcuts**
   - `Ctrl/Cmd + S`: Save changes
   - `Ctrl/Cmd + Z`: Undo
   - `Ctrl/Cmd + Y`: Redo
   - `Esc`: Cancel/Close dialogs
   - `Tab`: Navigate between fields
   - `Enter`: Save/Confirm

### User Experience

1. **Loading States**
   - Skeleton loaders for table
   - Progress indicators for long operations
   - Optimistic UI updates where appropriate

2. **Feedback**
   - Toast notifications for success/error
   - Inline validation messages
   - Confirmation dialogs for destructive actions

3. **Performance**
   - Lazy load results table
   - Virtual scrolling for large datasets
   - Debounce search input
   - Optimize re-renders

---

## Implementation Roadmap

### Phase 1: Critical Path (Weeks 1-4)

**Week 1-2: Book/Save Functionality**
- Backend: Items module, bulk update endpoint
- Frontend: Book button, confirmation dialog
- Testing: End-to-end save flow

**Week 3: Group By & Activity Filters**
- Backend: Query builder enhancements
- Frontend: Group By selector, activity filter integration
- Testing: Group By scenarios, activity filtering

**Week 4: Polish & Validation**
- Wild card search
- Search limit enforcement
- Read-only field enforcement
- Red highlighting for varying fields

### Phase 2: Enhancements (Weeks 5-6)

- Print functionality
- Enhanced column customization
- Batch operations enhancements
- Performance optimizations

### Phase 3: New Capabilities (Weeks 7-8)

- Field configuration system (if prioritized)
- Audit trail
- Export functionality
- Additional enhancements

---

## Testing Requirements

### Unit Tests

- Query builder logic
- Filter state management
- Validation rules
- Data transformation functions

### Integration Tests

- Search flow end-to-end
- Save flow end-to-end
- Filter application
- Session save/load

### E2E Tests

- Complete user workflows
- Error scenarios
- Performance benchmarks
- Cross-browser compatibility

---

## Success Criteria

### Functional Parity

- ✅ All Priority 1 features implemented
- ✅ 100% feature parity with legacy system (primary vendor mode)
- ✅ All critical workflows functional

### Performance

- ✅ Search response time: ≤3 seconds for ≤20K records
- ✅ Save operation: ≤5 seconds for ≤1K rows
- ✅ UI responsiveness: ≤100ms for user interactions

### Quality

- ✅ Zero critical bugs
- ✅ <5% error rate in production
- ✅ 99.5%+ uptime
- ✅ WCAG 2.1 Level AA compliance

---

## Appendix: Field Reference

### Complete Column List (35 columns)

1. UPC
2. First Digits
3. Vendor
4. Style
5. Color Name
6. Vendor Color
7. Size
8. Description
9. POS Description
10. First Cost
11. Wholesale Cost
12. Retail Price
13. Markdown Price
14. Markdown Date
15. Outlet Price
16. Outlet Markdown
17. Outlet Markdown Date
18. Department
19. Class
20. Sub-Class
21. Sub Dept
22. Attribute 1
23. Attribute 2
24. Attribute 3
25. Season
26. Prepack
27. Last Modified
28. Alt Style/SKU
29. Active Code
30. Status
31. Available On Web
32. Stat 3
33. Item Picture
34. Employee Price
35. Web Back Order Eligible

---

## Document Maintenance

**Last Updated**: 2025-01-11  
**Next Review**: After Phase 1 completion  
**Owner**: Product Team  
**Stakeholders**: Design Team, Engineering Team, Product Management

---

**Note for Design & Engineering Teams:**

This document serves as the source of truth for functional requirements. Each priority section includes:
- Clear requirements
- Technical implementation guidance
- File locations for modifications
- Effort estimates

Please refer to this document when planning sprints and implementing features. For questions or clarifications, contact the Product Team.

