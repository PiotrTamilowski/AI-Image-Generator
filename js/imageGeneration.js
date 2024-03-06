const generateBtn = document.getElementById("generate");


generateBtn.addEventListener("click", function(e){
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const negPrompt = document.getElementById("negprompt").value;
    const aspectRatio = document.getElementById("aspectRatio").value;
    let seed = Number(document.getElementById("seed").value);
    seed != 0 ? seed = seed : seed = Math.floor(Math.random() * 9223372036854776000) + 1;
    const guidanceScale = document.getElementById("guidanceScale").value;
    let style = document.getElementById("style").value;
    style != "no style" ? style = style : style = undefined
    const steps = Number(document.getElementById("steps").value);
    const safeFilter = document.getElementById("safeFilter").checked;

    console.log(`prompt: ${prompt}`);
    console.log(`negprompt: ${negPrompt}`);
    console.log(`aspectRatio: ${aspectRatio}`);
    console.log(`seed: ${seed}`);
    console.log(`guidanceScale: ${guidanceScale}`);
    console.log(`style: ${style}`);
    console.log(`steps: ${steps}`);
    console.log(`safeFilter: ${safeFilter}`);

    
    const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjlhNTJhNzY1ZjBkODMzMzM5ZWE3OTk2NjY0ZmVlYjg4IiwiY3JlYXRlZF9hdCI6IjIwMjQtMDEtMjBUMTI6NTE6MzAuMjU4NTkwIn0.yUj8CyQbPUuQ186Rw9o4n8I6-pg_eTlrGblSFyKylxU"
    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "prompt": prompt,
            "negprompt": negPrompt,
            "aspect_ratio": aspectRatio,
            "seed": seed,
            "guidance_scale": guidanceScale,
            "safeFilter": safeFilter,
            "samples": 1,
            "steps": steps,
            "style": style
            })
        };

    fetch('https://api.monsterapi.ai/v1/generate/sdxl-base', options)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        const options2 = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${API_KEY}`
            }
        };

        let inv = setInterval(function(){
            fetch(`https://api.monsterapi.ai/v1/status/${response.process_id}`, options2)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(response.status == "COMPLETED"){
                    clearInterval(inv);
                    document.querySelector(".generatedImg").src = response.result.output[0];
                    }
                })
            }, 1000)


    })
    .catch(err => console.error(err));

})