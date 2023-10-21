import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';

// @ts-ignore
export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		slug: string; //@username or @me
	};
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);
	const username = params.slug?.replace('%40', '');
	if (session && !session?.user?.username) return me;
	if (session && [session?.user?.username, 'me'].includes(username))
		return me;
	return other;
}
