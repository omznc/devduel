"use client";

import { useIsMobile } from "@/src/lib/hooks.ts";
import { cn } from "@/src/lib/utils.ts";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	PiArrowLeftDuotone,
	PiEyeDuotone,
	PiFolderSimplePlusDuotone,
	PiHouseDuotone,
	PiTrophyDuotone,
	PiUserDuotone,
	PiUserGearDuotone,
} from "react-icons/pi";
import { TaskStatus } from "@prisma/client";

export default function Header({ taskStatus }: { taskStatus: TaskStatus }) {
	const path = usePathname();
	const [hovering, setHovering] = useState(false);
	const [isScrollingUp, setIsScrollingUp] = useState(true);
	const [prevScrollY, setPrevScrollY] = useState(0);
	const isMobile = useIsMobile();
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user) return;
		if (!session.user?.username && path !== "/user/me/username") {
			console.log("Redirecting");
			router.push("/user/me/username");
		}
	}, [path, router, session]);

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
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMobile, prevScrollY]);

	// If we're on the top of the page, always show the header
	useEffect(() => {
		if (window.scrollY === 0) setIsScrollingUp(true);
	}, [path]);

	return (
		<>
			<div className="h-24 w-full"></div>
			<div
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				className={`group fixed top-0 z-40 flex h-24 w-fit ml-[50px] md:ml-[70px] items-center justify-center transition-all delay-300 ${
					isMobile === null ? "" : "fly-in"
				}`}
			>
				{isMobile !== null && (
					<>
						<div
							className={cn(
								"absolute -left-[50px] w-[80px] md:-left-[70px] md:w-[150px] border-normal flex items-start justify-start rounded-l-full bg-white bg-opacity-50 p-1.5 opacity-100 backdrop-blur-md transition-all dark:bg-black dark:bg-opacity-50 md:p-2.5",
								{
									"-translate-y-24 opacity-0": !isScrollingUp,
									"translate-y-0 opacity-100": isScrollingUp || hovering,
									"translate-x-10 opacity-0": path === "/",
								},
								"back-arrow",
							)}
						>
							<button
								className={cn(
									"text-md w-full inline-flex items-center justify-start gap-2 rounded-full p-2 px-2 transition-all hover:bg-black hover:bg-opacity-20 hover:dark:bg-white dark:hover:bg-opacity-50 md:p-3 md:px-4 md:text-lg",
								)}
								onClick={() => {
									router.back();
								}}
								aria-label="Go back"
							>
								<PiArrowLeftDuotone className={"h-6 w-auto -m-1"} />
							</button>
						</div>
						<div
							className={cn(
								"border-normal flex gap-1 rounded-full bg-white bg-opacity-25 p-1.5 backdrop-blur-md transition-all dark:bg-black dark:bg-opacity-25 md:justify-center md:p-2",
								{
									"-translate-y-24 opacity-0": !isScrollingUp,
									"translate-y-0 opacity-100": isScrollingUp || hovering,
									"-ml-16": path === "/",
								},
							)}
						>
							{items
								.filter((i) => {
									// I know this looks weird, but it does work
									if (i?.protected) {
										if (i?.admin) {
											return session?.user?.admin;
										}
										return session?.user;
									}
									if (i?.admin) {
										return session?.user?.admin;
									}
									return true;
								})
								.filter((item) => {
									if (item?.show && !session?.user?.admin) {
										return item?.show === taskStatus;
									}
									return true;
								})
								.map((item) => {
									const active =
										(path.includes(item.href ?? "") && item.href !== "/") ||
										path === item.href;
									return (
										<Link
											href={item.href}
											key={item.name}
											aria-label={item.name}
											className={cn(
												"text-md inline-flex items-center justify-center gap-2 rounded-full px-1.5 py-1 transition-all hover:bg-black hover:bg-opacity-10 hover:dark:bg-white dark:hover:bg-opacity-10 md:px-4 md:py-2 md:text-lg",
												{
													"bg-black text-white hover:bg-opacity-100 dark:bg-white dark:text-black dark:hover:bg-opacity-100":
														active,
												},
											)}
											onClick={async (e) => {
												if (!session?.user && item.name === "profile") {
													e.preventDefault();
													e.stopPropagation();
													await signIn("github");
												} else if (path === item.href) {
													e.preventDefault();
													e.stopPropagation();
													window?.scrollTo({
														top: 0,
														behavior: "smooth",
													});
												}
											}}
										>
											{item.icon}
											<span
												className={cn(
													"block text-md opacity-1 -ml-1 overflow-hidden transition-all",
													{
														"text-[0px] opacity-0": isMobile && !active,
													},
												)}
											>
												{item.name !== "profile"
													? item.name
													: session?.user
													  ? item.name
													  : "login"}
											</span>
										</Link>
									);
								})}
						</div>
					</>
				)}
			</div>
		</>
	);
}

const items = [
	{
		name: "home",
		href: "/",
		icon: <PiHouseDuotone className="h-6 w-auto" />,
	},
	{
		name: "explore",
		href: "/explore",
		icon: <PiEyeDuotone className="h-6 w-auto" />,
		show: TaskStatus.VOTING,
	},
	{
		name: "winners",
		href: "/winners",
		icon: <PiTrophyDuotone className="h-6 w-auto" />,
	},
	{
		name: "submit",
		href: "/submit",
		icon: <PiFolderSimplePlusDuotone className="h-6 w-auto" />,
		protected: true,
	},
	{
		name: "profile",
		href: "/user/me",
		icon: <PiUserDuotone className="h-6 w-auto" />,
	},
	{
		name: "admin",
		href: "/admin",
		icon: <PiUserGearDuotone className="h-6 w-auto" />,
		protected: true,
		admin: true,
	},
] as {
	name: string;
	href: string;
	icon: JSX.Element;
	protected?: boolean;
	admin?: boolean;
	show?: TaskStatus;
}[];
