import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin, SearchX } from "lucide-react";
import type { BorrowRecord, ComponentItem, DeviceUnit } from "../types/inventory";
import SearchBar from "../components/SearchBar";
import { getStockStatus } from "../components/StockBadge";

interface AdminAvailabilityProps {
  items: ComponentItem[];
  borrows: BorrowRecord[];
  units: DeviceUnit[];
}

export type StockLevel = "high" | "medium" | "low";

/* How High / Medium / Low is decided (placeholder until Inventory Logic confirms):
   Countable parts → Low: at or below minimum (or none left)
                     Medium: above minimum but no more than double it
                     High: more than double the minimum
   Devices         → Low: none available · Medium: under half available · High: half or more */
export function stockLevel(item: ComponentItem, totalUnits: number): StockLevel {
  if (item.tracking === "unit") {
    if (item.quantity <= 0) return "low";
    return totalUnits > 0 && item.quantity / totalUnits < 0.5 ? "medium" : "high";
  }
  if (getStockStatus(item.quantity, item.minimumStock) !== "in") return "low";
  return item.quantity <= item.minimumStock * 2 ? "medium" : "high";
}

const levelInfo: Record<StockLevel, { label: string; variant: string; order: number }> = {
  low: { label: "Low", variant: "badge--danger", order: 0 },
  medium: { label: "Medium", variant: "badge--warning", order: 1 },
  high: { label: "High", variant: "badge--success", order: 2 },
};

type LevelFilter = "all" | StockLevel;

export default function AdminAvailability({ items, borrows, units }: AdminAvailabilityProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [category, setCategory] = useState("all");

  // One row per item with everything the table needs.
  const rows = useMemo(() => items.map(item => {
    const itemUnits = units.filter(u => u.componentId === item.id && u.status !== "lost");
    const borrowed = borrows
      .filter(b => b.componentId === item.id && (b.status === "borrowed" || b.status === "overdue"))
      .reduce((s, b) => s + b.quantity, 0);
    return { item, borrowed, totalUnits: itemUnits.length, level: stockLevel(item, itemUnits.length) };
  }), [items, borrows, units]);

  const categories = useMemo(() => [...new Set(items.map(i => i.category))].sort(), [items]);
  const counts = useMemo(() => ({
    all: rows.length,
    high: rows.filter(r => r.level === "high").length,
    medium: rows.filter(r => r.level === "medium").length,
    low: rows.filter(r => r.level === "low").length,
  }), [rows]);

  const q = query.trim().toLowerCase();
  // Low first, so what needs restocking is at the top.
  const visible = rows
    .filter(r => level === "all" || r.level === level)
    .filter(r => category === "all" || r.item.category === category)
    .filter(r => [r.item.name, r.item.id, r.item.location, r.item.partNumber ?? ""].join(" ").toLowerCase().includes(q))
    .sort((a, b) => levelInfo[a.level].order - levelInfo[b.level].order || a.item.name.localeCompare(b.item.name));

  const filtersActive = q !== "" || level !== "all" || category !== "all";

  return (
    <>
      <header className="page-header">
        <div className="page-header__text">
          <h1>Availability</h1>
          <p>Every item in the club, lowest stock first.</p>
        </div>
      </header>

      <section className="panel">
        <div className="chips" role="radiogroup" aria-label="Stock level">
          {(["all", "low", "medium", "high"] as LevelFilter[]).map(l => (
            <label className="chip" key={l}>
              <input type="radio" name="level" value={l} checked={level === l} onChange={() => setLevel(l)} />
              <span>{l === "all" ? "All" : levelInfo[l].label} ({counts[l]})</span>
            </label>
          ))}
        </div>

        <div className="toolbar mt-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Search name, ID or location…" />
          <div className="toolbar__filters">
            <label className="select"><span className="sr-only">Category</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="all">Category: All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" /></label>
          </div>
        </div>

        <div className="table-wrap table-wrap--cards"><table className="table">
          <thead><tr>
            <th>ID</th><th>Item</th><th>Category</th>
            <th className="num">Available</th><th className="num">Borrowed</th><th className="num">Minimum</th>
            <th>Location</th><th>Level</th>
          </tr></thead>
          <tbody>
            {visible.map(({ item, borrowed, totalUnits, level: lv }) => (
              <tr key={item.id}>
                <td className="cell-id nowrap"><span className="table__id">{item.id}</span></td>
                <td className="cell-title" style={{ minWidth: 210 }}>
                  <Link className="table__primary" to={`/items/${item.id}`}>{item.name}</Link>
                  {item.tracking === "unit" && <span className="text-xs text-muted"> · device</span>}
                  {item.requiresApproval && <span className="text-xs text-muted"> · needs approval</span>}
                </td>
                <td className="cell-meta">{item.category}</td>
                <td className="num cell-end" data-label="Available">
                  {item.quantity}{item.tracking === "unit" ? ` of ${totalUnits}` : ""}
                </td>
                <td className="num hide-on-phone">{borrowed}</td>
                <td className="num hide-on-phone">{item.tracking === "unit" ? "—" : item.minimumStock}</td>
                <td className="cell-footer nowrap"><span className="location"><MapPin size={14} aria-hidden="true" />{item.location}</span></td>
                <td className="cell-status"><span className={`badge ${levelInfo[lv].variant}`}>{levelInfo[lv].label}</span></td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td className="table__empty" colSpan={8}>
                <div className="empty-state">
                  <span className="empty-state__icon"><SearchX size={24} aria-hidden="true" /></span>
                  <h3>No items match</h3>
                  <p>Try another search or show all levels.</p>
                  {filtersActive && <button className="btn mt-2" onClick={() => { setQuery(""); setLevel("all"); setCategory("all"); }}>Clear filters</button>}
                </div>
              </td></tr>
            )}
          </tbody>
        </table></div>
      </section>
    </>
  );
}
