'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/color-brewer.css';
import type { BlogPost, BlogMetadata } from '@/types';
import { blogConfig } from '@/lib/config';

export const useBlog = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'detail'>('list');
    
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 设置 markdown-it，添加正确的类型注解
    const md: MarkdownIt = new MarkdownIt({
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
                    // 忽略错误，使用默认处理
                }
            }
            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    });
    
    const parseFrontMatter = (content: string): { metadata: BlogMetadata; content: string } => {
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
                    // 如果是相对路径，转换为正确的路径
                    if (value.startsWith('./public/')) {
                        value = value.replace('./public', '');
                    } else if (value.startsWith('./')) {
                        // 其他相对路径处理
                        value = value.replace('./', '/');
                    }
                }
                
                // 尝试解析为JSON，与原代码逻辑保持一致
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    try {
                        value = JSON.parse(value) as string[];
                    } catch {
                        // 如果解析失败，保持原值
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
    };
    
    const processImagePaths = (content: string, filename: string): string => {
        return content.replace(/!\[(.*?)]\((\.\/.*?)\)/g, (match, alt, src) => {
            // 将相对路径转换为绝对路径
            const newSrc = `/blog/${filename}/${src.replace('./', '')}`;
            return `![${alt}](${newSrc})`; // 修复：使用正确的 markdown 语法
        });
    };
    
    const loadBlogFile = async (filename: string): Promise<BlogPost | null> => {
        try {
            const response = await fetch(`/blog/${filename}/${filename}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log("Get blog file successfully:", filename);
            }
            
            const content = await response.text();
            const { metadata, content: markdownContent } = parseFrontMatter(content);
            const processedContent = processImagePaths(markdownContent, filename);
            
            if (!metadata.image) {
                metadata.image = `/blog/${filename}/${filename}_img1.jpg`;
            }
            
            const blog: BlogPost = {
                filename,
                metadata,
                content: markdownContent,
                htmlContent: md.render(processedContent)
            };
            
            console.log('load blog successfully:', blog.metadata.title);
            return blog;
        } catch (error) {
            console.error(`Failed to load blog file: ${filename}`, error);
            return null;
        }
    };
    
    const loadAllBlogs = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        
        try {
            const blogPromises = blogConfig.blogList.map(filename => loadBlogFile(filename));
            const blogResults = await Promise.all(blogPromises);
            const validBlogs = blogResults.filter((blog): blog is BlogPost => blog !== null);
            
            // 按日期排序
            validBlogs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
            
            setBlogs(validBlogs);
            console.log('All blogs loaded successfully:', validBlogs.length);
        } catch (err) {
            setError('Failed to load blogs');
            console.error('Failed to load blogs:', err);
        } finally {
            setLoading(false);
        }
    }, [loadBlogFile]);
    
    const getBlogByFilename = useCallback((filename: string): BlogPost | undefined => {
        return blogs.find(blog => blog.filename === filename);
    }, [blogs]);
    
    const switchToDetailView = useCallback((blog: BlogPost): void => {
        setCurrentBlog(blog);
        setView('detail');
        // 使用 shallow routing 避免页面跳转到顶部
        router.push(`/?blog=${blog.filename}`, { scroll: false });
    }, [router]);
    
    const switchToListView = useCallback((): void => {
        setCurrentBlog(null);
        setView('list');
        // 使用 shallow routing
        router.push('/', { scroll: false });
    }, [router]);
    
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // 处理URL参数
    useEffect(() => {
        const blogParam = searchParams.get('blog');
        if (blogParam && blogs.length > 0) {
            const blog = getBlogByFilename(blogParam);
            if (blog && currentBlog?.filename !== blog.filename) {
                setCurrentBlog(blog);
                setView('detail');
            }
        } else if (!blogParam && view === 'detail') {
            setCurrentBlog(null);
            setView('list');
        }
    }, [searchParams, blogs, getBlogByFilename, currentBlog, view]);
    // 初始化加载
    useEffect(() => {
        loadAllBlogs();
    }, []);
    
    return {
        blogs,
        currentBlog,
        loading,
        error,
        view,
        switchToDetailView,
        switchToListView,
        getBlogByFilename,
        formatDate,
        reload: loadAllBlogs
    };
};
