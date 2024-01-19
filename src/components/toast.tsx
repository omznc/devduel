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
						"bg-white dark:bg-black px-4 py-4 flex gap-4 items-center justify-center rounded-md border-normal shadow-md",
					actionButton:
						"bg-black dark:bg-white p-4 rounded-md text-white dark:text-black",
					cancelButton: "bg-transparent text-black dark:text-white",
					description: "text-sm",
				},
			}}
		/>
	);
};

export default Toast;
