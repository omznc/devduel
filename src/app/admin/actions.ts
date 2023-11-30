"use server";

import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";

export async function createTask(formData: FormData) {
	const authorized = await isAuthorized(true);
	if (!authorized) throw new Error("Unauthorized");

	const title = formData.get("title") as string;
	const description = formData.get("description") as string;

	const data = {
		title,
		description,
	} as const;

	for (const key in data) {
		if (!data[key as keyof typeof data]) throw new Error(`Missing ${key}`);
	}

	const task = await prisma.task.create({
		data,
	});
	return Boolean(task);
}
