import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@lib/utils.ts';
import { default as MD } from 'react-markdown';
import { Submission } from '@prisma/client';

interface MarkdownProps {
	submission: Submission;
}

export default function Markdown({ submission }: MarkdownProps) {
	return (
		<MD
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
							width={parseInt((props.width as string) ?? '500')}
							height={parseInt((props.height as string) ?? '500')}
							alt={(props.alt as string) ?? 'Submission Image'}
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
		</MD>
	);
}
