import { cn } from "@/src/lib/utils.ts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiHouseDuotone, PiMoonDuotone, PiSunDuotone } from "react-icons/pi";

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		<div className="border-normal z-10 mr-0 flex h-fit items-center gap-2 rounded-full p-2 backdrop-blur-lg transition-all md:mr-[150px]">
			<span
				className={cn(
					"flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100 md:h-10 md:w-10",
					{
						"bg-black text-white opacity-100 dark:bg-white dark:text-black":
							mounted && theme === "light",
					},
				)}
				onClick={() => setTheme("light")}
			>
				<PiSunDuotone />
			</span>
			<span
				className={cn(
					"flex h-8 w-8  cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100 md:h-10 md:w-10",
					{
						"bg-black text-white opacity-100 dark:bg-white dark:text-black":
							mounted ? theme == "system" : true,
					},
				)}
				onClick={() => setTheme("system")}
			>
				<PiHouseDuotone />
			</span>
			<span
				className={cn(
					"flex h-8 w-8  cursor-pointer items-center justify-center rounded-full p-1 text-2xl opacity-80 transition-all hover:opacity-100 md:h-10 md:w-10",
					{
						"bg-black text-white opacity-100 dark:bg-white dark:text-black":
							mounted && theme === "dark",
					},
				)}
				onClick={() => setTheme("dark")}
			>
				<PiMoonDuotone />
			</span>
		</div>
	);
}
