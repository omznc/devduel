import { PiCircleDashedDuotone } from 'react-icons/pi';

const FullscreenLoader = () => (
	<div className='flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-4'>
		<PiCircleDashedDuotone className='h-24 w-24 animate-spin' />
	</div>
);

export default FullscreenLoader;
