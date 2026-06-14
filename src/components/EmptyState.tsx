export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        className="opacity-35"
      >
        <circle cx="36" cy="36" r="32" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400" />
        <line x1="4" y1="36" x2="68" y2="36" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400" />
        <circle cx="36" cy="36" r="9" stroke="currentColor" strokeWidth="2.5" fill="white" className="text-zinc-400" />
        <path d="M4 36 A32 32 0 0 1 68 36" fill="white" />
        <path d="M4 36 A32 32 0 0 1 68 36" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-zinc-400" />
        <text
          x="36"
          y="22"
          textAnchor="middle"
          fontFamily="'Press Start 2P', monospace"
          fontSize="9"
          fill="currentColor"
          className="text-zinc-400"
        >
          ?
        </text>
      </svg>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-pokemon text-[11px] text-zinc-700">pokédex vacía</p>
        <p className="font-pokemon text-[9px] text-zinc-400">That Pokémon doesn't exist.</p>
      </div>
    </div>
  );
}
