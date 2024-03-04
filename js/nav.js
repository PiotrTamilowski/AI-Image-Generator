const navAndNavImages = document.querySelectorAll("nav img, nav, nav div a");

window.addEventListener("scroll", () => {
    if (window.scrollY >= 100) {
        navAndNavImages.forEach((item) => {
            item.classList.add("scrolled");
        });
    } else {
        navAndNavImages.forEach((item) => {
            item.classList.remove("scrolled");
        });
    }
});
