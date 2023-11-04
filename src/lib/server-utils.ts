import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import prisma from '@lib/prisma.ts';

export async function isAuthorized(admin: boolean = false) {
	const session = await getServerSession(authOptions);
	if (session && session.user) {
		if (!admin || (admin && session.user.admin)) {
			return session;
		}
	}
	return null;
}
