import { useState, type FormEvent } from "react";
import { MapPin } from "lucide-react";
import type { BorrowRecord, ComponentItem } from "../types/inventory";
import Dialog from "./Dialog";
import QuantityInput from "./QuantityInput";

export type ItemCondition = "good" | "damaged" | "missing_parts";

export interface ReturnRequest {
  borrowId: string;
  quantity: number;
  condition: ItemCondition;
  note?: string;
}

interface ReturnDialogProps {
  item: ComponentItem;
  /** The member's active borrow record for this item. */
  borrow: BorrowRecord;
  onClose: () => void;
  /** Saves the return. Throw an Error to show its message in the dialog. */
  onConfirm: (request: ReturnRequest) => Promise<void> | void;
}

const conditions: { value: ItemCondition; label: string }[] = [
  { value: "good", label: "Good" },
  { value: "damaged", label: "Damaged" },
  { value: "missing_parts", label: "Missing parts" },
];

export default function ReturnDialog({ item, borrow, onClose, onConfirm }: ReturnDialogProps) {
  const outstanding = borrow.quantity;
  const [quantity, setQuantity] = useState(outstanding);
  const [condition, setCondition] = useState<ItemCondition>("good");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantityError =
    Number.isNaN(quantity) || quantity < 1 ? "Enter at least 1."
    : quantity > outstanding ? `You only have ${outstanding}.`
    : null;
  const noteRequired = condition !== "good";
  const noteError = noteRequired && !note.trim() ? "Tell the committee what happened." : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (quantityError || noteError || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onConfirm({ borrowId: borrow.id, quantity, condition, note: note.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Dialog
      title={`Return ${item.name}`}
      description={<span className="location"><MapPin size={14} aria-hidden="true" />Put it back in {item.location}</span>}
      onClose={onClose}
    >
      <form className="form mt-4" onSubmit={submit} noValidate>
        {outstanding > 1 && (
          <div className={quantityError ? "field has-error" : "field"}>
            <label htmlFor="return-qty" className="required">How many are you returning?</label>
            <QuantityInput id="return-qty" value={quantity} onChange={setQuantity} max={outstanding} />
            {quantityError ? <p className="field__error">{quantityError}</p> : <p className="field__hint">You have {outstanding}</p>}
          </div>
        )}

        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="field__label required">What condition is it in?</legend>
          <div className="chips mt-2">
            {conditions.map(c => (
              <label className="chip" key={c.value}>
                <input type="radio" name="condition" value={c.value} checked={condition === c.value} onChange={() => setCondition(c.value)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={noteError ? "field has-error" : "field"}>
          <label htmlFor="return-note" className={noteRequired ? "required" : undefined}>{noteRequired ? "What happened?" : "Note (optional)"}</label>
          <textarea id="return-note" value={note} onChange={e => setNote(e.target.value)} placeholder={noteRequired ? "e.g. one propeller cracked during testing" : "Anything the committee should know"} />
          {noteError && <p className="field__error">{noteError}</p>}
        </div>

        {error && <div className="alert alert--danger" role="alert">{error}</div>}

        <div className="dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={!!quantityError || !!noteError || saving}>
            {saving ? <><span className="spinner" aria-hidden="true" /> Saving…</> : "Confirm return"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}