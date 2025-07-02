function switchButtonToReadMe () {
    console.log("切换分页");
    
    const bodyHomeTop = document.querySelector("#body-home-top");
    
    bodyHomeTop.style.backgroundImage = "url(./src/img/LL_sun.jpg)";
}

function switchButtonToMainPage () {
    console.log("切换主页");
    
    const bodyHomeTop = document.querySelector("#body-home-top");
    
    bodyHomeTop.style.backgroundImage = "url(./src/img/LL_moon.jpg)";
}

