import { defineConfig } from 'vite'

export default defineConfig({
    root: './',
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/hitokoto': {
                target: 'https://v1.hitokoto.cn',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/hitokoto/, ''),
                secure: true
            }
        }
    }
})

