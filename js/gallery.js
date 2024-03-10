let flexColumns = document.querySelectorAll(`.flexColumn`);
const imageTable = [
    { prompt: `Film still cinematic photography, tilt angle, perfect composition, hyperdetailed forest, autumn theme, archaic military mech walking in a swamp, ripples of water move, biomechanical man and a mech, smoking heap of a spaceship collision in the background, natural aura, light blue aura, black aura, sunset`, negprompt: `easynegative, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated text, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated, embedding:easynegative`, src: `images/0.png` },
    { prompt: `Film still cinematic photography, tilt angle, perfect composition, hyperdetailed forest, autumn theme, archaic military mech walking in a swamp, ripples of water move, biomechanical man and a mech, smoking heap of a spaceship collision in the background, natural aura, light blue aura, black aura, sunset`, negprompt: `easynegative, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated text, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated, embedding:easynegative`, src: `images/1.png` },
    { prompt: `Film still cinematic photography, tilt angle, perfect composition, hyperdetailed forest, autumn theme, archaic military mech walking in a swamp, ripples of water move, biomechanical man and a mech, smoking heap of a spaceship collision in the background, natural aura, light blue aura, black aura, sunset`, negprompt: `easynegative, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated text, watermark, low quality, medium quality, blurry, censored, wrinkles, deformed, mutated, embedding:easynegative`, src: `images/2.png` },
    {prompt: `Man, futuristic armor, full body, deep Space, space armor suit, armor, style armor blu and red lights, gray and light blue metal chromed armor, red and blue lights, metal armor, diffusion lights on armor, smooth helmet, grey metal chromed armor, aggressive looking, epic helmet, aggressive helmet, Eva helmet, galaxy, city closed street background`, negprompt: `Nude, deformation, asian space ship, repeating, red hair, red head, hallway, red armor, ironman, face, showing face, hair (showing hair: 2.0) tight suit, tits, boobs, red armor`, src: `images/3.png`},
    {prompt: `Man, futuristic armor, full body, deep Space, space armor suit, armor, style armor blu and red lights, gray and light blue metal chromed armor, red and blue lights, metal armor, diffusion lights on armor, smooth helmet, grey metal chromed armor, aggressive looking, epic helmet, aggressive helmet, Eva helmet, galaxy, city closed street background`, negprompt: `Nude, deformation, asian space ship, repeating, red hair, red head, hallway, red armor, ironman, face, showing face, hair (showing hair: 2.0) tight suit, tits, boobs, red armor`, src: `images/4.png`},
    {prompt: `Man, futuristic armor, full body, deep Space, space armor suit, armor, style armor blu and red lights, gray and light blue metal chromed armor, red and blue lights, metal armor, diffusion lights on armor, smooth helmet, grey metal chromed armor, aggressive looking, epic helmet, aggressive helmet, Eva helmet, galaxy, city closed street background`, negprompt: `Nude, deformation, asian space ship, repeating, red hair, red head, hallway, red armor, ironman, face, showing face, hair (showing hair: 2.0) tight suit, tits, boobs, red armor`, src: `images/5.png`},
    {prompt: `juicy burger, dark cinematic, Kodak RAW`, negprompt: `clothes`, src: `images/6.png`},
    {prompt: `circuitboard egyptian pyramid`, negprompt: ``, src: `images/7.png`},
    {prompt: `tilt-shift photography,<lora:citySDXL:1>,the photo shows urban scenery,
    tilt-shift photography of A fairy-tale town,extreme detail,unreal engine,octane render,natural light,halo effects,8k,wallpaper,
    photograph shot with Canon EOS 90D with Canon EF-S 18-135mm f-3.5-5.6 IS USM`, negprompt: `ugly, deformed, noisy, blurry, low contrast, camera, blurry`, src: `images/8.png`},
    {prompt: `tilt-shift photography,<lora:citySDXL:1>,the photo shows urban scenery,
    tilt-shift photography of A fairy-tale town,extreme detail,unreal engine,octane render,natural light,halo effects,8k,wallpaper,
    photograph shot with Canon EOS 90D with Canon EF-S 18-135mm f-3.5-5.6 IS USM`, negprompt: `ugly, deformed, noisy, blurry, low contrast, camera, blurry`, src: `images/9.png`},
    {prompt: `tilt-shift photography,<lora:citySDXL:1>,the photo shows urban scenery,
    tilt-shift photography of A fairy-tale town,extreme detail,unreal engine,octane render,natural light,halo effects,8k,wallpaper,
    photograph shot with Canon EOS 90D with Canon EF-S 18-135mm f-3.5-5.6 IS USM`, negprompt: `ugly, deformed, noisy, blurry, low contrast, camera, blurry`, src: `images/9.png`, src: `images/10.png`},
];

/* START */
changeColumnNumbers();
/* START */

window.addEventListener("resize", changeColumnNumbers);

function checkColumnsNumber() {
    let number = 0;
    flexColumns.forEach((item) => {
        if (getComputedStyle(item).display == "flex") {
            number++;
        }
    });
    return number;
}

function changeColumnNumbers() {
    const columnNumbers = checkColumnsNumber();
    flexColumns.forEach((item) => {
        item.textContent = "";
    });
    
    let columnIndex = 0;
    for(let i = 0; i < imageTable.length; i++){
        
        const newImg = document.createElement("img");
        newImg.src = imageTable[i].src;
        flexColumns[columnIndex].appendChild(newImg);

        columnIndex++;
        if(columnIndex % columnNumbers == 0){
            columnIndex = 0;
        }
    }
    
}
