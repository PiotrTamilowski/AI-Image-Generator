let generatedImagesArray = [];

getItemsFromLocalStorage() != null && getItemsFromLocalStorage() != undefined ? (generatedImagesArray = getItemsFromLocalStorage("images")) : (generatedImagesArray = []);

class generatedImage {
    constructor(imageSrc, prompt, negtPrompt, style, creationTime, aspectRatio, seed, steps, guidanceScale, safeFilter) {
        this.imageSrc = imageSrc;
        this.prompt = prompt;
        this.negPrompt = negtPrompt;
        this.style = style;
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
    const negPrompt = document.getElementById("negprompt").value;
    let aspectRatio = document.getElementById("aspectRatio").value;
    let seed = Number(document.getElementById("seed").value);
    seed != 0 ? (seed = seed) : (seed = Math.floor(Math.random() * 9007199254740991) + 1);
    const guidanceScale = document.getElementById("guidanceScale").value;
    let style = document.getElementById("style").value;
    style != "no style" ? (style = style) : (style = undefined);
    const steps = Number(document.getElementById("steps").value);
    const safeFilter = document.getElementById("safeFilter").checked;

    if (prompt.length > 0 && seed >= 0 && seed <= 9007199254740991 && guidanceScale >= 5 && guidanceScale <= 50 && steps >= 10 && steps <= 100) {
        e.preventDefault();
        generateBtn.disable = true;
        loaderContainer.style.display = "flex";
        loadingStatus.textContent = "Łączę się z serwerem...";
        generatedImg.src = "";

        let timePassed = 0;
        const timer = setInterval(() => {
            timePassed += 0.1;
            loadingTime.textContent = timePassed.toFixed(1);
        }, 100);

        const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjlhNTJhNzY1ZjBkODMzMzM5ZWE3OTk2NjY0ZmVlYjg4IiwiY3JlYXRlZF9hdCI6IjIwMjQtMDEtMjBUMTI6NTE6MzAuMjU4NTkwIn0.yUj8CyQbPUuQ186Rw9o4n8I6-pg_eTlrGblSFyKylxU";
        const options = {
            method: "POST",
            url: "https://api.monsterapi.ai/v1/generate/sdxl-base",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Bearer ${API_KEY}`,
            },

            data: {
                prompt: prompt,
                negprompt: negPrompt,
                aspect_ratio: aspectRatio,
                seed: seed,
                guidance_scale: guidanceScale,
                safe_filter: safeFilter,
                samples: 1,
                steps: steps,
                style: style,
            },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);

                if (response.data.message == "Request accepted successfully") {
                    const options2 = {
                        method: "GET",
                        url: `https://api.monsterapi.ai/v1/status/${response.data.process_id}`,
                        headers: {
                            accept: "application/json",
                            authorization: `Bearer ${API_KEY}`,
                        },
                    };

                    let inv = setInterval(function () {
                        axios.request(options2).then(function (response2) {
                            console.log(response2.data);

                            if (response2.data.status == "IN_QUEUE") {
                                loadingStatus.textContent = "Oczekuję w kolejce...";
                            } else if (response2.data.status == "IN_PROGRESS") {
                                loadingStatus.textContent = "Generuję...";
                            } else if (response2.data.status == "COMPLETED") {
                                loadingStatus.textContent = "";
                                clearInterval(inv);
                                clearInterval(timer);
                                loaderContainer.style.display = "none";
                                generatedImg.src = response2.data.result.output[0];
                                if (aspectRatio == "square") {
                                    aspectRatio = "kwadrat";
                                } else if (aspectRatio == "portrait") {
                                    aspectRatio = "portret";
                                } else {
                                    aspectRatio = "Krajobraz";
                                }

                                generatedImagesArray.push(new generatedImage(generatedImg.src, prompt, negPrompt, (style = convertStyleToPolish(style)), `${timePassed.toFixed(1)}s`, aspectRatio, seed, steps, guidanceScale, safeFilter));
                                pushItemsToLocalStorage();
                                updateTable();
                                generateBtn.disable = false;
                            } else if ((response2.data.status = "FAILED")) {
                                clearInterval(inv);
                                clearInterval(timer);
                                generateBtn.disable = false;
                                loader.style.display = "none";
                                if ((response2.data.errorMessage = "The provided prompt contains NSFW content. Please provide a clean prompt")) {
                                    loadingStatus.textContent = "Twoje polecenie zawiera treści zablokowane przez filtr NSFW. Jeżeli mimo to chcesz wygenerować taki obraz, wyłacz bezpieczny filtr";
                                } else {
                                    loadingStatus.textContent = response2.data.status;
                                }
                            }
                        });
                    }, 1000);
                } else {
                    loadingStatus.textContent = "Wystąpił Błąd: " + response.data.message;
                    generateBtn.disable = false;
                }
            })
            .catch(function (error) {
                console.log("error");
            });
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
        generatedImagesArray.forEach((item, index) => {
            if (item.prompt.includes(phrase) && searchSelect.value == "prompt") {
                createTable(item, index);
            } else if (item.negPrompt.includes(phrase) && searchSelect.value == "negprompt") {
                createTable(item, index);
            } else if (item.creationTime.includes(phrase) && searchSelect.value == "creationTime") {
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
    const negprompt = document.createElement("td");
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
    negprompt.textContent = item.negPrompt;
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
    tr.appendChild(negprompt);
    tr.appendChild(creationTime);
    tr.appendChild(favouriteContainer);
    tr.appendChild(removeContainer);

    tBody.appendChild(tr);
}

/*CONVERT STYLE TO POLISH LANGUAGE*/

function convertStyleToPolish(style) {
    switch (style) {
        case "anime":
            style = "Anime";
            break;
        case "enhance":
            style = "Ulepszony";
            break;
        case "photographic":
            style = "Fotograficzny";
            break;
        case "digital-art":
            style = "Sztuka cyfrowa";
            break;
        case "comic-book":
            style = "Komiks";
            break;
        case "fantasy-art":
            style = "Sztuka fantastyczna";
            break;
        case "analog-film":
            style = "Zdjęcie analogowe";
            break;
        case "neonpunk":
            style = "Neonowy";
            break;
        case "isometric":
            style = "Izometryczny";
            break;
        case "lowpoly":
            style = "Lowpoly";
            break;
        case "origami":
            style = "Origami";
            break;
        case "line-art":
            style = "Rysunek kreskowy";
            break;
        case "craft-clay":
            style = "Modelinowy";
            break;
        case "3d-model":
            style = "Model 3D";
            break;
        case "pixel-art":
            style = "Sztuka pikselowa";
            break;
        case "texture":
            style = "Tekstura";
            break;
        case "futuristic":
            style = "Futurystyczny";
            break;
        case "realism":
            style = "Realistyczny";
            break;
        case "watercolor":
            style = "Akwarelowy";
            break;
        case "photorealistic":
            style = "Fotorealistyczny";
            break;
        default:
            style = "Bez stylu";
            break;
    }
    return style;
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
    modalTableElements[1].textContent = generatedImagesArray[imgIndex].negPrompt;
    modalTableElements[2].textContent = generatedImagesArray[imgIndex].style;
    modalTableElements[3].textContent = generatedImagesArray[imgIndex].creationTime;
    modalTableElements[4].textContent = generatedImagesArray[imgIndex].aspectRatio;
    modalTableElements[5].textContent = generatedImagesArray[imgIndex].seed;
    modalTableElements[6].textContent = generatedImagesArray[imgIndex].guidanceScale;
    modalTableElements[7].textContent = generatedImagesArray[imgIndex].steps;
    modalTableElements[8].textContent = generatedImagesArray[imgIndex].safeFilter;

    document.body.classList.add("unscrollable");
    // document.body.style.overflow = "hidden";
    modal.classList.add("showModal");
}

function closeModal() {
    // document.body.style.overflow = "visible";
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
    if (isWindowDraggable) {
        searchWindow.style.top = `${e.clientY - 15}px`;
        searchWindow.style.left = `${e.clientX - 110}px`;
        // searchWindow.style.top = e.clientY + "px";
        // searchWindow.style.left = e.clientX  + "px";
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
        console.log(sessionObj);

        document.getElementById("prompt").value = sessionObj.prompt;
        document.getElementById("negprompt").value = sessionObj.negprompt;
    }
}

/* START */

updateTable();
getImageDataFromSessionStorage();

/* START */
