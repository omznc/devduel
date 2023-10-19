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
		<div className='w-full text-white group  items-center flex justify-center'>
			<div className='w-full overflow-hidden text-black dark:text-white lg:flex-row flex-col transition-all px-8 max-w-[1920px] lg:gap-24 gap-8 py-4 h-fit  items-center flex justify-between'>
				<h1
					className={cn(
						'text-7xl select-none cursor-pointer transition-all font-bold hover:font-black',
						inter.className
					)}
					onClick={() => {
						setIsAnimating(true);
					}}
				>
					DevDuel
				</h1>
				<ThemeToggle />
				<div className='flex font-mono text-2xl gap-4'>
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
				<div ref={rocketRef} className='z-0 absolute -left-20'>
					<BsRocketTakeoffFill className='rotate-45 w-16 h-16' />
				</div>
			</div>
		</div>
	);
}
