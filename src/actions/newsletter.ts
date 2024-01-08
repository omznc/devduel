"use server";

import prisma from "@lib/prisma.ts";
import { isValidEmail } from "@lib/utils.ts";

const url = "https://ntfy.sh/ignpfi42uwng0894v23h9vgmw048tuvm2408tmu2v4";

export const subscribeToNewsletter = async (email: string) => {
	if (!isValidEmail(email)) {
		throw new Error("Invalid email");
	}
	return prisma.newsletter
		.create({
			data: {
				email,
			},
		})
		.then(async () => {
			await fetch(url, {
				method: "POST",
				body: JSON.stringify({
					email: email,
					list: "launch_email",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		})
		.catch((e) => {
			if (e?.message?.includes("Unique constraint failed")) {
				throw new Error("Already subscribed");
			}
		});
};
