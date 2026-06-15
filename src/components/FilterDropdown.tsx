import { useEffect, useRef, useState } from "react";

const TYPE_ICONS: Record<string, string> = {
  fire: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 14c-3 0-5-2-5-4.5 0-2 1.5-3.5 2-5 .5 1 .5 2 1.5 2.5C7 5.5 7 3 8 2c.5 1.5 1.5 2.5 2 4 .5-1 .5-2 .5-2.5C12 5 13 7 13 9.5c0 2.5-2 4.5-5 4.5z" fill="currentColor"/></svg>`,
  water: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2C8 2 3 8 3 11a5 5 0 0010 0C13 8 8 2 8 2z" fill="currentColor"/></svg>`,
  grass: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 14V7M8 7C8 7 5 4 2 3c1 3 3 5 6 4M8 7c0 0 3-3 6-4-1 3-3 5-6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  electric: `<svg viewBox="0 0 16 16" fill="none"><path d="M9 2L4 9h4l-1 5 5-7H8L9 2z" fill="currentColor"/></svg>`,
  poison: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="9" r="4" fill="currentColor"/><path d="M6 5V3h4v2M5 3h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  flying: `<svg viewBox="0 0 16 16" fill="none"><path d="M2 10c2-4 5-5 8-4M14 6c-2 0-4 2-4 4M2 10c2-1 5-1 7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  psychic: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" fill="currentColor"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.5 1.5M10.5 10.5L12 12M4 12l1.5-1.5M10.5 5.5L12 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  dragon: `<svg viewBox="0 0 16 16" fill="none"><path d="M3 13L8 3l5 10M5.5 9h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  normal: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.5"/></svg>`,
  ice: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  rock: `<svg viewBox="0 0 16 16" fill="none"><path d="M5 13l-2-5 3-4h4l3 4-2 5H5z" fill="currentColor"/></svg>`,
  ghost: `<svg viewBox="0 0 16 16" fill="none"><path d="M4 13V7a4 4 0 018 0v6l-2-1.5-2 1.5-2-1.5-2 1.5z" fill="currentColor"/><circle cx="6.5" cy="7.5" r="1" fill="white"/><circle cx="9.5" cy="7.5" r="1" fill="white"/></svg>`,
  bug: `<svg viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="9" rx="3" ry="4" fill="currentColor"/><path d="M5 6l-2-2M11 6l2-2M5 9H3M11 9h2M5 12l-2 2M11 12l2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  fighting: `<svg viewBox="0 0 16 16" fill="none"><path d="M5 12l5-8M10 12L5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="8" r="2.5" fill="currentColor"/></svg>`,
  steel: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4.5H14l-3.75 2.75L11.5 14 8 11.5 4.5 14l1.25-4.75L2 6.5h4.5L8 2z" fill="currentColor"/></svg>`,
  dark: `<svg viewBox="0 0 16 16" fill="none"><path d="M10 3A5 5 0 105 13a6 6 0 005-10z" fill="currentColor"/></svg>`,
  fairy: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l.8 2.4H14l-2.1 1.6.8 2.4L8 7l-4.7 1.4.8-2.4L2 4.4h5.2L8 2zM8 9l.5 1.5H10l-1.3 1 .5 1.5L8 12l-1.2.9.5-1.5L6 10.5h1.5L8 9z" fill="currentColor"/></svg>`,
  ground: `<svg viewBox="0 0 16 16" fill="none"><path d="M2 11h12M4 11V7l4-4 4 4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function TypeIcon({ type, size = 10 }: { type: string; size?: number }) {
  const svg = TYPE_ICONS[type.toLowerCase()];
  if (!svg) return null;
  return (
    <span
      style={{ width: size, height: size, display: "inline-flex", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

type Option = { value: string; label: string };

type FilterDropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  color?: string;
  showTypeIcons?: boolean;
};

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  color,
  showTypeIcons = false,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const isActive = value !== "";
  const clearLabel = label === "Gen" ? "All" : "All";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 font-pokemon text-[7px] transition"
        style={
          isActive && color
            ? { background: color, color: "white", borderColor: "transparent" }
            : undefined
        }
      >
        {isActive && showTypeIcons && <TypeIcon type={selected?.value ?? ""} size={10} />}
        {isActive ? selected?.label : label}
        <svg
          width="8" height="8" viewBox="0 0 8 8" fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-32.5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${value === "" ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
          >
            {clearLabel}
          </button>

          <div className="my-0.5 h-px bg-zinc-100" />

          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${isSelected ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
              >
                {showTypeIcons && <TypeIcon type={option.value} size={10} />}
                {option.label}
                {isSelected && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-auto text-zinc-900">
                    <path d="M1 4L3 6L7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
