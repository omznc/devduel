import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

// @ts-ignore
export default async function Layout({ me, other, params }: {
	me: ReactNode
	other: ReactNode
	params: {
		username: string
	}
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);
	if (session && (!session?.user?.username || ["me", params.username].includes(session?.user?.username))) {
		return me;
	}
	return other


}