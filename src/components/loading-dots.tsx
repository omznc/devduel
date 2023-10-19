'use client';

import { useState } from 'react';

export default function LoadingDots() {
	// 	[...] but the dots are animated
	// like [] > [.] > [..] > [...]

	const [dots, setDots] = useState(0);

	setTimeout(() => {
		setDots((dots + 1) % 6);
	}, 500);

	return <>{'.'.repeat(dots)}</>;
}
