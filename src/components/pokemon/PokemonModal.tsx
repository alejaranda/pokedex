import { useEffect, useState } from "react";
import type { Pokemon } from "../../lib/pokemon";

type Props = {
	pokemon: Pokemon | null;
	onClose: () => void;
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

const TYPE_CHART: Record<string, { weak: string[]; strong: string[] }> = {
	fire: {
		weak: ["water", "rock", "ground"],
		strong: ["grass", "ice", "bug", "steel"],
	},
	water: { weak: ["electric", "grass"], strong: ["fire", "rock", "ground"] },
	grass: {
		weak: ["fire", "ice", "poison", "flying", "bug"],
		strong: ["water", "rock", "ground"],
	},
	electric: { weak: ["ground"], strong: ["water", "flying"] },
	poison: { weak: ["ground", "psychic"], strong: ["grass", "fairy"] },
	flying: {
		weak: ["electric", "ice", "rock"],
		strong: ["grass", "fighting", "bug"],
	},
	psychic: { weak: ["bug", "ghost", "dark"], strong: ["fighting", "poison"] },
	dragon: { weak: ["ice", "dragon", "fairy"], strong: ["dragon"] },
	normal: { weak: ["fighting"], strong: [] },
	ice: {
		weak: ["fire", "fighting", "rock", "steel"],
		strong: ["grass", "ground", "flying", "dragon"],
	},
	rock: {
		weak: ["water", "grass", "fighting", "ground", "steel"],
		strong: ["fire", "ice", "flying", "bug"],
	},
	ghost: { weak: ["ghost", "dark"], strong: ["normal", "fighting"] },
	bug: {
		weak: ["fire", "flying", "rock"],
		strong: ["grass", "psychic", "dark"],
	},
	fighting: {
		weak: ["flying", "psychic", "fairy"],
		strong: ["normal", "ice", "rock", "dark", "steel"],
	},
	steel: {
		weak: ["fire", "fighting", "ground"],
		strong: ["ice", "rock", "fairy"],
	},
	dark: { weak: ["fighting", "bug", "fairy"], strong: ["ghost", "psychic"] },
	fairy: { weak: ["poison", "steel"], strong: ["fighting", "dragon", "dark"] },
	ground: {
		weak: ["water", "grass", "ice"],
		strong: ["fire", "electric", "poison", "rock", "steel"],
	},
};

const STAT_CONFIG = [
	{ key: "hp", label: "HP" },
	{ key: "attack", label: "ATK" },
	{ key: "defense", label: "DEF" },
	{ key: "specialAttack", label: "SP.ATK" },
	{ key: "specialDefense", label: "SP.DEF" },
	{ key: "speed", label: "SPD" },
] as const;

interface EvoNode {
	id: number;
	name: string;
}

async function fetchEvolutionChain(id: number): Promise<EvoNode[]> {
	const speciesRes = await fetch(
		`https://pokeapi.co/api/v2/pokemon-species/${id}`,
	);
	const species = await speciesRes.json();
	const chainRes = await fetch(species.evolution_chain.url);
	const chainData = await chainRes.json();

	const chain: EvoNode[] = [];
	let current = chainData.chain;
	while (current) {
		const urlParts = current.species.url.split("/").filter(Boolean);
		const speciesId = Number(urlParts[urlParts.length - 1]);
		chain.push({ id: speciesId, name: current.species.name });
		current = current.evolves_to?.[0] ?? null;
	}
	return chain;
}

function computeWeakStrong(types: string[]) {
	const weakSet = new Set<string>();
	const strongSet = new Set<string>();
	for (const t of types) {
		TYPE_CHART[t]?.weak.forEach((w) => weakSet.add(w));
		TYPE_CHART[t]?.strong.forEach((s) => strongSet.add(s));
	}
	weakSet.forEach((w) => {
		if (strongSet.has(w)) {
			weakSet.delete(w);
			strongSet.delete(w);
		}
	});
	return { weak: [...weakSet], strong: [...strongSet] };
}

export function PokemonModal({ pokemon, onClose }: Props) {
	const [evoChain, setEvoChain] = useState<EvoNode[]>([]);
	const [evoLoading, setEvoLoading] = useState(false);

	useEffect(() => {
		if (!pokemon) return;
		setEvoChain([]);
		setEvoLoading(true);
		fetchEvolutionChain(pokemon.id)
			.then(setEvoChain)
			.finally(() => setEvoLoading(false));
	}, [pokemon?.id]);

	if (!pokemon) return null;

	const num = String(pokemon.id).padStart(3, "0");
	const artwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
	const primary = pokemon.types[0];
	const typeColor = `var(--type-${primary})`;
	const { weak, strong } = computeWeakStrong(pokemon.types);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<div
				className="relative w-full overflow-hidden rounded-2xl"
				style={{
					maxWidth: "660px",
					background: `color-mix(in srgb, ${typeColor} 7%, white)`,
					border: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
					boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full font-pokemon text-[10px] text-zinc-500 transition hover:bg-zinc-200"
					style={{
						background: "rgba(255,255,255,0.85)",
						border: "0.5px solid rgba(0,0,0,0.08)",
					}}
				>
					✕
				</button>

				<div className="flex">
					<div
						className="relative flex shrink-0 flex-col items-center justify-center gap-2 overflow-hidden p-5"
						style={{ width: "190px" }}
					>
						<span
							className="font-pokemon pointer-events-none absolute select-none"
							style={{
								right: "-10px",
								bottom: "-16px",
								fontSize: "80px",
								color: typeColor,
								opacity: 0.08,
								lineHeight: 1,
							}}
						>
							{num}
						</span>

						<img
							src={artwork}
							alt={pokemon.name}
							className="relative h-24 w-24"
						/>
						<span
							className="font-pokemon text-[7px]"
							style={{
								color: `color-mix(in srgb, ${typeColor} 55%, transparent)`,
							}}
						>
							#{num}
						</span>
						<h2
							className="font-pokemon capitalize"
							style={{
								fontSize: "11px",
								color: "var(--pk-ink, #1a1a1a)",
								margin: 0,
							}}
						>
							{pokemon.name}
						</h2>
						<div className="flex gap-1.5">
							{pokemon.types.map((t) => (
								<span
									key={t}
									className="font-pokemon capitalize text-white"
									style={{
										background: `var(--type-${t})`,
										fontSize: "7px",
										padding: "3px 9px",
										borderRadius: "999px",
									}}
								>
									{t}
								</span>
							))}
						</div>
						<div className="flex gap-3 mt-1">
							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{pokemon.hp}{" "}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									hp
								</span>
							</span>
							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{(pokemon.height / 10).toFixed(1)}m{" "}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									ht
								</span>
							</span>
							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{ROMAN[pokemon.generation]}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									{" "}
									gen
								</span>
							</span>
						</div>
					</div>

					<div
						className="flex flex-1 flex-col"
						style={{
							borderLeft: `0.5px solid color-mix(in srgb, ${typeColor} 20%, transparent)`,
							minWidth: 0,
						}}
					>
						<div className="p-4 pb-3">
							<p
								className="mb-2 font-pokemon text-zinc-400"
								style={{ fontSize: "6px", letterSpacing: "0.1em" }}
							>
								BASE STATS
							</p>
							<div className="flex flex-col gap-1.5">
								{STAT_CONFIG.map(({ key, label }) => {
									const value = pokemon[key] as number;
									const pct = Math.round((value / 255) * 100);
									return (
										<div key={key} className="flex items-center gap-2">
											<span
												className="font-pokemon text-zinc-400"
												style={{ fontSize: "6px", width: "44px" }}
											>
												{label}
											</span>
											<span
												className="font-pokemon text-zinc-700"
												style={{
													fontSize: "7px",
													width: "20px",
													textAlign: "right",
												}}
											>
												{value}
											</span>
											<div
												className="flex-1 overflow-hidden rounded-full"
												style={{ background: "rgba(0,0,0,0.07)" }}
											>
												<div
													className="rounded-full"
													style={{
														width: `${pct}%`,
														height: "5px",
														background: typeColor,
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div
							style={{
								height: "0.5px",
								background: `color-mix(in srgb, ${typeColor} 15%, transparent)`,
								margin: "0 16px",
							}}
						/>

						<div className="p-4 py-3">
							<div className="mb-2">
								<p
									className="mb-1.5 font-pokemon text-zinc-400"
									style={{ fontSize: "6px", letterSpacing: "0.1em" }}
								>
									weak against
								</p>
								<div className="flex flex-wrap gap-1">
									{weak.length === 0 ? (
										<span
											className="font-pokemon text-zinc-300"
											style={{ fontSize: "6px" }}
										>
											—
										</span>
									) : (
										weak.map((t) => (
											<span
												key={t}
												className="font-pokemon capitalize text-white"
												style={{
													background: `var(--type-${t})`,
													fontSize: "6px",
													padding: "2px 7px",
													borderRadius: "999px",
												}}
											>
												{t} ×2
											</span>
										))
									)}
								</div>
							</div>
							<div>
								<p
									className="mb-1.5 font-pokemon text-zinc-400"
									style={{ fontSize: "6px", letterSpacing: "0.1em" }}
								>
									strong against
								</p>
								<div className="flex flex-wrap gap-1">
									{strong.length === 0 ? (
										<span
											className="font-pokemon text-zinc-300"
											style={{ fontSize: "6px" }}
										>
											—
										</span>
									) : (
										strong.map((t) => (
											<span
												key={t}
												className="font-pokemon capitalize text-white"
												style={{
													background: `var(--type-${t})`,
													fontSize: "6px",
													padding: "2px 7px",
													borderRadius: "999px",
												}}
											>
												{t}
											</span>
										))
									)}
								</div>
							</div>
						</div>

						<div
							style={{
								height: "0.5px",
								background: `color-mix(in srgb, ${typeColor} 15%, transparent)`,
								margin: "0 16px",
							}}
						/>

						<div className="p-4 py-3">
							<p
								className="mb-2 font-pokemon text-zinc-400"
								style={{ fontSize: "6px", letterSpacing: "0.1em" }}
							>
								EVOLUTION CHAIN
							</p>
							{evoLoading ? (
								<span
									className="font-pokemon text-zinc-400"
									style={{ fontSize: "6px" }}
								>
									loading...
								</span>
							) : evoChain.length <= 1 ? (
								<span
									className="font-pokemon text-zinc-300"
									style={{ fontSize: "6px" }}
								>
									no evolution chain
								</span>
							) : (
								<div className="flex items-center gap-2">
									{evoChain.map((evo, i) => {
										const isActive = evo.id === pokemon.id;
										const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`;
										return (
											<div key={evo.id} className="flex items-center gap-2">
												{i > 0 && (
													<span
														className="font-pokemon text-zinc-400"
														style={{ fontSize: "7px", flexShrink: 0 }}
													>
														→
													</span>
												)}
												<div
													className="flex flex-col items-center gap-1"
													style={{
														background: isActive
															? `color-mix(in srgb, ${typeColor} 12%, white)`
															: "transparent",
														border: isActive
															? `1px solid color-mix(in srgb, ${typeColor} 28%, transparent)`
															: "1px solid transparent",
														borderRadius: "8px",
														padding: "4px 5px",
													}}
												>
													<img
														src={sprite}
														alt={evo.name}
														style={{
															width: "36px",
															height: "36px",
															imageRendering: "pixelated",
														}}
													/>
													<span
														className="font-pokemon capitalize"
														style={{
															fontSize: "5px",
															color: isActive ? typeColor : "#aaa",
														}}
													>
														{evo.name}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
