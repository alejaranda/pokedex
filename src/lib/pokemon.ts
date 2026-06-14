const API_URL = "https://pokeapi.co/api/v2";

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
  generation: number;
}

export const GEN_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

export function getGeneration(id: number): number {
  for (const [gen, [start, end]] of Object.entries(GEN_RANGES)) {
    if (id >= start && id <= end) {
      return Number(gen);
    }
  }

  return 1;
}

interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function mapPokemon(detail: PokemonDetailResponse): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    types: detail.types.map(({ type }) => type.name),
    hp:
      detail.stats.find(({ stat }) => stat.name === "hp")?.base_stat ?? 0,
    generation: getGeneration(detail.id),
  };
}

export async function getPokemonList(): Promise<Pokemon[]> {
  const { results } = await fetchJson<PokemonListResponse>(
    `${API_URL}/pokemon?limit=1025`
  );

  const pokemonDetails = await Promise.all(
    results.map(({ url }) => fetchJson<PokemonDetailResponse>(url))
  );

  return pokemonDetails.map(mapPokemon);
}

export async function fetchGen(gen: number): Promise<Pokemon[]> {
  const allPokemon = await getPokemonList();

  return allPokemon.filter(
    (pokemon) => pokemon.generation === gen
  );
}
