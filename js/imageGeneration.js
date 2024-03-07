const generateBtn = document.getElementById("generate");
const loaderContainer = document.querySelector(".loaderContainer");
const generatedImg = document.querySelector(".generatedImg");
const loadingTime = document.getElementById("loadingTime");
const loadingStatus = document.getElementById("loadingStatus");

generateBtn.addEventListener("click", function (e) {
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
                safeFilter: safeFilter,
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
                            } else {
                                loadingStatus.textContent = response2.data.status;
                            }

                            if (response2.data.status == "COMPLETED") {
                                clearInterval(inv);
                                clearInterval(timer);
                                loaderContainer.style.display = "none";
                                generatedImg.src = response2.data.result.output[0];
                            }
                            if (response2.data.status == "FAILED") {
                                clearInterval(inv);
                                clearInterval(timer);
                                loadingStatus.textContent = response2.data.status;
                            }
                        });
                    }, 1000);
                } else {
                    loadingStatus.textContent = "Wystąpił Błąd: " + response.data.message;
                }
            })
            .catch(function (error) {
                console.log("error");
            });
    }
});
