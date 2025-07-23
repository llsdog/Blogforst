import { NextResponse } from 'next/server';
import { githubConfig } from '@/lib/config';

export async function GET() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${githubConfig.username}/events`,
            {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${githubConfig.token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub activities');
        }
        
        const events = await response.json();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch GitHub activities' },
            { status: 500 }
        );
    }
}
