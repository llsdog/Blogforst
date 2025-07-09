# Blogforst
## 一个从零开始的开源博客网站
### 该项目从原生的前端框架开始
### 在我学习前端的过程中将会不断
1. **逐步完善网站**
2. **优化目录结构**
3. **引入更多开源库**
4. **尝试从原生转至更加现代化的开发方式**

***欢迎创建分支来和我一起学习前端***

此项目没有太大的开源的开源价值, 为个人学习使用, 详情请看开源许可证

## How to get your own github activities in Blog
1.Creat "Blogforst/scr/config.js"

2.Write like this:
````javascript
export const config = {
    github: {
        token: 'Your_Github_PAT',
        username : 'Your_Github_Name'
    }
}   
````

## How to customize your SnowEffect

### In Blogforst/src/main.js
```javascript
SnowEffect.start({
    maxSnowflakes: 150,        // max number of snowflakes
    snowflakeColor: '#ffffff', // snowflakes's color
    minSize: 2,                // min size
    maxSize: 6,                // max size
    minSpeed: 0.5,             // min speed of snowflakes
    maxSpeed: 2,               // max speed of snowflakes
    wind: 0.3,                 // wind force intensity
    zIndex: 9999               // Z-index
});
```
### Other method
```javascript
// stop effect
SnowEffect.stop();

// restart
SnowEffect.start();

// clear snowflakes
SnowEffect.destroy();

// change midway
SnowEffect.setOptions({
    maxSnowflakes: 200,
    snowflakeColor: '#87CEEB'
});
```