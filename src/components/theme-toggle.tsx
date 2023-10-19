import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaTv } from 'react-icons/fa6';
import { cn } from '@/src/lib/utils.ts';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<div className='flex z-10 backdrop-blur-lg transition-all items-center gap-2 rounded-full border border-black dark:border-white border-opacity-25 dark:border-opacity-25 p-2'>
			<span
				className={cn(
					'text-2xl cursor-pointer transition-all p-1 w-10 h-10 rounded-full flex justify-center items-center',
					{
						'bg-black text-white dark:bg-white dark:text-black':
							mounted && theme === 'light',
					}
				)}
				onClick={() => setTheme('light')}
			>
				<FaSun />
			</span>
			<span
				className={cn(
					'text-2xl cursor-pointer transition-all p-1 w-10 h-10 rounded-full flex justify-center items-center',
					{
						'bg-black text-white dark:bg-white dark:text-black':
							mounted ? theme == 'system' : true,
					}
				)}
				onClick={() => setTheme('system')}
			>
				<FaTv />
			</span>
			<span
				className={cn(
					'text-2xl cursor-pointer transition-all p-1 w-10 h-10 rounded-full flex justify-center items-center',
					{
						'bg-black text-white dark:bg-white dark:text-black':
							mounted && theme === 'dark',
					}
				)}
				onClick={() => setTheme('dark')}
			>
				<FaMoon />
			</span>
		</div>
	);
}
