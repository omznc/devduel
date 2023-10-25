'use client';

import { Submission } from '@prisma/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { PiCircleDashedDuotone } from 'react-icons/pi';
import { cn } from '@lib/utils.ts';
import '@app/github-markdown.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Client({ submission }: { submission: Submission }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted)
		return <PiCircleDashedDuotone className='h-24 w-24 animate-spin' />;

	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				img: ({ node, ...props }) => {
					// 		only allow images from imgur
					const { src } = props;
					if (!src?.startsWith('https://i.imgur.com/'))
						return <Link href={src ?? '#'}>External Image</Link>;
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
		</Markdown>
	);
}
