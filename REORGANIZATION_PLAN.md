# MatSafy Project Reorganization Plan

## Current Structure Analysis

The project currently uses Next.js App Router with mixed frontend/backend files. This plan separates concerns while maintaining Next.js conventions.

## Proposed Structure

```
matsafy/
├── app/                          # Next.js App Router (Frontend + API Routes)
│   ├── (auth)/                   # Frontend: Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Frontend: Dashboard pages
│   │   └── vehicles/
│   │       └── page.tsx
│   ├── api/                      # Backend: API Routes
│   │   ├── [...nextauth]/
│   │   │   └── route.ts
│   │   ├── register/
│   │   │   └── route.ts
│   │   └── vehicles/
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── ratings/
│   │           │   ├── route.ts
│   │           │   └── reports/
│   │           │       └── route.ts
│   │           └── route.ts
│   ├── components/               # Frontend: React Components
│   │   ├── HeroVideo.tsx
│   │   ├── SessionProvider.tsx
│   │   └── vehicles/
│   │       └── VehicleCard.tsx
│   ├── lib/                      # Backend: Business Logic & Utilities
│   │   ├── auth.ts              # Authentication logic
│   │   └── prisma.ts            # Database client
│   ├── types/                    # Shared: TypeScript Types
│   │   └── next-auth.d.ts
│   ├── globals.css              # Frontend: Global Styles
│   ├── layout.tsx                # Frontend: Root Layout
│   └── page.tsx                  # Frontend: Home Page
│
├── prisma/                       # Backend: Database
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeding script
│   └── dev.db                   # SQLite database (dev only)
│
├── public/                       # Frontend: Static Assets
│   └── brand/
│       ├── matlog.jpg
│       └── matsafylogo.mp4
│
├── config/                      # Backend: Configuration (NEW)
│   ├── database.ts              # Database configuration
│   └── constants.ts             # App constants
│
├── services/                    # Backend: Business Logic Services (NEW)
│   ├── auth.service.ts         # Authentication service
│   ├── user.service.ts         # User operations
│   ├── vehicle.service.ts      # Vehicle operations
│   └── rating.service.ts       # Rating operations
│
├── utils/                       # Shared: Utility Functions (NEW)
│   ├── validation.ts            # Validation helpers
│   └── errors.ts                # Error handling
│
├── hooks/                       # Frontend: Custom React Hooks (NEW)
│   ├── useAuth.ts
│   └── useVehicles.ts
│
└── [config files]               # Root config files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── vercel.json
```

## Detailed Breakdown

### Frontend Files (UI/Client-Side)

**Pages:**
- `app/page.tsx` - Home/Landing page
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page
- `app/(dashboard)/vehicles/page.tsx` - Vehicles listing page
- `app/layout.tsx` - Root layout wrapper

**Components:**
- `app/components/` - All React UI components
  - `HeroVideo.tsx` - Video component
  - `SessionProvider.tsx` - Auth context provider
  - `vehicles/VehicleCard.tsx` - Vehicle card component

**Styles:**
- `app/globals.css` - Global CSS styles

**Assets:**
- `public/` - Static files (images, videos, etc.)

**Hooks (NEW):**
- `hooks/useAuth.ts` - Authentication hook
- `hooks/useVehicles.ts` - Vehicles data fetching hook

### Backend Files (Server-Side)

**API Routes:**
- `app/api/[...nextauth]/route.ts` - NextAuth authentication
- `app/api/register/route.ts` - User registration endpoint
- `app/api/vehicles/route.ts` - Vehicle CRUD operations
- `app/api/vehicles/[id]/route.ts` - Single vehicle operations
- `app/api/vehicles/[id]/ratings/route.ts` - Rating operations
- `app/api/vehicles/[id]/ratings/reports/route.ts` - Report operations

**Business Logic:**
- `app/lib/auth.ts` - Authentication configuration
- `app/lib/prisma.ts` - Database client setup

**Services (NEW - Recommended):**
- `services/auth.service.ts` - Auth business logic
- `services/user.service.ts` - User management
- `services/vehicle.service.ts` - Vehicle management
- `services/rating.service.ts` - Rating management

**Database:**
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeding script
- `prisma/dev.db` - SQLite database file (dev)

**Configuration:**
- `config/database.ts` - Database configuration
- `config/constants.ts` - App-wide constants

### Shared Files

**Types:**
- `app/types/next-auth.d.ts` - NextAuth type definitions

**Utils:**
- `utils/validation.ts` - Validation schemas/helpers
- `utils/errors.ts` - Error handling utilities

## Migration Steps

1. **Create new directories:**
   - `config/`
   - `services/`
   - `utils/`
   - `hooks/`

2. **Move/Organize files:**
   - Keep API routes in `app/api/` (Next.js convention)
   - Extract business logic from API routes to `services/`
   - Move validation to `utils/validation.ts`
   - Create custom hooks in `hooks/`

3. **Refactor API routes:**
   - API routes should only handle HTTP requests/responses
   - Business logic moves to service files
   - Services use Prisma client for database operations

4. **Update imports:**
   - Update all import paths after reorganization
   - Ensure TypeScript paths are configured in `tsconfig.json`

## Benefits

1. **Clear Separation:** Easy to identify frontend vs backend code
2. **Maintainability:** Business logic separated from HTTP handling
3. **Testability:** Services can be unit tested independently
4. **Scalability:** Easy to add new features in organized structure
5. **Team Collaboration:** Frontend and backend developers can work independently

## Next.js Considerations

- Next.js App Router requires `app/` directory structure
- API routes must stay in `app/api/` for routing to work
- Pages must stay in `app/` for routing
- This plan maintains Next.js conventions while organizing code better

