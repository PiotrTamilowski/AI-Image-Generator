const firstRow = document.querySelector(".carousel .firstLine");
const secondRow = document.querySelector(".carousel .secondLine");
const thirdRow = document.querySelector(".carousel .thirdLine");

class img {
    constructor(src) {
        this.src = src;
    }
}

const firstRowImages = [new img("images/1.png"), new img("images/9.png"), new img("images/16.png"), new img("images/22.png"), new img("images/25.png"), new img("images/96.png"), new img("images/113.png"), new img("images/122.png")];
const secondRowImages = [new img("images/37.png"), new img("images/44.png"), new img("images/3.png"), new img("images/61.png"), new img("images/59.png"), new img("images/112.png"), new img("images/108.png"), new img("images/118.png")];
const thirdRowImages = [new img("images/68.png"), new img("images/47.png"), new img("images/51.png"), new img("images/64.png"), new img("images/121.png"), new img("images/110.png"), new img("images/105.png"), new img("images/13.png")];

/* start */
for (let i = 0; i < 6; i++) {
    checkHowManyImages();
}

// this function adds images to the carousel. It needs two arguments: array and container (parent element to which images will be added)
function addElements(arr, container) {
    arr.forEach((item) => {
        const newImg = document.createElement("img");
        newImg.src = item.src;

        if (document.querySelectorAll(`.carousel .${container.getAttribute("class")} img:last-of-type`).length == 0) {
            newImg.style.left = "0px";
            newImg.style.width = "240px";
        } else {
            newImg.style.left = document.querySelector(`.carousel .${container.getAttribute("class")} img:last-of-type`).getBoundingClientRect().right + "px";
            newImg.style.width = "240px";
        }
        container.appendChild(newImg);
    });
}

// this function checks how many images are in a row, if there is less than 30, this functions calls addElements function
function checkHowManyImages() {
    if (document.querySelectorAll(".carousel .firstLine img").length < 30) {
        addElements(firstRowImages, firstRow);
    }
    if (document.querySelectorAll(".carousel .secondLine img").length < 30) {
        addElements(secondRowImages, secondRow);
    }
    if (document.querySelectorAll(".carousel .thirdLine img").length < 30) {
        addElements(thirdRowImages, thirdRow);
    }
}

// this function deletes images that moved out off the screen
function removeImages() {
    const allImg = document.querySelectorAll(".carousel img");
    allImg.forEach((item) => {
        if (item.getBoundingClientRect().x + item.getBoundingClientRect().width < 0) {
            item.parentElement.removeChild(item);
        }
    });
}

setInterval(checkHowManyImages, 1000);
setInterval(removeImages, 1000);
