import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, SearchX, Inbox } from "lucide-react";
import type { ComponentItem } from "../types/inventory";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import { categoryIcon } from "../components/CategoryTile";
import { getStockStatus, type StockStatus } from "../components/StockBadge";

interface CategoryProps {
  /** Category name from the URL, e.g. /category/Sensors */
  category: string;
  /** All components (the page filters to this category). */
  items: ComponentItem[];
  loading?: boolean;
}

type SortKey = "name" | "available" | "location";

export default function Category({ category, items, loading = false }: CategoryProps) {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState<"all" | StockStatus>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const Icon = categoryIcon(category);

  const inCategory = useMemo(() => items.filter(item => item.category === category), [items, category]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inCategory
      .filter(item => [item.name, item.location, item.partNumber ?? ""].join(" ").toLowerCase().includes(q))
      .filter(item => stock === "all" || getStockStatus(item.quantity, item.minimumStock) === stock)
      .sort((a, b) =>
        sort === "available" ? b.quantity - a.quantity
        : sort === "location" ? a.location.localeCompare(b.location)
        : a.name.localeCompare(b.name));
  }, [inCategory, query, stock, sort]);

  const filtersActive = query.trim() !== "" || stock !== "all";

  return (
    <main className="page">
      <a className="back-link" href="/"><ArrowLeft size={16} aria-hidden="true" /> All categories</a>

      <header className="page-header">
        <div className="panel__title">
          <span className="panel__icon panel__icon--lg"><Icon size={26} aria-hidden="true" /></span>
          <div className="page-header__text">
            <h1>{category}</h1>
            <p>{inCategory.length} {inCategory.length === 1 ? "part" : "parts"} in this category</p>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder={`Search in ${category}…`} />
        <div className="toolbar__filters">
          <label className="select"><span className="sr-only">Availability</span>
            <select value={stock} onChange={e => setStock(e.target.value as "all" | StockStatus)}>
              <option value="all">Availability: All</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select><ChevronDown size={14} aria-hidden="true" /></label>
          <label className="select"><span className="sr-only">Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
              <option value="name">Sort: Name</option>
              <option value="available">Sort: Most available</option>
              <option value="location">Sort: Location</option>
            </select><ChevronDown size={14} aria-hidden="true" /></label>
        </div>
      </div>

      {loading ? (
        <div className="grid">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" style={{ height: 250, borderRadius: "var(--radius-md)" }} />)}
        </div>
      ) : visible.length > 0 ? (
        <div className="grid">
          {visible.map(item => <ItemCard key={item.id} item={item} href={`/items/${item.id}`} />)}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <span className="empty-state__icon">{filtersActive ? <SearchX size={24} /> : <Inbox size={24} />}</span>
            {filtersActive
              ? <><h3>No parts match these filters</h3><p>Try another search or show all availability.</p>
                  <button className="btn mt-2" onClick={() => { setQuery(""); setStock("all"); }}>Clear filters</button></>
              : <><h3>No parts in {category} yet</h3><p>Parts appear here once they are added.</p></>}
          </div>
        </div>
      )}
    </main>
  );
}