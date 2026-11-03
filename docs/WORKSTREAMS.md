# Team workstreams

Split the project into five coordinated workstreams. Each group owns its deliverables, documents decisions, and raises dependencies early. Agree on interfaces and data fields before parallel implementation.

| Workstream | Main responsibility | Key deliverables |
|---|---|---|
| UI/UX | User research, workflows, visual design, accessibility | Personas, user flows, wireframes, design system, usability review |
| Frontend | React application and client-side behavior | Pages, reusable components, forms, validation, API integration |
| Backend | Supabase setup, database, authentication, authorization | SQL migrations, RLS policies, API/service functions, environment setup |
| Deployment | GitHub workflow, hosting, environments, release process | CI checks, Vercel configuration, deployment guide, rollback notes |
| Inventory logic | Rules for stock, borrowing, returns, filament and audit history | Data definitions, business rules, calculations, test cases |

## Shared working agreements

- Use GitHub issues for tasks and pull requests for review.
- Keep secrets and real member information out of commits.
- Use sample data until access rules and workflows are approved.
- Agree on field names and status values across frontend and backend.
- The inventory-logic group defines expected behavior; frontend and backend implement it together.
- A feature is complete only when its behavior, error cases, and tests are documented.

See each file in [workstreams](workstreams/) for the group checklist.