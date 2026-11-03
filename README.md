# DRC Inventory Organizer

A web-based inventory organizer for the **Drones & Robotics Club (DRC)**. It is intended to track electronics components, borrowing and returns, and 3D-printer filament spools and usage.

> **Status:** Early development scaffold. The dashboard currently uses sample data. Supabase persistence, authentication, and production security policies are not connected.

## Project workstreams

The project is organized into five team groups:

| Group | Responsibility | Brief |
|---|---|---|
| UI/UX | User research, workflows, wireframes, visual design, accessibility | [UI/UX](docs/workstreams/ui-ux.md) |
| Frontend | React/TypeScript pages, components, forms, client-side integration | [Frontend](docs/workstreams/frontend.md) |
| Backend | Supabase, PostgreSQL schema, authentication, RLS, secure operations | [Backend](docs/workstreams/backend.md) |
| Deployment | GitHub collaboration, CI, Vercel, environments, releases | [Deployment](docs/workstreams/deployment.md) |
| Inventory logic | Stock rules, borrowing/returns, spool balances, audit requirements | [Inventory logic](docs/workstreams/inventory-logic.md) |

Read [the workstream overview](docs/WORKSTREAMS.md) for shared agreements and group deliverables.

## Tech stack
- React + TypeScript + Vite
- Supabase / PostgreSQL (planned backend)
- GitHub for collaboration
- Vercel (planned hosting)

## Repository layout
```
src/                    React application
  types/                Shared TypeScript domain types
docs/
  WORKSTREAMS.md        Group responsibilities and coordination
  workstreams/          One brief per team group
supabase/
  schema.sql            Initial database schema draft
.env.example            Public frontend environment variable template
```

## Run locally
Requirements: Node.js 20+, npm, and Git.

```bash
npm install
npm run dev
```

Useful checks: `npm run typecheck`, `npm run build`, and `npm run preview`.

## Important limitations
- The dashboard uses illustrative sample data, not the club's actual stock.
- Borrow/return and filament usage are not yet implemented as persistent workflows.
- The Supabase schema is an initial draft. RLS, role policies, and atomic inventory operations must be designed, implemented, and tested before real use.
- Do not store real inventory or member data in this prototype.
- Never commit secrets or put a Supabase service-role key in frontend code.

## Team workflow
1. Pick tasks from your workstream brief and create GitHub issues.
2. Agree on data fields and business rules with the other groups before implementation.
3. Work in feature branches and open pull requests.
4. Run typecheck/build and test the changed workflow.
5. Ask another teammate to review before merging.
