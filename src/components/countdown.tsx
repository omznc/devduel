'use client';

import { useEffect, useState } from 'react';

interface CurrentTaskProps {
	expires: Date;
}

export default function Countdown({ expires }: CurrentTaskProps) {
	const [timeLeft, setTimeLeft] = useState(expires.getTime() - Date.now());

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(expires.getTime() - Date.now());
		}, 1000);
		return () => clearInterval(interval);
	}, [expires]);

	const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
	const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
	const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	return (
		<>
			{days > 0 && `${days} day${days === 1 ? ' ' : 's '}`}
			{hours > 0 && `${hours} hour${hours === 1 ? ' ' : 's '}`}
			{minutes > 0 &&
				`${minutes} minute${minutes === 1 ? ' ' : 's '}`}
			{`${seconds} second${seconds === 1 ? '' : 's'}`}

		</>
	);
}
