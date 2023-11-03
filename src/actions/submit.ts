'use server';

import { isAuthorized } from '@lib/server-utils.ts';
import { getCurrentTask } from '@lib/task.ts';
import { uploadFile } from '@lib/storage.ts';
import prisma from '@lib/prisma.ts';
import { compressImage } from '@lib/image.ts';
import { submitFormSchema } from '@app/submit/schema.ts';

export async function createSubmission(formData: FormData) {
	const data = submitFormSchema.parse({
		title: formData.get('title'),
		description: formData.get('description'),
		shortDescription: formData.get('shortDescription'),
		image: formData.get('image'),
		website: formData.get('website'),
		source: formData.get('source'),
	});
	const session = await isAuthorized();
	if (!session) throw new Error('Unauthorized');
	const task = await getCurrentTask();
	if (!task) throw new Error('No task found');

	const compressed = await compressImage(data.image);
	const url = await uploadFile(
		compressed.buffer,
		compressed.type,
		`submissions/${task.id}/${session.user!.id}`
	);

	return prisma.submission.upsert({
		where: {
			taskId_userId: {
				taskId: task.id,
				userId: session.user!.id,
			},
		},
		create: {
			user: {
				connect: {
					id: session.user!.id,
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
}
