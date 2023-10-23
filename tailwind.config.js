/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	//  add custom border preset border border-black border-opacity-25 dark:border-white dark:border-opacity-25
	theme: {
		extend: {},
		keyframes: {
			'fade-in': {
				'0%': {
					opacity: '0',
				},
				'100%': {
					opacity: 'initial',
				},
			},
			spin: {
				'0%': {
					transform: 'rotate(0deg)',
				},
				'100%': {
					transform: 'rotate(360deg)',
				},
			},
		},
		animation: {
			'fade-in': 'fade-in 0.5s ease-out forwards',
			spin: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
		},
	},

	darkMode: 'class',
	plugins: [require('tailwindcss-bg-patterns')],
};
