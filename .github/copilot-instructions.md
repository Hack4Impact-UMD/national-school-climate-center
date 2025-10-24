<!-- Short, action-oriented instructions for AI coding agents working on this repo -->

# Copilot guidance (short & specific)

This is a Vite + React + TypeScript frontend project using Tailwind + Shadcn/ui and Firebase (Auth, Firestore, Storage). Keep edits small, test locally, and reference the files below.

Essentials (where to look)
- App entry and routes: `src/main.tsx`, `src/App.tsx` (routes use nested `Layout` + `Outlet`).
- Firebase surface: `src/firebase/config.ts` — exports `auth`, `db`, `storage`. Env vars use Vite `VITE_*` format; see `.env.example`.
- UI primitives: `src/components/ui/*`; higher-level components live under `src/components/`.
- Styling: Tailwind + Shadcn/ui. Tokens & examples: `STYLING.md` and `src/index.css`.

Dev commands (exact)
- npm run dev — start dev server (Vite, default port 5173)
- npm run build — tsc -b && vite build
- npm run typecheck — tsc --noEmit
- npm run lint — eslint .  (use `npm run lint:fix` to auto-fix)
- npm run format — prettier --write .

Project conventions to follow
- Components: PascalCase, `.tsx`. Utilities/hooks: camelCase, `.ts`/`.tsx`.
- Keep presentational components in `components/` and side-effects (Firebase, routing) in `hooks/` or `lib/`.
- Use Shadcn/ui components and Tailwind utilities rather than adding global CSS.
- Use `lucide-react` for icons.

Common tasks — where to implement
- Auth: implement Firebase flows in `src/pages/auth/Login.tsx` and use `auth` from `src/firebase/config.ts` (do not add a second initialization).
- Firestore: use `db` from `src/firebase/config.ts` within `hooks/` or `lib/` helpers (e.g., `src/lib/` or `src/hooks/`).
- New UI components: create base primitives under `src/components/ui/` and composed components in `src/components/`.

Safety & QA rules
- Never commit secrets. `.env.example` lists required `VITE_FIREBASE_*` keys — real values must remain local.
- After edits run: `npm run typecheck` and `npm run lint`. Run `npm run dev` to smoke test the UI where applicable.
- Prefer small, reversible changes. When behavior changes, include a short usage example or minimal test.

If uncertain
- Move heavy logic into `hooks/` or `lib/` and keep components presentational.
- Add an in-code TODO referencing file path and open a PR with environment/testing notes for reviewers.

Small checklist for PRs
- Runs typecheck and lint (or include results in PR description).
- Lists env var requirements from `.env.example` if relevant to run locally.

Questions or missing items — tell me which areas you want expanded (CI, Cloud Functions, or example snippets).
