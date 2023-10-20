'use client';

import Link from 'next/link';
import ThemeToggle from '@components/theme-toggle.tsx';
import { BsRocketTakeoffFill } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/src/lib/utils.ts';
import { useIsMobile } from '@/src/lib/hooks.ts';
import {
	PiArrowSquareInDuotone,
	PiArrowSquareOutDuotone,
	PiArrowUpRightDuotone,
	PiDiscordLogoDuotone,
	PiGithubLogoDuotone,
	PiTriangleDuotone,
	PiTwitterLogoDuotone,
} from 'react-icons/pi';
import { IoLogoVercel } from 'react-icons/io5';

const inter = Inter({ subsets: ['latin'] });

export default function Footer() {
	const rocketRef = useRef<HTMLDivElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const isMobile = useIsMobile();

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
		<div className='flex w-full  items-center justify-center text-white'>
			<div className='flex h-fit w-full max-w-[1920px] flex-col items-center justify-between gap-8 overflow-hidden px-8 py-4 text-black transition-all dark:text-white md:flex-row lg:gap-24'>
				<h1
					className={cn(
						'flex cursor-pointer select-none flex-col text-7xl font-bold transition-all hover:font-black',
						inter.className
					)}
					onClick={() => {
						setIsAnimating(true);
					}}
				>
					DevDuel
					<Link
						href={
							'https://vercel.com?utm_source=devduel&utm_campaign=oss'
						}
						target={'_blank'}
						className='group ml-1 inline-flex items-center gap-1 text-sm font-normal opacity-80 hover:underline'
					>
						powered by <IoLogoVercel />{' '}
						<span className='font-bold'>Vercel</span>
						<PiArrowUpRightDuotone className='opacity-0 transition-all group-hover:opacity-100' />
					</Link>
				</h1>
				{!isMobile && (
					<>
						<ThemeToggle />
						<div className='z-10 flex h-fit items-center gap-2 p-2 transition-all'>
							<Link
								href={'#'}
								className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiTwitterLogoDuotone />
							</Link>
							<Link
								href={'#'}
								className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiDiscordLogoDuotone />
							</Link>
							<Link
								href={'#'}
								className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiGithubLogoDuotone />
							</Link>
						</div>
					</>
				)}
				{isMobile && (
					<div className='g-2 flex w-full justify-between'>
						<ThemeToggle />
						<div className='border-normal z-10 mr-0 flex h-fit items-center gap-2 rounded-full p-2 backdrop-blur-lg transition-all md:mr-[150px]'>
							<Link
								href={'#'}
								className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiTwitterLogoDuotone />
							</Link>
							<Link
								href={'#'}
								className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiDiscordLogoDuotone />
							</Link>
							<Link
								href={'#'}
								className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:underline hover:opacity-100 md:h-10 md:w-10'
							>
								<PiGithubLogoDuotone />
							</Link>
						</div>
					</div>
				)}
				<div ref={rocketRef} className='absolute -left-20 z-20'>
					<BsRocketTakeoffFill className='h-16 w-16 rotate-45' />
				</div>
			</div>
		</div>
	);
}
