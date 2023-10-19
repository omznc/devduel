/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {},
		border: {},
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
