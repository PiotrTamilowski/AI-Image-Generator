const firstRow = document.querySelector(".carousel .firstLine");
const secondRow = document.querySelector(".carousel .secondLine");
const thirdRow = document.querySelector(".carousel .thirdLine");

class img {
    constructor(src) {
        this.src = src;
    }
}

const firstRowImages = [new img("images/009b0f1f-66ee-4c30-b635-add75670a570_0.png"), new img("images/23e9bc6a-048c-48a1-b3e6-f8a604f01ded_0.png"), new img("images/64531de3-33dc-4231-afb6-828dc9b63108_0.png"), new img("images/686cf664-de18-4a22-807f-06f492bd9b92_0.png"), new img("images/a2575a4e-3a21-4bb2-a10c-00283f884169_0.png")];
const secondRowImages = [new img("images/009b0f1f-66ee-4c30-b635-add75670a570_0.png"), new img("images/23e9bc6a-048c-48a1-b3e6-f8a604f01ded_0.png"), new img("images/64531de3-33dc-4231-afb6-828dc9b63108_0.png"), new img("images/686cf664-de18-4a22-807f-06f492bd9b92_0.png"), new img("images/a2575a4e-3a21-4bb2-a10c-00283f884169_0.png")];
const thirdRowImages = [new img("images/009b0f1f-66ee-4c30-b635-add75670a570_0.png"), new img("images/23e9bc6a-048c-48a1-b3e6-f8a604f01ded_0.png"), new img("images/64531de3-33dc-4231-afb6-828dc9b63108_0.png"), new img("images/686cf664-de18-4a22-807f-06f492bd9b92_0.png"), new img("images/a2575a4e-3a21-4bb2-a10c-00283f884169_0.png")];

/* start */ 
for(let i = 0; i < 6; i++){
    checkHowManyImages();
}

// this function adds images to the carousel. It needs two arguments: array and container (parent element to which images will be added) 
function addElements(arr, container) {
    arr.forEach(item => {
        const newImg = document.createElement("img");
        newImg.src = item.src;
     
        if(document.querySelectorAll(`.carousel .${container.getAttribute("class")} img:last-of-type`).length == 0){
            newImg.style.left = "0px"
            newImg.style.width = "180px"
        } else {
            newImg.style.left = (document.querySelector(`.carousel .${container.getAttribute("class")} img:last-of-type`).getBoundingClientRect().right + "px")
            newImg.style.width = "180px"
        }
        container.appendChild(newImg);
    })
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
