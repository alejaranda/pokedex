import { useMemo } from "react";
import type { Pokemon } from "../lib/pokemon";

export function usePokemonFilters(
  pokemon: Pokemon[],
  query: string,
  typeFilter: string,
) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();

    return pokemon.filter((p) => {
      const matchName =
        !q || p.name.includes(q);

      const matchType =
        !typeFilter ||
        p.types.includes(typeFilter);

      return matchName && matchType;
    });
  }, [pokemon, query, typeFilter]);
}
