import { useState } from "react";

import { GEN_RANGES } from "../lib/pokemon";

import { usePokemon } from "../hooks/usePokemon";
import { usePokemonFilters } from "../hooks/usePokemonFilters";

import { PokemonCard } from "./Card";
import { FilterDropdown } from "./FilterDropdown";
import { SearchBar } from "./SearchBar";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";

const ALL_TYPES = [
	"fire",
	"water",
	"grass",
	"electric",
	"poison",
	"flying",
	"psychic",
	"dragon",
	"normal",
	"ice",
	"rock",
	"ghost",
	"bug",
	"fighting",
	"steel",
	"dark",
	"fairy",
	"ground",
];

export default function Pokedex() {
	const [gen, setGen] = useState("");
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("");

	const { pokemon: allPokemon, loading: isLoading } = usePokemon(gen);

	const filtered = usePokemonFilters(allPokemon, query, typeFilter);

	const typeColor = typeFilter ? `var(--type-${typeFilter})` : undefined;

	const genOptions = Object.keys(GEN_RANGES).map((g) => ({
		value: g,
		label: `Gen ${g}`,
	}));

	const typeOptions = ALL_TYPES.map((type) => ({
		value: type,
		label: type,
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
				/>

				{(gen || query || typeFilter) && (
					<button
						onClick={() => {
							setGen("");
							setQuery("");
							setTypeFilter("");
						}}
						className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-pokemon text-[7px] text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
					>
						clear ✕
					</button>
				)}

				<span className="ml-auto whitespace-nowrap font-pokemon text-[6px] text-zinc-400">
					{isLoading
						? `loading ${gen ? ` gen ${gen}` : ""}...`
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
