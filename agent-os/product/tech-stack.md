# Tech Stack: Item Maintenance V2

This document defines the complete technical stack for Item Maintenance V2, a modern retail product data management system built on the GES 2.0 framework. All technology choices prioritize performance, maintainability, scalability, and enterprise-grade reliability.

---

## Framework & Runtime

- **Frontend Framework**: React 18+ with TypeScript
- **Backend Runtime**: Node.js 18+ (LTS recommended)
- **Language**: TypeScript 5.0+ (strict mode)
- **Package Manager**: npm or yarn
- **Build Tool**: Vite 5.0+ (frontend) / tsc (backend)

---

## Frontend Stack

### Core Framework
- **UI Framework**: React 18.2.0+
  - Functional components with hooks
  - Concurrent features for performance
  - Server Components (if applicable)
- **Type Safety**: TypeScript 5.0+
  - Strict mode enabled
  - Comprehensive type definitions
  - Shared types package

### State Management
- **Primary**: Redux Toolkit 2.0+ or Zustand 4.0+
  - **Redux Toolkit** (recommended for complex state):
    - Centralized state management
    - RTK Query for API calls
    - DevTools integration
  - **Zustand** (alternative for simpler state):
    - Lightweight, minimal boilerplate
    - Good for grid state and UI preferences
- **Local State**: React Hooks (useState, useReducer)
  - Component-level state
  - Form state management
  - UI state (modals, tooltips)

### Grid Component
- **Primary Option**: AG-Grid Community 31.0+
  - Enterprise features available if needed
  - Excellent performance with large datasets
  - Built-in editing, filtering, sorting
  - Virtual scrolling
  - Column management
- **Alternative**: TanStack Table (React Table) 8.0+
  - Headless, highly customizable
  - Smaller bundle size
  - More control over rendering

### UI Library & Styling
- **Option 1**: Tailwind CSS 3.4.0+ + shadcn/ui
  - Utility-first CSS
  - Pre-built accessible components
  - Customizable design system
  - Small bundle size with purging
- **Option 2**: Material-UI (MUI) 5.0+
  - Comprehensive component library
  - Theming system
  - Accessibility built-in
  - Larger bundle size

**Recommendation**: Tailwind CSS + shadcn/ui for better performance and customization

### API Client
- **HTTP Client**: Axios 1.6.0+
  - Request/response interceptors
  - Error handling
  - Request cancellation
  - Timeout configuration
- **Alternative**: Fetch API with custom wrapper
  - Native browser API
  - Smaller bundle size
  - Less feature-rich

### Form Management
- **Form Library**: React Hook Form 7.0+
  - Performance optimized
  - Minimal re-renders
  - Validation integration
  - TypeScript support

### Validation
- **Schema Validation**: Zod 3.22.0+
  - TypeScript-first
  - Runtime validation
  - Client and server validation
  - Type inference

---

## Backend Stack

### Runtime & Framework
- **Runtime**: Node.js 18+ (LTS)
- **Framework Option 1**: Express.js 4.18+
  - Minimal, flexible
  - Large ecosystem
  - Easy to understand
- **Framework Option 2**: NestJS 10.0+
  - TypeScript-first
  - Built-in dependency injection
  - Modular architecture
  - Better for large teams

**Recommendation**: NestJS for better structure and TypeScript support

### Database
- **Database**: Existing KWI database
  - SQL Server or PostgreSQL (as per existing setup)
  - No schema changes required
  - Must work with existing tables:
    - `articles` (main product table)
    - `artven` (vendor linkage)
    - `artvc` (vendor-specific data)
    - `coll` (department master)
    - `types` (class master)
    - `patterns` (color/pattern master)
- **New Tables**:
  - `audit_log` (change tracking)
  - `search_sessions` (user preferences)
  - `layout_profiles` (column configurations)
  - `field_permissions` (role-based access)

### ORM / Query Builder
- **Option 1**: Prisma 5.0+
  - Type-safe database client
  - Excellent TypeScript support
  - Migration system
  - Query optimization
- **Option 2**: TypeORM 0.3+
  - Mature, feature-rich
  - Active Record and Data Mapper patterns
  - Complex query support

**Recommendation**: Prisma for better TypeScript integration and developer experience

### Validation
- **Schema Validation**: Zod 3.22.0+ (shared with frontend)
  - Consistent validation across stack
  - Type inference
  - Runtime validation

### Authentication & Authorization
- **Authentication**: JWT (JSON Web Tokens)
  - Stateless authentication
  - Integration with KWI auth service
  - Token refresh mechanism
- **Authorization**: Role-Based Access Control (RBAC)
  - Field-level permissions
  - Mode-specific restrictions (Primary/Secondary Vendor)
  - Custom middleware for permission checks

### API Documentation
- **API Docs**: OpenAPI/Swagger 3.0+
  - Auto-generated from code
  - Interactive API explorer
  - Type definitions

---

## Development Tools

### Code Quality
- **Linting**: ESLint 8.55.0+
  - React plugins
  - TypeScript support
  - Airbnb or Standard config
- **Formatting**: Prettier 3.1.0+
  - Consistent code style
  - Auto-format on save
- **Type Checking**: TypeScript compiler
  - Strict mode
  - No implicit any

### Testing
- **Unit Testing**: Jest 29.7.0+
  - Test runner and assertion library
  - Snapshot testing
  - Mocking capabilities
- **Component Testing**: React Testing Library 14.1.0+
  - User-centric testing
  - Accessibility testing
  - Integration with Jest
- **E2E Testing**: Playwright 1.40+ or Cypress 13.0+
  - Browser automation
  - Cross-browser testing
  - Visual regression testing

### Build & Bundling
- **Frontend Build**: Vite 5.0+
  - Fast HMR
  - Optimized production builds
  - ES modules
- **Backend Build**: TypeScript compiler (tsc)
  - Type checking
  - Compilation to JavaScript

### Development Environment
- **Code Editor**: VS Code (recommended)
  - Extensions: ESLint, Prettier, TypeScript
- **Version Control**: Git
  - Branching strategy: Git Flow or GitHub Flow
- **Package Management**: npm or yarn
  - Lock files for reproducibility

---

## Infrastructure & Deployment

### Hosting
- **Frontend**: 
  - **Recommended**: Vercel (optimized for React)
  - **Alternatives**: Netlify, AWS S3 + CloudFront, Azure Static Web Apps
- **Backend**:
  - **Recommended**: AWS EC2, Azure App Service, or Railway
  - **Container**: Docker + Kubernetes (for scalability)
  - **Serverless**: AWS Lambda, Azure Functions (for specific endpoints)

### Database Hosting
- **Existing**: KWI database (on-premise or cloud)
- **New Tables**: Same database instance
- **Connection**: Connection pooling required
  - pgBouncer (PostgreSQL) or connection pooler (SQL Server)

### CI/CD
- **CI Platform**: GitHub Actions, GitLab CI, or Jenkins
  - Automated testing
  - Linting and type checking
  - Build and deployment
- **CD Strategy**: 
  - Automated deployment to staging
  - Manual approval for production
  - Feature flags for gradual rollout

### Monitoring & Observability
- **Application Monitoring**: 
  - **Option 1**: New Relic
  - **Option 2**: Datadog
  - **Option 3**: Application Insights (Azure)
- **Error Tracking**: Sentry
  - Error capture and reporting
  - Performance monitoring
  - Release tracking
- **Logging**: 
  - **Structured Logging**: Winston or Pino
  - **Log Aggregation**: ELK Stack, Splunk, or cloud logging

### Caching
- **In-Memory Cache**: Redis 7.0+
  - Search result caching
  - Reference data caching
  - Session storage
- **CDN**: CloudFlare, AWS CloudFront, or Azure CDN
  - Static asset delivery
  - API response caching (where appropriate)

---

## Security

### Authentication
- JWT tokens with secure storage
- Token refresh mechanism
- Session management
- Integration with KWI auth service

### Authorization
- Role-Based Access Control (RBAC)
- Field-level permissions
- Mode-specific restrictions
- Server-side validation of all permissions

### Data Protection
- SQL injection prevention (parameterized queries)
- XSS protection (React's built-in escaping)
- CSRF protection (tokens)
- Input sanitization
- Output encoding

### Security Headers
- Content Security Policy (CSP)
- HTTPS enforcement
- Secure cookies
- X-Frame-Options
- X-Content-Type-Options

---

## Performance Optimization

### Frontend
- **Code Splitting**: React.lazy() and Suspense
- **Bundle Optimization**: Tree shaking, minification
- **Asset Optimization**: Image compression, lazy loading
- **Caching**: Browser caching, service workers (future)
- **Virtual Scrolling**: AG-Grid built-in for large datasets

### Backend
- **Query Optimization**: 
  - Indexed fields for WHERE clauses
  - Prepared statements
  - Query result caching (Redis)
- **Connection Pooling**: 
  - pgBouncer (PostgreSQL)
  - Connection pooler (SQL Server)
- **Batch Operations**: 
  - Batch SQL updates (not row-by-row)
  - Transaction optimization
- **Caching Strategy**:
  - Reference data (departments, classes, etc.)
  - Search results (with TTL)
  - User preferences

### Database
- **Indexes**: 
  - On frequently queried fields
  - Composite indexes for common queries
- **Query Analysis**: 
  - EXPLAIN plans
  - Performance monitoring
  - Slow query logging

---

## Browser Support

### Target Browsers
- **Chrome**: Latest 2 versions (90+)
- **Firefox**: Latest 2 versions (88+)
- **Safari**: Latest 2 versions (14+)
- **Edge**: Latest 2 versions (90+)

### Mobile
- **iOS Safari**: Latest 2 versions
- **Chrome Mobile**: Latest 2 versions

### Polyfills
- Not required for modern browsers
- Core functionality works with JavaScript enabled
- Progressive enhancement approach

---

## Accessibility

### Standards
- **WCAG Compliance**: Level 2.1 AA (minimum)
- **ARIA**: Full ARIA label and role support
- **Keyboard Navigation**: Complete keyboard support
- **Screen Readers**: Tested with NVDA, JAWS, VoiceOver

### Implementation
- Semantic HTML
- ARIA attributes
- Focus management
- Keyboard shortcuts
- High contrast support
- Screen reader announcements

---

## Third-Party Services

### Analytics (Optional)
- **Option 1**: Google Analytics 4
- **Option 2**: Plausible (privacy-friendly)
- **Usage**: Feature usage, performance metrics, user flows

### Error Tracking
- **Sentry**: Error capture, performance monitoring, release tracking

### Monitoring
- **APM**: New Relic, Datadog, or Application Insights
- **Uptime Monitoring**: Pingdom, UptimeRobot, or StatusCake

---

## Storage

### Client-Side Storage
- **sessionStorage**: Pending edits, current session state
- **localStorage**: User preferences (fallback)
- **IndexedDB**: Future - for offline support

### Server-Side Storage
- **Database**: KWI database (existing + new tables)
- **File Storage**: 
  - Export files: S3, Azure Blob, or local storage
  - Temporary files: Same or dedicated storage

---

## Production Dependencies

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "ag-grid-react": "^31.0.0",
    "ag-grid-community": "^31.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "zod": "^3.22.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "winston": "^3.11.0",
    "redis": "^4.6.0"
  }
}
```

---

## Development Dependencies

### Frontend
```json
{
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.0",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### Backend
```json
{
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.2",
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

---

## Project Structure

```
item-maintenance-v2/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── grid/
│   │   │   ├── search/
│   │   │   ├── forms/
│   │   │   └── common/
│   │   ├── features/
│   │   │   ├── search/
│   │   │   ├── editing/
│   │   │   ├── validation/
│   │   │   └── export/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── api/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── articles/
│   │   │   ├── search/
│   │   │   ├── validation/
│   │   │   ├── audit/
│   │   │   └── auth/
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── decorators/
│   │   ├── config/
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── shared/
│   └── types/
│       ├── article.ts
│       ├── search.ts
│       └── validation.ts
│
└── docs/
    ├── api/
    └── architecture/
```

---

## Technology Decisions

### Why React + TypeScript?
- **Type Safety**: Catch errors at compile time
- **Component Reusability**: Modular, maintainable code
- **Ecosystem**: Large community and library support
- **Performance**: Virtual DOM and optimization features
- **Developer Experience**: Excellent tooling and debugging

### Why Redux Toolkit?
- **Predictable State**: Centralized, predictable state management
- **DevTools**: Excellent debugging capabilities
- **RTK Query**: Built-in API state management
- **Scalability**: Handles complex application state
- **Team Familiarity**: Common pattern in enterprise apps

### Why AG-Grid?
- **Performance**: Handles 100K+ rows with virtual scrolling
- **Features**: Built-in editing, filtering, sorting, grouping
- **Customization**: Highly configurable
- **Enterprise Ready**: Battle-tested in production
- **Documentation**: Comprehensive docs and examples

### Why NestJS?
- **TypeScript First**: Built for TypeScript
- **Modular**: Clean, organized architecture
- **Dependency Injection**: Testable, maintainable code
- **Built-in Features**: Validation, guards, interceptors
- **Scalability**: Handles large codebases well

### Why Prisma?
- **Type Safety**: Auto-generated types from schema
- **Developer Experience**: Excellent tooling and migrations
- **Performance**: Optimized queries
- **Modern**: Active development and community
- **Migration System**: Version-controlled schema changes

### Why Zod?
- **Type Inference**: TypeScript types from schemas
- **Shared Validation**: Same schemas for client and server
- **Runtime Safety**: Validates data at runtime
- **Composable**: Easy to build complex validations
- **TypeScript First**: Excellent TS support

---

## Future Considerations

### Potential Additions
- **GraphQL**: If API complexity grows
- **WebSockets**: For real-time collaboration
- **Service Workers**: For offline support
- **Micro-frontends**: If application scales significantly
- **Kubernetes**: For container orchestration
- **Message Queue**: For background jobs (RabbitMQ, Redis Queue)
- **Search Engine**: Elasticsearch for advanced search (if needed)

### Migration Paths
- **JavaScript → TypeScript**: Already TypeScript-first
- **Redux → Zustand**: If state becomes simpler
- **AG-Grid Community → Enterprise**: If advanced features needed
- **Express → NestJS**: Already NestJS-first
- **Monolith → Microservices**: If scale requires it

---

## Performance Targets

### Frontend
- **Initial Load**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Bundle Size**: < 500KB (gzipped)
- **Grid Render**: < 1 second for 1K rows

### Backend
- **Search API**: ≤ 3 seconds for ≤ 20K records
- **Save API**: ≤ 5 seconds for 1K rows
- **Validation API**: < 100ms per field
- **Permission Check**: < 50ms per request

### Database
- **Query Performance**: < 500ms for indexed queries
- **Batch Updates**: < 5 seconds for 1K rows
- **Connection Pool**: 10-20 connections

---

## Current Stack Status

✅ **All core technologies selected and validated:**
- React 18+ with TypeScript - ✅ Selected
- Redux Toolkit or Zustand - ✅ Selected
- AG-Grid or TanStack Table - ✅ Selected
- NestJS or Express - ✅ Selected
- Prisma or TypeORM - ✅ Selected
- Zod for validation - ✅ Selected

**Next Steps**:
1. Finalize UI library choice (Tailwind + shadcn/ui vs MUI)
2. Finalize state management (Redux Toolkit vs Zustand)
3. Set up development environment
4. Create project structure
5. Configure CI/CD pipeline

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-07  
**Status**: Active Planning
