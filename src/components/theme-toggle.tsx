import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaTv } from 'react-icons/fa6';
import { cn } from '@/src/lib/utils.ts';
import { useEffect, useState } from 'react';
import {
	PiComputerTowerDuotone,
	PiHouseDuotone,
	PiMoonDuotone,
	PiSunDuotone,
} from 'react-icons/pi';
import React from 'preact/compat';

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<div className='border-normal z-10 flex items-center gap-2 rounded-full p-2 backdrop-blur-lg transition-all'>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100',
					{
						'bg-black text-white opacity-100 dark:bg-white dark:text-black':
							mounted && theme === 'light',
					}
				)}
				onClick={() => setTheme('light')}
			>
				<PiSunDuotone />
			</span>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100',
					{
						'bg-black text-white opacity-100 dark:bg-white dark:text-black':
							mounted ? theme == 'system' : true,
					}
				)}
				onClick={() => setTheme('system')}
			>
				<PiHouseDuotone />
			</span>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100',
					{
						'bg-black text-white opacity-100 dark:bg-white dark:text-black':
							mounted && theme === 'dark',
					}
				)}
				onClick={() => setTheme('dark')}
			>
				<PiMoonDuotone />
			</span>
		</div>
	);
}
