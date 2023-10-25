'use server';

import prisma from '@lib/prisma.ts';
import { getCurrentTask, isAuthorized } from '@/src/lib/server-utils.ts';
import { uploadFile } from '@lib/storage.ts';

export async function createSubmission(formData: FormData) {
	const session = await isAuthorized();
	if (!session) throw new Error('Unauthorized');
	const task = await getCurrentTask();
	if (!task) throw new Error('No task found');

	const data = {
		title: (() => {
			const title = formData.get('title') as string;
			if (!title) throw new Error('No title');
			if (title.length > 100) throw new Error('Title too long');
			return title;
		})(),
		description: (() => {
			const description = formData.get('description') as string;
			if (!description) throw new Error('No description');
			if (description.length > 10000)
				throw new Error('Description too long');
			return description;
		})(),
		url: (() => {
			const website = formData.get('website') as string;
			if (!website) throw new Error('No website');
			if (website.length > 1000) throw new Error('Website too long');
			return website;
		})(),
		source: (() => {
			const source = formData.get('source') as string;
			if (!source) throw new Error('No source');
			if (source.length > 1000) throw new Error('Source too long');
			return source;
		})(),
		image: (() => {
			const image = formData.get('image') as File;
			if (!image) throw new Error('No image');
			if (image.size > 5 * 1024 * 1024)
				throw new Error('Image too large');
			if (!image.type.startsWith('image/'))
				throw new Error('Image must be an image');
			return image;
		})(),
	};

	const url = await uploadFile(
		Buffer.from(await data.image.arrayBuffer()),
		data.image.type,
		`submissions/${task.id}/${session.user!.id}`
	);

	console.log(url);

	return prisma.submission.create({
		data: {
			user: {
				connect: {
					// @ts-ignore
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
	});
}
