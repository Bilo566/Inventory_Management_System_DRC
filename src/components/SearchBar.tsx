import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Text read by screen readers. Defaults to the placeholder. */
  label?: string;
  /** "hero" = large rounded search for the Home page; "compact" = inside toolbars. */
  size?: "hero" | "compact";
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search components...",
  label,
  size = "compact",
  autoFocus = false,
}: SearchBarProps) {
  const isHero = size === "hero";

  return (
    <label className={isHero ? "search search--hero" : "search"}>
      <Search size={isHero ? 20 : 16} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
      />
      {value && (
        <button type="button" className="search__clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </label>
  );
}