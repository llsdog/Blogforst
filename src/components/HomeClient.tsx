'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePageTransition } from '@/hooks/usePageTransition';
import { SnowEffect } from '@/components/SnowEffect';
import { BlogCard } from '@/components/BlogCard';
import { GitHubActivity } from '@/components/GitHubActivity';
import { MusicPlayer } from '@/components/MusicPlayer';
import Image from 'next/image';
import type { BlogPost } from '@/types';

interface HomeClientProps {
    initialBlogs: BlogPost[];
}

export function HomeClient({ initialBlogs }: HomeClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [hitokoto, setHitokoto] = useState({ hitokoto: '', from: '' });
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
    const [isLoadingBlog, setIsLoadingBlog] = useState(false);
    const { currentPage, switchTo, showPage } = usePageTransition();
    
    // 从URL参数获取博客slug
    const blogSlug = searchParams.get('blog');
    
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // 处理博客卡片点击
    const handleBlogClick = async (filename: string) => {
        // 更新URL，添加blog参数
        const newUrl = `/?blog=${filename}`;
        router.push(newUrl, { scroll: false });
    };
    
    // 返回博客列表
    const handleBackToBlogList = () => {
        router.push('/', { scroll: false });
    };
    
    // 监听URL变化，加载对应博客
    useEffect(() => {
        if (blogSlug) {
            setIsLoadingBlog(true);
            fetch(`/api/blog/${blogSlug}`)
                .then(response => response.json())
                .then(blog => {
                    setSelectedBlog(blog);
                })
                .catch(error => {
                    console.error('Failed to load blog:', error);
                    setSelectedBlog(null);
                })
                .finally(() => {
                    setIsLoadingBlog(false);
                });
        } else {
            setSelectedBlog(null);
        }
    }, [blogSlug]);
    
    // 加载一言
    useEffect(() => {
        const fetchHitokoto = async () => {
            try {
                const response = await fetch('/api/hitokoto/');
                const data = await response.json();
                setHitokoto(data);
            } catch (error) {
                console.error('Failed to fetch hitokoto:', error);
            }
        };
        
        fetchHitokoto();
    }, []);
    
    // 初始化页面
    useEffect(() => {
        showPage('body-home-bottom-mainpage', true);
    }, [showPage]);
    
    return (
        <>
            <SnowEffect enabled={true} />
            
            <div id="body-home" className="container-fluid p-0 position-relative">
                {/* 上半部分 - 保持不变 */}
                <div id="body-home-top" className="container-fluid d-flex flex-column w-100 align-items-center border-bottom-0 position-relative">
                    {/* 导航栏 */}
                    <section className="container d-flex justify-content-center" style={{ width: '25%', minWidth: '300px' }}>
                        <div id="nav" className="d-flex flex-row justify-content-center rounded-5">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    id="button-to-mainpage"
                                    className="btn text-white rounded-4 focus-ring custom-focus btn-enhance"
                                    onClick={() => switchTo('body-home-bottom-mainpage')}
                                >
                                    首页
                                </button>
                                <button
                                    type="button"
                                    id="button-to-readme"
                                    className="btn text-white rounded-4 focus-ring custom-focus btn-enhance page-button"
                                    onClick={() => switchTo('body-home-bottom-readme')}
                                >
                                    关于我
                                </button>
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
                <section id="body-home-bottom-mainpage" className="page container-fluid d-flex flex-column w-100 py-4">
                    <div className="row w-100 justify-content-center p-3">
                        <div className="p-2 d-flex flex-row justify-content-between">
                            
                            {/* 左侧栏 - 保持不变 */}
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
                                        <span className="m-2 p-0 gradient-text">关于我页面建设中</span>
                                    </div>
                                </div>
                                
                                {/* 一言 */}
                                <div className="blog-post-w blog-small-card-effect d-flex flex-column ms-auto col-12 rounded-3">
                                    <i className="bi bi-chat-left-quote-fill p-2">
                                        <span className="blog-i p-0">一言</span>
                                    </i>
                                    <div className="d-flex flex-row m-1">
                                        <span className="m-2 p-0 gradient-text bottom-0">{hitokoto.hitokoto}</span>
                                    </div>
                                    {hitokoto.from && (
                                        <span className="ms-auto m-1" style={{ fontSize: '60%' }}>
                                            —— {hitokoto.from}
                                        </span>
                                    )}
                                </div>
                                
                                {/* 音乐播放器 */}
                                <MusicPlayer />
                            
                            </div>
                            
                            {/* 中间内容区域 - 博客列表或详情 */}
                            <div className="blog-large-card blog-post-w container d-flex flex-column align-items-center col-5 gap-4 p-1 m-1 rounded-3">
                                {selectedBlog ? (
                                    // 博客详情视图
                                    <div className="blog-view container d-flex flex-column col-12 gap-4 p-4 m-1">
                                        <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                                            <button
                                                onClick={handleBackToBlogList}
                                                className="btn btn-outline-secondary rounded-4"
                                                style={{color: '#007bff'}}
                                            >
                                                <i className="bi bi-chevron-left blog-title"> 返回</i>
                                            </button>
                                        </div>
                                        
                                        <div className="d-flex flex-row align-items-center justify-content-center m-0">
                                            <h1 className="blog-title mb-0">{selectedBlog.metadata.title}</h1>
                                        </div>
                                        
                                        <div className="d-flex justify-content-center gap-3 text-muted">
                                            <span><i className="bi bi-person-fill"></i> {selectedBlog.metadata.author}</span>
                                            <span><i className="bi bi-calendar"></i> {formatDate(selectedBlog.metadata.date)}</span>
                                        </div>
                                        
                                        <hr className="m-0" />
                                        
                                        <div
                                            className="markdown-content"
                                            dangerouslySetInnerHTML={{ __html: selectedBlog.htmlContent }}
                                        />
                                    </div>
                                ) : (
                                    // 博客列表视图
                                    <div className="blog-view container d-flex flex-column align-items-center col-12 gap-4 p-1 m-1 rounded-3">
                                        {isLoadingBlog ? (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            initialBlogs.map(blog => (
                                                <BlogCard
                                                    key={blog.filename}
                                                    blog={blog}
                                                    formatDate={formatDate}
                                                    onBlogClick={handleBlogClick}
                                                    enableInlineView={true}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* 右侧栏 - 保持不变 */}
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
                
                {/* 关于页面 */}
                <section id="body-home-bottom-readme" className="page container-fluid d-flex w-100 py-4">
                    <div className="d-flex justify-content-center align-items-center w-100 h-100">
                        <h2></h2>
                    </div>
                </section>
            
            </div>
        </>
    );
}
