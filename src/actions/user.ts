'use server';

import prisma from '@lib/prisma.ts';
import { isAuthorized } from '@lib/server-utils.ts';
import { revalidatePath } from 'next/cache';
import { isValidUsername } from '@lib/utils.ts';

export async function checkUsername(username: string) {
	if (!isValidUsername(username)) {
		throw new Error('Invalid username format');
	}
	const exists = await prisma.user.exists({
		username,
	});
	if (exists) {
		throw new Error('Username already exists');
	}
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

interface getWinnersOptions {
	take?: number;
	skip?: number;
}

export interface getWinnersResponse {
	username: string | null;
	name: string | null;
	id: string;
	submissions: number;
	image: string | null;
}
export const getWinners = async ({
	take = 10,
	skip = 0,
}: getWinnersOptions): Promise<getWinnersResponse[]> => {
	const users = await prisma.user.findMany({
		orderBy: {
			submissions: {
				_count: 'desc',
			},
		},
		take,
		skip,
		include: {
			submissions: {
				where: {
					winner: true,
				},
			},
		},
	});

	console.log(users);

	return users.map(user => ({
		username: user.username,
		name: user.name,
		id: user.id,
		image: user.image,
		submissions: user.submissions.length,
	}));
};
