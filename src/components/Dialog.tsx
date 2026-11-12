import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  title: string;
  /** Short line under the title. */
  description?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** Buttons shown at the bottom (Cancel / Confirm). */
  actions?: ReactNode;
}

/**
 * Accessible popup: closes on Escape or a click outside, moves focus inside
 * when it opens and back to the button that opened it when it closes.
 */
export default function Dialog({ title, description, onClose, children, actions }: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("input, select, textarea, button:not(.dialog__close)");
    (first ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel) {           // keep Tab inside the dialog
        const focusable = [...panel.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")].filter(el => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const firstEl = focusable[0], lastEl = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <div className="dialog__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p className="text-muted text-sm mt-2">{description}</p>}
          </div>
          <button type="button" className="icon-btn dialog__close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {children}
        {actions && <div className="dialog__actions">{actions}</div>}
      </div>
    </div>
  );
}