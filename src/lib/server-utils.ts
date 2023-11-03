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
	return prisma.task.findFirst({
		where: {
			endDate: {
				gt: new Date(),
			},
		},
		orderBy: {
			endDate: 'desc',
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
}
