import { useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, CalendarClock, CircleCheck, Hourglass, Info, MapPin, Package, ShieldCheck } from "lucide-react";
import type { BorrowRecord, ComponentItem } from "../types/inventory";
import StockBadge from "../components/StockBadge";
import { categoryIcon } from "../components/CategoryTile";
import BorrowDialog, { type BorrowRequest } from "../components/BorrowDialog";
import ReturnDialog, { type ReturnRequest } from "../components/ReturnDialog";

/** An active loan of this item. No names — members don't see who borrowed what. */
export interface ActiveLoan {
  quantity: number;
  dueAt?: string;
}

interface ItemDetailProps {
  item: ComponentItem;
  imageUrl?: string;
  /** All active loans of this item (any member), used for "currently borrowed" and "next back". */
  activeLoans?: ActiveLoan[];
  /** The signed-in member's own active borrow of this item, if any. */
  myBorrow?: BorrowRecord;
  /** The signed-in member's request for this item that is waiting for approval, if any. */
  myRequest?: BorrowRecord;
  /** Leave out to hide the Borrow button (e.g. signed out). */
  onBorrow?: (request: BorrowRequest) => Promise<void> | void;
  onReturn?: (request: ReturnRequest) => Promise<void> | void;
}

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : undefined;

export default function ItemDetail({ item, imageUrl, activeLoans = [], myBorrow, myRequest, onBorrow, onReturn }: ItemDetailProps) {
  const [dialog, setDialog] = useState<"borrow" | "return" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const borrowedCount = activeLoans.reduce((sum, loan) => sum + loan.quantity, 0);
  const nextBack = activeLoans.map(l => l.dueAt).filter((d): d is string => !!d).sort()[0];
  const outOfStock = item.quantity <= 0;
  const needsApproval = !!item.requiresApproval;
  const CategoryIcon = categoryIcon(item.category);

  return (
    <main className="page">
      <a className="back-link" href={`/category/${encodeURIComponent(item.category)}`}>
        <ArrowLeft size={16} aria-hidden="true" /> {item.category}
      </a>

      {message && <div className="alert alert--success" role="status"><CircleCheck size={18} aria-hidden="true" /><span>{message}</span></div>}

      <section className="detail">
        <div className="detail__media">
          {imageUrl ? <img src={imageUrl} alt={item.name} /> : <Package size={72} aria-hidden="true" />}
        </div>

        <div className="detail__body">
          <div className="row">
            <span className="badge badge--neutral badge--tag"><CategoryIcon size={12} aria-hidden="true" />{item.category}</span>
            <StockBadge quantity={item.quantity} minimumStock={item.minimumStock} />
            {needsApproval && <span className="badge badge--info badge--tag"><ShieldCheck size={12} aria-hidden="true" />Needs approval</span>}
          </div>
          <h1>{item.name}</h1>
          {item.partNumber && <p className="text-muted">Part number {item.partNumber}</p>}

          <dl className="facts">
            <div className="fact fact--highlight fact--wide">
              <dt>Where to find it</dt>
              <dd className="detail__location"><MapPin size={20} aria-hidden="true" />{item.location}</dd>
            </div>
            <div className="fact"><dt>Available now</dt><dd className="detail__number">{item.quantity}</dd></div>
            <div className="fact"><dt>Currently borrowed</dt><dd className="detail__number">{borrowedCount}</dd></div>
            {nextBack && <div className="fact fact--wide"><dt>Next one expected back</dt><dd>{formatDate(nextBack)}</dd></div>}
          </dl>

          {myBorrow && (
            <div className="alert alert--info">
              <CalendarClock size={18} aria-hidden="true" />
              <span>You have <b>{myBorrow.quantity}</b> of these{myBorrow.dueAt ? <> · return by <b>{formatDate(myBorrow.dueAt)}</b></> : null}.</span>
            </div>
          )}

          {myRequest && (
            <div className="alert alert--warning">
              <Hourglass size={18} aria-hidden="true" />
              <span>Your request for <b>{myRequest.quantity}</b> is waiting for committee approval.</span>
            </div>
          )}

          {outOfStock && (
            <div className="alert alert--warning">
              <Info size={18} aria-hidden="true" />
              <span>None available right now.{nextBack ? ` The next one is due back on ${formatDate(nextBack)}.` : ""}</span>
            </div>
          )}

          <div className="btn-group detail__actions">
            {onBorrow && (
              <button className="btn btn--primary btn--lg" disabled={outOfStock || !!myRequest} onClick={() => { setMessage(null); setDialog("borrow"); }}>
                <ArrowDownToLine size={18} aria-hidden="true" /> {needsApproval ? "Request to borrow" : "Borrow"}
              </button>
            )}
            {myBorrow && onReturn && (
              <button className="btn btn--lg" onClick={() => { setMessage(null); setDialog("return"); }}>
                <ArrowUpFromLine size={18} aria-hidden="true" /> Return
              </button>
            )}
          </div>

          {item.notes && (
            <section className="card card--soft">
              <h3>Notes</h3>
              <p className="mt-2">{item.notes}</p>
            </section>
          )}
        </div>
      </section>

      {dialog === "borrow" && onBorrow && (
        <BorrowDialog
          item={item}
          needsApproval={needsApproval}
          onClose={() => setDialog(null)}
          onConfirm={async req => {
            await onBorrow(req);
            setMessage(needsApproval
              ? `Request sent for ${req.quantity} × ${item.name}. You can pick it up once a committee member approves it.`
              : `Borrowed ${req.quantity} × ${item.name}. Return by ${formatDate(req.dueDate)}.`);
          }}
        />
      )}
      {dialog === "return" && myBorrow && onReturn && (
        <ReturnDialog
          item={item}
          borrow={myBorrow}
          onClose={() => setDialog(null)}
          onConfirm={async req => {
            await onReturn(req);
            setMessage(`Returned ${req.quantity} × ${item.name}. Thanks for putting it back in ${item.location}!`);
          }}
        />
      )}
    </main>
  );
}