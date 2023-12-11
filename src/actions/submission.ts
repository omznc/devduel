"use server";

import { submitFormSchema } from "@app/submit/schema.ts";
import { imageConfig } from "@config";
import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";
import { compressImage, getSignedURL, uploadFile } from "@lib/storage.ts";
import { getCurrentTask } from "@lib/task.ts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toSlug } from "@lib/utils.ts";
import env from "@env";

const RAW_HOSTNAME = `https://${
	env.BACKBLAZE_BUCKET_NAME
}.${env.BACKBLAZE_BUCKET_ENDPOINT.replace("https://", "")}`;
const CDN_HOSTNAME = `https://${env.BACKBLAZE_CDN_URL}/file/${env.BACKBLAZE_BUCKET_NAME}`;

export async function createSubmission(formData: FormData) {
	const data = submitFormSchema.parse({
		title: formData.get("title"),
		description: formData.get("description"),
		shortDescription: formData.get("shortDescription"),
		image: formData.get("image"),
		website: formData.get("website"),
		source: formData.get("source"),
	});

	const [session, task] = await Promise.all([isAuthorized(), getCurrentTask()]);

	if (!session?.user) throw new Error("Unauthorized");
	if (!task) throw new Error("No task found");
	if (task.status !== "OPEN") throw new Error("Submissions are closed");
	if (!data.image) throw new Error("No image found");
	if (![RAW_HOSTNAME, CDN_HOSTNAME].some((host) => data.image.startsWith(host)))
		throw new Error("Invalid image host");

	data.image = data.image.replace(RAW_HOSTNAME, CDN_HOSTNAME);

	const submission = await prisma.submission.upsert({
		where: {
			taskId_userId: {
				taskId: task.id,
				userId: session.user?.id,
			},
		},
		create: {
			user: {
				connect: {
					id: session.user?.id,
				},
			},
			task: {
				connect: {
					id: task.id,
				},
			},
			...data,
			slug: toSlug(data.title, true),
		},
		update: {
			...data,
		},
	});

	revalidatePath(`/submission/${submission.slug}`);
	return redirect(`/submission/${submission.slug}`);
}

export const getSignedUploadURL = async (type: string, size: number) => {
	return getSignedURL(type, size);
};

export async function deleteSubmission(id: string) {
	const [session, submission] = await Promise.all([
		isAuthorized(),
		prisma.submission.findUnique({
			where: {
				id,
			},
			include: {
				task: {
					select: {
						slug: true,
					},
				},
			},
		}),
	]);

	if (!session) throw new Error("Unauthorized");
	if (!submission) throw new Error("No submission found");
	if (submission.userId !== session.user?.id) throw new Error("Unauthorized");

	await prisma.submission.delete({
		where: {
			id,
		},
	});

	revalidatePath(`/task/${submission.task.slug}`);
	return redirect(`/task/${submission.task.slug}`);
}

interface getSubmissionsOptions {
	taskId?: string;
	take?: number;
	skip?: number;
	includeUser?: boolean;
	winnersOnly?: boolean;
}

export const getSubmissions = async ({
	taskId,
	take = 10,
	skip = 0,
	includeUser = false,
	winnersOnly = false,
}: getSubmissionsOptions) => {
	// most votes to least
	return prisma.submission.findMany({
		where: {
			...(winnersOnly
				? {
						winner: true,
				  }
				: {}),
			...(taskId
				? {
						taskId,
				  }
				: {}),
		},
		orderBy: {
			votes: {
				_count: "desc",
			},
		},
		take,
		skip,
		include: {
			...(includeUser
				? {
						user: {
							select: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
				  }
				: {}),
		},
	});
};
