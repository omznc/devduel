import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';

export async function isAuthorized() {
	// @ts-ignore
	const session = await getServerSession(authOptions);
	if (session && session.user) {
		return session;
	}
	return null;
}
