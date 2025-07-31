'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import React from "react";

interface BlogCardProps {
    blog: BlogPost;
    formatDate: (date: string) => string;
    onBlogClick?: (filename: string) => void;
    enableInlineView?: boolean; // 新增：控制是否启用内联查看
}

export const BlogCard: React.FC<BlogCardProps> = ({
                                                      blog,
                                                      formatDate,
                                                      onBlogClick,
                                                      enableInlineView = false
                                                  }) => {
    const { metadata } = blog;
    const {
        title = 'No Title',
        date = 'Unknown Date',
        author = 'Unknown Author',
        description = 'No Description',
        image = '/blog/default/default_img1.jpg',
        comments = 0
    } = metadata;
    
    const handleClick = (e: React.MouseEvent) => {
        if (enableInlineView && onBlogClick) {
            e.preventDefault();
            onBlogClick(blog.filename);
        }
        // 如果 enableInlineView 为 false，则让 Link 正常工作
    };
    
    const cardContent = (
        <article
            className="blog-small-card-effect blog-post rounded-4 border border-2 border-dark p-3 position-relative"
            style={{ cursor: 'pointer' }}
            data-blog={blog.filename}
            onClick={handleClick}
        >
            <div className="blog-post-div d-inline-block float-start">
                <Image
                    src={image}
                    alt={title}
                    width={185}
                    height={185}
                    className="blog-post-div-img img-fluid"
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '1/1',
                        objectFit: 'contain'
                    }}
                />
            </div>
            
            <div className="d-flex flex-column p-1">
                <div className="d-flex flex-row m-1">
                    <h4 className="gradient-text blog-title p-1 text-start d-flex">{title}</h4>
                </div>
                
                <div className="d-flex flex-row m-1">
                    <span className="gradient-text blog-text p-1 fs-6 text-start d-flex m-1">{description}</span>
                </div>
                
                <div className="blog-post-box d-flex flex-row align-items-center m-1">
                    <i className="blog-i bi bi-at m-1">{author}</i>
                    <i className="blog-i bi bi-clock-fill m-2">{formatDate(date)}</i>
                    <i className="blog-i bi bi-person-fill m-2">?</i>
                    <i className="blog-i bi bi-chat-dots-fill m-2">{comments}</i>
                </div>
            </div>
        </article>
    );
    
    // 如果启用内联查看，直接返回内容；否则用 Link 包装
    return enableInlineView ? cardContent : (
        <Link href={`/blog/${blog.filename}`} className="text-decoration-none">
            {cardContent}
        </Link>
    );
};
