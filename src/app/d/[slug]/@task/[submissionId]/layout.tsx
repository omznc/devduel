import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSubmissionCached } from '@app/d/[slug]/@task/cache.ts';

// @ts-ignore
export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		submissionId: string;
		slug: string;
	};
}) {
	// @ts-ignore
	const session = await getServerSession(authOptions);

	if (!session || !session?.user?.username) return other;

	const submission = await getSubmissionCached(
		params.slug,
		params.submissionId
	);
	if (!submission) return redirect(`/${params.slug}`);
	if (submission?.user?.username === session?.user?.username) return me;

	return other;
}
