class SnowEffect {
    constructor(options = {}) {
        this.options = {
            maxSnowflakes: options.maxSnowflakes || 100,
            snowflakeColor: options.snowflakeColor || 'white',
            minSize: options.minSize || 3,
            maxSize: options.maxSize || 8,
            minSpeed: options.minSpeed || 1,
            maxSpeed: options.maxSpeed || 3,
            wind: options.wind || 0.5,
            zIndex: options.zIndex || 9999,
            ...options
        };

        this.snowflakes = [];
        this.container = null;
        this.isRunning = false;
        this.animationId = null;

        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.id = 'snow-effect-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: ${this.options.zIndex};
            overflow: hidden;
        `;

        document.body.appendChild(this.container);
        this.createInitialSnowflakes();
        this.start();
        window.addEventListener('resize', () => this.handleResize());

        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
        const speed = Math.random() * (this.options.maxSpeed - this.options.minSpeed) + this.options.minSpeed;
        const opacity = Math.random() * 0.6 + 0.4;

        snowflake.style.cssText = `
            position: absolute;
            top: -10px;
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${this.options.snowflakeColor} 0%, transparent 70%);
            border-radius: 50%;
            opacity: ${opacity};
            pointer-events: none;
        `;

        snowflake.snowData = {
            x: parseFloat(snowflake.style.left),
            y: -10,
            speed: speed,
            wind: (Math.random() - 0.5) * this.options.wind,
            size: size,
            opacity: opacity
        };

        return snowflake;
    }

    createInitialSnowflakes() {
        const initialCount = Math.floor(this.options.maxSnowflakes / 2);
        for (let i = 0; i < initialCount; i++) {
            const snowflake = this.createSnowflake();
            snowflake.snowData.y = Math.random() * window.innerHeight;
            snowflake.style.top = snowflake.snowData.y + 'px';
            this.snowflakes.push(snowflake);
            this.container.appendChild(snowflake);
        }
    }

    updateSnowflakes() {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        for (let i = this.snowflakes.length - 1; i >= 0; i--) {
            const snowflake = this.snowflakes[i];
            const data = snowflake.snowData;

            data.y += data.speed;
            data.x += data.wind;
            snowflake.style.top = data.y + 'px';
            snowflake.style.left = data.x + '%';

            if (data.y > windowHeight || data.x < -5 || data.x > 105) {
                this.container.removeChild(snowflake);
                this.snowflakes.splice(i, 1);
            }
        }

        if (this.snowflakes.length < this.options.maxSnowflakes && Math.random() < 0.3) {
            const snowflake = this.createSnowflake();
            this.snowflakes.push(snowflake);
            this.container.appendChild(snowflake);
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.updateSnowflakes();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stop();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.snowflakes = [];
        this.container = null;

        // 移除事件监听
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    handleResize() {
        this.snowflakes.forEach(snowflake => {
            const data = snowflake.snowData;
            if (data.x > 100) {
                data.x = 100;
                snowflake.style.left = '100%';
            }
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    }

    // 动态调整参数
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        if (this.container) {
            this.container.style.zIndex = this.options.zIndex;
        }
    }
}

// 自动初始化（可选）
let snowEffect = null;

// 提供全局方法
window.SnowEffect = {
    start: (options = {}) => {
        if (snowEffect) {
            snowEffect.destroy();
        }
        snowEffect = new SnowEffect(options);
        return snowEffect;
    },

    stop: () => {
        if (snowEffect) {
            snowEffect.stop();
        }
    },

    destroy: () => {
        if (snowEffect) {
            snowEffect.destroy();
            snowEffect = null;
        }
    },

    setOptions: (options) => {
        if (snowEffect) {
            snowEffect.setOptions(options);
        }
    }
};

export default window.SnowEffect;

