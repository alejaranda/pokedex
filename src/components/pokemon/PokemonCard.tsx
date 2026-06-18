import { useState } from "react";
import type { Pokemon } from "../../lib/pokemon";
import { PokemonModal } from "./PokemonModal";

type Props = {
	p: Pokemon;
};

export function PokemonCard({ p }: Props) {
	const [open, setOpen] = useState(false);
	const num = String(p.id).padStart(3, "0");
	const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
	const primary = p.types[0];

	return (
		<>
			<article
				className="flex cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 sm:flex-col"
				style={{ ["--pk-color" as any]: `var(--type-${primary})` }}
				onClick={() => setOpen(true)}
			>
				<div className="w-1 shrink-0 bg-(--pk-color) sm:h-1 sm:w-auto" />
				<div className="flex shrink-0 items-center justify-center bg-zinc-100 px-3 py-2 sm:px-0 sm:py-3">
					<img
						src={sprite}
						alt={p.name}
						loading="lazy"
						className="pixelated h-14 w-14 sm:h-16 sm:w-16"
					/>
				</div>
				<div className="flex flex-1 flex-col justify-center p-2.5">
					<div className="mb-1 flex items-baseline justify-between">
						<span className="font-pokemon text-[7px] text-zinc-400">
							#{num}
						</span>
						<span className="font-pokemon text-[6px] text-zinc-500">
							<b className="text-[9px] text-(--pk-color)">{p.hp}</b> HP
						</span>
					</div>
					<p className="mb-1.5 font-pokemon text-[7px] capitalize leading-[1.4] text-zinc-800">
						{p.name}
					</p>
					<div className="flex flex-wrap gap-1">
						{p.types.map((t) => (
							<span
								key={t}
								className="rounded px-1.5 py-0.5 font-pokemon text-[7px] font-semibold capitalize text-white"
								style={{ background: `var(--type-${t})` }}
							>
								{t}
							</span>
						))}
					</div>
				</div>
			</article>

			<PokemonModal pokemon={open ? p : null} onClose={() => setOpen(false)} />
		</>
	);
}
