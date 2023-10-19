'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils.ts';
import { usePathname } from 'next/navigation';

const colors = [
	'bg-red-500',
	'bg-blue-500',
	'bg-white',
	'bg-green-500',
	'bg-pink-500',
	'bg-yellow-500',
	'bg-orange-500',
	'bg-purple-500',
]

export default function BackgroundHoverEffect() {
	const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
	const [randomCoordinates, setRandomCoordinates] = useState({ x: 0, y: 0 });
	const [color, setColor] = useState(colors[0]);
	const path = usePathname()

	const handleMouseMove = (e: MouseEvent) => {
		setCoordinates({ x: e.x, y: e.y });
		setRandomCoordinates({
			x: Math.random() * e.x,
			y: Math.random() * e.y
		});
	};
	const handleMouseClick = () => {
		setColor(colors[Math.floor(Math.random() * colors.length)])
	}

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('click', handleMouseClick);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('click', handleMouseClick);
		};
	},[]);

	return (
		<>
		<div
			className={cn(
				`fixed w-[500px] h-[500px] z-10 rounded-full bg-opacity-30 mix-blend-color-dodge pointer-events-none`,
				color,
			)}
			style={{
				top: coordinates.y - 250,
				left: coordinates.x - 250,
				filter: 'blur(200px)',
				transition: 'background-color 0.5s ease-out',
			}}
			suppressHydrationWarning={true}
		/>
			{
				path === '/' && (
					<>
						<div
							className={cn(
								`fixed w-[500px] transition-all h-[500px] bg-blue-500 z-10 rounded-full mix-blend-color pointer-events-none duration-200`,
							)}
							style={{
								top: (randomCoordinates.y - 250) * Math.random(),
								right: (randomCoordinates.x - 250) * Math.random(),
								filter: 'blur(100px)',
							}}
						/>
						<div
							className={cn(
								`fixed w-[500px] transition-all h-[500px] bg-green-500 z-10 rounded-full mix-blend-color pointer-events-none duration-500`,
							)}
							style={{
								top: (randomCoordinates.y - 250) * Math.random(),
								left: (randomCoordinates.x - 250) * Math.random(),
								filter: 'blur(100px)',
							}}
						/>
						<div
							className={cn(
								`fixed w-[500px] transition-all h-[500px] bg-yellow-500 z-10 rounded-full mix-blend-color pointer-events-none duration-800`,
							)}
							style={{
								top: (randomCoordinates.y - 250) * Math.random(),
								right: (randomCoordinates.x - 250) * Math.random(),
								filter: 'blur(100px)',
							}}
						/>
						<div
							className={cn(
								`fixed w-[500px] transition-all h-[500px] bg-orange-500 z-10 rounded-full mix-blend-color pointer-events-none duration-1000`,
							)}
							style={{
								top: (randomCoordinates.y - 250) * Math.random(),
								left: (randomCoordinates.x - 250) * Math.random(),
								filter: 'blur(100px)',
							}}
						/>
					</>
				)
			}
		</>


	)
}
