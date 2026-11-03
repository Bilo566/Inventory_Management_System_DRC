# Deployment workstream

## Mission
Make collaboration, testing, and releases repeatable.

## Deliverables
- Protect the main branch and require pull-request review where practical.
- Add CI checks for dependency installation, TypeScript checks, and production build.
- Configure Vercel project and preview deployments for pull requests.
- Configure production environment variables in the hosting dashboard.
- Document domain setup, release steps, rollback, and ownership.
- Keep development, preview, and production Supabase projects or environments clearly separated.

## Environment variables
Frontend variables expected by this scaffold:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Only public client credentials belong in Vite variables. Never use a service-role key with the `VITE_` prefix.

## Release checklist
- Pull request reviewed and checks green.
- Database migrations reviewed and applied in the intended environment.
- Preview tested with non-sensitive sample data.
- Production environment variables verified.
- Smoke test login, component search, borrow/return, and filament logging.
- Rollback plan and release notes ready.