/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: { ignoreBuildErrors: true },
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3007',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: '93.127.198.150',
				port: '3007',
				pathname: '/**',
			},
		],
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
