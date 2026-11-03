# Backend workstream

## Mission
Provide persistent, secure data storage and authenticated access using Supabase and PostgreSQL.

## Deliverables
- Create Supabase project and document local setup.
- Design and version SQL migrations for components, members/profiles, borrow records, filament spools, usage logs, and audit events.
- Define authentication and roles.
- Implement Row Level Security (RLS) for every exposed table.
- Implement safe stock-changing operations so borrow/return and filament consumption cannot create negative quantities or race-condition errors.
- Provide typed service contracts and example requests for the frontend.

## Security requirements
- Enable RLS on tables exposed through the Supabase API.
- Default to least privilege; members should not gain manager permissions by editing client-side state.
- Validate quantities and ownership on the server/database side.
- Never expose the Supabase service-role key in frontend code.
- Test access as anonymous, member, manager, and administrator.

## Acceptance checklist
- Schema migrations can be applied to a clean project.
- Unauthorized reads/writes are denied.
- Borrow and return operations are atomic and leave an audit trail.
- Errors are structured and documented.
- Backups and recovery expectations are recorded.