'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

type PageType = 'body-home-bottom-mainpage' | 'body-home-bottom-readme';

export const usePageTransition = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('body-home-bottom-mainpage');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isInitialized = useRef(false);
    
    const pageConfigs = {
        'body-home-bottom-mainpage': {
            backgroundClass: 'page-background-moon',
            removeClass: 'page-background-sun'
        },
        'body-home-bottom-readme': {
            backgroundClass: 'page-background-sun',
            removeClass: 'page-background-moon'
        }
    };
    
    const updateBackground = useCallback((element: HTMLElement | null, pageId: PageType) => {
        if (!element) return;
        
        const config = pageConfigs[pageId];
        if (config) {
            element.classList.remove(config.removeClass);
            element.classList.add(config.backgroundClass);
        }
    }, [pageConfigs]);
    
    const addVisualFeedback = useCallback((pageId: PageType) => {
        const buttons = document.querySelectorAll('.page-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const activeButtonId = pageId === 'body-home-bottom-mainpage'
            ? 'button-to-mainpage'
            : 'button-to-readme';
        const activeButton = document.getElementById(activeButtonId);
        
        if (activeButton) {
            activeButton.classList.add('active');
            
            gsap.to(activeButton, {
                scale: 1.1,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }, []);
    
    const createTransitionAnimation = useCallback((
        bodyHomeTop: HTMLElement,
        targetPage: HTMLElement,
        allPages: NodeListOf<Element>,
        pageId: PageType
    ) => {
        const tl = gsap.timeline({
            onComplete: () => {
                setIsTransitioning(false);
                setCurrentPage(pageId);
            }
        });
        
        const currentPageElement = document.querySelector('.page.active');
        
        if (pageId === 'body-home-bottom-mainpage') {
            tl.to(bodyHomeTop, {
                rotationY: -15,
                x: 150,
                scale: 0.9,
                duration: 0.6,
                ease: "power2.inOut"
            })
                .to(currentPageElement, {
                    opacity: 0,
                    y: -50,
                    rotationX: 20,
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.3")
                .call(() => {
                    updateBackground(bodyHomeTop, pageId);
                    allPages.forEach(page => page.classList.remove('active'));
                    targetPage.classList.add('active');
                    
                    gsap.set(targetPage, {
                        opacity: 0,
                        y: 50,
                        rotationX: -20
                    });
                })
                .to(bodyHomeTop, {
                    rotationY: 0,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                })
                .to(targetPage, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, "-=0.3")
                .from(targetPage.querySelectorAll('.blog-large-card'), {
                    scale: 0.8,
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=0.2");
            
        } else if (pageId === 'body-home-bottom-readme') {
            tl.to(bodyHomeTop, {
                rotationY: 15,
                x: -150,
                scale: 0.9,
                duration: 0.6,
                ease: "power2.inOut"
            })
                .to(currentPageElement, {
                    opacity: 0,
                    y: 50,
                    rotationX: -20,
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.3")
                .call(() => {
                    updateBackground(bodyHomeTop, pageId);
                    allPages.forEach(page => page.classList.remove('active'));
                    targetPage.classList.add('active');
                    
                    gsap.set(targetPage, {
                        opacity: 0,
                        y: -50,
                        rotationX: 20
                    });
                })
                .to(bodyHomeTop, {
                    rotationY: 0,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                })
                .to(targetPage, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, "-=0.3")
                .from(targetPage.querySelectorAll('.row'), {
                    scale: 0.9,
                    opacity: 0,
                    x: -30,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "-=0.2");
        }
        
        addVisualFeedback(pageId);
    }, [updateBackground, addVisualFeedback]);
    
    const switchTo = useCallback((pageId: PageType) => {
        if (isTransitioning || currentPage === pageId) return;
        
        const bodyHomeTop = document.querySelector("#body-home-top") as HTMLElement;
        const targetPage = document.getElementById(pageId) as HTMLElement;
        const allPages = document.querySelectorAll('.page');
        
        if (!targetPage || !bodyHomeTop) return;
        
        setIsTransitioning(true);
        createTransitionAnimation(bodyHomeTop, targetPage, allPages, pageId);
    }, [isTransitioning, currentPage, createTransitionAnimation]);
    
    const showPage = useCallback((pageId: PageType, isInitial: boolean = false) => {
        const bodyHomeTop = document.querySelector("#body-home-top") as HTMLElement;
        const targetPage = document.getElementById(pageId) as HTMLElement;
        const allPages = document.querySelectorAll('.page');
        
        if (!targetPage || !bodyHomeTop) return;
        
        if (isInitial) {
            allPages.forEach(page => page.classList.remove('active'));
            targetPage.classList.add('active');
            updateBackground(bodyHomeTop, pageId);
            setCurrentPage(pageId);
            return;
        }
        
        switchTo(pageId);
    }, [updateBackground, switchTo]);
    
    // 初始化逻辑 - 相当于原版的 init() 方法
    useEffect(() => {
        if (isInitialized.current) return;
        
        const handleToMainPage = () => {
            switchTo('body-home-bottom-mainpage');
        };
        
        const handleToReadme = () => {
            switchTo('body-home-bottom-readme');
        };
        
        // 添加事件监听器
        const mainPageButton = document.getElementById("button-to-mainpage");
        const readmeButton = document.getElementById("button-to-readme");
        
        mainPageButton?.addEventListener("click", handleToMainPage);
        readmeButton?.addEventListener("click", handleToReadme);
        
        // 显示初始页面
        showPage('body-home-bottom-mainpage', true);
        
        isInitialized.current = true;
        
        // 清理函数
        return () => {
            mainPageButton?.removeEventListener("click", handleToMainPage);
            readmeButton?.removeEventListener("click", handleToReadme);
        };
    }, [switchTo, showPage]);
    
    return {
        currentPage,
        isTransitioning,
        switchTo,
        showPage
    };
};
