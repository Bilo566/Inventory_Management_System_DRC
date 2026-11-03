export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  partNumber?: string;
  quantity: number;
  minimumStock: number;
  location: string;
  notes?: string;
}

export interface BorrowRecord {
  id: string;
  componentId: string;
  borrowerId: string;
  quantity: number;
  borrowedAt: string;
  dueAt?: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
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