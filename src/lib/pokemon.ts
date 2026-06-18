const API_URL = "https://pokeapi.co/api/v2";

export interface Pokemon {
	id: number;
	name: string;
	types: string[];
	hp: number;
	attack: number;
	defense: number;
	specialAttack: number;
	specialDefense: number;
	speed: number;
	height: number;
	weight: number;
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
	height: number;
	weight: number;
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
	const stat = (name: string) =>
		detail.stats.find(({ stat }) => stat.name === name)?.base_stat ?? 0;

	return {
		id: detail.id,
		name: detail.name,
		types: detail.types.map(({ type }) => type.name),
		hp: stat("hp"),
		attack: stat("attack"),
		defense: stat("defense"),
		specialAttack: stat("special-attack"),
		specialDefense: stat("special-defense"),
		speed: stat("speed"),
		height: detail.height,
		weight: detail.weight,
		generation: getGeneration(detail.id),
	};
}

export async function getPokemonList(): Promise<Pokemon[]> {
	const { results } = await fetchJson<PokemonListResponse>(
		`${API_URL}/pokemon?limit=1025`,
	);
	const pokemonDetails = await Promise.all(
		results.map(({ url }) => fetchJson<PokemonDetailResponse>(url)),
	);
	return pokemonDetails.map(mapPokemon);
}

// Antes: pedía la lista completa (1025 fetches) y filtraba en memoria.
// Ahora: pide solo los ids del rango de esa generación.
export async function fetchGen(gen: number): Promise<Pokemon[]> {
	const [start, end] = GEN_RANGES[gen];
	const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i);
	const pokemonDetails = await Promise.all(
		ids.map((id) =>
			fetchJson<PokemonDetailResponse>(`${API_URL}/pokemon/${id}`),
		),
	);
	return pokemonDetails.map(mapPokemon);
}

export const ALL_TYPES = [
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
] as const;

export type SortKey =
	| "id"
	| "name"
	| "hp"
	| "attack"
	| "defense"
	| "specialAttack"
	| "specialDefense"
	| "speed"
	| "total";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "id", label: "Number" },
	{ value: "name", label: "Name (A-Z)" },
	{ value: "total", label: "Total stats" },
	{ value: "hp", label: "HP" },
	{ value: "attack", label: "Attack" },
	{ value: "defense", label: "Defense" },
	{ value: "specialAttack", label: "Sp. Atk" },
	{ value: "specialDefense", label: "Sp. Def" },
	{ value: "speed", label: "Speed" },
];

export function getStatTotal(p: Pokemon): number {
	return (
		p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed
	);
}
