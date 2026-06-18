import { useMemo } from "react";
import { getStatTotal, type Pokemon, type SortKey } from "../lib/pokemon";

export type SortDirection = "asc" | "desc";

function seededRandom(seed: number) {
	return () => {
		var t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
	const result = [...arr];
	const rand = seededRandom(seed);
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function usePokemonFilters(
	pokemon: Pokemon[],
	query: string,
	typeFilter: string,
	sortKey: SortKey = "id",
	sortDirection: SortDirection = "asc",
	shuffleSeed: number = 0,
) {
	return useMemo(() => {
		const q = query.toLowerCase().trim();

		const filtered = pokemon.filter((p) => {
			const matchName = !q || p.name.includes(q) || String(p.id).includes(q);
			const matchType = !typeFilter || p.types.includes(typeFilter);
			return matchName && matchType;
		});

		if (shuffleSeed !== 0) {
			return shuffleWithSeed(filtered, shuffleSeed);
		}

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
	}, [pokemon, query, typeFilter, sortKey, sortDirection, shuffleSeed]);
}
