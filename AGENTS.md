# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Pet Rescue Georgia (`mipove.me`) — a Vite + React 18 + TypeScript swipe-style pet-adoption app. Styling is Tailwind + shadcn/ui. Standard commands live in `package.json` `scripts` and `README.md`.

### Running the app (frontend)
- Dev server: `npm run dev`. It serves on **port 8080** (configured in `vite.config.ts`), not Vite's default 5173.
- The app runs fully **without Supabase**: when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset it falls back to `localStorage` (see `src/lib/supabase.ts`). So no secrets are needed to run/test the frontend locally. A "[supabase] ... localStorage" console warning in dev/tests is expected, not an error.
- Hello-world flow to verify it works: open `/app`, dismiss the tutorial/cookie overlay, click the heart LIKE button on a pet card, then open the "Liked" tab in the bottom nav — the pet appears under `/favorites`.

### Tests & lint
- `npm run test` (Vitest, jsdom) — all tests pass with no env setup.
- `npm run lint` currently reports pre-existing errors/warnings in the app code (e.g. `@typescript-eslint/no-explicit-any`, empty interfaces). These are not environment problems; do not "fix" them as part of setup.

### Backend / serverless (`api/`)
- The `api/` directory holds Vercel serverless functions (admin auth, pet-deletion, cron). These are **not** run by `npm run dev` (that only runs the Vite frontend) and require server-only secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` — see `.env.example`). Running them locally needs the Vercel CLL (`vercel dev`) plus a real Supabase project; skip unless specifically working on admin/cron features.
- `supabase/migrations/` are the DB schema; apply via the Supabase dashboard or CLI when using a real backend.

### Package manager
Use **npm** (`package-lock.json` is the source of truth). A `bun.lock`/`bun.lockb` also exist but npm is what the README and this environment use.
