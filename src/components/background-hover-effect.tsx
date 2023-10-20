'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils.ts';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/src/lib/hooks.ts';

const colors = [
	'bg-red-500',
	'bg-blue-500',
	'bg-white',
	'bg-green-500',
	'bg-pink-500',
	'bg-yellow-500',
	'bg-orange-500',
	'bg-purple-500',
];

export default function BackgroundHoverEffect() {
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
	const [randomCoordinates, setRandomCoordinates] = useState({ x: 0, y: 0 });
	const [color, setColor] = useState(colors[0]);
	const path = usePathname();
	const isMobile = useIsMobile();

	const handleMouseMove = (e: MouseEvent) => {
		setCoordinates({ x: e.x, y: e.y });
		setRandomCoordinates({
			x: Math.random() * e.x,
			y: Math.random() * e.y,
		});
	};
	const handleMouseClick = () => {
		setColor(colors[Math.floor(Math.random() * colors.length)]);
	};

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('click', handleMouseClick);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('click', handleMouseClick);
		};
	}, []);

	return (
		<>
			<div
				className={cn(
					`reveal-color pointer-events-none fixed z-20 h-[500px] w-[500px] rounded-full bg-opacity-30 mix-blend-color-dodge`,
					color
				)}
				style={{
					top: coordinates.y - 250,
					left: coordinates.x - 250,
					transition: 'background-color 0.5s ease-out',
					filter: 'blur(100px)',
					animation: '',
				}}
				suppressHydrationWarning={true}
			/>
			{path === '/' && !isMobile && (
				<>
					<div
						className={cn(
							`pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-blue-500 mix-blend-color transition-all duration-200`
						)}
						style={{
							top: (randomCoordinates.y - 250) * Math.random(),
							right: (randomCoordinates.x - 250) * Math.random(),
							filter: 'blur(100px)',
						}}
					/>
					<div
						className={cn(
							`pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-green-500 mix-blend-color transition-all duration-500`
						)}
						style={{
							top: (randomCoordinates.y - 250) * Math.random(),
							left: (randomCoordinates.x - 250) * Math.random(),
							filter: 'blur(100px)',
						}}
					/>
					<div
						className={cn(
							`duration-800 pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-yellow-500 mix-blend-color transition-all`
						)}
						style={{
							top: (randomCoordinates.y - 250) * Math.random(),
							right: (randomCoordinates.x - 250) * Math.random(),
							filter: 'blur(100px)',
						}}
					/>
					<div
						className={cn(
							`pointer-events-none fixed z-10 h-[500px] w-[500px] rounded-full bg-orange-500 mix-blend-color transition-all duration-1000`
						)}
						style={{
							top: (randomCoordinates.y - 250) * Math.random(),
							left: (randomCoordinates.x - 250) * Math.random(),
							filter: 'blur(100px)',
						}}
					/>
				</>
			)}
		</>
	);
}
