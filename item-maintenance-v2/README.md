# Item Maintenance V2

Modern retail product data management system built on the GES 2.0 framework.

## Project Structure

```
item-maintenance-v2/
├── backend/          # NestJS backend API
├── frontend/         # React + TypeScript frontend
└── shared/           # Shared TypeScript types
```

## Implementation Status

### Contextual Search Workspace (MER-1231)

**Status**: In Progress

#### Task Group 1: Search API and Database Queries
- ✅ TypeScript interfaces created (`shared/types/search.ts`)
- ✅ Zod validation schemas created (`shared/types/search.schema.ts`)
- ✅ Search service structure created (`backend/src/modules/search/search.service.ts`)
- ✅ Search controller created (`backend/src/modules/search/search.controller.ts`)
- ✅ Search module created (`backend/src/modules/search/search.module.ts`)
- ✅ Test structure created (`backend/src/modules/search/search.service.spec.ts`)
- ⏳ Query builder implementation (TODO)
- ⏳ Filter application logic (TODO)
- ⏳ Redis caching (TODO)
- ⏳ Database connection setup (TODO)

## Next Steps

1. Set up NestJS project with dependencies
2. Configure database connection (Prisma/TypeORM)
3. Implement query builder with multi-field search
4. Implement filter application logic
5. Set up Redis caching
6. Complete remaining task groups

## Tech Stack

- **Backend**: NestJS, TypeScript, Prisma/TypeORM
- **Frontend**: React 18+, TypeScript, shadcn/ui, Tailwind CSS
- **Database**: KWI database (existing tables)
- **Cache**: Redis
- **Validation**: Zod

