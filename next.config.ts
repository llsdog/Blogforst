import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export', // 启用静态导出
    trailingSlash: true, // 为 URL 添加尾随斜杠
    images: {
        unoptimized: true, // 对于静态导出，禁用图像优化
    },
    // 如果你的站点部署在子路径下，可以设置 basePath
    // basePath: '/your-subdirectory',
};

export default nextConfig;
