import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
}

/** Number field with − / + buttons. Only whole numbers between min and max. */
export default function QuantityInput({ id, value, onChange, min = 1, max }: QuantityInputProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  return (
    <div className="stepper">
      <button type="button" className="stepper__btn" onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label="Decrease quantity"><Minus size={16} /></button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={Number.isNaN(value) ? "" : value}
        onChange={e => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
        onBlur={() => onChange(clamp(Number.isNaN(value) ? min : value))}
      />
      <button type="button" className="stepper__btn" onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label="Increase quantity"><Plus size={16} /></button>
    </div>
  );
}