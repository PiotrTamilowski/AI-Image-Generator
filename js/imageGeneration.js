const generatedImagesArray = [];

class generatedImage {
    constructor(imageSrc, prompt, negtPrompt, style, creationTime) {
        this.imageSrc = imageSrc;
        this.prompt = prompt;
        this.negPrompt = negtPrompt;
        this.style = style;
        this.creationTime = creationTime;
        this.favourite = false;
    }
}

const generateBtn = document.getElementById("generate");
const loaderContainer = document.querySelector(".loaderContainer");
const loader = document.querySelector(".loader");
const loadingTime = document.getElementById("loadingTime");
const loadingStatus = document.getElementById("loadingStatus");
const generatedImg = document.querySelector(".generatedImg");
const tBody = document.querySelector("tbody");

generateBtn.addEventListener("click", function (e) {
    loader.style.display = "block";
    const prompt = document.getElementById("prompt").value;
    const negPrompt = document.getElementById("negprompt").value;
    const aspectRatio = document.getElementById("aspectRatio").value;
    let seed = Number(document.getElementById("seed").value);
    seed != 0 ? (seed = seed) : (seed = Math.floor(Math.random() * 9223372036854776000) + 1);
    const guidanceScale = document.getElementById("guidanceScale").value;
    let style = document.getElementById("style").value;
    style != "no style" ? (style = style) : (style = undefined);
    const steps = Number(document.getElementById("steps").value);
    const safeFilter = document.getElementById("safeFilter").checked;


    if (prompt.length > 0 && seed >= 0 && seed <= 9223372036854776000 && guidanceScale >= 5 && guidanceScale <= 50 && steps >= 10 && steps <= 100) {
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
                                generatedImagesArray.push(new generatedImage(generatedImg.src, prompt, negPrompt, style != undefined ? style = style : style = "no style", `${timePassed.toFixed(1)}s`));
                                updateTable();
                                generateBtn.disable = false;
                            } else if (response2.data.status = "FAILED"){
                                clearInterval(inv);
                                clearInterval(timer);
                                generateBtn.disable = false;
                                loader.style.display = "none";
                                if(response2.data.errorMessage = "The provided prompt contains NSFW content. Please provide a clean prompt"){
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

function updateTable() {
    tBody.innerHTML="";
    generatedImagesArray.forEach((item, index) => {
        const tr = document.createElement("tr");
        const lp = document.createElement("td");
        const imgContainer = document.createElement("td");
        const img = document.createElement("img");
        const prompt = document.createElement("td");
        const negprompt = document.createElement("td");
        const style = document.createElement("td");
        const creationTime = document.createElement("td");
        const favouriteContainer = document.createElement("td");
        const favouriteIcon = document.createElement("i");
        const removeContainer = document.createElement("td");
        const removeIcon = document.createElement("i");

        lp.textContent = index + 1;
        img.src = item.imageSrc;
        img.classList.add("pointer");
        img.addEventListener("click", function () {
            console.log(this);
        });
        imgContainer.appendChild(img);
        prompt.textContent = item.prompt;
        negprompt.textContent = item.negPrompt;
        style.textContent = item.style;
        creationTime.textContent = item.creationTime;
        favouriteIcon.classList.add("fa-solid", "fa-star", "pointer", "favouriteIcon", "icon");
        favouriteContainer.appendChild(favouriteIcon);
        removeIcon.classList.add("fa-solid", "fa-circle-xmark", "pointer", "deleteItem", "icon");
        removeContainer.appendChild(removeIcon);

        tr.appendChild(lp);
        tr.appendChild(imgContainer);
        tr.appendChild(prompt);
        tr.appendChild(negprompt);
        tr.appendChild(style);
        tr.appendChild(creationTime);
        tr.appendChild(favouriteContainer);
        tr.appendChild(removeContainer);

        tBody.appendChild(tr);
    });
}

function addTestData() {
    generatedImagesArray.push(new generatedImage("../images/0.png", "blabasdasdasd", "asdasdasd", "no style", "8.7s"));
    generatedImagesArray.push(new generatedImage("../images/17.png", "asdasdas", "", "no style", "3.8s"));
    generatedImagesArray.push(new generatedImage("../images/68.png", "prompt prompt prompt", "", "futuristic", "8.8s"));
    updateTable();
}
addTestData();
