const nav = document.querySelector("nav");
const body = document.querySelector("body");

document.addEventListener("scroll", () => {
    var scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 0) {
        nav.classList.add("nav-gradient");
    } else {
        nav.classList.remove("nav-gradient");
    }
});

const sliderCount = document.querySelectorAll(".slider").length;
const translateArrs = [];

for (let i = 1; i <= sliderCount; i++) {
    // slider box element
    const sliderBox = document.querySelector(`.slider-${i}`);
    // each slide
    const slides = document.querySelectorAll(`.slider-${i} .slide`);

    // array of translation values to maintain the translations
    const translateArr = [];

    for (let k = 0; k < slides.length; k++) translateArr[k] = k * 100;

    translateArrs.push(translateArr);

    // box for the dots
    const dotBox = document.querySelector(`.dots-${i}`);

    // creating and adding dots to the dot box
    for (let j = 0; j < translateArrs[i - 1].length; j++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dotBox.appendChild(dot);
    }

    // capturing the dots as element
    const dots = document.querySelectorAll(`.dots-${i} .dot`);


    // providing the initial translation to each slide
    slides.forEach((el, idx) => {
        // providing height to the slider box according the slide
        const height = window.getComputedStyle(el).height;
        sliderBox.style.height = height;
        updateOpacityNDotClass(el, translateArrs, dots, idx, i);
    });

    // function that will run at each interval
    const intervalFn = () => {
        // first translation each slide by 100% to the left
        slides.forEach((el, idx) => {
            translateArrs[i - 1][idx] -= 100;
            updateOpacityNDotClass(el, translateArrs, dots, idx, i);
        });

        // changing the opacity of the slide with translation = -100
        setTimeout(() => {
            slides.forEach((el, idx) => {
                if (translateArrs[i - 1][idx] === -100) {
                    el.style.opacity = 0;
                }
            });
        }, 800);


        setTimeout(() => {
            slides.forEach((el, idx) => {
                if (translateArrs[i - 1][idx] === -100) {
                    translateArrs[i - 1][idx] = (slides.length - 1) * 100;
                    el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
                }
            });
        }, 1000)
    };

    let interval = setInterval(intervalFn, 5000);


    dots.forEach((el, idx) => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            clearInterval(interval);
            const len = translateArrs[i - 1].length;
            let count = 0;
            const currentDot = translateArrs[i - 1].findIndex(el => el === 0);
            for (let x = 0; x < len; x++) {
                if (x < idx)
                    translateArrs[i - 1][x] = (len - idx + x) * 100;
                else {
                    translateArrs[i - 1][x] = count * 100;
                    count++;
                }
            }

            slides.forEach((el, idx) => {
                if (translateArrs[i - 1][idx] === 0) {
                    updateOpacityNDotClass(el, translateArrs, dots, idx, i);
                    el.style.zIndex = 2;
                }
            });

            dots[currentDot].classList.remove("dot-active");

            setTimeout(() => {
                slides.forEach((el, idx) => {
                    updateOpacityNDotClass(el, translateArrs, dots, idx, i);
                    el.style.zIndex = 0;
                    if (translateArrs[i - 1][idx] !== 0)
                        el.style.opacity = 0;
                });
            }, 800);

            interval = setInterval(intervalFn, 5000);
        })
    })

    window.addEventListener("resize", () => {
        slides.forEach(el => {
            const height = window.getComputedStyle(el).height;
            sliderBox.style.height = height;
        });
    })
}


function updateOpacityNDotClass(el, translateArrs, dots, idx, i) {
    el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
    if (translateArrs[i - 1][idx] === 0) dots[idx].classList.add("dot-active");
    else dots[idx].classList.remove("dot-active");
    el.style.opacity = 1;
}
