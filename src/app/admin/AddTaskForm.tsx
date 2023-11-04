'use client';

import { toast } from 'react-hot-toast';
import { createTask } from '@app/admin/actions.ts';
import { SubmitFormButton } from '@components/buttons.tsx';

export default function AddTaskForm() {
	return (
		<form
			action={formData => {
				toast.promise(createTask(formData), {
					loading: 'Creating task...',
					success: 'Created task!',
					error: e => e?.message ?? 'Failed to create task.',
				});
			}}
			className='flex w-full flex-col gap-2'
		>
			<label htmlFor='title'>{'Title'}</label>
			<input
				type='text'
				name='title'
				className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
			/>
			<label htmlFor='description'>{'Description'}</label>
			<input
				type='text'
				name='description'
				className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
			/>
			<label htmlFor='startDate'>{'Start Date'}</label>
			<input
				type='date'
				name='startDate'
				className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
			/>
			<label htmlFor='endDate'>{'End Date'}</label>
			<input
				type='date'
				name='endDate'
				className='border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white'
			/>
			<SubmitFormButton>{'Create Task'}</SubmitFormButton>
		</form>
	);
}
