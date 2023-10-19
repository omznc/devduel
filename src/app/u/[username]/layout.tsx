import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';

export default async function Layout({ me, other, children, params }: {
	children?: ReactNode
	me?: ReactNode
	other?: ReactNode
	params: {
		username: string
	}
}) {
	const session = await getServerSession(authOptions);
	if (session && ["me", params.username].includes(session?.user?.username)) {
		return me;
	}
	return other


}