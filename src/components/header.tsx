'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils.ts';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function Header() {
	const path = usePathname();
	const [hovering, setHovering] = useState(false);
	const [isScrollingUp, setIsScrollingUp] = useState(true);
	const [prevScrollY, setPrevScrollY] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		setIsMobile(window.innerWidth < 768);
	}, []);

	useEffect(() => {
		if (isMobile) return;
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY < prevScrollY) {
				setIsScrollingUp(true);
			} else {
				setIsScrollingUp(false);
			}
			setPrevScrollY(currentScrollY);
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isMobile, prevScrollY]);

	return (
		<div
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className='fixed group font-mono z-10 left-0 top-0 w-full gap-24 h-24 items-center flex justify-center'
		>
			<div
				className={cn(
					'flex p-1.5 md:p-2 transition-all gap-1 border border-black dark:border-white dark:border-opacity-25 border-opacity-25 rounded-full backdrop-blur-md dark:bg-opacity-25 bg-opacity-25 bg-white dark:bg-black',
					{
						'-translate-y-24 opacity-0': !isScrollingUp,
						'translate-y-0 opacity-100': isScrollingUp || hovering,
					}
				)}
			>
				{items
					.filter(
						i => !i?.protected || (i?.protected && session?.user)
					)
					.map(item => (
						<Link
							href={item.href}
							key={item.name}
							className={cn(
								'text-md md:text-lg rounded-full transition-all px-1.5 md:px-4 py-1 md:py-2 hover:bg-black hover:dark:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10',
								{
									'bg-black dark:bg-white text-white dark:text-black dark:hover:bg-opacity-100 hover:bg-opacity-100':
										(path.includes(item.href ?? '') &&
											item.href !== '/') ||
										path === item.href,
								}
							)}
							onClick={async e => {
								if (!session?.user && item.name === 'profile') {
									e.preventDefault();
									e.stopPropagation();
									await signIn('github');
								} else if (path === item.href) {
									e.preventDefault();
									e.stopPropagation();
									window?.scrollTo({
										top: 0,
										behavior: 'smooth',
									});
								}
							}}
						>
							{item.name !== 'profile'
								? item.name
								: session?.user
								? item.name
								: 'login'}
						</Link>
					))}
			</div>
		</div>
	);
}

const items = [
	{
		name: 'explore',
		href: '/explore',
		protected: false,
	},
	{
		name: 'leaderboard',
		href: '/leaderboard',
		protected: false,
	},
	{
		name: 'submit',
		href: '/submit',
		protected: true,
	},
	{
		name: 'home',
		href: '/',
		protected: false,
	},
	{
		name: 'profile',
		href: '/profile',
		protected: false,
	},
];
