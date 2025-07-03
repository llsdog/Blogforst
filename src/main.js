import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import gsap from "gsap";

import './index.css';

import moonImg from './img/LL_moon.jpg';
import sunImg from './img/LL_sun.jpg';

function switchButtonToReadMe () {
    console.log("切换分页");
    
    const bodyHomeTop = document.querySelector("#body-home-top");
    
    gsap.to(bodyHomeTop, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            bodyHomeTop.style.backgroundImage = `url(${moonImg})`;
            gsap.to(bodyHomeTop, {opacity: 1, duration: 0.5});
        }
    });
}

function switchButtonToMainPage () {
    console.log("切换主页");
    
    const bodyHomeTop = document.querySelector("#body-home-top");

    gsap.to(bodyHomeTop, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            bodyHomeTop.style.backgroundImage = `url(${sunImg})`;
            gsap.to(bodyHomeTop, {opacity: 1, duration: 0.5});
        }
    });
}

document.getElementById("button-to-readme").addEventListener("click", switchButtonToReadMe);
document.getElementById("button-to-mainpage").addEventListener("click", switchButtonToMainPage);
