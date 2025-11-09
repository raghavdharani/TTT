# Task Breakdown: Contextual Search Workspace

## Overview
Total Tasks: ~45 tasks across 5 task groups

## Task List

### Backend Layer

#### Task Group 1: Search API and Database Queries
**Dependencies:** None

- [x] 1.0 Complete search API and database layer
  - [x] 1.1 Write 2-8 focused tests for search functionality
    - Test multi-field search (SKU, Style, Vendor, Description)
    - Test partial matching behavior
    - Test search with no results
    - Test search performance with large dataset (≤3s for 20K records)
    - Test search with special characters
    - Limit to 2-8 highly focused tests maximum
  - [x] 1.2 Create SearchRequest and SearchResponse TypeScript interfaces
    - Fields: quickSearch, filters (hierarchy, activity, vendor, pricing, status, dates), vendorMode, sort, pagination
    - Response: count, data, executionTime, hasMore
    - Use Zod schemas for validation
  - [ ] 1.3 Implement search query builder service
    - Build SQL query with multi-field WHERE clauses (SKU, Style, Vendor, Description)
    - Use indexed fields for WHERE clauses (articles.style, articles.upc, articles.description)
    - Support partial matching with LIKE or full-text search
    - Handle vendor mode (primary vs secondary) affecting table joins
    - Optimize query with proper indexes
  - [ ] 1.4 Implement filter application logic
    - Hierarchy filters: Department (coll table), Class (types table), Subclass
    - Activity filters: Status, Last Modified Date, Creation Date
    - Vendor filters: Vendor Name, Primary/Secondary mode
    - Pricing filters: Wholesale, Retail, Markdown (min/max ranges)
    - Status & Attributes: Active Code, Season, Label/Ticket
    - Date filters: Date range with preset support
  - [ ] 1.5 Implement record count query (optimized)
    - Separate COUNT query for performance
    - Use same filter logic as search query
    - Cache count results in Redis with appropriate TTL
    - Performance target: ≤3s for ≤20K records
  - [ ] 1.6 Implement Redis caching for search results
    - Cache search results with query hash as key
    - Cache record counts separately
    - Set appropriate TTL (e.g., 5 minutes)
    - Invalidate cache on data updates
  - [ ] 1.7 Implement pagination support
    - Default page size: 1000 records
    - Support page number and limit parameters
    - Return hasMore flag for infinite scroll support
  - [ ] 1.8 Ensure search API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify search returns correct results
    - Verify performance targets met
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Search queries execute ≤3s for ≤20K records
- Multi-field search works correctly
- All filter types apply correctly
- Record count query optimized and cached
- Pagination works correctly

#### Task Group 2: Saved Search Sessions API
**Dependencies:** Task Group 1

- [x] 2.0 Complete saved search sessions API
  - [x] 2.1 Write 2-8 focused tests for search sessions
    - Test create session with filters and search query
    - Test load session restores all criteria
    - Test update existing session
    - Test delete session
    - Test list user sessions
    - Limit to 2-8 highly focused tests maximum
  - [x] 2.2 Create SearchSession database model/table
    - Fields: id, userId, name, searchQuery, filters (JSON), sortConfig (JSON), columnConfig (JSON), createdAt, updatedAt
    - Add indexes: userId, createdAt
    - Use existing database (no schema changes to KWI tables)
  - [x] 2.3 Create migration for search_sessions table
    - Add table with all required fields
    - Add indexes for userId and createdAt
    - Foreign key to users table if applicable
  - [x] 2.4 Implement CRUD API endpoints for sessions
    - POST /api/sessions - Create session
    - GET /api/sessions - List user sessions
    - GET /api/sessions/:id - Load session
    - PUT /api/sessions/:id - Update session
    - DELETE /api/sessions/:id - Delete session
    - Include authentication/authorization checks
  - [x] 2.5 Implement auto-restore last session feature
    - User preference flag for auto-restore
    - Load last session on login if enabled
    - API endpoint to get last session
  - [ ] 2.6 Ensure saved sessions API tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify all CRUD operations work
    - Verify auto-restore works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- All CRUD operations work correctly
- Sessions persist and restore all search criteria
- Auto-restore feature works when enabled
- Proper authorization enforced

### Frontend Components

#### Task Group 3: Search Bar and Header Components
**Dependencies:** Task Group 1

- [x] 3.0 Complete search bar and header components
  - [x] 3.1 Write 2-8 focused tests for search bar
    - Test search input updates state
    - Test debounced search triggers API call
    - Test manual search button
    - Test search history dropdown
    - Test autocomplete suggestions
    - Limit to 2-8 highly focused tests maximum
  - [x] 3.2 Create HeaderBar component
    - Position search bar centered in header with max-width constraint
    - Add search icon on left side of input
    - Placeholder: "Search by SKU, UPC, or description..."
    - Filter toggle button with active state (blue background when panel open)
    - Match design from `planning/visuals/Retail Dashboard Design/src/components/HeaderBar.tsx`
  - [x] 3.3 Implement global search input with debouncing
    - Use React Hook Form or controlled input
    - Implement 500ms debounce delay
    - Trigger search API call on debounce
    - Manual "Search" button as backup trigger
    - Rounded corners (rounded-lg) and primary color focus (#1976D2)
  - [x] 3.4 Implement search history dropdown
    - Show recent searches (last 10-20 queries) below input when focused
    - Store history in localStorage or sessionStorage
    - Clicking history item triggers search
    - Clear history option available
  - [x] 3.5 Implement autocomplete suggestions
    - Show suggestions based on partial input
    - Match against SKU, Style, Vendor, or Description
    - Display suggestions in dropdown below input
    - Clicking suggestion triggers search
    - Limit to 5-10 suggestions
  - [x] 3.6 Implement advanced sorting controls
    - Sort options: Relevance, Last Modified, Creation Date, Price (ascending/descending)
    - Display sort controls in header or near search bar
    - Update sort state and trigger new search
    - Persist sort with saved sessions
  - [ ] 3.7 Ensure search bar component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify search input works correctly
    - Verify debouncing works
    - Verify history and autocomplete work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Search bar matches visual design
- Debounced search works correctly
- Search history and autocomplete function properly
- Advanced sorting controls work
- All interactions are accessible

#### Task Group 4: Filter Panel Components
**Dependencies:** Task Group 1

- [x] 4.0 Complete filter panel components
  - [x] 4.1 Write 2-8 focused tests for filter panel
    - Test filter panel toggle open/close
    - Test accordion sections expand/collapse
    - Test filter application
    - Test filter reset
    - Test active filters display
    - Limit to 2-8 highly focused tests maximum
  - [x] 4.2 Create FilterPanel component structure
    - Collapsible sidebar (320px width when open)
    - Collapsed by default
    - Header with "Filters" title and close button (X icon)
    - Scrollable content area using ScrollArea component
    - Match design from `planning/visuals/Retail Dashboard Design/src/components/FilterPanel.tsx`
  - [x] 4.3 Implement accordion-based filter sections
    - Use shadcn/ui Accordion component
    - Sections: Item Details, Hierarchy, Vendor, Pricing, Status & Attributes, Dates
    - Default expanded: Item Details and Hierarchy
    - Auto-expand Vendor section when vendor mode changes
    - Rounded borders, padding, hover states
  - [x] 4.4 Implement Item Details filter section
    - SKU/UPC text input
    - Description text input
    - Size dropdown (populated from reference data)
    - Color text input
  - [x] 4.5 Implement Hierarchy filter section
    - Department dropdown (from `coll` reference table)
    - Class dropdown (from `types` reference table)
    - Subclass dropdown (dependent on Class selection)
  - [x] 4.6 Implement Vendor filter section
    - Vendor Name dropdown
    - Vendor Color text input
    - Primary/Secondary Vendor mode toggle (radio buttons or switch)
    - Auto-expand section when vendor mode changes
  - [x] 4.7 Implement Pricing filter section
    - Wholesale Price range (min/max number inputs side-by-side)
    - Retail Price range (min/max number inputs)
    - Markdown Price range (min/max number inputs)
  - [x] 4.8 Implement Status & Attributes filter section
    - Active Code dropdown (Status with controlled vocabulary)
    - Season dropdown
    - Label/Ticket dropdown
  - [x] 4.9 Implement Dates filter section
    - Last Modified Date range picker (from/to)
    - Creation Date range picker (from/to)
    - Preset buttons (Today, Last 7 days, Last 30 days, Last 90 days, This Month, This Year)
    - Custom date pickers using Calendar component in Popover
    - Date format: "Month Day, Year" (e.g., "November 7, 2025")
  - [x] 4.10 Implement filter actions
    - "Apply Filters" button (primary blue #1976D2, full-width, rounded-lg)
    - "Reset" button (outline variant, full-width, rounded-lg)
    - Apply triggers filter API call and updates active filters
    - Reset clears all filter inputs and active filters
  - [x] 4.11 Implement active filters display
    - Display active filters as removable chips/badges above grid
    - Use Badge component from shadcn/ui
    - Show filter label and value
    - X icon on each chip to remove individual filter
    - Update search when filter removed
  - [ ] 4.12 Ensure filter panel component tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify filter panel toggles correctly
    - Verify all filter sections work
    - Verify apply and reset work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Filter panel matches visual design
- All filter sections render and function correctly
- Filter application and reset work properly
- Active filters display and removal work
- All interactions are accessible

#### Task Group 5: Saved Search Sessions UI and Record Count
**Dependencies:** Task Groups 2, 3, 4

- [x] 5.0 Complete saved sessions UI and record count
  - [x] 5.1 Write 2-8 focused tests for saved sessions UI
    - Test save current search state
    - Test load saved session
    - Test update saved session
    - Test delete saved session
    - Test auto-restore last session
    - Limit to 2-8 highly focused tests maximum
  - [x] 5.2 Implement saved sessions management UI
    - Save current search button/menu item
    - List saved sessions in dropdown or sidebar section
    - Load saved session restores all criteria (filters, sort, search query)
    - Update existing saved session
    - Delete saved session with confirmation
  - [x] 5.3 Implement record count preview
    - Display record count dynamically as filters are applied
    - Show count in format: "X records found" or "X results"
    - Call count API endpoint (optimized, cached)
    - Display count before grid loads
    - "Load Results" button to fetch actual grid data after verifying count
  - [x] 5.4 Implement auto-restore last session UI
    - User preference toggle for auto-restore
    - Load last session on page load if enabled
    - Show notification when session restored
  - [ ] 5.5 Ensure saved sessions UI tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify save/load/update/delete work
    - Verify auto-restore works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Saved sessions UI works correctly
- Record count preview displays correctly
- Auto-restore feature works when enabled
- All interactions are accessible

### Integration & State Management

#### Task Group 6: State Management and API Integration
**Dependencies:** Task Groups 1, 2, 3, 4, 5

- [x] 6.0 Complete state management and API integration
  - [x] 6.1 Write 2-8 focused tests for state management
    - Test search state updates correctly
    - Test filter state management
    - Test saved sessions state
    - Test API integration
    - Limit to 2-8 highly focused tests maximum
  - [x] 6.2 Set up state management for search workspace
    - Use Redux Toolkit or Zustand for global state
    - State includes: searchQuery, filters, sortConfig, activeFilters, recordCount, savedSessions
    - Create slices/stores for search, filters, and sessions
  - [x] 6.3 Implement API client for search endpoints
    - Create search API service using Axios
    - POST /api/search - Search with filters
    - GET /api/search/count - Get record count
    - Include request/response interceptors for error handling
    - Support request cancellation
  - [x] 6.4 Implement API client for saved sessions
    - CRUD operations for search sessions
    - Integrate with state management
    - Handle loading and error states
  - [x] 6.5 Connect search bar to API
    - Debounced search triggers API call
    - Update state with results
    - Handle loading and error states
    - Display error messages appropriately
  - [x] 6.6 Connect filter panel to API
    - Apply filters triggers search API call
    - Update active filters state
    - Reset filters clears state and triggers new search
    - Update record count when filters change
  - [x] 6.7 Connect record count to API
    - Call count API when filters/search change
    - Display count in UI
    - Cache count results appropriately
  - [x] 6.8 Integrate saved sessions with search state
    - Save current state to session
    - Load session restores all state
    - Update session when state changes (if auto-save enabled)
  - [ ] 6.9 Ensure integration tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify state management works correctly
    - Verify API integration works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 6.1 pass
- State management works correctly
- API integration works for all endpoints
- Search, filters, and sessions are properly connected
- Error handling works correctly

### Testing

#### Task Group 7: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-6

- [ ] 7.0 Review existing tests and fill critical gaps only
  - [ ] 7.1 Review tests from Task Groups 1-6
    - Review the 2-8 tests written by backend-engineer (Task 1.1)
    - Review the 2-8 tests written by backend-engineer (Task 2.1)
    - Review the 2-8 tests written by frontend-engineer (Task 3.1)
    - Review the 2-8 tests written by frontend-engineer (Task 4.1)
    - Review the 2-8 tests written by frontend-engineer (Task 5.1)
    - Review the 2-8 tests written by integration-engineer (Task 6.1)
    - Total existing tests: approximately 12-48 tests
  - [ ] 7.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [ ] 7.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Examples: full search workflow, filter application workflow, saved session workflow
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 7.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, and 7.3)
    - Expected total: approximately 22-58 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 22-58 tests total)
- Critical user workflows for this feature are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence:
1. Backend Layer - Search API and Database Queries (Task Group 1)
2. Backend Layer - Saved Search Sessions API (Task Group 2)
3. Frontend Components - Search Bar and Header (Task Group 3)
4. Frontend Components - Filter Panel (Task Group 4)
5. Frontend Components - Saved Sessions UI and Record Count (Task Group 5)
6. Integration & State Management (Task Group 6)
7. Test Review & Gap Analysis (Task Group 7)

## Notes

- All components should follow shadcn/ui design patterns from the visual prototype
- Use TypeScript for type safety throughout
- Follow RESTful API design patterns per standards
- Ensure WCAG 2.1 Level AA accessibility compliance
- Performance target: ≤3s for search queries on ≤20K records
- Reference visual design from `planning/visuals/Retail Dashboard Design` for UI implementation

