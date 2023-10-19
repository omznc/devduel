'use client';

import Link from 'next/link';
import ThemeToggle from '@components/theme-toggle.tsx';
import { BsRocketTakeoffFill } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/src/lib/utils.ts';

const inter = Inter({ subsets: ['latin'] });

export default function Footer() {
	const rocketRef = useRef<HTMLDivElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isAnimating) {
			rocketRef.current?.classList.add('animate-rocket');
			setTimeout(() => {
				rocketRef.current?.classList.remove('animate-rocket');
				setIsAnimating(false);
			}, 1000);
		}
	}, [isAnimating]);
	return (
		<div className='group flex w-full  items-center justify-center text-white'>
			<div
				className='flex h-fit w-full max-w-[1920px] flex-col items-center justify-between gap-8 overflow-hidden px-8 py-4 text-black transition-all  dark:text-white lg:flex-row lg:gap-24'>
				<h1
					className={cn(
						'cursor-pointer select-none text-7xl font-bold transition-all hover:font-black',
						inter.className,
					)}
					onClick={() => {
						setIsAnimating(true);
					}}
				>
					DevDuel
				</h1>
				<ThemeToggle />
				<div className='flex gap-4 font-mono text-2xl'>
					<Link href={'#'} className='hover:underline'>
						Twitter
					</Link>
					<Link href={'#'} className='hover:underline'>
						Discord
					</Link>
					<Link href={'#'} className='hover:underline'>
						GitHub
					</Link>
				</div>
				<div ref={rocketRef} className='absolute -left-20 z-0'>
					<BsRocketTakeoffFill className='h-16 w-16 rotate-45' />
				</div>
			</div>
		</div>
	);
}
