import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

// @ts-ignore
export default async function Layout({
	user,
	task,
	params,
}: {
	user: ReactNode;
	task: ReactNode;
	params: {
		slug: string; //@username or @me
	};
}) {
	const slug = params.slug;

	if (!slug) return redirect('/');
	if (slug.startsWith('%40')) return user;
	return task;
}
