# Architecture Diagram: Contextual Search Workspace

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│                    (React + TypeScript)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HeaderBar Component                    │  │
│  │  • Breadcrumb navigation                                  │  │
│  │  • Global SearchBar (debounced, history, autocomplete)    │  │
│  │  • Filter toggle button                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  SearchBar Component                       │  │
│  │  • 500ms debounced search                                  │  │
│  │  • Search history (localStorage)                          │  │
│  │  • Autocomplete suggestions                                │  │
│  │  • Manual "Search" button                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Redux Store (searchSlice)                     │  │
│  │  • searchQuery                                            │  │
│  │  • filters                                                │  │
│  │  • sortConfig                                             │  │
│  │  • activeFilters                                          │  │
│  │  • recordCount                                            │  │
│  │  • results                                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐          │
│  │                                                    │          │
│  ▼                                                    ▼          │
│  ┌──────────────────────┐          ┌──────────────────────────┐ │
│  │   FilterPanel        │          │   RecordCount Component   │ │
│  │   (Collapsible)     │          │   • Shows count preview   │ │
│  │                      │          │   • "Load Results" button │ │
│  │  • Item Details      │          └──────────────────────────┘ │
│  │  • Hierarchy         │                                        │
│  │  • Vendor            │                                        │
│  │  • Pricing           │                                        │
│  │  • Status & Attr     │                                        │
│  │  • Dates             │                                        │
│  └──────────────────────┘                                        │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────┐                                        │
│  │  ActiveFilters        │                                        │
│  │  (Removable chips)    │                                        │
│  └──────────────────────┘                                        │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Client Services                           │  │
│  │  • searchApi.ts (POST /api/search, GET /api/search/count)│  │
│  │  • sessionsApi.ts (CRUD /api/sessions)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                         Backend Layer                             │
│                    (NestJS + TypeScript)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Search Controller                            │  │
│  │  POST /api/search                                         │  │
│  │  GET  /api/search/count                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Search Service                               │  │
│  │  • search(request) → SearchResponse                       │  │
│  │  • getRecordCount(request) → RecordCountResponse         │  │
│  │  • buildSearchQuery() [TODO: Implement SQL]              │  │
│  │  • applyFilters() [TODO: Implement filter logic]         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐          │
│  │                                                    │          │
│  ▼                                                    ▼          │
│  ┌──────────────────────┐          ┌──────────────────────────┐ │
│  │   Query Builder       │          │   Redis Cache             │ │
│  │   [TODO: Implement]   │          │   [TODO: Implement]       │ │
│  │   • Multi-field WHERE │          │   • Search results cache  │ │
│  │   • Filter application│          │   • Count cache           │ │
│  │   • Vendor mode joins │          │   • TTL: 5 minutes         │ │
│  └──────────────────────┘          └──────────────────────────┘ │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Database (KWI)                              │  │
│  │  • articles (main product table)                         │  │
│  │  • artven (vendor linkage)                               │  │
│  │  • artvc (vendor-specific data)                           │  │
│  │  • coll (department master)                              │  │
│  │  • types (class master)                                  │  │
│  │  • patterns (color/pattern master)                       │  │
│  │  • search_sessions (new table)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Sessions Controller                          │  │
│  │  POST   /api/sessions                                     │  │
│  │  GET    /api/sessions                                     │  │
│  │  GET    /api/sessions/:id                                 │  │
│  │  GET    /api/sessions/last                                │  │
│  │  PUT    /api/sessions/:id                                 │  │
│  │  DELETE /api/sessions/:id                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Sessions Service                             │  │
│  │  • create()                                               │  │
│  │  • findAll()                                              │  │
│  │  • findOne()                                             │  │
│  │  • findLast()                                            │  │
│  │  • update()                                               │  │
│  │  • remove()                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Prisma ORM                                   │  │
│  │  • SearchSession model                                    │  │
│  │  • Database queries                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Shared Types Layer                          │
│                    (TypeScript + Zod)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  • SearchRequest interface                                       │
│  • SearchResponse interface                                     │
│  • SearchFilters interface                                       │
│  • SortConfig interface                                          │
│  • PaginationConfig interface                                    │
│  • Zod validation schemas                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Search Flow
```
User types in SearchBar
    │
    ▼
Debounce (500ms) or Manual Search
    │
    ▼
Redux Action → searchSlice.setSearchQuery()
    │
    ▼
searchApi.search(request)
    │
    ▼
POST /api/search
    │
    ▼
SearchService.search()
    │
    ▼
Query Builder → SQL Query
    │
    ▼
Database (articles, artven, artvc)
    │
    ▼
Results → SearchResponse
    │
    ▼
Redux Store → searchSlice.setResults()
    │
    ▼
UI Updates (Grid displays results)
```

### Filter Flow
```
User applies filters in FilterPanel
    │
    ▼
Click "Apply Filters"
    │
    ▼
Collect filter values
    │
    ▼
Redux Action → searchSlice.setFilters()
    │
    ▼
searchApi.getCount(request) [Preview]
    │
    ▼
GET /api/search/count
    │
    ▼
SearchService.getRecordCount()
    │
    ▼
Optimized COUNT query
    │
    ▼
RecordCount component displays count
    │
    ▼
User clicks "Load Results"
    │
    ▼
searchApi.search(request)
    │
    ▼
Full search with filters applied
```

### Saved Sessions Flow
```
User clicks "Save Current Search"
    │
    ▼
SavedSessions component
    │
    ▼
sessionsApi.create(sessionData)
    │
    ▼
POST /api/sessions
    │
    ▼
SessionsService.create()
    │
    ▼
Prisma → search_sessions table
    │
    ▼
Session saved
    │
    ▼
User clicks "Load Session"
    │
    ▼
sessionsApi.findOne(id)
    │
    ▼
GET /api/sessions/:id
    │
    ▼
Restore searchQuery, filters, sortConfig
    │
    ▼
Redux Store updated
    │
    ▼
UI reflects saved session state
```

## Component Hierarchy

```
App
├── HeaderBar
│   ├── Breadcrumb
│   ├── SearchBar
│   │   ├── Search Input
│   │   ├── Search History Dropdown
│   │   └── Autocomplete Suggestions
│   ├── Filter Toggle Button
│   └── SortControls
├── FilterPanel (Collapsible)
│   ├── ItemDetailsSection
│   ├── HierarchySection
│   ├── VendorSection
│   ├── PricingSection
│   ├── StatusAttributesSection
│   ├── DatesSection
│   ├── Apply Filters Button
│   └── Reset Button
├── ActiveFilters (Chips)
├── RecordCount
├── SavedSessions
└── ItemsDataGrid (Out of scope for this spec)
```

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Redux Toolkit** for state management
- **shadcn/ui** components (Accordion, Select, Input, Calendar, etc.)
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **NestJS** with TypeScript
- **Prisma** ORM for database access
- **Zod** for validation
- **Redis** for caching (TODO)
- **PostgreSQL/SQL Server** (KWI database)

### Shared
- **TypeScript** interfaces
- **Zod** schemas for validation

## Key Design Patterns

1. **Component-Based Architecture** - Modular React components
2. **State Management** - Redux Toolkit for global state
3. **API Client Pattern** - Centralized API services
4. **Service Layer** - Business logic in services
5. **Repository Pattern** - Prisma for data access
6. **Validation** - Zod schemas shared between frontend/backend

