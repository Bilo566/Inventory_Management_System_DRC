# Electronics & Filament Inventory Organizer

A web-based inventory organizer for the **Drones & Robotics Club (DRC)**. The goal is to make it easier for club members to find electronic components, see where items are stored, monitor quantities, and track 3D-printer filament.

> **Project status:** Early prototype. The interface currently uses sample data. Database persistence and authentication are not yet connected.

## Features

- **Inventory dashboard** — overview of component quantities, filament stock, and low-stock alerts.
- **Component catalog** — search components by name, category, or storage location.
- **Borrow and return workflow** — prototype interface for recording component check-outs and returns.
- **Filament tracking** — view spools by material, color, brand, storage location, and remaining weight.
- **Filament usage logging** — prototype workflow for recording grams used.
- **Project documentation** — project plan, initial data model, and team workflow guidance.

## Technology stack

- **Frontend:** React, TypeScript, Vite
- **UI icons:** Lucide React
- **Backend/database planned:** Supabase (PostgreSQL, authentication, Row Level Security)
- **Version control and collaboration:** GitHub
- **Deployment planned:** Vercel

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Bilo566/Inventory_Management_System_DRC.git
cd Inventory_Management_System_DRC
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal by Vite.

### Other useful commands

```bash
npm run build      # Type-check and build for production
npm run typecheck  # Run the TypeScript project checks
npm run preview    # Preview the production build locally
```

## Current limitations

- The interface uses illustrative sample inventory; it is not the club's live stock list.
- Borrowing, returning, and filament usage update temporary in-memory state only. Refreshing the page resets those changes.
- Supabase has not yet been wired into the frontend.
- The SQL schema in `supabase/schema.sql` is a starting point and needs testing and secure inventory-operation functions before real use.
- Authentication, role management, and production deployment still need to be completed.

**Do not use this prototype as the authoritative record of club inventory.**

## Planned development

1. Finalize requirements and user roles.
2. Connect the frontend to Supabase.
3. Implement persistent component search and stock management.
4. Add secure, atomic borrow and return operations with transaction history.
5. Implement filament spool records, usage logging, and weight adjustments.
6. Add authentication, permissions, and low-stock alerts.
7. Test with club members and deploy the application.

See [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md), [docs/DATA_MODEL.md](docs/DATA_MODEL.md), and [docs/TEAM_WORKFLOW.md](docs/TEAM_WORKFLOW.md) for more details.

## Environment configuration

The repository includes an `.env.example` template for the planned Supabase connection. Once the backend integration is implemented, copy it to `.env.local` and fill in the project URL and public anon key:

```bash
cp .env.example .env.local
```

Never commit real credentials or secrets. **Never place a Supabase service-role key in frontend code.**

## Contributing

1. Create or choose a GitHub issue describing the task.
2. Create a feature branch, for example:

   ```bash
   git checkout -b feat/component-search
   ```

3. Make a focused change and test it.
4. Open a pull request with a summary and test steps.
5. Request a teammate's review before merging.

Do not commit secrets or real inventory data. Keep documentation up to date as features change.

## License

No license has been specified yet. Contact the repository owner before reusing or redistributing this project.
