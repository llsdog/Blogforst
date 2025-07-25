'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import React from "react";

interface BlogCardProps {
    blog: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const { metadata } = blog;
    const {
        title = 'No Title',
        date = 'Unknown Date',
        formattedDate = date, // 使用预处理的格式化日期，如果没有则使用原始日期
        author = 'Unknown Author',
        description = 'No Description',
        image = '/blog/default/default_img1.jpg',
        comments = 0
    } = metadata;
    
    return (
        <Link href={`/blog/${blog.filename}`} className="text-decoration-none">
            <article
                className="blog-small-card-effect blog-post rounded-4 border border-2 border-dark p-3 position-relative "
                style={{ cursor: 'pointer', color: 'black' }}
                data-blog={blog.filename}
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
                        <i className="blog-i bi bi-clock-fill m-2">{formattedDate}</i>
                        <i className="blog-i bi bi-person-fill m-2">?</i>
                        <i className="blog-i bi bi-chat-dots-fill m-2">{comments}</i>
                    </div>
                </div>
            </article>
        </Link>
    );
};
