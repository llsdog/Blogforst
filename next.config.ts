/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [], // 如果有外部图片域名，在这里添加
    },
};

export default nextConfig;
