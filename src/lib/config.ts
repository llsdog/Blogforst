export const blogConfig = {
    blogList: ['blog_1', 'blog_2'], // 博客文件名列表
};

export const snowConfig = {
    maxSnowflakes: Number(process.env.NEXT_PUBLIC_SNOW_MAX_FLAKES) || 100,
    snowflakeColor: process.env.NEXT_PUBLIC_SNOW_COLOR || 'white',
    minSize: Number(process.env.NEXT_PUBLIC_SNOW_MIN_SIZE) || 3,
    maxSize: Number(process.env.NEXT_PUBLIC_SNOW_MAX_SIZE) || 8,
    minSpeed: Number(process.env.NEXT_PUBLIC_SNOW_MIN_SPEED) || 1,
    maxSpeed: Number(process.env.NEXT_PUBLIC_SNOW_MAX_SPEED) || 3,
    wind: Number(process.env.NEXT_PUBLIC_SNOW_WIND) || 0.5,
    zIndex: Number(process.env.NEXT_PUBLIC_SNOW_Z_INDEX) || 9999,
};

export const musicConfig = {
    baseURL: process.env.NEXT_PUBLIC_CLOUDMUSIC_BASE_URL || '',
    listid: process.env.NEXT_PUBLIC_CLOUDMUSIC_PLAYLIST_ID || '',
};

export const githubConfig = {
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME || '',
    token: process.env.GITHUB_TOKEN || '',
};
