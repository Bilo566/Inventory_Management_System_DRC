export type StockStatus = "in" | "low" | "out";

/**
 * The single place that decides an item's stock status.
 *   out → quantity is 0
 *   low → quantity is at or below the minimum
 *   in  → otherwise
 */
export function getStockStatus(quantity: number, minimumStock: number): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= minimumStock) return "low";
  return "in";
}

const labels: Record<StockStatus, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

const variants: Record<StockStatus, string> = {
  in: "badge--success",
  low: "badge--warning",
  out: "badge--danger",
};

interface StockBadgeProps {
  quantity: number;
  minimumStock: number;
  /** Show the count instead of the word, e.g. "4 left". Status colour still applies. */
  showCount?: boolean;
}

export default function StockBadge({ quantity, minimumStock, showCount = false }: StockBadgeProps) {
  const status = getStockStatus(quantity, minimumStock);
  const text = showCount && status !== "out" ? `${quantity} left` : labels[status];

  return (
    <span className={`badge ${variants[status]}`} title={showCount ? labels[status] : undefined}>
      {text}
    </span>
  );
}