'use client';

import { useState, useRef, useCallback } from 'react';
import { musicConfig } from '@/lib/config';

interface Song {
    id: number;
    name: string;
    artist: string;
    album: string;
    albumPic: string;
    duration: number;
}

interface MusicPlayerOptions {
    volume?: number;
    onPlayStart?: (song: Song) => void;
    onPlayEnd?: () => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: any) => void;
}

export const useMusicPlayer = (options: MusicPlayerOptions = {}) => {
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [volume] = useState(options.volume || 0.8);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const initAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
            audioRef.current.preload = 'metadata';
            
            audioRef.current.addEventListener('loadstart', () => {
                setIsLoading(true);
                options.onLoadStart?.();
            });
            
            audioRef.current.addEventListener('canplay', () => {
                setIsLoading(false);
                options.onLoadEnd?.();
            });
            
            audioRef.current.addEventListener('play', () => {
                setIsPlaying(true);
                options.onPlayStart?.(currentSong!);
            });
            
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentSong(null);
                options.onPlayEnd?.();
            });
            
            audioRef.current.addEventListener('error', (e) => {
                console.error('音频播放错误:', e);
                setIsPlaying(false);
                setIsLoading(false);
                options.onError?.({ error: e, song: currentSong });
            });
        }
    }, [volume, currentSong, options]);
    
    const loadPlaylist = async () => {
        const response = await fetch(`/api/neteasecloudmusic?action=playlist&id=${musicConfig.listid}`);
        const data = await response.json();
        
        if (data.code === 200 && data.songs) {
            const songs = data.songs.map((song: any) => ({
                id: song.id,
                name: song.name,
                artist: song.ar?.map((artist: any) => artist.name).join(' / ') || '未知艺术家',
                album: song.al?.name || '未知专辑',
                albumPic: song.al?.picUrl || '',
                duration: song.dt || 0
            }));
            
            setPlaylist(songs);
            console.log(`成功加载歌单，共 ${songs.length} 首歌曲`);
            return songs;
        } else {
            throw new Error(data.message || '加载歌单失败');
        }
    };
    
    const getSongUrl = async (songId: number): Promise<string> => {
        const response = await fetch(`/api/neteasecloudmusic?action=songurl&id=${songId}`);
        const data = await response.json();
        
        if (data.code === 200 && data.data?.[0]?.url) {
            return data.data[0].url;
        } else {
            throw new Error('获取歌曲URL失败');
        }
    };
    
    const playRandom = async () => {
        if (playlist.length === 0) {
            throw new Error('歌单为空');
        }
        
        if (isPlaying && audioRef.current) {
            stop();
        }
        
        const randomIndex = Math.floor(Math.random() * playlist.length);
        const song = playlist[randomIndex];
        setCurrentSong(song);
        
        try {
            initAudio();
            const url = await getSongUrl(song.id);
            
            if (audioRef.current && url) {
                audioRef.current.src = url;
                options.onPlayStart?.(song);
                await audioRef.current.play();
            }
        } catch (error) {
            console.error('播放歌曲失败:', error);
            setCurrentSong(null);
            options.onError?.({ error, song });
            throw error;
        }
    };
    
    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentSong(null);
    };
    
    const init = async () => {
        try {
            await loadPlaylist();
            initAudio();
            return true;
        } catch (error) {
            console.error('初始化播放器失败:', error);
            throw error;
        }
    };
    
    return {
        playlist,
        currentSong,
        isPlaying,
        isLoading,
        volume,
        init,
        playRandom,
        stop
    };
};
