import { useMemo, useState } from "react";
import { Boxes, Search, Printer, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { ComponentItem } from "./types/inventory";

const sampleItems: ComponentItem[] = [
  { id: "C-001", name: "ESP32 development board", category: "Microcontrollers", quantity: 12, minimumStock: 5, location: "Cabinet A · Bin 2" },
  { id: "C-002", name: "Ultrasonic distance sensor", category: "Sensors", quantity: 4, minimumStock: 6, location: "Cabinet B · Bin 1" },
  { id: "C-003", name: "Jumper wires (40 pack)", category: "Wiring", quantity: 18, minimumStock: 8, location: "Drawer C · Tray 4" }
];

export default function App() {
  const [items] = useState(sampleItems);
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => items.filter(item =>
    [item.name, item.category, item.location].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [items, query]);

  return <main className="shell">
    <header className="topbar"><div className="brand"><Boxes /><span>DRC <b>Inventory</b></span></div><span className="prototype">Prototype · Sample data</span></header>
    <section className="intro"><p className="eyebrow">DRONES & ROBOTICS CLUB</p><h1>Inventory overview</h1><p>Find components, track stock, and keep filament usage organized.</p></section>
    <section className="stats">
      <article><span>Component types</span><strong>{items.length}</strong></article>
      <article><span>Total units</span><strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong></article>
      <article><span>Low-stock alerts</span><strong>{items.filter(item => item.quantity <= item.minimumStock).length}</strong></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>Electronics components</h2><p>Search by name, category, or storage location.</p></div><div className="actions"><button disabled><ArrowDownToLine size={16}/> Borrow · coming soon</button><button disabled><ArrowUpFromLine size={16}/> Return · coming soon</button></div></div>
      <label className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search inventory..." /></label>
      <div className="table-wrap"><table><thead><tr><th>Component</th><th>Category</th><th>Quantity</th><th>Storage location</th><th>Status</th></tr></thead><tbody>
        {visibleItems.map(item => <tr key={item.id}><td><b>{item.name}</b><small>{item.id}</small></td><td>{item.category}</td><td>{item.quantity}</td><td>{item.location}</td><td><span className={item.quantity <= item.minimumStock ? "status low" : "status ok"}>{item.quantity <= item.minimumStock ? "Low stock" : "In stock"}</span></td></tr>)}
        {visibleItems.length === 0 && <tr><td colSpan={5}>No matching components.</td></tr>}
      </tbody></table></div>
    </section>
    <section className="panel filament"><Printer/><div><h2>Filament tracking</h2><p>Spool records and usage logging are planned for the inventory-logic workstream.</p></div></section>
    <footer>DRC Inventory Organizer · Early development scaffold</footer>
  </main>;
}