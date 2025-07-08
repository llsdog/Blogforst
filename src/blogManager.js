import {marked} from 'marked';
import * as bootstrap from 'bootstrap';

export class BlogManager {
    constructor() {
        this.blogs = [];
        this.blogCache = new Map();

        //Create Blog List
        this.blogList = [
            'blog_1',
            'blog_1'
        ];
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

            if (!metadata.image) {
                metadata.image = `./public/blog/${filename}/${filename}_img1.jpg`;
            }

            const blog = {
                filename,
                metadata,
                content: markdownContent,
                htmlContent: marked(markdownContent)
            };

            this.blogCache.set(filename, blog);
            console.log('load blog successfully:', blog.metadata.title);
            return blog;
        } catch (error) {
            console.error(`Load blog file failed: ${filename} with:`, error);
            return null;
        }
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
            <article class="blog-small-card blog-post rounded-4 border border-2 border-dark p-3 position-relative" data-blog="${blog.filename}">
                <div class="blog-post-div d-inline-block float-start">
                    <img class="blog-post-div-img img-fluid" src="${image}" alt="${title}" loading="lazy">
                </div>
                
                <div class="d-flex flex-column p-1">
                    <div class="d-flex flex-row m-1">
                        <h4 class="gradient-text blog-title p-1 text-start d-flex col-5">${title}</h4>
                    </div>
                    
                    <span class="gradient-text blog-text p-1 fs-6 text-start d-flex m-1">
                        ${description}
                    </span>
                    
                    <div class="blog-post-box d-flex flex-row align-items-center m-1">
                        <i class="blog-i bi bi-at p-1">${author}</i>
                        <i class="blog-i bi bi-clock-fill p-2">${this.formatDate(date)}</i>
                        <i class="blog-i bi bi-person-wheelchair p-2">?</i>
                        <i class="blog-i bi bi-chat-dots-fill p-2">${comments}</i>
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
}

// Create an instance of BlogManager
const blogManager = new BlogManager();

// Initialize blogs
export async function initBlogs() {
    try {
        console.log("Initializing blogs...");
        await blogManager.loadAllBlogs();

        // Render blog cards in the container
        const blogContainer = document.getElementById('blog-cards-container');
        console.log("Blog container found");

        if (blogContainer) {
            blogManager.renderBlogCards(blogContainer);
        } else {
            console.error("Blog container not found.");
        }

        // Add click event listener to blog cards
        addBlogCardClickEvents();

    } catch (error) {
        console.error('Failed to initialize blogs:', error);
    }
}

// Add click event listeners to blog cards
function addBlogCardClickEvents() {
    setTimeout(() => {
        const blogCards = document.querySelectorAll('[data-blog]');
        console.log('Adding click events to blog cards:', blogCards.length);

        blogCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const filename = card.dataset.blog;
                openBlogDetail(filename);
            });
        });
    }, 100);
}

function openBlogDetail(filename) {
    const blog = blogManager.getBlogByFilename(filename);
    if (blog) {
       //Create a new page for the blog detail
        console.log('Open Blog:', blog.metadata.title)
        showBlogModal(blog);
    }
}

// Show blog modal
function showBlogModal(blog) {
    const modal = `
        <div>
        
        </div>
    `;

    const existingModal = document.getElementById('blogModal');
    if (existingModal) {
        existingModal.remove();
    }

    //Add new modal
    document.body.insertAdjacentHTML('beforeend', modal);

    //Show the modal
    const modalBs = new bootstrap.Modal(document.getElementById('blogModal'));
    modalBs.show();
}


