'use server';

import { isAuthorized } from '@lib/server-utils.ts';
import { getCurrentTask } from '@lib/task.ts';
import { compressImage, uploadFile } from '@lib/storage.ts';
import prisma from '@lib/prisma.ts';
import { submitFormSchema } from '@app/submit/schema.ts';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createSubmission(formData: FormData) {
	const data = submitFormSchema.parse({
		title: formData.get('title'),
		description: formData.get('description'),
		shortDescription: formData.get('shortDescription'),
		image: formData.get('image'),
		website: formData.get('website'),
		source: formData.get('source'),
	});

	const [session, task] = await Promise.all([
		isAuthorized(),
		getCurrentTask(),
	]);

	if (!session) throw new Error('Unauthorized');
	if (!task) throw new Error('No task found');

	const compressed = await compressImage(data.image);
	const url = await uploadFile(
		compressed.buffer,
		compressed.type,
		`submissions/${task.id}/${session.user!.id}`
	);

	const submission = await prisma.submission.upsert({
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

	revalidatePath(`/submission/${submission.id}`);
	return redirect(`/submission/${submission.id}`);
}
