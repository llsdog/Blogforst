import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import type { BlogPost, BlogMetadata } from '@/types';
import { blogConfig } from '@/lib/config';

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
                // 忽略错误
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
            
            if (key.trim() === 'image') {
                if (value.startsWith('./public/')) {
                    value = value.replace('./public', '');
                } else if (value.startsWith('./')) {
                    value = value.replace('./', '/');
                }
            }
            
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value) as string[];
                } catch {
                    // 保持原值
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
        const newSrc = `/blog/${filename}/${src.replace('./', '')}`;
        return `!${alt} [<sup>1</sup>](${newSrc})`;
    });
};

export async function loadBlogFile(filename: string): Promise<BlogPost | null> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'blog', filename, `${filename}.md`);
        
        if (!fs.existsSync(filePath)) {
            return null;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
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
        
        return blog;
    } catch (error) {
        console.error(`Failed to load blog file: ${filename}`, error);
        return null;
    }
}

export function getBlogList(): string[] {
    return blogConfig.blogList;
}

export async function getAllBlogs(): Promise<BlogPost[]> {
    const blogPromises = blogConfig.blogList.map(filename => loadBlogFile(filename));
    const blogResults = await Promise.all(blogPromises);
    const validBlogs = blogResults.filter((blog): blog is BlogPost => blog !== null);
    
    // 按日期排序
    validBlogs.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    
    return validBlogs;
}
