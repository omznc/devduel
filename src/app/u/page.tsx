import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { redirect } from 'next/navigation';

export default async function Profile(){
	// @ts-ignore
	const session = await getServerSession(authOptions);

	return redirect(session?.user ? `/u/me` : '/');
}