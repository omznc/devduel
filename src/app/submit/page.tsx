'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import { cn } from '@lib/utils.ts';
import Image from 'next/image';
import { PiTrashDuotone } from 'react-icons/pi';
import { toast } from 'react-hot-toast';
import { createSubmission } from '@app/submit/actions.tsx';
import { useTheme } from 'next-themes';
import rehypeSanitize from 'rehype-sanitize';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const markdown = `
# My Submission
`;

interface FormData {
	title: string;
	description: string;
	website: string;
	source: string;
	image?: File;
}

export default function Page() {
	const [formData, setFormData] = useState<FormData>({
		title: '',
		description: markdown,
		website: '',
		source: '',
		image: undefined,
	});

	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	const { data: session } = useSession();
	const user = session?.user;

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;
	if (!user) {
		return redirect('/');
	}

	return (
		<div className='mt-16 flex h-full  min-h-screen w-full flex-col items-center justify-center'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-4 font-bold transition-all'>
				<span className='fit-text w-full text-center transition-all'>
					{"Ready to go? Let's go!"}
				</span>
				<div className='flex w-full max-w-4xl flex-col gap-4 md:flex-row'>
					<div className='flex h-full flex-col gap-4'>
						<label htmlFor='cover'>{'Cover Image'}</label>
						<Dropzone
							onDrop={files => {
								if (files.length === 0) return;
								setFormData({
									...formData,
									image: files[0],
								});
							}}
						>
							{!formData.image && (
								<span className='flex h-[300px] w-[300px] items-center justify-center text-center transition-all'>
									{"Drop it like it's hot... or just click."}
								</span>
							)}
							{formData.image && (
								<span
									className='group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all'
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										setFormData({
											...formData,
											image: undefined,
										});
									}}
								>
									<Image
										src={URL.createObjectURL(
											formData.image
										)}
										width={200}
										height={200}
										alt='Preview'
										className='z-20 aspect-square h-[300px] w-[300px] rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter'
									/>
									<div className='absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100'>
										<PiTrashDuotone className='h-12 w-12' />
										<span className='text-2xl'>
											{'Remove'}
										</span>
									</div>
								</span>
							)}
						</Dropzone>
					</div>
					<div className='flex w-full flex-col justify-start gap-4'>
						<div className='flex w-full flex-col gap-2'>
							<label htmlFor='title'>{'Title'}</label>
							<input
								type='text'
								id='title'
								className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
								onChange={e =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
							/>
						</div>
						<div className='flex w-full flex-col gap-2'>
							<label htmlFor='website'>{'Website'}</label>
							<input
								type='website'
								id='website'
								className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
								onChange={e =>
									setFormData({
										...formData,
										website: e.target.value,
									})
								}
							/>
						</div>
						<div className='flex w-full flex-col gap-2'>
							<label htmlFor='source'>{'Source Code'}</label>
							<input
								type='text'
								id='source'
								className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
								onChange={e =>
									setFormData({
										...formData,
										source: e.target.value,
									})
								}
							/>
						</div>
					</div>
				</div>
				<div
					className='z-20 flex w-full max-w-4xl flex-col gap-4'
					data-color-mode={theme}
				>
					<label htmlFor='description'>{'Description'}</label>
					<MDEditor
						height={200}
						value={formData.description}
						onChange={value =>
							setFormData({
								...formData,
								description: value ?? '',
							})
						}
						className='editor rounded-sm'
						data-theme={theme}
						previewOptions={{
							rehypePlugins: [[rehypeSanitize]],
						}}
					/>
					<button
						className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
						onClick={async () => {
							const data = new FormData();
							for (const key in formData) {
								const entry = formData[key as keyof FormData];
								if (entry === undefined)
									return toast.error(`${key} is required.`);
								data.append(key, entry);
							}

							console.log(data);

							await toast.promise(createSubmission(data), {
								loading: 'Uploading...',
								success: 'Uploaded!',
								error: 'Failed to upload.',
							});
						}}
					>
						{'Submit'}
					</button>
				</div>
			</div>
		</div>
	);
}

type DropzoneProps = {
	onDrop: (_: File[]) => void;
	children: ReactNode;
};
const Dropzone = ({ onDrop, children }: DropzoneProps) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/png': ['.png'],
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/gif': ['.gif'],
			'image/webp': ['.webp'],
		},
		maxFiles: 1,
	});

	return (
		<div
			{...getRootProps()}
			className={cn(
				`border-normal flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-black bg-opacity-10 p-4 text-black transition-all dark:bg-white dark:bg-opacity-10 dark:text-white md:max-w-fit`,
				{
					'p-8': isDragActive,
				}
			)}
		>
			<input {...getInputProps()} />
			{children}
		</div>
	);
};
