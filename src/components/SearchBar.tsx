type Props = {
	value: string;
	onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
	return (
		<div className="relative flex-1 sm:max-w-xs">
			<svg
				className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
			>
				<circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" />

				<path
					d="M8 8L10.5 10.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>

			<input
				type="search"
				placeholder="Search pokémon..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-3 font-pokemon text-[7px] text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
			/>
		</div>
	);
}
