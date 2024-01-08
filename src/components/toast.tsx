"use client";

import { Toaster } from "sonner";

const Toast = () => {
	return (
		<Toaster
			position={"bottom-left"}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast:
						"bg-white dark:bg-black px-4 py-4 flex gap-2 items-center justify-start rounded-md border-normal shadow-md",
				},
			}}
		/>
	);
};

export default Toast;
