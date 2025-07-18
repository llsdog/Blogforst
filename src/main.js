import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import { getRecentActivities } from "./githubActivityManager.js";
import { initBlogs, blogManager } from "./blogManager.js";
import SnowEffect from "./snowEffect.js";
import { SimpleRandomMusicPlayer, MusicPlayButton } from './musicPlayer.js';
import switchPage from './switchPage.js';


function handleInitialUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogParam = urlParams.get('blog');

    if (blogParam) {
        setTimeout(() => {
            const blog = blogManager.getBlogByFilename(blogParam);
            if(blog) {
                blogManager.switchToDetailView(blog);
            }
        }, 500);
    }
}

//Listener
document.getElementById("button-to-mainpage").addEventListener("click",
    function () {
        showPage('body-home-bottom-mainpage', 'click');
    });
document.getElementById("button-to-readme").addEventListener("click",
    function () {
        showPage('body-home-bottom-readme', 'click');
    });


//load hitokoto
fetch('/hitokoto')
    .then(response => response.json())
    .then(data => {
        document.getElementById('hitokoto').innerText = data.hitokoto;

        //显示出处
        const fromElement = document.getElementById('hitokoto-type');
        if (data.from) {
            fromElement.innerText = `—— ${data.from}`;
            fromElement.style.display = 'inline-block';
        } else {
            fromElement.style.display = 'none';
        }
    })
    .catch(console.error);

// 页面加载完成后显示主页
document.addEventListener('DOMContentLoaded', async function () {
    getRecentActivities(); //获取最近的活动
    initBlogs().then(() => {
        handleInitialUrl(); //处理初始URL
    }); //Init Blog
    window.addEventListener('popstate', (event) => {
        blogManager.handlePopState(event);
    });
    SnowEffect.start();
    const musicPlayer = new SimpleRandomMusicPlayer({
        volume: 0.2,
    });
    await musicPlayer.init();

    // 创建播放按钮
    const playButton = new MusicPlayButton('#music-button-container', musicPlayer, {
        showVolume: true,
    });
    console.log("加载成功, 欢迎来到我的Blog");
});



