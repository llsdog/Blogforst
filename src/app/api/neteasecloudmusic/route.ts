import { NextRequest, NextResponse } from 'next/server';
import { musicConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const id = searchParams.get('id');
        
        if (!action || !id) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }
        
        const apiMap = {
            playlist: `/playlist/track/all?id=${id}`,
            songurl: `/song/url?id=${id}`
        };
        
        const endpoint = apiMap[action as keyof typeof apiMap];
        if (!endpoint) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }
        
        const response = await fetch(`${musicConfig.baseURL}${endpoint}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('API 代理错误:', error);
        return NextResponse.json(
            { error: 'API request failed' },
            { status: 500 }
        );
    }
}
