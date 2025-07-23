'use client';

import { useEffect, useRef } from 'react';
import { snowConfig } from '@/lib/config';
import type { SnowflakeOptions } from '@/types';

interface SnowflakeData {
    x: number;
    y: number;
    speed: number;
    wind: number;
    size: number;
    opacity: number;
}

export const useSnowEffect = (enabled: boolean = true) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const snowflakesRef = useRef<HTMLDivElement[]>([]);
    const animationIdRef = useRef<number | null>(null);
    const isRunningRef = useRef(false);
    
    const options: SnowflakeOptions = snowConfig;
    
    const createSnowflake = (): HTMLDivElement => {
        const snowflake = document.createElement('div');
        const size = Math.random() * (options.maxSize - options.minSize) + options.minSize;
        const speed = Math.random() * (options.maxSpeed - options.minSpeed) + options.minSpeed;
        const opacity = Math.random() * 0.6 + 0.4;
        
        snowflake.style.cssText = `
      position: absolute;
      top: -10px;
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${options.snowflakeColor} 0%, transparent 70%);
      border-radius: 50%;
      opacity: ${opacity};
      pointer-events: none;
    `;
        
        (snowflake as any).snowData = {
            x: parseFloat(snowflake.style.left),
            y: -10,
            speed: speed,
            wind: (Math.random() - 0.5) * options.wind,
            size: size,
            opacity: opacity,
        } as SnowflakeData;
        
        return snowflake;
    };
    
    const updateSnowflakes = () => {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        for (let i = snowflakesRef.current.length - 1; i >= 0; i--) {
            const snowflake = snowflakesRef.current[i];
            const data = (snowflake as any).snowData as SnowflakeData;
            
            data.y += data.speed;
            data.x += data.wind;
            snowflake.style.top = data.y + 'px';
            snowflake.style.left = data.x + '%';
            
            if (data.y > windowHeight || data.x < -5 || data.x > 105) {
                if (containerRef.current) {
                    containerRef.current.removeChild(snowflake);
                }
                snowflakesRef.current.splice(i, 1);
            }
        }
        
        if (snowflakesRef.current.length < options.maxSnowflakes && Math.random() < 0.3) {
            const snowflake = createSnowflake();
            snowflakesRef.current.push(snowflake);
            if (containerRef.current) {
                containerRef.current.appendChild(snowflake);
            }
        }
    };
    
    const animate = () => {
        if (!isRunningRef.current) return;
        updateSnowflakes();
        animationIdRef.current = requestAnimationFrame(animate);
    };
    
    const start = () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        animate();
    };
    
    const stop = () => {
        isRunningRef.current = false;
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
    };
    
    useEffect(() => {
        if (!enabled) return;
        
        // 创建容器
        const container = document.createElement('div');
        container.id = 'snow-effect-container';
        container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${options.zIndex};
      overflow: hidden;
    `;
        
        document.body.appendChild(container);
        containerRef.current = container;
        
        // 创建初始雪花
        const initialCount = Math.floor(options.maxSnowflakes / 2);
        for (let i = 0; i < initialCount; i++) {
            const snowflake = createSnowflake();
            (snowflake as any).snowData.y = Math.random() * window.innerHeight;
            snowflake.style.top = (snowflake as any).snowData.y + 'px';
            snowflakesRef.current.push(snowflake);
            container.appendChild(snowflake);
        }
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        start();
        
        return () => {
            stop();
            if (containerRef.current && containerRef.current.parentNode) {
                containerRef.current.parentNode.removeChild(containerRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            snowflakesRef.current = [];
        };
    }, [enabled]);
    
    return { start, stop };
};
