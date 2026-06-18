import { useEffect, useMemo, useState } from "react";
import { fetchGen, GEN_RANGES, type Pokemon } from "../lib/pokemon";

export function usePokemon(gen: string) {
	const [cache, setCache] = useState<Record<number, Pokemon[]>>({});

	const [loadingGens, setLoadingGens] = useState<Set<number>>(new Set());

	const gensToLoad =
		gen === "" ? Object.keys(GEN_RANGES).map(Number) : [Number(gen)];

	useEffect(() => {
		const missing = gensToLoad.filter((g) => !cache[g] && !loadingGens.has(g));

		if (missing.length === 0) {
			return;
		}

		setLoadingGens((prev) => new Set([...prev, ...missing]));

		missing.forEach((g) => {
			fetchGen(g).then((data) => {
				setCache((prev) => ({
					...prev,
					[g]: data,
				}));

				setLoadingGens((prev) => {
					const next = new Set(prev);
					next.delete(g);
					return next;
				});
			});
		});
	}, [gen]);

	const pokemon = useMemo(() => {
		return gensToLoad.flatMap((g) => cache[g] ?? []);
	}, [cache, gen]);

	const loading = gensToLoad.some((g) => !cache[g]);

	return {
		pokemon,
		loading,
	};
}
