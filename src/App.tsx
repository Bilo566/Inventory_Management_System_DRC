import { Fragment, useMemo, useState } from "react";
import { Boxes, Package, TriangleAlert, Cpu, ChevronDown, MapPin, Inbox } from "lucide-react";
import type { ComponentItem } from "./types/inventory";
import SearchBar from "./components/SearchBar";
import StockBadge, { getStockStatus } from "./components/StockBadge";

const statusOf = (item: ComponentItem) => getStockStatus(item.quantity, item.minimumStock);
const needsRestock = (item: ComponentItem) => statusOf(item) !== "in";

export default function App() {
  // Filled from the database once the backend connection is added (src/lib/).
  const [items] = useState<ComponentItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => [...new Set(items.map(item => item.category))].sort(), [items]);
  const visibleItems = useMemo(() => items.filter(item =>
    [item.name, item.category, item.location, item.id].join(" ").toLowerCase().includes(query.trim().toLowerCase())
    && (category === "all" || item.category === category)
    && (stock === "all" || statusOf(item) === stock)
  ), [items, query, category, stock]);

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowCount = items.filter(needsRestock).length;
  const categoryCount = categories.length;
  const healthyPct = items.length ? Math.round(((items.length - lowCount) / items.length) * 100) : 0;

  return <div className="app">
    <header className="topbar">
      <a className="topbar__brand" href="/"><img className="topbar__logo" src="/drc-logo-white.png" alt="Drones and Robotics Club" /><span className="topbar__title">Inventory</span></a>
    </header>

    <main className="page">
      <header className="page-header">
        <div className="page-header__text"><p className="eyebrow">Drones & Robotics Club</p><h1>Inventory overview</h1><p>Find components and where they are stored.</p></div>
      </header>

      <section className="stat-grid" aria-label="Inventory summary">
        <article className="stat stat--hero">
          <div className="stat__head"><span className="stat__icon"><Boxes size={22}/></span><span className="stat__label">Component types</span></div>
          <strong className="stat__value">{items.length}</strong>
          <small className="stat__note">across {categoryCount} categories</small>
          <Boxes className="stat__deco" aria-hidden="true"/>
        </article>
        <article className="stat">
          <div className="stat__head"><span className="stat__icon"><Package size={22}/></span><span className="stat__label">Total units</span></div>
          <strong className="stat__value">{totalUnits}</strong>
          <div className="meter" role="img" aria-label={`${healthyPct}% of component types are well stocked`}><span style={{ width: `${healthyPct}%` }}/></div>
          <small className="stat__note">{healthyPct}% of types well stocked</small>
        </article>
        <article className={lowCount ? "stat stat--alert" : "stat"}>
          <div className="stat__head"><span className="stat__icon"><TriangleAlert size={22}/></span><span className="stat__label">Low-stock alerts</span></div>
          <strong className="stat__value">{lowCount}</strong>
          <small className="stat__note">{lowCount ? "Needs restocking soon" : "All good"}</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div className="panel__title"><span className="panel__icon"><Cpu size={20}/></span><div><h2>Electronics components</h2><p>Search by name, category, or storage location.</p></div></div>
        </div>

        <div className="toolbar">
          <SearchBar value={query} onChange={setQuery} placeholder="Search components..." />
          <div className="toolbar__filters">
            <label className="select"><span className="sr-only">Category</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="all">Category: All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select><ChevronDown size={14}/></label>
            <label className="select"><span className="sr-only">Stock status</span>
              <select value={stock} onChange={e => setStock(e.target.value)}>
                <option value="all">Status: All</option>
                <option value="in">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select><ChevronDown size={14}/></label>
          </div>
        </div>

        <div className="table-wrap table-wrap--cards"><table className="table">
          <thead><tr><th>ID</th><th>Component</th><th>Category</th><th className="num">Quantity</th><th>Storage location</th><th>Status</th><th><span className="sr-only">Details</span></th></tr></thead>
          <tbody>
            {visibleItems.map(item => {
              const open = openId === item.id;
              return <Fragment key={item.id}>
                <tr className={open ? "is-open" : undefined}>
                  <td className="cell-id"><a className="table__id" href={`#${item.id}`}>{item.id}</a></td>
                  <td className="cell-title table__primary">{item.name}</td>
                  <td className="cell-meta">{item.category}</td>
                  <td className="num cell-end" data-label="Quantity">{item.quantity}</td>
                  <td className="cell-footer"><span className="location"><MapPin size={14}/>{item.location}</span></td>
                  <td className="cell-status"><StockBadge quantity={item.quantity} minimumStock={item.minimumStock} /></td>
                  <td className="cell-toggle table__toggle-cell"><button className="icon-btn" aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} details for ${item.name}`} onClick={() => setOpenId(open ? null : item.id)}><ChevronDown size={16}/></button></td>
                </tr>
                {open && <tr className="table__details"><td colSpan={7}>
                  <dl className="facts">
                    <div className="fact"><dt>On hand</dt><dd>{item.quantity}</dd></div>
                    <div className="fact"><dt>Minimum stock</dt><dd>{item.minimumStock}</dd></div>
                    <div className="fact"><dt>Storage location</dt><dd>{item.location}</dd></div>
                    <div className="fact"><dt>Part number</dt><dd>{item.partNumber ?? "—"}</dd></div>
                  </dl>
                </td></tr>}
              </Fragment>;
            })}
            {visibleItems.length === 0 && <tr><td className="table__empty" colSpan={7}>
              <div className="empty-state">
                <span className="empty-state__icon"><Inbox size={24}/></span>
                {items.length === 0
                  ? <><h3>No components yet</h3><p>Components will appear here once they are added.</p></>
                  : <><h3>No matching components</h3><p>Try a different name or clear the filters.</p></>}
              </div>
            </td></tr>}
          </tbody>
        </table></div>
      </section>

    </main>

    <footer className="footer">Drones &amp; Robotics Club · Inventory</footer>
  </div>;
}