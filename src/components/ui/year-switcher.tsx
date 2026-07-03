"use client";

type Year = "2026" | "2027";

interface YearSwitcherProps {
  value: Year;
  onChange: (year: Year) => void;
  className?: string;
}

export function YearSwitcher({ value, onChange, className = "" }: YearSwitcherProps) {
  return (
    <div
      className={[
        "mx-auto mt-8 flex max-w-sm rounded-2xl border border-border bg-muted/40 p-1",
        className,
      ].join(" ")}
    >
      {(["2026", "2027"] as const).map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => onChange(year)}
          className={[
            "flex-1 rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
            value === year
              ? "bg-koder-orange text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
