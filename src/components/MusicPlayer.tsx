'use client';

import { useState, useEffect } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

export const MusicPlayer: React.FC = () => {
    const [initialized, setInitialized] = useState(false);
    const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'playing'>('idle');
    const [error, setError] = useState<string | null>(null);
    
    const musicPlayer = useMusicPlayer({
        volume: 0.2,
        onPlayStart: () => {
            setButtonState('playing');
            setError(null);
        },
        onPlayEnd: () => setButtonState('idle'),
        onLoadStart: () => setButtonState('loading'),
        onError: () => {
            setButtonState('idle');
            setError('播放出错，请重试');
            setTimeout(() => setError(null), 3000);
        }
    });
    
    useEffect(() => {
        const initPlayer = async () => {
            try {
                setButtonState('loading');
                await musicPlayer.init();
                setInitialized(true);
                setButtonState('idle');
            } catch (error) {
                console.error('音乐播放器初始化失败:', error);
                setError('音乐播放器初始化失败');
                setButtonState('idle');
            }
        };
        
        initPlayer();
    }, []);
    
    const handlePlayClick = async () => {
        if (!initialized || musicPlayer.isPlaying || musicPlayer.isLoading) return;
        
        try {
            setError(null);
            await musicPlayer.playRandom();
        } catch (error) {
            console.error('播放失败:', error);
            setError('播放失败，请检查网络连接');
        }
    };
    
    const getButtonText = () => {
        if (error) return '重试';
        
        switch (buttonState) {
            case 'loading':
                return '正在播放...  ';
            case 'playing':
                return '正在播放...';
            default:
                return '随机播放';
        }
    };
    
    return (
        <div className="blog-small-card-effect blog-post-w d-flex flex-row rounded-3 music-play-button-container col-12 align-items-center">
            <div className="d-flex flex-row rounded-3 align-items-center justify-content-center">
                <i className="bi bi-music-note-beamed m-1"></i>
                <span className="blog-i">随机放首背景音乐听听</span>
                
                <button
                    className={`d-flex flex-row btn custom-focus music-play-button m-2 p-1 rounded-4 blog-title btn-outline-secondary ${buttonState}`}
                    type="button"
                    onClick={handlePlayClick}
                    disabled={buttonState !== 'idle'}
                    style={{color: '#007bff'}}
                >
                    <i className="bi bi-chevron-right m-0"></i>
                    <span>{getButtonText()}</span>
                </button>
            </div>
        </div>
    );
};
