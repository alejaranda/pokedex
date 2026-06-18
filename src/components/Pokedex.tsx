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

	const { pokemon: allPokemon, loading: isLoading } = usePokemon(gen);
	const filtered = usePokemonFilters(
		allPokemon,
		query,
		typeFilter,
		sortKey,
		sortDirection,
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
					onChange={(v) => setSortKey((v || "id") as SortKey)}
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

				{(gen || query || typeFilter || sortKey !== "id") && (
					<button
						onClick={() => {
							setGen("");
							setQuery("");
							setTypeFilter("");
							setSortKey("id");
							setSortDirection("asc");
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
