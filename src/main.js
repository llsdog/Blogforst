import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import gsap from "gsap";
import './index.css';

//切换分页按钮函数
function showPage(pageId, methodName) {
    //移除所有页面的active属性
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    //显示目标页面
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

//按钮绑定
document.getElementById("button-to-mainpage").addEventListener("click",
    function () {
        showPage('body-home-bottom-mainpage', 'click');
    });
document.getElementById("button-to-readme").addEventListener("click",
    function () {
        showPage('body-home-bottom-readme', 'click');
    });

// 页面加载完成后显示主页
document.addEventListener('DOMContentLoaded', function () {
    showPage('body-home-bottom-mainpage', 'load');
    console.log("加载成功, 欢迎来到我的Blog");
});

//加载一言
fetch('https://v1.hitokoto.cn/')
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

