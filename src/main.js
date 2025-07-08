import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import gsap from "gsap";
import './index.css';
import { initBlogs } from "./blogManager.js";
import { getRecentActivities } from "./githubActivityManager.js";

//Page switch function
function showPage(pageId, methodName) {
    //remove 'active' class from all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    //add 'active' class to the target page
    const bodyHomeTop = document.querySelector("#body-home-top");
    const targetPage = document.getElementById(pageId);
    if (pageId === 'body-home-bottom-mainpage') {
        if (methodName === 'load') {
            bodyHomeTop.classList.remove('page-background-sun');
            bodyHomeTop.classList.add('page-background-moon');
            return;
        }
        gsap.to(bodyHomeTop, {
            x: 100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.classList.remove('page-background-sun');
                bodyHomeTop.classList.add('page-background-moon');
                targetPage.classList.add('active');
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    } else if (pageId === 'body-home-bottom-readme') {
        if (methodName === 'load') {
            bodyHomeTop.classList.remove('page-background-moon');
            bodyHomeTop.classList.add('page-background-sun');
            return;
        }
        gsap.to(bodyHomeTop, {
            x: -100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.classList.remove('page-background-moon');
                bodyHomeTop.classList.add('page-background-sun');
                targetPage.classList.add('active');
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    }
}

//button
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
document.addEventListener('DOMContentLoaded', function () {
    showPage('body-home-bottom-mainpage', 'load');
    getRecentActivities(); //获取最近的活动
    initBlogs(); //Init Blog
    console.log("加载成功, 欢迎来到我的Blog");
});



