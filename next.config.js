const million = require('million/compiler');
/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn-devduel.omarzunic.com'
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'api.dicebear.com'
			}
		],
		// Used for profile images in cases where one doesn't exist
		dangerouslyAllowSVG: true
	},
	experimental: {
		webpackBuildWorker: true
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		});

		return config;
	}
};

module.exports = million.next(nextConfig, {
	auto: { rsc: true },
	mute: true
});
