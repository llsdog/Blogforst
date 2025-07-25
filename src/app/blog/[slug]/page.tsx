import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SnowEffect } from '@/components/SnowEffect';
import { MusicPlayer } from '@/components/MusicPlayer';
import { GitHubActivity } from '@/components/GitHubActivity';
import { blogConfig } from '@/lib/config';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/color-brewer.css';
import type { BlogPost, BlogMetadata } from '@/types';
import fs from 'fs/promises';
import path from 'path';

// 为 SSG 生成静态参数
export async function generateStaticParams() {
    return blogConfig.blogList.map((filename) => ({
        slug: filename,
    }));
}

// 解析 Markdown 前置信息
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

// 处理图片路径
function processImagePaths(content: string, filename: string): string {
    return content.replace(/!\[(.*?)]\((\.\/.*?)\)/g, (match, alt, src) => {
        const newSrc = `/blog/${filename}/${src.replace('./', '')}`;
        return `![${alt}](${newSrc})`;
    });
}

// 加载单个博客文件
async function loadBlogFile(filename: string): Promise<BlogPost | null> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'blog', filename, `${filename}.md`);
        const content = await fs.readFile(filePath, 'utf-8');
        
        const { metadata, content: markdownContent } = parseFrontMatter(content);
        const processedContent = processImagePaths(markdownContent, filename);
        
        if (!metadata.image) {
            metadata.image = `/blog/${filename}/${filename}_img1.jpg`;
        }
        
        // 设置 markdown-it
        const md = new MarkdownIt({
            html: true,
            xhtmlOut: true,
            breaks: true,
            linkify: true,
            typographer: true,
            highlight: function (str: string, lang: string): string {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                            '</code></pre>';
                    } catch (__) {
                        // 忽略错误
                    }
                }
                return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
            }
        });
        
        const blog: BlogPost = {
            filename,
            metadata,
            content: markdownContent,
            htmlContent: md.render(processedContent)
        };
        
        return blog;
    } catch (error) {
        console.error(`Failed to load blog file: ${filename}`, error);
        return null;
    }
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await loadBlogFile(slug);
    
    if (!blog) {
        return {
            title: '博客未找到'
        };
    }
    
    return {
        title: blog.metadata.title,
        description: blog.metadata.description,
        keywords: blog.metadata.tags,
        authors: [{ name: blog.metadata.author }],
        openGraph: {
            title: blog.metadata.title,
            description: blog.metadata.description,
            images: blog.metadata.image ? [blog.metadata.image] : undefined,
            type: 'article',
            publishedTime: blog.metadata.date,
            authors: [blog.metadata.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.metadata.title,
            description: blog.metadata.description,
            images: blog.metadata.image ? [blog.metadata.image] : undefined,
        }
    };
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

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await loadBlogFile(slug);
    
    if (!blog) {
        notFound();
    }
    
    return (
        <>
            <SnowEffect enabled={true} />
            
            <div id="body-home" className="container-fluid p-0 position-relative">
                {/* 上半部分 - 导航栏 */}
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
                                {blog.metadata.title}
                            </h1>
                        </div>
                    </section>
                    
                    <div className="trapezoid position-absolute bottom-0 z-0"></div>
                </div>
                
                {/* 主内容区域 */}
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
                                
                                {/* 音乐播放器 */}
                                <MusicPlayer />
                            </div>
                            
                            {/* 中间内容区域 - 博客详情 */}
                            <div className="blog-large-card blog-post-w container d-flex flex-column col-5 gap-4 p-1 m-1 rounded-3">
                                <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                                    <Link
                                        href="/"
                                        className="btn btn-outline-secondary"
                                    >
                                        <i className="bi bi-chevron-left blog-title"> 返回</i>
                                    </Link>
                                </div>
                                
                                <div className="d-flex flex-row align-items-center justify-content-center m-0">
                                    <h1 className="blog-title mb-0">{blog.metadata.title}</h1>
                                </div>
                                
                                {/* 博客元信息 */}
                                <div className="d-flex flex-row justify-content-center gap-3 text-muted">
                                    <span><i className="bi bi-person-fill"></i> {blog.metadata.author}</span>
                                    <span><i className="bi bi-calendar-fill"></i> {formatDate(blog.metadata.date)}</span>
                                    {blog.metadata.tags && (
                                        <span><i className="bi bi-tags-fill"></i> {Array.isArray(blog.metadata.tags) ? blog.metadata.tags.join(', ') : blog.metadata.tags}</span>
                                    )}
                                </div>
                                
                                <hr className="m-0" />
                                
                                <div
                                    className="markdown-content"
                                    dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
                                />
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
