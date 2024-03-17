let allStoredImages = [];

const flexFavourites = document.querySelector(".flexFavourites");

/* START */
getItemsFromLocalStorage() != null && getItemsFromLocalStorage() != undefined ? (allStoredImages = getItemsFromLocalStorage("images")) : (allStoredImages = []);
createImages();
/* START */

/* This function insert images based on what was stored in user's local storage */
function createImages() {
    flexFavourites.innerHTML = "";
    allStoredImages.forEach((item, index) => {
        if (item.favourite == true) {
            const newArticle = document.createElement("article");
            const newImg = document.createElement("img");
            newImg.src = item.imageSrc;

            const favouriteIcon = document.createElement("i");
            favouriteIcon.classList.add("fa-solid", "fa-star", "pointer", "favouriteIcon", "icon");
            favouriteIcon.addEventListener("click", addToFavourites);
            favouriteIcon.classList.add("favouriteIconAssigned");

            newArticle.appendChild(newImg);
            newArticle.appendChild(favouriteIcon);
            flexFavourites.appendChild(newArticle);
        }
    });
}

/* LOCAL STORAGE FUNCTIONS */

function getItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("images"));
}

function pushItemsToLocalStorage() {
    localStorage.setItem("images", JSON.stringify(allStoredImages));
}

function addToFavourites() {
    let imgSrc = this.parentNode.childNodes[0].getAttribute("src");
    allStoredImages.forEach((item, index) => {
        if (item.imageSrc == imgSrc) {
            allStoredImages[index].favourite = false;
            this.classList.remove("favouriteIconAssigned");
        }
        pushItemsToLocalStorage();
        createImages();
    });
}
