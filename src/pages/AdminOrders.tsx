import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CircleCheck, Inbox, MapPin, X } from "lucide-react";
import type { BorrowRecord, ComponentItem, Member } from "../types/inventory";

interface AdminOrdersProps {
  items: ComponentItem[];
  borrows: BorrowRecord[];
  members: Member[];
  onApprove: (borrowId: string) => void;
  onReject: (borrowId: string) => void;
}

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";

/** Borrow requests for parts that need approval (expensive parts). */
export default function AdminOrders({ items, borrows, members, onApprove, onReject }: AdminOrdersProps) {
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const itemOf = (b: BorrowRecord) => items.find(i => i.id === b.componentId);
  const nameOf = (id: string) => members.find(m => m.id === id)?.name ?? "Unknown member";

  // Oldest request first — first come, first served.
  const pending = borrows.filter(b => b.status === "pending").sort((a, b) => a.borrowedAt.localeCompare(b.borrowedAt));

  return (
    <>
      <header className="page-header">
        <div className="page-header__text">
          <h1>Orders</h1>
          <p>Borrow requests for parts that need approval. Approving takes the parts out of stock.</p>
        </div>
      </header>

      {message && <div className="alert alert--success" role="status"><CircleCheck size={18} aria-hidden="true" /><span>{message}</span></div>}

      <section className="panel">
        <div className="panel__header">
          <div className="panel__title"><div><h2>Waiting for approval</h2><p>{pending.length} {pending.length === 1 ? "request" : "requests"}, oldest first</p></div></div>
        </div>

        {pending.length ? (
          <ul className="list">
            {pending.map(b => {
              const item = itemOf(b);
              const available = item?.quantity ?? 0;
              const enough = available >= b.quantity;
              const who = nameOf(b.borrowerId);
              return (
                <li className="list__item" key={b.id} style={{ flexWrap: "wrap" }}>
                  <div className="stack-sm" style={{ minWidth: 0, flex: "1 1 260px" }}>
                    <Link className="text-strong" to={`/items/${b.componentId}`}>{b.quantity} × {item?.name ?? "Unknown item"}</Link>
                    <span className="text-sm text-muted">{who} · requested {formatDate(b.borrowedAt)} · return by {formatDate(b.dueAt)}</span>
                    {item && <span className="location text-sm text-muted"><MapPin size={14} aria-hidden="true" />{item.location} · {available} available</span>}
                  </div>

                  {confirmReject === b.id ? (
                    <div className="row row--end">
                      <span className="text-sm">Reject this request?</span>
                      <button className="btn btn--sm btn--ghost" onClick={() => setConfirmReject(null)}>Keep</button>
                      <button className="btn btn--sm btn--danger" onClick={() => {
                        onReject(b.id); setConfirmReject(null);
                        setMessage(`Rejected ${who}'s request for ${item?.name ?? "the item"}.`);
                      }}>Yes, reject</button>
                    </div>
                  ) : (
                    <div className="row row--end">
                      {!enough && <span className="badge badge--danger">Only {available} in stock</span>}
                      <button className="btn btn--sm btn--danger" onClick={() => { setMessage(null); setConfirmReject(b.id); }}>
                        <X size={14} aria-hidden="true" />Reject
                      </button>
                      <button className="btn btn--sm" disabled={!enough} onClick={() => {
                        onApprove(b.id);
                        setMessage(`Approved ${b.quantity} × ${item?.name ?? "item"} for ${who}.`);
                      }}>
                        <Check size={14} aria-hidden="true" />Approve
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon"><Inbox size={24} aria-hidden="true" /></span>
            <h3>No requests waiting</h3>
            <p>New requests for parts that need approval show up here.</p>
          </div>
        )}
      </section>
    </>
  );
}
