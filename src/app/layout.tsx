import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'highlight.js/styles/color-brewer.css';
import React from "react";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: "llsdog的博客",
        template: "%s | llsdog的博客"
    },
    description: "欢迎来到llsdog的个人技术博客，分享编程技术、学习心得和生活感悟",
    keywords: ["博客", "技术", "编程", "前端", "JavaScript", "TypeScript", "React", "Next.js"],
    authors: [{ name: "llsdog", url: "https://github.com/llsdog" }],
    creator: "llsdog",
    publisher: "llsdog",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
        type: "website",
        locale: "zh_CN",
        url: "./",
        title: "llsdog的博客",
        description: "欢迎来到llsdog的个人技术博客",
        siteName: "llsdog的博客",
        images: [
            {
                url: "/img/avatar.jpg",
                width: 1200,
                height: 630,
                alt: "llsdog的博客",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "llsdog的博客",
        description: "欢迎来到llsdog的个人技术博客",
        images: ["/img/avatar.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
    
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <head>
            {/* 预加载关键资源 */}
            <link rel="preload" as="image" href="/img/LL_moon.jpg" />
            <link rel="preload" as="image" href="/img/LL_sun.jpg" />
            <link rel="preload" as="image" href="/img/avatar.jpg" />
            
            {/* 预加载视频资源 */}
            <link rel="preload" as="video" href="/webm/LL-front-special-x2.webm" />
            <link rel="preload" as="video" href="/webm/LL-front-special-x1.webm" />
            <link rel="preload" as="video" href="/webm/LL-front-Idle-x1.webm" />
            
            {/* 预连接到外部资源 */}
            <link rel="preconnect" href="https://api.github.com" />
            <link rel="preconnect" href="https://v1.hitokoto.cn" />
            {process.env.NEXT_PUBLIC_CLOUDMUSIC_BASE_URL && (
                <link rel="preconnect" href={process.env.NEXT_PUBLIC_CLOUDMUSIC_BASE_URL} />
            )}
            
            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/img/avatar.jpg" />
            
            {/* 主题色 */}
            <meta name="theme-color" content="#ffffff" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            
            {/* 视口配置 */}
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>llsdog的博客</title>
        </head>
        <body
            className="antialiased"
            style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
            }}
        >
        {/* 主要内容 */}
        <main>
            {children}
        </main>
        
        {/* Bootstrap JavaScript - 放在页面底部以提高性能 */}
        <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            strategy="lazyOnload"
        />
        
        {/* FontAwesome - 延迟加载 */}
        <Script
            src="https://kit.fontawesome.com/7e729c77cd.js"
            strategy="lazyOnload"
            crossOrigin="anonymous"
        />
        
        {/* GSAP - 如果需要的话 */}
        <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
            strategy="beforeInteractive"
        />
        
        {/* 页面加载完成后的初始化脚本 */}
        <Script id="page-init" strategy="afterInteractive">
            {`
            // 页面加载完成日志
            console.log("加载成功, 欢迎来到我的Blog");
            
            // 预防白屏，确保页面正确显示
            document.documentElement.style.visibility = 'visible';
            
            // 性能监控
            if (typeof window !== 'undefined' && window.performance) {
              window.addEventListener('load', () => {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                console.log('页面加载时间:', loadTime + 'ms');
              });
            }
          `}
        </Script>
        
        {/* 错误边界脚本 */}
        <Script id="error-handler" strategy="afterInteractive">
            {`
            window.addEventListener('error', function(e) {
              console.error('全局错误:', e.error);
              // 可以在这里添加错误报告逻辑
            });
            
            window.addEventListener('unhandledrejection', function(e) {
              console.error('未处理的Promise拒绝:', e.reason);
              // 可以在这里添加错误报告逻辑
            });
          `}
        </Script>
        </body>
        </html>
    );
}
