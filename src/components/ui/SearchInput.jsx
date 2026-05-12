import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A8 — Reusable SearchInput component
 * Features: search icon, debounce, clear button.
 */
export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Tìm kiếm...',
  debounceMs = 300,
  className = '',
}) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const emitChange = useCallback(
    (nextValue) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(nextValue);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (event) => {
    const next = event.target.value;
    setLocal(next);
    emitChange(next);
  };

  const handleClear = () => {
    setLocal('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8d80]" />
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#decebd] bg-[#fbf6ef] py-3 pl-10 pr-9 text-sm text-[var(--hr-ink)] outline-none transition placeholder:text-[#9b8d80] focus:border-[#b55233] focus:bg-white"
      />
      {local ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8d80] hover:text-[var(--hr-ink)]"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
