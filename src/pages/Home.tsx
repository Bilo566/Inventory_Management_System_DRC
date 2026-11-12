import { useMemo, useState } from "react";
import { Inbox, SearchX } from "lucide-react";
import type { ComponentItem } from "../types/inventory";
import SearchBar from "../components/SearchBar";
import CategoryTile from "../components/CategoryTile";
import ItemCard from "../components/ItemCard";

interface HomeProps {
  /** All components, loaded from the database by the parent (router/app). */
  items: ComponentItem[];
  /** Shows skeletons while items are loading. */
  loading?: boolean;
  /** Member's first name for the greeting. */
  memberName?: string;
}

const categoryHref = (category: string) => `/category/${encodeURIComponent(category)}`;
const itemHref = (item: ComponentItem) => `/items/${item.id}`;

export default function Home({ items, loading = false, memberName }: HomeProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach(item => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  const results = useMemo(() => q
    ? items.filter(item =>
        [item.name, item.category, item.location, item.partNumber ?? ""].join(" ").toLowerCase().includes(q))
    : [], [items, q]);

  return (
    <main className="page">
      <header className="home-hero">
        <p className="eyebrow">Drones &amp; Robotics Club</p>
        <h1>{memberName ? `Hi ${memberName}, what do you need today?` : "What do you need today?"}</h1>
        <p className="text-muted">Search for a part to see if it's available and where it's stored.</p>
        <SearchBar
          size="hero"
          value={query}
          onChange={setQuery}
          placeholder="Search parts, e.g. ESP32, servo, camera…"
          label="Search the inventory"
        />
      </header>

      {q ? (
        <section aria-live="polite">
          <div className="section-heading">
            <h2>Results</h2>
            <span className="text-muted text-sm">{results.length} {results.length === 1 ? "match" : "matches"}</span>
          </div>
          {results.length > 0 ? (
            <div className="grid">
              {results.map(item => <ItemCard key={item.id} item={item} href={itemHref(item)} />)}
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <span className="empty-state__icon"><SearchX size={24} /></span>
                <h3>No parts match “{query.trim()}”</h3>
                <p>Check the spelling, or browse the categories below.</p>
                <button className="btn mt-2" onClick={() => setQuery("")}>Clear search</button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section>
        <div className="section-heading"><h2>Browse by category</h2></div>
        {loading ? (
          <div className="grid" style={{ ["--grid-min" as string]: "150px" }}>
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" style={{ height: 150, borderRadius: "var(--radius-md)" }} />)}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid" style={{ ["--grid-min" as string]: "150px" }}>
            {categories.map(([name, count]) => <CategoryTile key={name} name={name} count={count} href={categoryHref(name)} />)}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <span className="empty-state__icon"><Inbox size={24} /></span>
              <h3>No categories yet</h3>
              <p>Categories appear here once parts are added to the inventory.</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}