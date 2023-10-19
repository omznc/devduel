import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaTv } from 'react-icons/fa6';
import { cn } from '@/src/lib/utils.ts';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<div className='z-10 flex items-center gap-2 rounded-full p-2 backdrop-blur-lg transition-all border-normal'>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl transition-all opacity-80 hover:opacity-100',
					{
						'bg-black text-white dark:bg-white dark:text-black opacity-100':
							mounted && theme === 'light',
					}
				)}
				onClick={() => setTheme('light')}
			>
				<FaSun />
			</span>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl transition-all opacity-80 hover:opacity-100',
					{
						'bg-black text-white dark:bg-white dark:text-black opacity-100':
							mounted ? theme == 'system' : true,
					}
				)}
				onClick={() => setTheme('system')}
			>
				<FaTv />
			</span>
			<span
				className={cn(
					'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-2xl transition-all opacity-80 hover:opacity-100',
					{
						'bg-black text-white dark:bg-white dark:text-black opacity-100':
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
