# Inventory logic workstream

## Mission
Define the rules that keep electronics stock, borrowing, returns, and filament balances accurate.

## Electronics component rules
- A component record represents a type of item, not an individual physical unit.
- Track quantity on hand, minimum stock threshold, category, part number (optional), storage location, and notes.
- Quantity must never be negative.
- Low stock means quantity on hand is less than or equal to the minimum threshold.
- Every manual adjustment should record who changed it, when, and why.

## Borrow and return rules
- A borrow record identifies the member, component, quantity, checkout time, and optional due date.
- Borrow quantity must be a positive integer and cannot exceed available stock.
- Checkout decreases available stock and creates a transaction record.
- Return quantity cannot exceed the outstanding borrowed quantity.
- Partial returns should be supported if the club approves that workflow.
- A return increases available stock and records who confirmed it and when.
- Decide whether manager approval is required before checkout; document the decision before implementation.

## Filament rules
- Track each spool separately: material, color, brand, initial weight, remaining weight, and storage location.
- Record usage in grams against a specific spool and optionally a project.
- Usage must be positive and cannot exceed the spool's remaining weight.
- Remaining weight = previous remaining weight - recorded usage, subject to audited corrections.
- Define how empty spools, tare weight, opened spools, and manual weighing corrections are handled.

## Decisions the club must approve
1. Who can create/edit components?
2. Who can approve or confirm borrowing and returns?
3. Are due dates required?
4. Are partial returns allowed?
5. How are damaged, missing, or discarded parts recorded?
6. How often are filament weights checked?
7. Who may correct a stock or spool balance, and what reason is required?

## Test cases
- Reject zero, negative, fractional (for piece-count components), and over-stock borrow quantities.
- Borrowing the final available unit leaves zero available, not negative stock.
- Partial and full returns restore exactly the returned quantity.
- Duplicate submission must not double-decrement stock.
- Filament usage equal to remaining weight leaves zero grams.
- Filament usage greater than remaining weight is rejected.
- Concurrent transactions cannot overdraw the same component or spool.