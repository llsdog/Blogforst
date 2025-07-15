import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/color-brewer.css'
import {config} from "./config.js";


export class BlogManager {
    constructor() {
        this.blogs = [];
        this.blogCache = new Map();
        this.currentView = 'list';

        // set up markdownit
        this.md = markdownit({
            html: true,
            xhtmlOut: true,
            breaks: true,
            linkify: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                            '</code></pre>';
                    } catch (__) {}
                    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
                }
            }
        });

        // Create Blog List
        this.blogList = config.blogList
    }

    // Read out Front Matter
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);

        if (!match) {
            return {
                metadata: {},
                content: content
            };
        }

        const frontMatter = match[1];
        const markdownContent = match[2];

        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                let value = valueParts.join(':').trim();

                // Try to parse as JSON
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    value = JSON.parse(value);
                } else if (!isNaN(value)) {
                    value = Number(value);
                }

                metadata[key.trim()] = value;
            }
        });

        return {
            metadata,
            content: markdownContent
        }
    }

    //Get a blog list
    async getBlogList() {
        return this.blogList;
    }

    // Load a blog
    async loadBlogFile(filename){
        if (this.blogCache.has(filename)) {
            return this.blogCache.get(filename);
        }

        try {
            const response = await fetch(`./public/blog/${filename}/${filename}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log("Get blog file successfully:", filename);
            }

            const content = await response.text();
            const { metadata, content: markdownContent } = this.parseFrontMatter(content);
            const processedContent = this.processImagePaths(markdownContent, filename);

            if (!metadata.image) {
                metadata.image = `./public/blog/${filename}/${filename}_img1.jpg`;
            }

            const blog = {
                filename,
                metadata,
                content: markdownContent,
                htmlContent: this.md.render(processedContent)
            };

            this.blogCache.set(filename, blog);
            console.log('load blog successfully:', blog.metadata.title);
            return blog;
        } catch (error) {
            console.error(`Load blog file failed: ${filename} with:`, error);
            return null;
        }
    }

    processImagePaths(content, filename) {
        return content.replace(/!\[(.*?)]\((\.\/.*?)\)/g, (match, alt, src) => {
            // Convert a relative path to an absolute path
            const newSrc = `./public/blog/${filename}/${src.replace('./', '')}`;
            return `![${alt}](${newSrc})`;
        })
    }

    // Load all blogs
    async loadAllBlogs() {
        const blogFiles = await this.getBlogList();
        const blogs = [];

        for (const filename of blogFiles) {
            const blog = await this.loadBlogFile(filename);
            if (blog) {
                blogs.push(blog);
            }
        }

        // Sort blogs by date
        blogs.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

        this.blogs = blogs;
        console.log('All blogs loaded successfully:', this.blogs.length);
        return blogs;
    }

    // render blogs card
    renderBlogCards(container) {
        if (!container) {
            console.log("Blog container not found.");
            return;
        }

        container.innerHTML = this.blogs.map(blog =>
            this.createBlogCard(blog)).join('');
        console.log('Blog cards rendered successfully:', this.blogs.length);

    }

    //Create a blog card HTML
    createBlogCard(blog) {
        const { metadata } = blog;
        const {
            title = 'No Title',
            date = 'Unknown Date',
            author = 'Unknown Author',
            description = 'No Description',
            image = '/default-image.png',
            comments = 0
        } = metadata;

        return `
            <article class="blog-small-card-effect blog-post rounded-4 border border-2 border-dark p-3 position-relative" data-blog="${blog.filename}">
                <div class="blog-post-div d-inline-block float-start">
                    <img class="blog-post-div-img img-fluid" src="${image}" alt="${title}" loading="lazy">
                </div>
                
                <div class="d-flex flex-column p-1">
                    <div class="d-flex flex-row m-1">
                        <h4 class="gradient-text blog-title p-1 text-start d-flex">${title}</h4>
                    </div>
                    
                    <span class="gradient-text blog-text p-1 fs-6 text-start d-flex m-1">
                        ${description}
                    </span>
                    
                    <div class="blog-post-box d-flex flex-row align-items-center m-1">
                        <i class="blog-i bi bi-at m-1">${author}</i>
                        <i class="blog-i bi bi-clock-fill m-2">${this.formatDate(date)}</i>
                        <i class="blog-i bi bi-person-fill m-2">?</i>
                        <i class="blog-i bi bi-chat-dots-fill m-2">${comments}</i>
                    </div>
                </div>
            </article>
        `;
    }

    // Format date to a readable string
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Get Blog
    getBlogByFilename(filename) {
        return this.blogs.find(blog => blog.filename === filename);
    }

    // Switch to detail view
    switchToDetailView(blog) {
        const listView = document.getElementById("blog-list-view");
        const detailView = document.getElementById('blog-detail-view');

        if (!listView || !detailView) {
            console.error('Blog views not found');
            return;
        }

        //switch views
        listView.classList.remove('active');
        detailView.classList.add('active');

        //update URL
        const newUrl = `${window.location.origin}${window.location.pathname}?blog=${blog.filename}`;
        window.history.pushState({blog: blog.filename}, '', newUrl);

        // Render blog detail
        this.renderBlogDetail(blog);
    }

    // switch back to list view
    switchToListView() {
        const listView = document.getElementById('blog-list-view');
        const detailView = document.getElementById('blog-detail-view');

        if (!listView || !detailView) {
            console.error('Blog views not found');
            return;
        }

        //update URL
        const newUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.pushState({}, '', newUrl);

        //switch views
        detailView.classList.remove('active');
        listView.classList.add('active');
    }

    renderBlogDetail(blog) {
        const titleElement = document.getElementById('blog-detail-title');
        const contentElement = document.getElementById('blog-detail-content');

        if (titleElement && contentElement) {
            titleElement.textContent = blog.metadata.title || 'No Title';
            contentElement.innerHTML = blog.htmlContent;
        }
    }

    handlePopState(event) {
        if (event.state && event.state.blog) {
            const blog = this.getBlogByFilename(event.state.blog);
            if (blog) {
                this.switchToDetailView(blog);
            } else {
                this.switchToListView();
            }
        } else {
            this.switchToListView();
        }
    }
}

// Create an instance of BlogManager
export const blogManager = new BlogManager();

// Initialize blogs
export async function initBlogs() {
    try {
        console.log("Initializing blogs...");
        await blogManager.loadAllBlogs();

        //init active view
        const listView = document.getElementById('blog-list-view');
        const detailView = document.getElementById('blog-detail-view');

        if (listView && detailView) {
            listView.classList.add('active');
            detailView.classList.remove('active');
        }

        // Render blog cards in the container
        const blogContainer = document.getElementById('blog-cards-container');
        if (blogContainer) {
            blogManager.renderBlogCards(blogContainer);
        } else {
            console.error("Blog container not found.");
        }

        // Add click event listener to blog cards
        setupEventListeners();

    } catch (error) {
        console.error('Failed to initialize blogs:', error);
    }
}

// Add click event listeners to blog cards
function setupEventListeners() {
    document.getElementById('blog-cards-container').addEventListener('click', (e) => {
        const card = e.target.closest('[data-blog]');
        if (card) {
            const filename = card.dataset.blog;
            const blog = blogManager.getBlogByFilename(filename);
            if (blog) blogManager.switchToDetailView(blog);
        }
    });

    const backButton = document.getElementById('back-to-list-btn');
    backButton?.addEventListener('click', () => blogManager.switchToListView());
}








