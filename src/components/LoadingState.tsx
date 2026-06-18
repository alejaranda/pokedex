import { useEffect, useState } from "react";

const POOL = [1, 4, 7, 25, 39, 52, 54, 63, 79, 94, 129, 131, 143, 147, 150];

type Props = {
	generation?: string;
};

export function LoadingState({ generation }: Props) {
	const [pokemonId, setPokemonId] = useState(
		() => POOL[Math.floor(Math.random() * POOL.length)],
	);
	const [name, setName] = useState("");
	const [dots, setDots] = useState(".");

	useEffect(() => {
		fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
			.then((r) => r.json())
			.then((d) => setName(d.name))
			.catch(() => setName(""));
	}, [pokemonId]);

	useEffect(() => {
		const interval = setInterval(() => {
			setPokemonId(POOL[Math.floor(Math.random() * POOL.length)]);
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			i = (i + 1) % 4;
			setDots(".".repeat(i + 1));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

	return (
		<div className="flex flex-col items-center justify-center gap-5 py-24">
			<div className="flex flex-col items-center gap-1">
				<img
					src={sprite}
					alt={name}
					className="pixelated h-24 w-24 animate-bounce"
					style={{ animationDuration: "0.6s" }}
				/>
				<div
					className="h-1.5 w-10 rounded-full bg-zinc-300"
					style={{
						animation: "shadow-pulse 0.6s ease-in-out infinite",
					}}
				/>
			</div>

			<div className="text-center">
				<p className="font-pokemon text-[9px] text-zinc-400">
					{generation
						? `Loading gen ${generation}`
						: "Loading all generation of pokemon"}
					<span>{dots}</span>
				</p>
			</div>

			<style>{`
        @keyframes shadow-pulse {
          0%, 100% { transform: scaleX(1); opacity: 0.35; }
          50% { transform: scaleX(0.55); opacity: 0.15; }
        }
      `}</style>
		</div>
	);
}
