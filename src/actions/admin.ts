"use server";

import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";
import { toSlug } from "@lib/utils.ts";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
	const authorized = await isAuthorized(true);
	if (!authorized) throw new Error("Unauthorized");

	const title = formData.get("title") as string;
	const description = formData.get("description") as string;
	const slug = toSlug(title, true);

	const data = {
		title,
		description,
		slug,
	} as const;

	for (const key in data) {
		if (!data[key as keyof typeof data]) throw new Error(`Missing ${key}`);
	}

	const task = await prisma.task.create({
		data,
	});

	revalidatePath("/admin");
	return Boolean(task);
}

export async function updateTask(formData: FormData, slug: string) {
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

	const task = await prisma.task.update({
		where: {
			slug,
		},
		data,
	});

	revalidatePath("/admin");

	return Boolean(task);
}

export async function deleteTask(slug: string) {
	const authorized = await isAuthorized(true);
	if (!authorized) throw new Error("Unauthorized");

	const task = await prisma.task.delete({
		where: {
			slug,
		},
	});

	revalidatePath("/admin");

	return Boolean(task);
}

export async function getTask(slug: string) {
	const task = await prisma.task.findUnique({
		where: {
			slug,
		},
	});

	return task;
}
