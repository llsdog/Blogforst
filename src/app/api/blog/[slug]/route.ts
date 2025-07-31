import { NextRequest, NextResponse } from 'next/server';
import { loadBlogFile } from '@/lib/blogLoader';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const blog = await loadBlogFile(slug);
        
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error loading blog:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
