'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils.ts';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import {
	PiEyeDuotone,
	PiFolderSimplePlusDuotone,
	PiHouseDuotone,
	PiTrophyDuotone,
	PiUserDuotone,
} from 'react-icons/pi';
import { useIsMobile } from '@/src/lib/hooks.ts';

export default function Header() {
	const path = usePathname();
	const [hovering, setHovering] = useState(false);
	const [isScrollingUp, setIsScrollingUp] = useState(true);
	const [prevScrollY, setPrevScrollY] = useState(0);
	const isMobile = useIsMobile();
	const { data: session } = useSession();

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

	if (isMobile === null) return null;

	return (
		<div
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className='fly-in group fixed left-0 top-0 z-10 flex h-24 w-full items-center justify-center gap-24 font-mono'
		>
			<div
				className={cn(
					'border-normal flex gap-1 rounded-full bg-white bg-opacity-25 p-1.5 backdrop-blur-md transition-all dark:bg-black dark:bg-opacity-25 md:justify-center md:p-2',
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
					.map(item => {
						const active =
							(path.includes(item.href ?? '') &&
								item.href !== '/') ||
							path === item.href;
						return (
							<Link
								href={item.href}
								key={item.name}
								className={cn(
									'text-md inline-flex items-center justify-center gap-2 rounded-full px-1.5 py-1 transition-all hover:bg-black hover:bg-opacity-10 hover:dark:bg-white dark:hover:bg-opacity-10 md:px-4 md:py-2 md:text-lg',
									{
										'bg-black text-white hover:bg-opacity-100 dark:bg-white dark:text-black dark:hover:bg-opacity-100':
											active,
									}
								)}
								onClick={async e => {
									if (
										!session?.user &&
										item.name === 'profile'
									) {
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
								{item.icon}
								<span
									className={cn('block transition-all', {
										hidden: isMobile && !active,
									})}
								>
									{item.name !== 'profile'
										? item.name
										: session?.user
										? item.name
										: 'login'}
								</span>
							</Link>
						);
					})}
			</div>
		</div>
	);
}

const items = [
	{
		name: 'explore',
		href: '/explore',
		icon: <PiEyeDuotone className='h-6 w-auto' />,
		protected: false,
	},
	{
		name: 'leaderboard',
		href: '/leaderboard',
		icon: <PiTrophyDuotone className='h-6 w-auto' />,
		protected: false,
	},
	{
		name: 'home',
		href: '/',
		icon: <PiHouseDuotone className='h-6 w-auto' />,
		protected: false,
	},
	{
		name: 'submit',
		href: '/submit',
		icon: <PiFolderSimplePlusDuotone className='h-6 w-auto' />,
		protected: true,
	},
	{
		name: 'profile',
		href: '/@me',
		icon: <PiUserDuotone className='h-6 w-auto' />,
		protected: false,
	},
];
