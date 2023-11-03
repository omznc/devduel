import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';

export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		username: string;
	};
}) {
	const session = await getServerSession(authOptions);
	if (!session) return other;
	return [session.user?.username, 'me'].includes(params?.username)
		? me
		: other;
}
