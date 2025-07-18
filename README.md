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


2.Creat "Blogforst/scr/config.js"

### Write like this:
```javascript
export const config = {
    api: {
        url: 'Your_Blogforst_API_URL'
    },

    cloudmusic: {
        listid: 'Your_Musiclist_Id' ,
    },

    blogList: [
        //blog's name in public/blog
        'blog_1',
        'blog_2'
    ],

    snowstyle: {
        maxSnowflakes: 150,        // max number of snowflakes
        snowflakeColor: '#ffffff', // snowflakes's color
        minSize: 2,                // min size
        maxSize: 6,                // max size
        minSpeed: 0.5,             // min speed of snowflakes
        maxSpeed: 2,               // max speed of snowflakes
        wind: 0.3,                 // wind force intensity
        zIndex: 9999               // Z-index
    }
} 
```

3.Run
```bash
vite dev
```