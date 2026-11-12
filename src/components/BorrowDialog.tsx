import { useState, type FormEvent } from "react";
import { MapPin } from "lucide-react";
import type { ComponentItem } from "../types/inventory";
import Dialog from "./Dialog";
import QuantityInput from "./QuantityInput";

export interface BorrowRequest {
  componentId: string;
  quantity: number;
  /** Return-by date, YYYY-MM-DD */
  dueDate: string;
}

interface BorrowDialogProps {
  item: ComponentItem;
  onClose: () => void;
  /** Saves the borrow. Throw an Error to show its message in the dialog. */
  onConfirm: (request: BorrowRequest) => Promise<void> | void;
}

/** YYYY-MM-DD in the member's local time (toISOString would shift to UTC). */
const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };

export default function BorrowDialog({ item, onClose, onConfirm }: BorrowDialogProps) {
  const available = item.quantity;
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState(toDateInput(addDays(7)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = toDateInput(new Date());
  const quantityError =
    Number.isNaN(quantity) || quantity < 1 ? "Enter at least 1."
    : !Number.isInteger(quantity) ? "Use a whole number."
    : quantity > available ? `Only ${available} available.`
    : null;
  const dateError = !dueDate ? "Choose a return date." : dueDate < today ? "The date can't be in the past." : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (quantityError || dateError || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onConfirm({ componentId: item.id, quantity, dueDate });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Dialog
      title={`Borrow ${item.name}`}
      description={<span className="location"><MapPin size={14} aria-hidden="true" />{item.location} · {available} available</span>}
      onClose={onClose}
    >
      <form className="form mt-4" onSubmit={submit} noValidate>
        <div className={quantityError ? "field has-error" : "field"}>
          <label htmlFor="borrow-qty" className="required">How many?</label>
          <QuantityInput id="borrow-qty" value={quantity} onChange={setQuantity} max={available} />
          {quantityError ? <p className="field__error">{quantityError}</p> : <p className="field__hint">Up to {available}</p>}
        </div>

        <div className={dateError ? "field has-error" : "field"}>
          <label htmlFor="borrow-due" className="required">Return by</label>
          <input id="borrow-due" type="date" min={today} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          {dateError ? <p className="field__error">{dateError}</p> : <p className="field__hint">You'll get a reminder before this date.</p>}
        </div>

        {error && <div className="alert alert--danger" role="alert">{error}</div>}

        <div className="dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={!!quantityError || !!dateError || saving}>
            {saving ? <><span className="spinner" aria-hidden="true" /> Saving…</> : "Confirm borrow"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}