export interface BlogMetadata {
    title: string;
    date: string;
    author: string;
    description: string;
    image?: string;
    comments?: number;
    tags?: string[];
    [key: string]: string | number | string[] | undefined; // 添加索引签名以支持其他属性
}

export interface BlogPost {
    filename: string;
    metadata: BlogMetadata;
    content: string;
    htmlContent: string;
}

export interface SnowflakeOptions {
    maxSnowflakes: number;
    snowflakeColor: string;
    minSize: number;
    maxSize: number;
    minSpeed: number;
    maxSpeed: number;
    wind: number;
    zIndex: number;
}

export interface GitHubActivity {
    type: string;
    repo: string;
    message: string;
    timeAgo: string;
}

export interface MusicPlayerOptions {
    volume?: number;
    onPlayStart?: (song: Song) => void;
    onPlayEnd?: () => void;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    onError?: (error: { error: unknown; song: Song | null }) => void;
}

export interface Song {
    id: number;
    name: string;
    artist: string;
    album: string;
    albumPic: string;
    duration: number;
}
