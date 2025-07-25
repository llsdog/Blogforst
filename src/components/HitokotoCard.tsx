'use client';

import { useEffect, useState } from 'react';

export function HitokotoCard() {
    const [hitokoto, setHitokoto] = useState({ hitokoto: '', from: '' });
    
    useEffect(() => {
        const fetchHitokoto = async () => {
            try {
                const response = await fetch('https://v1.hitokoto.cn');
                const data = await response.json();
                setHitokoto(data);
            } catch (error) {
                console.error('Failed to fetch hitokoto:', error);
            }
        };
        
        fetchHitokoto();
    }, []);
    
    return (
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
    );
}
