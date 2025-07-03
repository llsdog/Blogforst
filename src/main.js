import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import gsap from "gsap";
import './index.css';
import moonImg from './img/LL_moon.jpg';
import sunImg from './img/LL_sun.jpg';

// 初始化页面
let pageNumber = 1; //当前页数


//切换分页按钮函数
function switchButtonToReadMe () {
    console.log("切换分页");
    
    const bodyHomeTop = document.querySelector("#body-home-top");

    if (pageNumber === 1) {
        pageNumber = 2;
        gsap.to(bodyHomeTop, {
            x: 100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.style.backgroundImage = `url(${moonImg})`;
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    }  else {
        gsap.to(bodyHomeTop, {
            y: 50,
            duration: 0.5,
            onComplete: () => {
                gsap.to(bodyHomeTop, {y: 0, duration: 0.5});
            }
        })
    }
}

//切换主页按钮函数
function switchButtonToMainPage () {
    console.log("切换主页");

    const bodyHomeTop = document.querySelector("#body-home-top");

    if (pageNumber === 2) {
        pageNumber = 1;
        gsap.to(bodyHomeTop, {
            x: -100,
            duration: 0.5,
            onComplete: () => {
                bodyHomeTop.style.backgroundImage = `url(${sunImg})`;
                gsap.to(bodyHomeTop, {x: 0, duration: 0.5});
            }
        });
    } else {
        gsap.to(bodyHomeTop, {
            y: 50,
            duration: 0.5,
            onComplete: () => {
                gsap.to(bodyHomeTop, {y: 0, duration: 0.5});
            }
        })
    }
}

//按钮绑定
document.getElementById("button-to-readme").addEventListener("click", switchButtonToReadMe);
document.getElementById("button-to-mainpage").addEventListener("click", switchButtonToMainPage);

// 页面加载时标题的动画效果
gsap.from("#body-home-top-title-title", {
    y: 70,
    opacity: 0.5,
    duration: 1,
    ease: "power2.out"
});