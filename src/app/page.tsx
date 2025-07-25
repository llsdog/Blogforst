import { SnowEffect } from '@/components/SnowEffect';
import { BlogCard } from '@/components/BlogCard';
import { GitHubActivity } from '@/components/GitHubActivity';
import { MusicPlayer } from '@/components/MusicPlayer';
import { blogConfig } from '@/lib/config';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost, BlogMetadata } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import { HitokotoCard } from '@/components/HitokotoCard';

// 解析 Markdown 前置信息的服务器端函数
function parseFrontMatter(content: string): { metadata: BlogMetadata; content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
        return {
            metadata: {} as BlogMetadata,
            content: content
        };
    }
    
    const frontMatter = match[1];
    const markdownContent = match[2];
    
    const metadata: Record<string, unknown> = {};
    frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value: string | number | string[] = valueParts.join(':').trim();
            
            // 处理图片路径
            if (key.trim() === 'image') {
                if (value.startsWith('./public/')) {
                    value = value.replace('./public', '');
                } else if (value.startsWith('./')) {
                    value = value.replace('./', '/');
                }
            }
            
            // 解析值类型
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value) as string[];
                } catch {
                    // 解析失败，保持原值
                }
            } else if (!isNaN(Number(value)) && value !== '') {
                value = Number(value);
            }
            
            metadata[key.trim()] = value;
        }
    });
    
    return {
        metadata: metadata as BlogMetadata,
        content: markdownContent
    };
}

// 加载所有博客的服务器端函数
async function loadAllBlogs(): Promise<BlogPost[]> {
    const blogs: BlogPost[] = [];
    
    for (const filename of blogConfig.blogList) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'blog', filename, `${filename}.md`);
            const content = await fs.readFile(filePath, 'utf-8');
            
            const { metadata } = parseFrontMatter(content);
            
            if (!metadata.image) {
                metadata.image = `/blog/${filename}/${filename}_img1.jpg`;
            }
            
            // 在服务器端格式化日期
            if (metadata.date) {
                const date = new Date(metadata.date);
                metadata.formattedDate = date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            blogs.push({
                filename,
                metadata,
                content: '', // 主页不需要完整内容
                htmlContent: '' // 主页不需要渲染的HTML
            });
        } catch (error) {
            console.error(`Failed to load blog file: ${filename}`, error);
        }
    }
    
    // 按日期排序
    blogs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    
    return blogs;
}


// 格式化日期
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 主页组件（服务器组件）
export default async function Home() {
    const blogs = await loadAllBlogs();
    
    return (
        <>
            <SnowEffect enabled={true} />
            
            <div id="body-home" className="container-fluid p-0 position-relative">
                {/* 上半部分 */}
                <div id="body-home-top" className="page-background-moon container-fluid d-flex flex-column w-100 align-items-center border-bottom-0 position-relative">
                    {/* 导航栏 */}
                    <section className="container d-flex justify-content-center" style={{ width: '25%', minWidth: '300px' }}>
                        <div id="nav" className="d-flex flex-row justify-content-center rounded-5">
                            <div className="btn-group">
                                <Link
                                    href="/"
                                    className="btn text-white rounded-4 focus-ring custom-focus btn-enhance page-button"
                                >
                                    首页
                                </Link>
                                <Link
                                    href="/about"
                                    className="btn text-white rounded-4 focus-ring custom-focus btn-enhance page-button"
                                >
                                    关于我
                                </Link>
                            </div>
                        </div>
                    </section>
                    
                    {/* 标题区域 */}
                    <section id="body-home-top-title-section" className="container custom-spacing align-items-center">
                        <div className="d-flex justify-content-center w-100">
                            <h1 className="display-5 text-center" id="body-home-top-title-title">
                                Bonjour!欢迎来到我的Blog
                            </h1>
                        </div>
                    </section>
                    
                    {/* 视频区域 */}
                    <div className="position-relative container-fluid z-1 d-flex justify-content-center">
                        <video className="video-webm" autoPlay muted loop>
                            <source src="/webm/LL-front-special-x2.webm" type="video/webm" />
                        </video>
                        <video className="video-webm" autoPlay muted loop>
                            <source src="/webm/LL-front-special-x1.webm" type="video/webm" />
                        </video>
                        <video className="video-webm" autoPlay muted loop>
                            <source src="/webm/LL-front-Idle-x1.webm" type="video/webm" />
                        </video>
                    </div>
                    <div className="trapezoid position-absolute bottom-0 z-0"></div>
                </div>
                
                {/* 主页面内容 */}
                <section className="container-fluid d-flex flex-column w-100 py-4">
                    <div className="row w-100 justify-content-center p-3">
                        <div className="p-2 d-flex flex-row justify-content-between">
                            
                            {/* 左侧栏 */}
                            <div className="blog-large-card d-flex flex-column gap-4 p-3 ms-auto col-2 rounded-3">
                                {/* 个人信息 */}
                                <div className="blog-small-card-effect blog-post-w d-flex flex-column align-items-center ms-auto col-12 rounded-3">
                                    <Image
                                        src="/img/avatar.jpg"
                                        alt="Avatar"
                                        width={100}
                                        height={100}
                                        className="rounded-circle"
                                        style={{
                                            width: '35%',
                                            height: 'auto',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <span className="gradient-text">LLsDog</span>
                                    <div className="d-flex flex-row">
                                        <a className="fa-brands fa-bilibili p-2 text-decoration-none" href="https://space.bilibili.com/266475962" target="_blank" style={{ color: 'black' }}></a>
                                        <a className="fa-brands fa-github p-2 text-decoration-none" href="https://github.com/llsdog" target="_blank" style={{ color: 'black' }}></a>
                                        <a className="bi bi-envelope-heart-fill p-1 text-decoration-none" href="https://github.com/llsdog" target="_blank" style={{ color: 'black' }}></a>
                                    </div>
                                </div>
                                
                                {/* 公告 */}
                                <div className="blog-small-card-effect blog-post-w d-flex flex-column ms-auto col-12 rounded-3">
                                    <i className="bi bi-megaphone-fill float-start p-2">
                                        <span className="blog-i p-0">Bro有话要说</span>
                                    </i>
                                    <div className="d-flex flex-row m-1">
                                        <span className="m-2 p-0 gradient-text">来点数学分析B1</span>
                                    </div>
                                </div>
                                
                                {/* 一言 - 客户端组件 */}
                                <HitokotoCard />
                                
                                {/* 音乐播放器 */}
                                <MusicPlayer />
                                
                                {/* 建造中 */}
                                <div className="blog-post-w blog-small-card-effect d-flex flex-column ms-auto col-12 rounded-3">
                                    <i className="bi bi-translate p-2">设施建造中</i>
                                </div>
                            </div>
                            
                            {/* 中间内容区域 - 博客列表 */}
                            <div className="blog-large-card blog-post-w container d-flex flex-column align-items-center col-5 gap-4 p-1 m-1 rounded-3">
                                <div className="container d-flex flex-column align-items-center col-12 gap-4 p-1 m-1 rounded-3">
                                    {blogs.map(blog => (
                                        <BlogCard
                                            key={blog.filename}
                                            blog={blog}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* 右侧栏 */}
                            <div className="blog-large-card d-flex flex-column gap-4 p-3 me-auto rounded-3" style={{ flex: '0 0 auto', width: '20%' }}>
                                <div className="blog-small-card blog-post-w d-flex flex-column rounded-3">
                                    <div className="d-flex flex-row">
                                        <i className="bi bi-github p-1"></i>
                                        <span className="m-1 gradient-text">看看我在GitHub干啥</span>
                                    </div>
                                    <GitHubActivity />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
