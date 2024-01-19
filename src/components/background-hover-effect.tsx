"use client";

import { useDebounce, useIsMobile } from "@/src/lib/hooks.ts";
import { cn } from "@/src/lib/utils.ts";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const colors = [
	"bg-red-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-pink-500",
	"bg-yellow-500",
	"bg-orange-500",
	"bg-purple-500",
	"bg-indigo-500",
];

export default function BackgroundHoverEffect() {
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
	const [randomCoordinates, setRandomCoordinates] = useState({ x: 0, y: 0 });
	const [color, setColor] = useState(colors[0]);
	const path = usePathname();
	const isMobile = useIsMobile();
	const debouncedRandomCoordinates = useDebounce(randomCoordinates, 300);

	const handleMouseMove = (e: MouseEvent) => {
		setCoordinates({ x: e.x, y: e.y });
		setRandomCoordinates({
			x: Math.random() * e.x,
			y: Math.random() * e.y,
		});
		if (e.buttons === 1) {
			const div = document.createElement("div");
			div.className = cn(
				"reveal-color fixed pointer-events-none fixed z-20 h-[100px] w-[100px] rounded-full dark:bg-opacity-100 bg-opacity-30 mix-blend-color-dodge",
				color,
			);
			div.style.top = `${e.y - 50}px`;
			div.style.left = `${e.x - 50}px`;
			div.style.transition = "background-color 0.5s ease-out";
			div.style.filter = "blur(200px)";
			div.style.animation = "";
			document.body.appendChild(div);
			setTimeout(() => {
				document.body.removeChild(div);
			}, 1000);
		}
	};
	const handleMouseClick = () => {
		setColor(colors[Math.floor(Math.random() * colors.length)]);
	};

	useEffect(() => {
		if (path !== "/" || isMobile) return;

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("click", handleMouseClick);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("click", handleMouseClick);
		};
	}, [path]);

	if (isMobile === null) return null;

	if (path !== "/") return null;

	return (
		<>
			<div
				className={cn(
					"reveal-color pointer-events-none fixed z-20 h-[500px] w-[500px] rounded-full bg-opacity-30 mix-blend-color-dodge",
					color,
				)}
				style={{
					top: coordinates.y - 250,
					left: coordinates.x - 250,
					transition: "background-color 0.5s ease-out",
					filter: "blur(100px)",
					animation: "",
				}}
				suppressHydrationWarning
			/>
			{path === "/" && !isMobile && (
				<>
					<div
						className={cn(
							"pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-blue-500 mix-blend-color transition-all duration-200",
						)}
						style={{
							top: (debouncedRandomCoordinates.y - 250) * Math.random(),
							right: (debouncedRandomCoordinates.x - 250) * Math.random(),
							filter: "blur(100px)",
						}}
						suppressHydrationWarning
					/>
					<div
						className={cn(
							"pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-green-500 mix-blend-color transition-all duration-500",
						)}
						style={{
							top: (debouncedRandomCoordinates.y - 250) * Math.random(),
							left: (debouncedRandomCoordinates.x - 250) * Math.random(),
							filter: "blur(100px)",
						}}
						suppressHydrationWarning
					/>
					<div
						className={cn(
							"duration-800 pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-yellow-500 mix-blend-color transition-all",
						)}
						style={{
							top: (debouncedRandomCoordinates.y - 250) * Math.random(),
							right: (debouncedRandomCoordinates.x - 250) * Math.random(),
							filter: "blur(100px)",
						}}
						suppressHydrationWarning
					/>
					<div
						className={cn(
							"pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-orange-500 mix-blend-color transition-all duration-1000",
						)}
						style={{
							top: (debouncedRandomCoordinates.y - 250) * Math.random(),
							left: (debouncedRandomCoordinates.x - 250) * Math.random(),
							filter: "blur(100px)",
						}}
						suppressHydrationWarning
					/>
				</>
			)}
		</>
	);
}
