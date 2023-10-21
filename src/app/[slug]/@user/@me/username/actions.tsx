'use server';

import prisma from '@/src/lib/prisma.ts';
import { isAuthorized } from '@/src/lib/server-utils.ts';
import { revalidatePath } from 'next/cache';
import { isValidUsername } from '@/src/lib/utils.ts';

export async function checkUsername(username: string) {
	if (!isValidUsername(username)) {
		return {
			ok: false,
			message: 'Invalid username format',
		};
	}
	const exists = await prisma.user.exists({
		username,
	});
	return {
		ok: !exists,
		message: exists ? 'Username already taken' : 'Username available',
	};
}

export async function setUsername(username: string) {
	const authorized = await isAuthorized();
	if (!authorized || !authorized?.user) throw new Error('Not authorized');
	if (!isValidUsername(username)) throw new Error('Invalid username format');
	await prisma.user.update({
		where: {
			id: authorized.user.id,
		},
		data: {
			username,
		},
	});

	revalidatePath(`/@${username}`);
	revalidatePath(`/@${authorized.user?.username}`);
}

export async function getUsernameSuggestion() {
	const authorized = await isAuthorized();
	if (!authorized || !authorized?.user) throw new Error('Not authorized');

	const suggestions = [
		authorized.user.name?.split(' ')[0]?.toLowerCase(),
		authorized.user.name?.split(' ').join('-').toLowerCase(),
	];

	const exists = await prisma.user.findMany({
		where: {
			OR: [
				{
					username: {
						startsWith: suggestions[0],
					},
				},
				{
					username: {
						startsWith: suggestions[1],
					},
				},
			],
		},
	});

	if (exists.length === 0) {
		return suggestions[0];
	}
	const valid = suggestions.find(
		suggestion => !exists.find(user => user.username === suggestion)
	);
	if (valid) {
		return valid;
	}

	let found = false;
	while (!found) {
		const suggestion = `${authorized.user.name
			?.split(' ')
			.join('-')
			.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
		if (!exists.find(user => user.username === suggestion)) {
			found = true;
			return suggestion;
		}
	}
}
