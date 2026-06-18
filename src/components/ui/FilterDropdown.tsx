import { useEffect, useRef, useState } from "react";
import { TYPE_ICONS } from "../../lib/pokemonTypes";

function TypeIcon({ type, size = 10 }: { type: string; size?: number }) {
	const svg = TYPE_ICONS[type.toLowerCase()];
	if (!svg) return null;
	return (
		<span
			style={{
				width: size,
				height: size,
				display: "inline-flex",
				flexShrink: 0,
			}}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}

type Option = { value: string; label: string };

type FilterDropdownProps = {
	label: string;
	value: string;
	options: Option[];
	onChange: (value: string) => void;
	color?: string;
	showTypeIcons?: boolean;
};

export function FilterDropdown({
	label,
	value,
	options,
	onChange,
	color,
	showTypeIcons = false,
}: FilterDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = options.find((o) => o.value === value);
	const isActive = value !== "";
	const clearLabel = label === "Gen" ? "All" : "All";

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 rounded-lg border px-3 py-2 font-pokemon text-[7px] transition"
				style={
					isActive && color
						? { background: color, color: "white", borderColor: "transparent" }
						: undefined
				}
			>
				{isActive && showTypeIcons && (
					<TypeIcon type={selected?.value ?? ""} size={10} />
				)}
				{isActive ? selected?.label : label}
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					fill="none"
					className={`transition-transform ${open ? "rotate-180" : ""}`}
				>
					<path
						d="M1 2.5L4 5.5L7 2.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{open && (
				<div className="absolute left-0 top-full z-50 mt-1 min-w-32.5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
					<button
						onClick={() => {
							onChange("");
							setOpen(false);
						}}
						className={`w-full px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${value === "" ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
					>
						{clearLabel}
					</button>

					<div className="my-0.5 h-px bg-zinc-100" />

					{options.map((option) => {
						const isSelected = value === option.value;
						return (
							<button
								key={option.value}
								onClick={() => {
									onChange(option.value);
									setOpen(false);
								}}
								className={`flex w-full items-center gap-2 px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${isSelected ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
							>
								{showTypeIcons && <TypeIcon type={option.value} size={10} />}
								{option.label}
								{isSelected && (
									<svg
										width="8"
										height="8"
										viewBox="0 0 8 8"
										fill="none"
										className="ml-auto text-zinc-900"
									>
										<path
											d="M1 4L3 6L7 2"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
