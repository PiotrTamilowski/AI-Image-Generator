/* This script is responsible for changing nav height when page is scrolled down*/
const nav = document.querySelector("nav");
const navAndNavImages = document.querySelectorAll("nav img, nav, nav div a");
const hamburgerContainer = document.querySelector(".hamburgerContainer");
const hamburger = document.querySelector(".hamburger");

window.addEventListener("scroll", () => {
    if (window.scrollY >= 100 && window.innerWidth > 1000) {
        navAndNavImages.forEach((item) => {
            item.classList.add("scrolled");
        });
    } else {
        navAndNavImages.forEach((item) => {
            item.classList.remove("scrolled");
        });
    }
});

hamburgerContainer.addEventListener("click", () => {
    hamburgerContainer.classList.toggle("clicked");
    nav.classList.toggle("show");
    document.body.classList.toggle("unscrollable");
});
