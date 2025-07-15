import gsap from "gsap";

class SwitchPage {
    constructor() {
        this.currentPage = 'body-home-bottom-mainpage';
        this.isTransitioning = false;

        // 页面配置
        this.pageConfigs = {
            'body-home-bottom-mainpage': {
                backgroundClass: 'page-background-moon',
                removeClass: 'page-background-sun'
            },
            'body-home-bottom-readme': {
                backgroundClass: 'page-background-sun',
                removeClass: 'page-background-moon'
            }
        };

        this.init();
    }

    init() {
        document.getElementById("button-to-mainpage")?.addEventListener("click", () => {
            this.switchTo('body-home-bottom-mainpage');
        });

        document.getElementById("button-to-readme")?.addEventListener("click", () => {
            this.switchTo('body-home-bottom-readme');
        });

        this.showPage('body-home-bottom-mainpage', true);
    }

    switchTo(pageId) {
        if (this.isTransitioning || this.currentPage === pageId) return;
        this.showPage(pageId, false);
    }

    showPage(pageId, isInitial = false) {
        const bodyHomeTop = document.querySelector("#body-home-top");
        const targetPage = document.getElementById(pageId);
        const allPages = document.querySelectorAll('.page');

        if (!targetPage || !bodyHomeTop) return;

        if (isInitial) {
            allPages.forEach(page => page.classList.remove('active'));
            targetPage.classList.add('active');
            this.updateBackground(bodyHomeTop, pageId);
            this.currentPage = pageId;
            return;
        }

        this.isTransitioning = true;

        this.createTransitionAnimation(bodyHomeTop, targetPage, allPages, pageId);
    }

    createTransitionAnimation(bodyHomeTop, targetPage, allPages, pageId) {
        const tl = gsap.timeline({
            onComplete: () => {
                this.isTransitioning = false;
                this.currentPage = pageId;
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
                    this.updateBackground(bodyHomeTop, pageId);
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
                    this.updateBackground(bodyHomeTop, pageId);
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

        this.addVisualFeedback(pageId);
    }

    updateBackground(bodyHomeTop, pageId) {
        const config = this.pageConfigs[pageId];
        if (config) {
            bodyHomeTop.classList.remove(config.removeClass);
            bodyHomeTop.classList.add(config.backgroundClass);
        }
    }

    addVisualFeedback(pageId) {
        const buttons = document.querySelectorAll('.page-button');
        buttons.forEach(btn => btn.classList.remove('active'));

        const activeButton = pageId === 'body-home-bottom-mainpage'
            ? document.getElementById('button-to-mainpage')
            : document.getElementById('button-to-readme');

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
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setPage(pageId) {
        this.showPage(pageId, true);
    }
}

export default new SwitchPage();