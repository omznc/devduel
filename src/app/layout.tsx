import { cn } from "@/src/lib/utils.ts";
import BackgroundHoverEffect from "@components/background-hover-effect.tsx";
import Footer from "@components/footer.tsx";
import Header from "@components/header.tsx";
import Providers from "@components/providers";
import Toast from "@components/toast.tsx";
import env from "@env";
import { getCurrentTask } from "@lib/task.ts";
import { TaskStatus } from "@prisma/client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import "./globals.css";

const mono = localFont({
	src: "../../public/fonts/MonaspaceNeon.ttf",
});

export const metadata: Metadata = {
	title: "DevDuel",
	description: "A place to duel your friends",
};

type RootLayoutProps = {
	children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
	const task = await getCurrentTask();
	const projectLive = env.NEXT_PUBLIC_PROJECT_IS_LIVE;

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					mono.className,
					"relative flex h-full w-full flex-col items-center justify-center overflow-x-hidden",
					"selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black",
					"bg-white dark:bg-black",
				)}
			>
				<BackgroundHoverEffect />
				<Toast />
				<Providers>
					{projectLive ? (
						<Header taskStatus={task?.status ?? TaskStatus.CLOSED} />
					) : (
						<div className="h-24 w-full" />
					)}
					<div
						className={cn(
							"pattern-dots absolute top-0 -z-10 h-[100%] w-screen pattern-bg-transparent pattern-neutral-500 pattern-opacity-20 pattern-size-6 dark:pattern-opacity-10",
							{},
						)}
					/>
					<div className="h-full min-h-screen w-full max-w-[1920px] px-4 transition-all">
						{children}
					</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
