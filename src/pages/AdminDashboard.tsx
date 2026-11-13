import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, PackageX, SearchCheck, TriangleAlert } from "lucide-react";
import type { BorrowRecord, ComponentItem, DeviceUnit, Member, StockCount } from "../types/inventory";
import StockBadge, { getStockStatus } from "../components/StockBadge";

interface AdminDashboardProps {
  items: ComponentItem[];
  borrows: BorrowRecord[];
  members: Member[];
  units: DeviceUnit[];
  stockCounts: StockCount[];
}

const PERIOD_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
const withinPeriod = (iso?: string) => !!iso && Date.now() - new Date(iso).getTime() <= PERIOD_DAYS * DAY;
const daysLate = (iso: string) => Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / DAY));

/* Definitions (agreed for now):
   Parts used   = units handed out in the last 30 days (approved borrows only).
   Returns      = borrows given back in the last 30 days.
   Unaccounted  = lost: units missing from a stock count + devices marked "lost". */

export default function AdminDashboard({ items, borrows, members, units, stockCounts }: AdminDashboardProps) {
  const itemName = (id: string) => items.find(i => i.id === id)?.name ?? "Unknown item";
  const memberName = (id: string) => members.find(m => m.id === id)?.name ?? "Unknown member";

  const handedOut = borrows.filter(b => b.status !== "pending" && b.status !== "rejected" && withinPeriod(b.borrowedAt));
  const partsUsed = handedOut.reduce((s, b) => s + b.quantity, 0);
  const returns = borrows.filter(b => b.status === "returned" && withinPeriod(b.returnedAt));
  const pendingCount = borrows.filter(b => b.status === "pending").length;

  // Unaccounted = gaps found when counting shelves, plus devices marked lost.
  const countGaps = stockCounts
    .filter(c => c.counted < c.expected)
    .map(c => ({ key: c.id, name: itemName(c.componentId), missing: c.expected - c.counted, detail: `Counted ${c.counted} of ${c.expected} on ${formatDate(c.countedAt)}` }));
  const lostUnits = units
    .filter(u => u.status === "lost")
    .map(u => ({ key: u.id, name: `${itemName(u.componentId)} (${u.assetTag})`, missing: 1, detail: "Device marked lost" }));
  const unaccounted = [...countGaps, ...lostUnits];
  const unaccountedTotal = unaccounted.reduce((s, u) => s + u.missing, 0);

  const overdue = borrows
    .filter(b => b.status === "overdue" || (b.status === "borrowed" && !!b.dueAt && new Date(b.dueAt).getTime() < Date.now()))
    .sort((a, b) => (a.dueAt ?? "").localeCompare(b.dueAt ?? ""));
  const lowStock = items
    .filter(i => getStockStatus(i.quantity, i.minimumStock) !== "in")
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <>
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">Last {PERIOD_DAYS} days</p>
          <h1>Admin dashboard</h1>
        </div>
        {pendingCount > 0 && (
          <Link className="btn btn--primary" to="/admin/orders"><ClipboardCheck size={16} aria-hidden="true" />{pendingCount} {pendingCount === 1 ? "request" : "requests"} to review</Link>
        )}
      </header>

      <section className="stat-grid" aria-label="Summary">
        <article className="stat stat--hero">
          <div className="stat__head"><span className="stat__icon"><ArrowDownToLine size={22} aria-hidden="true" /></span><span className="stat__label">Parts used</span></div>
          <strong className="stat__value">{partsUsed}</strong>
          <small className="stat__note">units handed out in {handedOut.length} borrows</small>
        </article>
        <article className="stat">
          <div className="stat__head"><span className="stat__icon"><ArrowUpFromLine size={22} aria-hidden="true" /></span><span className="stat__label">Returns</span></div>
          <strong className="stat__value">{returns.length}</strong>
          <small className="stat__note">{overdue.length ? `${overdue.length} still overdue` : "Nothing overdue"}</small>
        </article>
        <article className={unaccountedTotal ? "stat stat--alert" : "stat"}>
          <div className="stat__head"><span className="stat__icon"><PackageX size={22} aria-hidden="true" /></span><span className="stat__label">Unaccounted</span></div>
          <strong className="stat__value">{unaccountedTotal}</strong>
          <small className="stat__note">{unaccountedTotal ? "Units lost or missing from the shelf" : "Everything is accounted for"}</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div className="panel__title">
            <span className="panel__icon"><SearchCheck size={20} aria-hidden="true" /></span>
            <div><h2>Unaccounted items</h2><p>Found missing in a stock count, or devices marked lost.</p></div>
          </div>
        </div>
        {unaccounted.length ? (
          <ul className="list">
            {unaccounted.map(u => (
              <li className="list__item" key={u.key}>
                <div className="stack-sm" style={{ minWidth: 0 }}>
                  <span className="text-strong">{u.name}</span>
                  <span className="text-sm text-muted">{u.detail}</span>
                </div>
                <span className="badge badge--danger">{u.missing} missing</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-muted">Nothing missing in the latest counts.</p>}
      </section>

      <div className="grid" style={{ ["--grid-min" as string]: "320px" }}>
        <section className="panel">
          <div className="panel__header">
            <div className="panel__title">
              <span className="panel__icon"><TriangleAlert size={20} aria-hidden="true" /></span>
              <div><h2>Overdue</h2><p>Follow up with these members.</p></div>
            </div>
          </div>
          {overdue.length ? (
            <ul className="list">
              {overdue.map(b => (
                <li className="list__item" key={b.id}>
                  <div className="stack-sm" style={{ minWidth: 0 }}>
                    <span className="text-strong">{b.quantity} × {itemName(b.componentId)}</span>
                    <span className="text-sm text-muted">{memberName(b.borrowerId)} · was due {formatDate(b.dueAt)}</span>
                  </div>
                  {b.dueAt && <span className="badge badge--danger">{daysLate(b.dueAt)} {daysLate(b.dueAt) === 1 ? "day" : "days"} late</span>}
                </li>
              ))}
            </ul>
          ) : <p className="text-muted">No overdue items.</p>}
        </section>

        <section className="panel">
          <div className="panel__header">
            <div className="panel__title">
              <span className="panel__icon"><PackageX size={20} aria-hidden="true" /></span>
              <div><h2>Low or out of stock</h2><p>Consider restocking.</p></div>
            </div>
          </div>
          {lowStock.length ? (
            <ul className="list">
              {lowStock.map(i => (
                <li className="list__item" key={i.id}>
                  <Link className="text-strong" to={`/items/${i.id}`}>{i.name}</Link>
                  <StockBadge quantity={i.quantity} minimumStock={i.minimumStock} showCount />
                </li>
              ))}
            </ul>
          ) : <p className="text-muted">Everything is well stocked.</p>}
        </section>
      </div>
    </>
  );
}
