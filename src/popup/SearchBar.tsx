import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search input with icon and clear button.
 * Filters both open tabs and favorites.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on popup open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-bar" id="search-bar">
      <Search className="search-icon" size={16} strokeWidth={1.5} />

      <input
        ref={inputRef}
        id="search-input"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tabs and favorites"
      />

      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          id="search-clear-btn"
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
