/* This script is responsible for changing source of the images in the instruction section on the main page*/
const instructionImages = document.querySelectorAll("#instruction img");

if (window.innerWidth < 1000) {
    instructionImages[0].src = "images/instruction-mobile.jpg";
    instructionImages[2].src = "images/instruction3-mobile.jpg";
}
