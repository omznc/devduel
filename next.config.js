/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['i.imgur.com', 'cdn-devduel.omarzunic.com'],
	},
	experimental: {
		serverActions: true,
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
};

module.exports = removeImports(nextConfig);
