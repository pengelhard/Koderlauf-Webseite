"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function VereinCombobox({
  names,
  value,
  onChange,
  placeholder = "Teamname wählen…",
  id,
  required,
}: {
  names: string[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const listId = id ? `${id}-list` : "verein-combobox-list";
  const q = value.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return names.slice(0, 12);
    return names.filter((n) => n.toLowerCase().includes(q)).slice(0, 12);
  }, [names, q]);

  return (
    <div className="relative">
      <input
        id={id}
        required={required}
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 160)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-koder-orange"
      />
      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          id={listId}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg"
        >
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={name === value}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-koder-orange/10",
                  name === value && "bg-koder-orange/15 font-semibold",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
