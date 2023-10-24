import { PiCircleDashedDuotone } from 'react-icons/pi';

export default function Loading() {
	return (
		<div className='flex h-full min-h-screen w-full flex-col items-center justify-center gap-4'>
			<PiCircleDashedDuotone className='animate-spin h-24 w-24' />
		</div>
	);
}
