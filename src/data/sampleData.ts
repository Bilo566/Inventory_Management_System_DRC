/* SAMPLE DATA — made-up records for building and testing screens.
   Not the club's real stock. Replace with Supabase calls once Backend's tables are ready. */
import type { BorrowRecord, ComponentItem, DeviceUnit, FilamentSpool, FilamentUsage, Member } from "../types/inventory";

/** ISO date a number of days from today, so "due soon" and "overdue" always look right. */
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(17, 0, 0, 0);
  return d.toISOString();
};

/* ---- Members ------------------------------------------------------------ */
export const sampleMembers: Member[] = [
  { id: "m-01", name: "Sara Alqahtani", email: "sara@example.com", role: "admin" },
  { id: "m-02", name: "Omar Alharbi", email: "omar@example.com", role: "member" },
  { id: "m-03", name: "Lama Alotaibi", email: "lama@example.com", role: "manager" },
  { id: "m-04", name: "Faisal Alshehri", email: "faisal@example.com", role: "member" },
];

/** The signed-in person while there's no login yet.
 *  Change the index to 1 to see the app as a regular member (no Admin link). */
export const currentMember: Member = sampleMembers[0];

/* ---- Individual devices ("unit" items) ---------------------------------- */
export const sampleUnits: DeviceUnit[] = [
  { id: "u-01", componentId: "D-001", assetTag: "CAM-01", status: "available" },
  { id: "u-02", componentId: "D-001", assetTag: "CAM-02", status: "borrowed" },
  { id: "u-03", componentId: "D-001", assetTag: "CAM-03", status: "repair" },
  { id: "u-04", componentId: "D-002", assetTag: "TRI-01", status: "available" },
  { id: "u-05", componentId: "D-002", assetTag: "TRI-02", status: "available" },
  { id: "u-06", componentId: "D-003", assetTag: "PSU-01", serialNumber: "BPS-30V-5521", status: "available" },
];

const availableUnits = (componentId: string) =>
  sampleUnits.filter(u => u.componentId === componentId && u.status === "available").length;

/* ---- Items -------------------------------------------------------------- */
const countableParts: ComponentItem[] = [
  { id: "C-001", name: "ESP32 development board", category: "Microcontrollers", partNumber: "ESP32-DevKitC", quantity: 12, minimumStock: 3, location: "Cabinet A · Bin 2" },
  { id: "C-002", name: "Arduino Uno R3", category: "Microcontrollers", quantity: 5, minimumStock: 2, location: "Cabinet A · Bin 1" },
  { id: "C-003", name: "Ultrasonic distance sensor", category: "Sensors", partNumber: "HC-SR04", quantity: 4, minimumStock: 5, location: "Cabinet B · Bin 1" },
  { id: "C-004", name: "GPS module", category: "Sensors", partNumber: "NEO-6M", quantity: 2, minimumStock: 2, location: "Cabinet B · Bin 3" },
  { id: "C-005", name: "Jumper wires (40 pack)", category: "Wiring", quantity: 18, minimumStock: 5, location: "Drawer C · Tray 4" },
  { id: "C-006", name: "SG90 micro servo", category: "Motors & servos", quantity: 0, minimumStock: 4, location: "Drawer D · Tray 1" },
  { id: "C-007", name: "Propellers 5045 (pair)", category: "Drone parts", quantity: 24, minimumStock: 10, location: "Shelf E · Box 2" },
  { id: "C-008", name: "LiPo battery 3S 2200 mAh", category: "Batteries & power", quantity: 6, minimumStock: 2, location: "Fireproof cabinet · Shelf 1", requiresApproval: true, notes: "Charge in the LiPo bag only. Return at storage voltage." },
];

const devices: ComponentItem[] = [
  { id: "D-001", name: "Action camera", category: "Cameras & media", quantity: availableUnits("D-001"), minimumStock: 0, location: "Locker F · Slot 1", tracking: "unit", requiresApproval: true },
  { id: "D-002", name: "Camera tripod", category: "Cameras & media", quantity: availableUnits("D-002"), minimumStock: 0, location: "Locker F · Slot 3", tracking: "unit" },
  { id: "D-003", name: "Bench power supply", category: "Tools", quantity: availableUnits("D-003"), minimumStock: 0, location: "Workbench 2", tracking: "unit", requiresApproval: true },
];

export const sampleItems: ComponentItem[] = [...countableParts, ...devices];

/* ---- Borrows & requests ------------------------------------------------- */
export const sampleBorrows: BorrowRecord[] = [
  { id: "b-01", componentId: "C-001", borrowerId: "m-01", quantity: 2, borrowedAt: daysFromNow(-2), dueAt: daysFromNow(5), status: "borrowed" },
  { id: "b-02", componentId: "C-003", borrowerId: "m-02", quantity: 1, borrowedAt: daysFromNow(-9), dueAt: daysFromNow(-2), status: "overdue" },
  { id: "b-03", componentId: "D-001", unitId: "u-02", borrowerId: "m-03", quantity: 1, borrowedAt: daysFromNow(-1), dueAt: daysFromNow(3), status: "borrowed" },
  { id: "b-04", componentId: "C-006", borrowerId: "m-04", quantity: 4, borrowedAt: daysFromNow(-6), dueAt: daysFromNow(1), status: "borrowed" },
  { id: "b-05", componentId: "C-008", borrowerId: "m-04", quantity: 1, borrowedAt: daysFromNow(0), dueAt: daysFromNow(4), status: "pending" },
  { id: "b-06", componentId: "D-002", unitId: "u-04", borrowerId: "m-02", quantity: 1, borrowedAt: daysFromNow(-14), dueAt: daysFromNow(-7), returnedAt: daysFromNow(-8), status: "returned" },
  { id: "b-07", componentId: "D-003", borrowerId: "m-01", quantity: 1, borrowedAt: daysFromNow(0), dueAt: daysFromNow(2), status: "pending" },
];

/* ---- Filament ----------------------------------------------------------- */
export const sampleSpools: FilamentSpool[] = [
  { id: "s-01", brand: "eSun", material: "PLA", color: "Black", initialWeightGrams: 1000, remainingWeightGrams: 620, location: "Printer shelf · Top", status: "in_use" },
  { id: "s-02", brand: "Polymaker", material: "PETG", color: "White", initialWeightGrams: 1000, remainingWeightGrams: 140, location: "Printer shelf · Top", status: "available" },
  { id: "s-03", brand: "eSun", material: "PLA", color: "Blue", initialWeightGrams: 1000, remainingWeightGrams: 0, location: "Printer shelf · Bottom", status: "empty" },
];

export const sampleUsage: FilamentUsage[] = [
  { id: "f-01", spoolId: "s-01", gramsUsed: 42, project: "Drone arm v3", recordedBy: "m-03", recordedAt: daysFromNow(-1) },
  { id: "f-02", spoolId: "s-02", gramsUsed: 85, project: "Camera mount", recordedBy: "m-02", recordedAt: daysFromNow(-3) },
];
