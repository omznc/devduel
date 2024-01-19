"use client";

import { useState } from "react";

export default function LoadingDots() {
	const [dots, setDots] = useState(0);

	setTimeout(() => {
		setDots((dots + 1) % 6);
	}, 500);

	return <>{".".repeat(dots)}</>;
}
