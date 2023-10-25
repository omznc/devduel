import { PiCircleDashedDuotone } from 'react-icons/pi';

export default function Loading() {
	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-start gap-4'>
			<PiCircleDashedDuotone className='h-24 w-24 animate-spin' />
		</div>
	);
}
