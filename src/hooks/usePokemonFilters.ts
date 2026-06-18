import { useMemo } from "react";
import { getStatTotal, type Pokemon, type SortKey } from "../lib/pokemon";

export type SortDirection = "asc" | "desc";

export function usePokemonFilters(
	pokemon: Pokemon[],
	query: string,
	typeFilter: string,
	sortKey: SortKey = "id",
	sortDirection: SortDirection = "asc",
) {
	return useMemo(() => {
		const q = query.toLowerCase().trim();

		const filtered = pokemon.filter((p) => {
			const matchName = !q || p.name.includes(q);
			const matchType = !typeFilter || p.types.includes(typeFilter);
			return matchName && matchType;
		});

		const getValue = (p: Pokemon): number | string => {
			if (sortKey === "name") return p.name;
			if (sortKey === "total") return getStatTotal(p);
			return p[sortKey];
		};

		const sorted = [...filtered].sort((a, b) => {
			const va = getValue(a);
			const vb = getValue(b);

			let comparison: number;
			if (typeof va === "string" && typeof vb === "string") {
				comparison = va.localeCompare(vb);
			} else {
				comparison = (va as number) - (vb as number);
			}

			return sortDirection === "asc" ? comparison : -comparison;
		});

		return sorted;
	}, [pokemon, query, typeFilter, sortKey, sortDirection]);
}
