'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { ReactNode, useState } from 'react';
import { cn } from '@lib/utils.ts';
import Image from 'next/image';
import { PiTrashDuotone } from 'react-icons/pi';
import { toast } from 'react-hot-toast';
import { createSubmission } from '@app/submit/actions.tsx';

export default function Page() {
	const [files, setFiles] = useState<File[]>([]);
	const { data: session } = useSession();
	const user = session?.user;
	if (!user) {
		return redirect('/');
	}

	return (
		<div className='mt-16 flex h-full  min-h-screen w-full flex-col items-center justify-center'>
			<div className='flex h-full w-fit flex-col items-center justify-start gap-2 font-bold transition-all'>
				<span className='fit-text w-full text-center transition-all'>
					{"Ready to go? Let's go!"}
				</span>
				<div className='flex w-full max-w-4xl flex-col gap-4 md:flex-row'>
					<Dropzone
						onDrop={files => {
							setFiles(files);
						}}
					>
						{files.length === 0 && (
							<span className='w-full text-center transition-all'>
								{'Drop your file here, or just click'}
							</span>
						)}
						{files.length > 0 && (
							<span
								className='group relative flex w-fit items-center justify-center overflow-hidden rounded-md text-center transition-all'
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									setFiles([]);
								}}
							>
								<Image
									src={URL.createObjectURL(files[0])}
									width={200}
									height={200}
									alt='Preview'
									className='z-20 aspect-square h-[300px] w-[300px] rounded-md object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter'
								/>
								<div className='absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100'>
									<PiTrashDuotone className='h-12 w-12' />
									<span className='text-2xl'>{'Remove'}</span>
								</div>
							</span>
						)}
					</Dropzone>
					<div className='flex w-full flex-col justify-between gap-2'>
						<label htmlFor='title'>{'Title'}</label>
						<input
							type='text'
							id='title'
							className='border-normal rounded-md bg-black p-2 dark:bg-white dark:text-black'
						/>
						<label htmlFor='description'>{'Description'}</label>
						<textarea
							id='description'
							className='border-normal rounded-md bg-black p-2 dark:bg-white dark:text-black'
						/>
						<label htmlFor='website'>{'Website'}</label>
						<input
							type='website'
							id='website'
							className='border-normal rounded-md bg-black p-2 dark:bg-white dark:text-black'
						/>
						<label htmlFor='source'>{'Source'}</label>
						<input
							type='text'
							id='source'
							className='border-normal rounded-md bg-black p-2 dark:bg-white dark:text-black'
						/>
						<button
							className='border-normal rounded-md p-2'
							onClick={async () => {
								const formData = new FormData();
								formData.append(
									'title',
									document.getElementById('title')?.value ??
										''
								);
								formData.append(
									'description',
									document.getElementById('description')
										?.value ?? ''
								);
								formData.append(
									'website',
									document.getElementById('website')?.value ??
										''
								);
								formData.append(
									'source',
									document.getElementById('source')?.value ??
										''
								);
								formData.append('image', files[0]);
								await toast.promise(
									createSubmission(formData),
									{
										loading: 'Uploading...',
										success: 'Uploaded!',
										error: 'Failed to upload.',
									}
								);
							}}
						>
							{'Submit'}
						</button>
					</div>
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
