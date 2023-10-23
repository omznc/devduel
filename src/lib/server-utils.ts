import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import prisma from '@lib/prisma.ts';

export async function isAuthorized() {
	const session = await getServerSession(authOptions);
	if (session && session.user) {
		return session;
	}
	return null;
}

export async function getCurrentTask(submissions: number = 0) {
	const task = await prisma.task.findFirst({
		where: {
			expiresAt: {
				gt: new Date(),
			},
		},
		orderBy: {
			expiresAt: 'desc',
		},
		include: {
			submissions: {
				orderBy: {
					createdAt: 'desc',
				},
				take: submissions,
				include: {
					user: true,
				},
			},
		},
	});
	return task;
}
