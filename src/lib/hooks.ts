import { useEffect, useLayoutEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debouncedValue;
}

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useLayoutEffect(() => {
		setIsMobile(window.innerWidth < 768);
		const updateSize = (): void => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener('resize', updateSize);
		// updateSize();
		return (): void => window.removeEventListener('resize', updateSize);
	}, []);

	return isMobile;
}
