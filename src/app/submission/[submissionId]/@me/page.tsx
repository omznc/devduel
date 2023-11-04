import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';
import { getSubmissionCached } from '@app/submission/cache.ts';
import { RoundButton, RoundLink } from '@components/buttons.tsx';
import Link from 'next/link';
import { getCurrentTask } from '@lib/task.ts';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { cn } from '@lib/utils.ts';
import '@app/markdown.css';
import { PiGitBranchDuotone, PiPencilDuotone } from 'react-icons/pi';

export default async function Page({
	params,
}: {
	params: { submissionId: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return redirect('/');
	if (!session?.user?.username) return redirect('/user/me/username');

	const [submission, task] = await Promise.all([
		getSubmissionCached(params.submissionId),
		getCurrentTask(),
	]);
	if (!submission) return redirect('/');

	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<div className='flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row'>
				<RoundLink href={`/task/${submission!.taskId}`}>
					Task: {submission!.task?.title}
				</RoundLink>
				{task?.id === submission.taskId && (
					<RoundLink href={`/submit`}>
						<PiPencilDuotone />
						Edit
					</RoundLink>
				)}
				{submission.source && (
					<RoundLink href={submission.source}>
						<PiGitBranchDuotone />
						Source Code
					</RoundLink>
				)}
				{submission.winner && <RoundButton>🏆 Winner</RoundButton>}
			</div>
			<Link
				className='fit-text bg-colored text-center after:bg-yellow-500'
				href={submission.website}
				target='_blank'
				rel='noopener noreferrer'
			>
				{submission!.title}
			</Link>
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					img: ({ node, ...props }) => {
						// 		only allow images from imgur
						const { src } = props;
						if (!src?.startsWith('https://i.imgur.com/'))
							return (
								<Link href={src ?? '#'} target={'_blank'}>
									External Image
								</Link>
							);
						return (
							<Image
								src={src}
								width={parseInt(
									(props.width as string) ?? '500'
								)}
								height={parseInt(
									(props.height as string) ?? '500'
								)}
								alt={
									(props.alt as string) ?? 'Submission Image'
								}
								className='w-full rounded-lg'
							/>
						);
					},
				}}
				className={cn(
					'markdown-body border-normal z-20 h-full w-full max-w-4xl rounded-lg p-4'
				)}
			>
				{submission!.description}
			</Markdown>
		</div>
	);
}
