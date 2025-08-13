let generatedImagesArray = [];

getItemsFromLocalStorage() != null && getItemsFromLocalStorage() != undefined ? (generatedImagesArray = getItemsFromLocalStorage("images")) : (generatedImagesArray = []);

class generatedImage {
    constructor(imageSrc, prompt, creationTime, aspectRatio, seed, steps, guidanceScale, safeFilter) {
        this.imageSrc = imageSrc;
        this.prompt = prompt;
        this.creationTime = creationTime;
        this.favourite = false;
        this.aspectRatio = aspectRatio;
        this.seed = seed;
        this.steps = steps;
        this.guidanceScale = guidanceScale;
        this.safeFilter = safeFilter;
    }
}

/* Image Generation Form Elements*/
const generateBtn = document.getElementById("generate");
const loaderContainer = document.querySelector(".loaderContainer");
const loader = document.querySelector(".loader");
const loadingTime = document.getElementById("loadingTime");
const loadingStatus = document.getElementById("loadingStatus");
const generatedImg = document.querySelector(".generatedImg");

/* Search Elements*/
const searchButton = document.querySelector(".searchButton");
searchButton.addEventListener("click", openSearchWindow);
const searchWindow = document.querySelector(".searchWindow");
const closeSearchWindowButton = document.querySelector(".closeSearchBtn");
closeSearchWindowButton.addEventListener("click", closeSearchWindow);
const dragBar = document.querySelector(".dragBar");
window.addEventListener("mousemove", dragWindow);
dragBar.addEventListener("mousedown", startDragging);
window.addEventListener("mouseup", stopDragging);
const searchSelect = document.querySelector(".searchSelect");
const searchInput = document.querySelector(".searchInput");
searchInput.addEventListener("input", () => {
    updateTable(searchInput.value);
});

/* Main table and Modal Elements*/
const tBody = document.querySelector("tbody");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modalContent");
const magnifyingGlass = document.querySelector(".magnifyingGlass");
magnifyingGlass.addEventListener("click", zoom);
const closeModalBtn = document.querySelector(".closeBtn");
closeModalBtn.addEventListener("click", closeModal);
const modalImage = document.querySelector(".modalImage");
const modalTableElements = document.querySelectorAll(".modalTable td");

/* This script is responsible for connecting to the external server through monster api and for generating an image */
generateBtn.addEventListener("click", function (e) {
    loader.style.display = "block";
    const prompt = document.getElementById("prompt").value;
    let aspectRatio = document.getElementById("aspectRatio").value;
    let width;
    let height;
    if(aspectRatio == "Kwadrat"){
        width = 512;
        height = 512;
    } else if(aspectRatio == "Portret"){
        width = 512;
        height = 768;
    } else {
        width = 768;
        height = 512
    }
    let seed = Number(document.getElementById("seed").value);
    seed != 0 ? (seed = seed) : (seed = Math.floor(Math.random() * 9007199254740991) + 1);
    const guidanceScale = document.getElementById("guidanceScale").value;
    let style = document.getElementById("style").value;
    style != "no style" ? (style = style) : (style = undefined);
    const steps = Number(document.getElementById("steps").value);
    const safeFilter = document.getElementById("safeFilter").checked;

    if (prompt.length > 0 && seed >= 0 && seed <= 9007199254740991 && guidanceScale >= 5 && guidanceScale <= 50 && steps >= 10 && steps <= 30) {
        e.preventDefault();
        generateBtn.disabled = true;
        loaderContainer.style.display = "flex";
        loadingStatus.textContent = "Łączę się z serwerem...";
        generatedImg.src = "";

        let timePassed = 0;
        const timer = setInterval(() => {
            timePassed += 0.1;
            loadingTime.textContent = timePassed.toFixed(1);
        }, 100);

    
        fetch('https://stablehorde.net/api/v2/generate/async', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'apikey': '0000000000',
                'Client-Agent': 'unknown:0:unknown',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'prompt': prompt,
                'params': {
                    'cfg_scale': Number(guidanceScale),
                    'height': height,
                    'width': width,
                    'seed': String(seed),
                    'steps': steps
                },
                'nfsw': safeFilter

            })
        }).then(function(response){
            response.json().then(function(response2){
                if(response.statusText = 'ACCEPTED'){
                    const inter = setInterval(() => {
                        fetch(`https://stablehorde.net/api/v2/generate/status/${response2.id}`, {
                        headers: {
                            'accept': 'application/json',
                            'Client-Agent': 'unknown:0:unknown'
                            }
                        }).then(function(response){
                            if(response.status == 200 || response.status == 429){
                                if(response.status == 200){
                                    response.json().then(function(response){
                                        if(response.waiting == 1 && response.queue_position != 0){
                                            loadingStatus.textContent = "Jesteśmy na " + response.queue_position + " pozycji w kolejce";
                                        } else if(response.waiting == 1){
                                            loadingStatus.textContent = "Oczekuję w kolejce";
                                        }
                                        else if(response.processing == 1){
                                            loadingStatus.textContent = "Generuję...";
                                        } else if(response.finished == 1){
                                            loadingStatus.textContent = "";
                                            clearInterval(inter);
                                            clearInterval(timer);
                                            loaderContainer.style.display = "none";
                                            generatedImg.src = response.generations[0].img;
                                            generatedImagesArray.push(new generatedImage(generatedImg.src, prompt, `${timePassed.toFixed(1)}s`, aspectRatio, seed, steps, guidanceScale, safeFilter == true ? "TAK" : "NIE"));
                                            pushItemsToLocalStorage();
                                            updateTable();
                                            generateBtn.disabled = false;
                                            const notification = new Notification("AI Image Generator", { body: "Twój obraz został wygenerowany", icon: "../Logo/favicon.PNG" })
                                        } else {         
                                            loadingStatus.textContent = "Wystąpił Błąd: Spróbuj jeszcze raz"
                                            generateBtn.disabled = false;
                                            clearInterval(inter)
                                            clearInterval(timer);
                                            loaderContainer.style.display = "none";
                                        }
                                    })
                                }
                                
                            } else {
                                loadingStatus.textContent = "Wystąpił Błąd: Spróbuj jeszcze raz"
                                generateBtn.disabled = false;
                                clearInterval(inter)
                                clearInterval(timer);
                                loaderContainer.style.display = "none";
                            }
                            
                        })
                        
                    }, 1500)
                } else {
                    loadingStatus.textContent = "Wystąpił Błąd: Spróbuj jeszcze raz"
                    generateBtn.disabled = false;
                }
                
                
            })
        })

    }
});

/* MAIN TABLE FUNCTIONS */

function updateTable(phrase) {
    tBody.innerHTML = "";
    if (phrase === undefined) {
        generatedImagesArray.forEach((item, index) => {
            createTable(item, index);
        });
    } else {
        phrase = phrase.toLowerCase();
        generatedImagesArray.forEach((item, index) => {
            if (item.prompt.toLowerCase().includes(phrase) && searchSelect.value == "prompt") {
                createTable(item, index);
            } else if (item.creationTime.toLowerCase().includes(phrase) && searchSelect.value == "creationTime") {
                createTable(item, index);
            }
        });
    }
}

function createTable(item, index) {
    const tr = document.createElement("tr");
    const lp = document.createElement("td");
    const imgContainer = document.createElement("td");
    const img = document.createElement("img");
    const prompt = document.createElement("td");
    const creationTime = document.createElement("td");
    const favouriteContainer = document.createElement("td");
    const favouriteIcon = document.createElement("i");
    const removeContainer = document.createElement("td");
    const removeIcon = document.createElement("i");

    lp.textContent = index + 1;
    img.src = item.imageSrc;
    img.classList.add("pointer");
    img.addEventListener("click", openModal);
    imgContainer.appendChild(img);
    prompt.textContent = item.prompt;
    creationTime.textContent = item.creationTime;
    favouriteIcon.classList.add("fa-solid", "fa-star", "pointer", "favouriteIcon", "icon");
    favouriteIcon.addEventListener("click", addToFavourites);
    item.favourite == true ? favouriteIcon.classList.add("favouriteIconAssigned") : favouriteIcon.classList.remove("favouriteIconAssigned");
    favouriteContainer.appendChild(favouriteIcon);
    removeIcon.classList.add("fa-solid", "fa-circle-xmark", "pointer", "deleteItem", "icon");
    removeIcon.addEventListener("click", deleteRow);
    removeContainer.appendChild(removeIcon);

    tr.appendChild(lp);
    tr.appendChild(imgContainer);
    tr.appendChild(prompt);
    tr.appendChild(creationTime);
    tr.appendChild(favouriteContainer);
    tr.appendChild(removeContainer);

    tBody.appendChild(tr);
}





/* DELETE FUNCTION*/

function deleteRow() {
    const rowToDelte = Number(this.parentNode.parentNode.childNodes[0].textContent) - 1;
    generatedImagesArray.splice(rowToDelte, 1);
    pushItemsToLocalStorage();
    updateTable();
}

/* MARK AS FAVOURITE FUNCTION */

function addToFavourites() {
    let arrayIndex = Number(this.parentNode.parentNode.childNodes[0].textContent) - 1;
    if (generatedImagesArray[arrayIndex].favourite == false) {
        generatedImagesArray[arrayIndex].favourite = true;
    } else {
        generatedImagesArray[arrayIndex].favourite = false;
    }
    pushItemsToLocalStorage();
    updateTable();
}

/* MODAL FUNCTIONS*/

function openModal() {
    const imgIndex = Number(this.parentNode.parentNode.childNodes[0].textContent) - 1;
    modalImage.src = generatedImagesArray[imgIndex].imageSrc;
    modalTableElements[0].textContent = generatedImagesArray[imgIndex].prompt;
    modalTableElements[1].textContent = generatedImagesArray[imgIndex].creationTime;
    modalTableElements[2].textContent = generatedImagesArray[imgIndex].aspectRatio;
    modalTableElements[3].textContent = generatedImagesArray[imgIndex].seed;
    modalTableElements[4].textContent = generatedImagesArray[imgIndex].guidanceScale;
    modalTableElements[5].textContent = generatedImagesArray[imgIndex].steps;
    modalTableElements[6].textContent = generatedImagesArray[imgIndex].safeFilter;

    document.body.classList.add("unscrollable");
    modal.classList.add("showModal");
}

function closeModal() {
    document.body.classList.remove("unscrollable");
    modal.classList.remove("showModal");
    if (modalContent.classList.contains("active")) {
        setTimeout(zoom, 500);
    }
}

function zoom() {
    magnifyingGlass.childNodes[0].classList.toggle("fa-magnifying-glass-plus");
    magnifyingGlass.childNodes[0].classList.toggle("fa-magnifying-glass-minus");
    modalContent.classList.toggle("active");
}

/* SEARCH WIDOW FUNCTIONS*/

function openSearchWindow() {
    searchWindow.style.visibility = "visible";
    searchWindow.style.opacity = 1;
}
function closeSearchWindow() {
    searchWindow.style.visibility = "hidden";
    searchWindow.style.opacity = 0;
}

let isWindowDraggable = false;
function dragWindow(e) {
    e.preventDefault();
    if (isWindowDraggable) {
        searchWindow.style.top = `${e.clientY - 15}px`;
        searchWindow.style.left = `${e.clientX - 110}px`;
    }
}
function startDragging() {
    
    isWindowDraggable = true;
}
function stopDragging() {
    isWindowDraggable = false;
}

/* LOCAL STORAGE FUNCTIONS */
function pushItemsToLocalStorage() {
    localStorage.setItem("images", JSON.stringify(generatedImagesArray));
}

function getItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("images"));
}

function getImageDataFromSessionStorage() {
    if (sessionStorage.copiedData != undefined) {
        let sessionObj = JSON.parse(sessionStorage.copiedData);

        document.getElementById("prompt").value = sessionObj.prompt;
    }
}

/* START */

updateTable();
getImageDataFromSessionStorage();

/* START */
