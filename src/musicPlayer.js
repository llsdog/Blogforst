import {config} from "./config.js";

class SimpleRandomMusicPlayer {
    constructor(options = {}) {
        this.apiURL = config.api.url;
        this.playlistId = config.cloudmusic.listid;
        this.playlist = [];
        this.currentSong = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.volume = options.volume || 0.8;

        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.preload = 'metadata';

        this.bindAudioEvents();

        this.onPlayStart = options.onPlayStart || null;
        this.onPlayEnd = options.onPlayEnd || null;
        this.onLoadStart = options.onLoadStart || null;
        this.onLoadEnd = options.onLoadEnd || null;
        this.onError = options.onError || null;
    }

    bindAudioEvents() {
        this.audio.addEventListener('loadstart', () => {
            this.isLoading = true;
            this.triggerCallback('onLoadStart');
        });

        this.audio.addEventListener('canplay', () => {
            this.isLoading = false;
            this.triggerCallback('onLoadEnd');
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.triggerCallback('onPlayStart', this.currentSong);
        });

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.currentSong = null;
            this.triggerCallback('onPlayEnd');
        });

        this.audio.addEventListener('error', (e) => {
            console.error('音频播放错误:', e);
            this.isPlaying = false;
            this.isLoading = false;
            this.triggerCallback('onError', { error: e, song: this.currentSong });
        });
    }

    triggerCallback(callbackName, data = null) {
        if (this[callbackName] && typeof this[callbackName] === 'function') {
            this[callbackName](data);
        }
    }


    async init(playlistId) {
        if (playlistId) {
            this.playlistId = playlistId;
        }

        if (!this.playlistId) {
            throw new Error('需要提供歌单ID');
        }

        try {
            await this.loadPlaylist();
            return true;
        } catch (error) {
            console.error('初始化播放器失败:', error);
            throw error;
        }
    }

    async loadPlaylist() {
        try {
            const response = await fetch(`${this.apiURL}/api/music/playlist/${this.playlistId}`);
            const data = await response.json();

            if (data.code === 200) {
                this.playlist = data.songs.map(song => ({
                    id: song.id,
                    name: song.name,
                    artist: song.ar.map(artist => artist.name).join(' / '),
                    album: song.al.name,
                    albumPic: song.al.picUrl,
                    duration: song.dt
                }));

                console.log(`成功加载歌单，共 ${this.playlist.length} 首歌曲`);
                return this.playlist;
            } else {
                throw new Error(data.message || '加载歌单失败');
            }
        } catch (error) {
            console.error('加载歌单失败:', error);
            throw error;
        }
    }

    async getSongUrl(songId) {
        try {
            const response = await fetch(`${this.apiURL}/api/music/song-url/${songId}`);
            const data = await response.json();

            if (data.code === 200 && data.data[0]) {
                return data.data[0].url;
            } else {
                throw new Error('获取歌曲URL失败');
            }
        } catch (error) {
            console.error('获取歌曲URL失败:', error);
            throw error;
        }
    }

    async playRandom() {
        if (this.playlist.length === 0) {
            throw new Error('歌单为空');
        }

        // 如果正在播放，先停止
        if (this.isPlaying) {
            this.stop();
        }

        // 随机选择一首歌
        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        const song = this.playlist[randomIndex];
        this.currentSong = song;

        try {
            // 获取播放URL
            const url = await this.getSongUrl(song.id);
            if (!url) {
                throw new Error('无法获取播放URL');
            }

            // 设置音频源并播放
            this.audio.src = url;
            await this.audio.play();
            this.triggerCallback('onPlayStart', song);

        } catch (error) {
            console.error('播放歌曲失败:', error);
            this.triggerCallback('onError', { error, song });
            throw error;
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.currentSong = null;
    }

    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
        this.volume = this.audio.volume;
    }

    getState() {
        return {
            isPlaying: this.isPlaying,
            isLoading: this.isLoading,
            currentSong: this.currentSong,
            volume: this.volume
        };
    }

    destroy() {
        this.stop();
        this.audio = null;
    }
}

class MusicPlayButton {
    constructor(container, player, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.player = player;
        this.options = {
            showVolume: options.showVolume !== false,
            buttonText: options.buttonText || '随机播放',
            playingText: options.playingText || '正在播放...',
            loadingText: options.loadingText || '加载中...',
            ...options
        };

        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.bindPlayerEvents();
    }

    render() {
        const { showVolume, buttonText } = this.options;

        this.container.innerHTML = `
            <div class="blog-small-card-effect blog-post-w d-flex flex-row rounded-3 music-play-button-container col-12 align-items-center">
                <div class="d-flex flex-row rounded-3 align-items-center justify-content-center">
                    <i class="bi bi-music-note-beamed m-1"></i>
                    <span class="blog-i">随机放首背景音乐听听</span>
                    <i class="bi bi-chevron-right m-0"></i>
                    <button class="d-flex flex-row btn custom-focus music-play-button m-1 p-1 rounded-4 blog-fontstyle" type="button">
                        <span class="">${buttonText}</span>
                    </button>
                </div>
        `;
    }

    bindEvents() {
        const button = this.container.querySelector('.music-play-button');
        const volumeSlider = this.container.querySelector('.volume-slider');
        const volumeValue = this.container.querySelector('.volume-value');

        // 播放按钮点击事件
        button.addEventListener('click', async () => {
            if (!this.player.isPlaying && !this.player.isLoading) {
                try {
                    await this.player.playRandom();
                } catch (error) {
                    console.error('播放失败:', error);
                    alert('播放失败，请检查网络连接或歌单设置');
                }
            }
        });

        // 音量控制
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.player.setVolume(volume);
                volumeValue.textContent = `${e.target.value}%`;
            });
        }
    }

    bindPlayerEvents() {
        // 播放开始
        this.player.onPlayStart = (song) => {
            console.log('开始播放:', song);
            this.updateButtonState('playing');
        };

        // 播放结束
        this.player.onPlayEnd = () => {
            console.log('播放结束');
            this.updateButtonState('idle');
        };

        // 加载开始
        this.player.onLoadStart = () => {
            console.log('开始加载');
            this.updateButtonState('loading');
        };

        // 加载结束
        this.player.onLoadEnd = () => {
            console.log('加载完成');
            // 加载完成后状态会由播放事件更新
        };

        // 错误处理
        this.player.onError = (error) => {
            console.error('播放器错误:', error);
            this.updateButtonState('idle');
            alert('播放出错，请重试');
        };
    }

    updateButtonState(state) {
        const button = this.container.querySelector('.music-play-button');
        const { buttonText, playingText, loadingText } = this.options;

        // 清除所有状态类
        button.classList.remove('playing', 'loading');

        switch (state) {
            case 'idle':
                button.textContent = buttonText;
                button.disabled = false;
                break;
            case 'loading':
                button.textContent = loadingText;
                button.classList.add('loading');
                button.disabled = true;
                break;
            case 'playing':
                button.textContent = playingText;
                button.classList.add('playing');
                button.disabled = true;
                break;
        }
    }
}

export { SimpleRandomMusicPlayer, MusicPlayButton };