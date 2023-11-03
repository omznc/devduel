'use client';
import Image from 'next/image';
import { PiTrashDuotone } from 'react-icons/pi';
import rehypeSanitize from 'rehype-sanitize';
import { toast } from 'react-hot-toast';
import { createSubmission } from '@/src/actions/submit.ts';
import { ReactNode, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils.ts';
import { submitFormSchemaType } from '@app/submit/schema.ts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { Submission } from '@prisma/client';
import { redirect } from 'next/navigation';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function SubmitForm({
	submission,
}: {
	submission: Submission | null;
}) {
	const [data, setData] = useState<submitFormSchemaType>({
		title: submission?.title || '',
		description: submission?.description || '',
		shortDescription: submission?.shortDescription || '',
		image: new File([], ''),
		website: submission?.website || '',
		source: submission?.source || '',
	});

	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;

	return (
		<>
			<form className='flex w-full flex-col gap-4 md:flex-row'>
				<div className='flex h-full flex-col gap-4'>
					<label htmlFor='cover'>{'Cover Image'}</label>
					<Dropzone
						onDrop={files => {
							setData(data => ({
								...data,
								image: files[0],
							}));
						}}
					>
						{!submission?.image && data.image.size === 0 && (
							<span className='flex h-[300px] w-[300px] items-center justify-center text-center transition-all'>
								{"Drop it like it's hot... or just click."}
							</span>
						)}
						{!submission?.image && data.image.size > 0 && (
							<span
								className='group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all'
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									setData(data => ({
										...data,
										image: new File([], ''),
									}));
								}}
							>
								<Image
									src={URL.createObjectURL(data.image)}
									width={200}
									height={200}
									alt='Preview'
									className='z-20 aspect-square h-[300px] w-[300px] rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter'
								/>
								<div className='absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100'>
									<PiTrashDuotone className='h-12 w-12' />
									<span className='text-2xl'>{'Remove'}</span>
								</div>
							</span>
						)}
						{submission?.image && (
							<span
								className='group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all'
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									setData(data => ({
										...data,
										image: new File([], ''),
									}));
									submission.image = '';
								}}
							>
								<Image
									src={submission.image}
									id={'existing-image'}
									width={200}
									height={200}
									alt='Preview'
									className='z-20 aspect-square h-[300px] w-[300px] rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter'
								/>
								<div className='absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100'>
									<PiTrashDuotone className='h-12 w-12' />
									<span className='text-2xl'>{'Remove'}</span>
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
								setData(data => ({
									...data,
									title: e.target.value,
								}))
							}
							defaultValue={submission?.title}
						/>
					</div>
					<div className='flex w-full flex-col gap-2'>
						<label htmlFor='website'>{'Website'}</label>
						<input
							type='website'
							id='website'
							className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
							onChange={e =>
								setData(data => ({
									...data,
									website: e.target.value,
								}))
							}
							defaultValue={submission?.website}
						/>
					</div>
					<div className='flex w-full flex-col gap-2'>
						<label htmlFor='short-description'>
							{'Short Description'}
						</label>
						<input
							type='short-description'
							id='short-description'
							className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
							onChange={e =>
								setData(data => ({
									...data,
									shortDescription: e.target.value,
								}))
							}
							defaultValue={submission?.shortDescription}
						/>
					</div>
					<div className='flex w-full flex-col gap-2'>
						<label htmlFor='source'>{'Source Code'}</label>
						<input
							type='text'
							id='source'
							className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
							onChange={e =>
								setData(data => ({
									...data,
									source: e.target.value,
								}))
							}
							defaultValue={submission?.source || ''}
						/>
					</div>
				</div>
			</form>
			<div
				className='z-20 flex w-full max-w-4xl flex-col gap-4'
				data-color-mode={theme}
			>
				<label htmlFor='description'>{'Description'}</label>

				<MDEditor
					height={200}
					onChange={value => {
						setData(data => ({
							...data,
							description: value || '',
						}));
					}}
					value={data.description ?? submission?.description ?? ''}
					className='editor rounded-sm'
					data-theme={theme}
					previewOptions={{
						rehypePlugins: [[rehypeSanitize]],
					}}
				/>

				<button
					className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
					onClick={async () => {
						const formData = new FormData();
						formData.append('title', data.title);
						formData.append('description', data.description);
						formData.append(
							'shortDescription',
							data.shortDescription
						);
						formData.append('website', data.website);
						if (data.source) formData.append('source', data.source);
						formData.append('image', data.image);

						if (submission?.image) {
							// 	get the existing image as a file
							const existingImage = document.getElementById(
								'existing-image'
							) as HTMLImageElement;
							const response = await fetch(existingImage.src);
							const blob = await response.blob();
							formData.set(
								'image',
								new File([blob], 'image', {
									type: blob.type,
								})
							);
						}

						await toast
							.promise(createSubmission(formData), {
								loading: 'Submitting...',
								success: 'Submitted!',
								error: e => {
									return e.message;
								},
							})
							.then(s => {
								redirect(`/submission/${s.id}`);
							});
					}}
				>
					{'Submit'}
				</button>
			</div>
		</>
	);
}

type DropzoneProps = {
	onDrop?: (_: File[]) => void;
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
