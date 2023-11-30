"use server";

import { submitFormSchema } from "@app/submit/schema.ts";
import { imageConfig } from "@config";
import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";
import { compressImage, uploadFile } from "@lib/storage.ts";
import { getCurrentTask } from "@lib/task.ts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

	if (!session) throw new Error("Unauthorized");
	if (!task) throw new Error("No task found");
	if (task.status !== "OPEN") throw new Error("Submissions are closed");

	const image = imageConfig.compression.enabled
		? await compressImage(data.image)
		: {
				buffer: Buffer.from(await data.image.arrayBuffer()),
				type: data.image.type,
				size: data.image.size,
		  };

	if (image.size > imageConfig.maxSize)
		throw new Error(
			`Image too large (${Math.round(image.size / 1_000_000)}MB > ${Math.round(
				imageConfig.maxSize / 1_000_000,
			)}MB max)`,
		);

	const url = await uploadFile(
		image.buffer,
		image.type,
		`submissions/${task.id}/${session.user?.id}`,
	);

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
			image: url,
		},
		update: {
			...data,
			image: url,
		},
	});

	revalidatePath(`/submission/${submission.id}`);
	return redirect(`/submission/${submission.id}`);
}

export async function deleteSubmission(id: string) {
	const [session, submission] = await Promise.all([
		isAuthorized(),
		prisma.submission.findUnique({
			where: {
				id,
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

	revalidatePath(`/task/${submission.taskId}`);
	return redirect(`/task/${submission.taskId}`);
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
			user: includeUser,
		},
	});
};
