# Blogforst
## Open source Blog Website
### Start from the original
### Gradually improve
1. **Improve**
2. **Optimize**
3. **Expand**
4. **Modern**

***For study in the beginning***

## How To Start
1.Environment create

```bash
npm install
```

2.Creat "Blogforst/.env.local"

### Write like this:
```env
# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# GitHub配置
NEXT_PUBLIC_GITHUB_USERNAME=Your_Github_Name
GITHUB_TOKEN=Your_Github_Token

# 网易云音乐配置
NEXT_PUBLIC_CLOUDMUSIC_BASE_URL=Neteasecloudmusicapi_URL
NEXT_PUBLIC_CLOUDMUSIC_PLAYLIST_ID=Your_Playlist_Id

# 雪花效果配置
NEXT_PUBLIC_SNOW_MAX_FLAKES=150
NEXT_PUBLIC_SNOW_COLOR=white
NEXT_PUBLIC_SNOW_MIN_SIZE=3
NEXT_PUBLIC_SNOW_MAX_SIZE=8
NEXT_PUBLIC_SNOW_MIN_SPEED=0.5
NEXT_PUBLIC_SNOW_MAX_SPEED=2
NEXT_PUBLIC_SNOW_WIND=0.3
NEXT_PUBLIC_SNOW_Z_INDEX=9999

# 端口
PORT=3000

```

3.Run
```bash
npm run dev
```