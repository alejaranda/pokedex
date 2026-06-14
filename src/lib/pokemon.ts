const API_URL = "https://pokeapi.co/api/v2";

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
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
  };
}

export async function getPokemonList(): Promise<Pokemon[]> {
  const { results } = await fetchJson<PokemonListResponse>(
    `${API_URL}/pokemon?limit=1025`
  );

  const pokemonDetails = await Promise.all(
    results.map(({ url }) =>
      fetchJson<PokemonDetailResponse>(url)
    )
  );

  return pokemonDetails.map(mapPokemon);
}
