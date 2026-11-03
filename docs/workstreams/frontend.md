# Frontend workstream

## Mission
Build the React + TypeScript application and connect it to backend services.

## Starter structure
- `src/App.tsx`: current lightweight dashboard scaffold
- `src/types/inventory.ts`: shared domain interfaces
- `src/styles.css`: initial responsive styling
- `src/main.tsx`: application entry point

## Deliverables
- Build responsive dashboard, component catalog/search, component detail/edit forms, borrow/return flows, filament spool views, and usage form.
- Create reusable form controls, tables, dialogs, loading states, and error states.
- Keep domain types aligned with the backend schema.
- Add client-side validation, but never rely on it as the only security control.
- Replace sample data with Supabase service calls after backend contracts are agreed.

## Acceptance checklist
- TypeScript typecheck and production build pass.
- Search handles empty results and case-insensitive matching.
- Forms show validation and service errors.
- Loading, empty, success, and failure states are implemented.
- No secrets or privileged service keys are bundled into the browser.

## Local development
Run `npm install`, then `npm run dev`. The current dashboard is sample-data-only.