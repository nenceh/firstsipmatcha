// https://github.com/gregrickaby/nextjs-github-pages

import type { NextConfig } from "next";
import { BASE } from "./database/constants";

const nextConfig: NextConfig = {
    // basePath: process.env.NODE_ENV === 'development' ? BASE : '',

    // output: "export", // enable static exports
    reactStrictMode: false,
    images: {
        // unoptimized: true, // disable server-based image optimization
        remotePatterns: [
            // https://nextjs.org/docs/messages/next-image-unconfigured-host
            new URL('https://items-images-sandbox.s3.us-west-2.amazonaws.com/**'),
        ],
    },

    // https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
    allowedDevOrigins: [
        'http://localhost:3000',
        'http://192.168.2.20:3000',
    ],

    pageExtensions: ['ts', 'tsx'],
};

export default nextConfig;