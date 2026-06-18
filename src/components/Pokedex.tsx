import { useState } from "react";
import { GEN_RANGES, SORT_OPTIONS, type SortKey } from "../lib/pokemon";
import { usePokemon } from "../hooks/usePokemon";
import {
	usePokemonFilters,
	type SortDirection,
} from "../hooks/usePokemonFilters";
import { PokemonCard } from "./pokemon/PokemonCard";
import { FilterDropdown } from "./ui/FilterDropdown";
import { SearchBar } from "./ui/SearchBar";
import { LoadingState } from "./ui/LoadingState";
import { EmptyState } from "./ui/EmptyState";
import { ALL_TYPES } from "../lib/pokemon";

export default function Pokedex() {
	const [gen, setGen] = useState("");
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("id");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [shuffleSeed, setShuffleSeed] = useState(0);

	const { pokemon: allPokemon, loading: isLoading } = usePokemon(gen);
	const filtered = usePokemonFilters(
		allPokemon,
		query,
		typeFilter,
		sortKey,
		sortDirection,
		shuffleSeed,
	);

	const typeColor = typeFilter ? `var(--type-${typeFilter})` : undefined;

	const genOptions = Object.keys(GEN_RANGES).map((g) => ({
		value: g,
		label: `Gen ${g}`,
	}));

	const typeOptions = ALL_TYPES.map((type) => ({
		value: type,
		label: type,
	}));

	const sortOptions = SORT_OPTIONS.filter((o) => o.value !== "id").map((o) => ({
		value: o.value,
		label: o.label,
	}));

	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center gap-2">
				<SearchBar value={query} onChange={setQuery} />

				<FilterDropdown
					label="Gen"
					value={gen}
					options={genOptions}
					onChange={setGen}
				/>

				<FilterDropdown
					label="Type"
					value={typeFilter}
					options={typeOptions}
					onChange={setTypeFilter}
					color={typeColor}
					showTypeIcons
				/>

				<FilterDropdown
					label="Sort"
					value={sortKey === "id" ? "" : sortKey}
					options={sortOptions}
					onChange={(v) => {
						setSortKey((v || "id") as SortKey);
						setShuffleSeed(0);
					}}
				/>

				<button
					onClick={() =>
						setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
					}
					aria-label="Toggle sort direction"
					title={sortDirection === "asc" ? "Ascending" : "Descending"}
					className="flex h-6.75 w-6.75 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
				>
					<svg
						width="9"
						height="9"
						viewBox="0 0 12 12"
						fill="none"
						className={`transition-transform ${
							sortDirection === "desc" ? "rotate-180" : ""
						}`}
					>
						<path
							d="M6 2V10M6 2L3 5M6 2L9 5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				<button
					onClick={() =>
						setShuffleSeed(Math.floor(Math.random() * 1_000_000) + 1)
					}
					aria-label="Shuffle order"
					title="Random order"
					className={`flex h-6.75 w-6.75 items-center justify-center rounded-lg border transition ${
						shuffleSeed !== 0
							? "border-zinc-300 bg-zinc-100 text-zinc-700"
							: "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
					}`}
				>
					<svg width="9" height="9" viewBox="0 0 12 12" fill="none">
						<rect
							x="1.5"
							y="1.5"
							width="9"
							height="9"
							rx="1.5"
							stroke="currentColor"
							strokeWidth="1.3"
						/>
						<circle cx="4" cy="4" r="0.8" fill="currentColor" />
						<circle cx="8" cy="4" r="0.8" fill="currentColor" />
						<circle cx="6" cy="6" r="0.8" fill="currentColor" />
						<circle cx="4" cy="8" r="0.8" fill="currentColor" />
						<circle cx="8" cy="8" r="0.8" fill="currentColor" />
					</svg>
				</button>

				{(gen ||
					query ||
					typeFilter ||
					sortKey !== "id" ||
					shuffleSeed !== 0) && (
					<button
						onClick={() => {
							setGen("");
							setQuery("");
							setTypeFilter("");
							setSortKey("id");
							setSortDirection("asc");
							setShuffleSeed(0);
						}}
						className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-pokemon text-[7px] text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
					>
						clear ✕
					</button>
				)}

				<span className="ml-auto whitespace-nowrap font-pokemon text-[6px] text-zinc-400">
					{isLoading
						? `loading${gen ? ` gen ${gen}` : ""}...`
						: `${filtered.length} pokémon`}
				</span>
			</div>

			{isLoading && allPokemon.length === 0 ? (
				<LoadingState generation={gen} />
			) : filtered.length === 0 ? (
				<EmptyState />
			) : (
				<div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{filtered.map((p) => (
						<PokemonCard key={p.id} p={p} />
					))}
				</div>
			)}
		</div>
	);
}
