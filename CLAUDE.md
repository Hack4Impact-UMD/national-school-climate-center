# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server on localhost:5173

# Quality checks (run before every PR)
npm run typecheck        # TypeScript type checking (must pass)
npm run lint             # ESLint (must pass)
npm run lint:fix         # Auto-fix linting issues
npm run build            # Production build (must succeed)

# Formatting
npm run format           # Prettier formatting
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) + Shadcn/ui components
- **Routing**: React Router v7
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form

### Key Architectural Patterns

**1. Authentication & Authorization Flow**
- `AuthContext` (src/contexts/AuthContext.tsx) wraps entire app in main.tsx
- On auth state change, fetches user role from Firestore `members/{uid}` collection
- Provides `{ user, role, loading }` to all components via `useAuth()` hook
- Role-based access control (RBAC) defined in `src/pages/auth/rbac.ts`
- Two role types: `admin` (full access) and `school_personnel` (read-only)

**2. Route Protection Pattern**
- `AdminOnlyRoute` component wraps protected routes in App.tsx
- Checks both authentication (`user`) and authorization (`can(role, 'manage_users')`)
- Unauthenticated users → redirect to `/login`
- Authenticated non-admins → show unauthorized message, then redirect to `/login`
- Uses React Router's `<Outlet />` pattern for nested protected routes

**3. Firebase Integration**
- All Firebase services initialized in `src/firebase/config.ts`
- Exports: `auth`, `db` (Firestore), `storage`, `googleProvider`
- Configuration uses Vite environment variables: `VITE_FIREBASE_*`
- Auth state managed globally via AuthContext, not per-component

**4. Styling System**
- Design tokens defined in `src/index.css` using Tailwind v4's `@theme` directive
- Custom colors: `primary`, `secondary`, `accent-plum`, `accent-purple`, `accent-gold`
- Custom fonts: `font-heading` (Raleway), `font-body` (Roboto)
- All styling via Tailwind utilities - no custom CSS files
- Shadcn/ui components in `src/components/ui/` (Button, Card, Input, etc.)
- See STYLING.md for comprehensive design system rules

**5. Import Aliases**
- `@/` maps to `src/` (configured in vite.config.ts)
- Use `@/components/...`, `@/contexts/...`, etc. in all imports

### Project Structure Principles

```
src/
├── components/
│   ├── ui/              # Shadcn/ui base components (Button, Card, etc.)
│   ├── *Route.tsx       # Route protection wrappers
│   └── Layout.tsx       # App shell with nav/header
├── contexts/            # React Context providers (AuthContext)
├── pages/
│   ├── auth/           # Login + RBAC logic
│   └── *.tsx           # Page components (Home, Admin, About)
├── firebase/           # Firebase config and initialization
└── index.css           # Design tokens (@theme) + Tailwind imports
```

### Important Implementation Details

**RBAC System**
- Permissions checked via `can(role, action)` function
- Actions: `read`, `create`, `update`, `delete`, `manage_users`
- Admin role has all permissions; school_personnel only has `read`
- Always use `can()` for authorization checks, never check role strings directly

**Firebase Auth Flow**
1. User logs in via `signInWithEmailAndPassword` (Login.tsx)
2. Firebase Auth creates session
3. `onAuthStateChanged` listener in AuthContext fires
4. Fetches user role from Firestore `members/{uid}` document
5. Updates AuthContext state with `{ user, role, loading: false }`
6. Route guards re-evaluate and grant/deny access

**Styling Conventions** (from CONTRIBUTING.md and STYLING.md)
- Components: PascalCase filenames (SurveyCard.tsx)
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA attributes for accessibility (`role="alert"`, `aria-live`)
- Mobile-first responsive design (base styles = mobile, then `md:`, `lg:`)
- Minimum touch target: `h-12` for buttons on mobile
- Icons via Lucide React

**Code Quality Requirements**
- TypeScript for all files - avoid `any` type
- Functional components with hooks only
- Boolean variables: `is*/has*/should*` prefix
- Handlers: `handle*/on*` prefix
- Constants: `UPPER_SNAKE_CASE`
- Remove all `console.log` statements before PRs
- Never commit sensitive data (check for API keys, tokens)

### Pull Request Workflow

**Title Format:**
- `Feature: [description]` for new features
- `Fix: [description]` for bug fixes
- `Refactor: [description]` for code improvements

**Required PR Checks:**
```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
npm run build       # Must succeed
```

**Branch Strategy:**
- Feature branches from `main`
- Delete branch after merge
- Pull latest `main` before starting new work

### Firebase Security Note

Client-side route protection is implemented, but Firestore security rules must also enforce role checks server-side. Ensure Firestore rules prevent users from:
- Modifying their own `role` field in `members/{userId}`
- Accessing data outside their permission scope

### User Roles Overview

- **Students**: Take anonymous surveys (not yet implemented)
- **School Leaders/Personnel**: View school-specific data, read-only access
- **NSCC Admins**: Create surveys, view all data, manage users, full CRUD access
