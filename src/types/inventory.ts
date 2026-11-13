/* Shared data shapes for the whole app.
   Keep these in step with supabase/schema.sql — tell Backend when you change one. */

/** How an item is tracked.
 *  "count"  → countable parts (resistors, jumper wires): we only store how many.
 *  "unit"   → individual devices (camera, tripod): each one has its own tag and status. */
export type TrackingMode = "count" | "unit";

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  partNumber?: string;
  /** Available right now. For "unit" items this equals the number of units with status "available". */
  quantity: number;
  minimumStock: number;
  location: string;
  notes?: string;
  /** Defaults to "count" when missing. */
  tracking?: TrackingMode;
  /** True when a manager must approve a borrow before it goes through. */
  requiresApproval?: boolean;
}

export type UnitStatus = "available" | "borrowed" | "repair" | "lost";

/** One physical device of a "unit" item, e.g. "Camera #2". */
export interface DeviceUnit {
  id: string;
  componentId: string;
  /** Label printed on the device, e.g. "CAM-02". */
  assetTag: string;
  serialNumber?: string;
  status: UnitStatus;
}

export type MemberRole = "member" | "manager" | "admin";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
}

export type BorrowStatus =
  | "pending"   // waiting for a manager (items with requiresApproval)
  | "rejected"  // a manager said no
  | "borrowed"
  | "returned"
  | "overdue";

export interface BorrowRecord {
  id: string;
  componentId: string;
  /** Set when a specific device was lent out ("unit" items only). */
  unitId?: string;
  borrowerId: string;
  quantity: number;
  borrowedAt: string;
  dueAt?: string;
  returnedAt?: string;
  status: BorrowStatus;
}

/** A physical count of one item's shelf by a manager.
 *  If fewer are found than the system expected, the gap is "unaccounted"
 *  (taken without being logged — the cabinets aren't locked). */
export interface StockCount {
  id: string;
  componentId: string;
  /** What the system said should be on the shelf. */
  expected: number;
  /** What the manager actually found. */
  counted: number;
  countedBy: string;
  countedAt: string;
}

export interface FilamentSpool {
  id: string;
  brand: string;
  material: string;
  color: string;
  initialWeightGrams: number;
  remainingWeightGrams: number;
  location: string;
  status: "available" | "in_use" | "empty";
}

export interface FilamentUsage {
  id: string;
  spoolId: string;
  gramsUsed: number;
  project?: string;
  recordedBy: string;
  recordedAt: string;
}
