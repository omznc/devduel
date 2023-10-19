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
		},
		animation: {
			'fade-in': 'fade-in 0.5s ease-out forwards',
		},
	},

	darkMode: 'class',
	plugins: [require('tailwindcss-bg-patterns')],
};
