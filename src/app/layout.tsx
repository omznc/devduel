import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from '@components/providers';
import { cn } from '@/src/lib/utils.ts';
import Header from '@components/header.tsx';
import Footer from '@components/footer.tsx';
import BackgroundHoverEffect from '@components/background-hover-effect.tsx';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'DevDuel',

	description: 'A place to duel your friends',
};

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={cn(
					jetbrainsMono.className,
					inter.className,
					'relative flex h-full w-full flex-col items-center justify-center',
					'selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black',
					'bg-white dark:bg-black'
				)}
			>
				<BackgroundHoverEffect />
				<Providers>
					<Header />
					<div
						className={cn(
							'pattern-dots absolute top-0 -z-10 h-[100%] w-screen pattern-bg-transparent pattern-neutral-500 pattern-opacity-20 pattern-size-6 dark:pattern-opacity-10'
						)}
					/>

					<div className='h-full min-h-screen w-full max-w-[1920px] px-4 font-mono transition-all'>
						{children}
					</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
