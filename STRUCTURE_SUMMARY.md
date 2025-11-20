# MatSafy Project Structure Summary

## Current Structure (Before Reorganization)

```
matsafy/
├── app/
│   ├── (auth)/              ← Frontend: Auth pages
│   ├── (dashboard)/         ← Frontend: Dashboard pages
│   ├── api/                 ← Backend: API endpoints
│   ├── components/          ← Frontend: UI components
│   ├── lib/                 ← Backend: Business logic
│   ├── prisma/              ← Backend: Database
│   ├── types/               ← Shared: TypeScript types
│   ├── globals.css          ← Frontend: Styles
│   ├── layout.tsx           ← Frontend: Root layout
│   └── page.tsx             ← Frontend: Home page
├── public/                  ← Frontend: Static assets
└── [config files]          ← Project configuration
```

## Proposed Structure (After Reorganization)

```
matsafy/
├── app/                     # Next.js App Router
│   ├── (auth)/              # 🎨 Frontend: Auth pages
│   ├── (dashboard)/         # 🎨 Frontend: Dashboard pages
│   ├── api/                 # ⚙️ Backend: API routes
│   ├── components/          # 🎨 Frontend: React components
│   ├── lib/                 # ⚙️ Backend: Core utilities
│   ├── types/               # 📦 Shared: TypeScript types
│   ├── globals.css          # 🎨 Frontend: Styles
│   ├── layout.tsx           # 🎨 Frontend: Layout
│   └── page.tsx             # 🎨 Frontend: Home
│
├── prisma/                  # ⚙️ Backend: Database
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
│
├── services/                # ⚙️ Backend: Business logic (NEW)
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── vehicle.service.ts
│   └── rating.service.ts
│
├── config/                  # ⚙️ Backend: Configuration (NEW)
│   ├── database.ts
│   └── constants.ts
│
├── utils/                   # 📦 Shared: Utilities (NEW)
│   ├── validation.ts
│   └── errors.ts
│
├── hooks/                   # 🎨 Frontend: React hooks (NEW)
│   ├── useAuth.ts
│   └── useVehicles.ts
│
├── public/                  # 🎨 Frontend: Static assets
│   └── brand/
│
└── [config files]          # Project configuration
```

## Legend

- 🎨 = Frontend (Client-side, UI)
- ⚙️ = Backend (Server-side, API, Database)
- 📦 = Shared (Used by both frontend and backend)

## File Classification

### Frontend (🎨)
- All `page.tsx` files
- All components in `app/components/`
- `app/globals.css`
- `app/layout.tsx`
- `public/` directory
- `hooks/` directory (custom React hooks)

### Backend (⚙️)
- All files in `app/api/`
- `app/lib/auth.ts`
- `app/lib/prisma.ts`
- `prisma/` directory
- `services/` directory (business logic)
- `config/` directory

### Shared (📦)
- `app/types/` (TypeScript definitions)
- `utils/` (validation, error handling)

## Quick Reference

**Where to add new code:**

- **New UI component?** → `app/components/`
- **New page?** → `app/(route-group)/page-name/page.tsx`
- **New API endpoint?** → `app/api/endpoint-name/route.ts`
- **New database model?** → `prisma/schema.prisma`
- **New business logic?** → `services/service-name.service.ts`
- **New validation?** → `utils/validation.ts`
- **New React hook?** → `hooks/useHookName.ts`
- **New static asset?** → `public/`

