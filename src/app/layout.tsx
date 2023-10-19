import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from '@components/providers';
import { cn } from '@/src/lib/utils.ts';
import BackgroundWhite from '@public/background-white.webp';
import Image from 'next/image';
import Header from '@components/header.tsx';
import Footer from '@components/footer.tsx';

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
					'relative w-full h-full flex flex-col items-center justify-center',
					'selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black',
					'bg-white dark:bg-black'
				)}
			>
				<Providers>
					<Header />
					<div
						className={cn(
							'w-screen h-[100%] -z-10 absolute top-0 pattern-dots  pattern-neutral-500 pattern-bg-transparent pattern-opacity-10 pattern-size-6'
						)}
					/>
					<div className='transition-all font-mono min-h-screen w-full max-w-[1920px] h-full px-4'>
						{children}
					</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
