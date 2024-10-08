window.addEventListener("load", () => {
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


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////// ----------------------------- Slider Code -----------------------------////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Total number of sliders on the page
    const sliderCount = document.querySelectorAll(".slider").length;

    // to keep track of the exact translations of all the slides of individual sliders
    let translateArrs = [];

    // adding one array for each sliders
    for (let i = 0; i < sliderCount; i++) {
        translateArrs.push([]);
    }

    // to keep track of the mouse movement
    let isMouseDown = false;

    // initial position of the mouse
    let initialPos = 0;

    // different timings for different timing functions
    const timeoutDurationMs = 500, intervalDurationMs = 5000, durationOfTimeoutAfterInterval = 10;
    // const timeoutDurationMs = 10000, intervalDurationMs = 15000, durationOfTimeoutAfterInterval = 2000;


    for (let i = 1; i <= sliderCount; i++) {
        // slider box element
        const sliderBox = document.querySelector(`.slider-${i}`);

        // each slide
        let slides = document.querySelectorAll(`.slider-${i} .slide`);

        // amount of displacement each time
        const displacement = +sliderBox.dataset.displacement;

        // initial displacement of the first slide
        const initialDisplacement = +sliderBox.dataset.initialDisplacement;

        const isDragable = sliderBox.dataset.dragable === "1";

        let slidesCount = slides.length;
        const initialSlideCount = slides.length;
        const maxDisplacement = (initialSlideCount * displacement) + initialDisplacement;
        const minDisplacement = -displacement + initialDisplacement;

        // array of translation values to maintain the translations
        for (let k = 0; k < slidesCount; k++) translateArrs[i - 1][k] = (k * displacement) + initialDisplacement;

        // box for the dots
        const dotBox = document.querySelector(`.dots-${i}`);

        // creating and adding dots to the dot box
        for (let j = 0; j < slidesCount; j++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            dotBox.appendChild(dot);
        }

        // capturing the dots as element
        const dots = document.querySelectorAll(`.dots-${i} .dot`);

        // providing the initial translation to each slide
        slides.forEach((el, idx) => {
            // providing height to the slider box according the slide
            const height = window.getComputedStyle(el.querySelector("img")).height;
            sliderBox.style.height = height;
            updateTranslationNDotClass(el, translateArrs, dots, idx, i, 0, initialSlideCount);
            el.className = `slide-${idx} ` + el.className;
            if (idx === initialSlideCount - 1) {
                cloneAddTranslate(el, minDisplacement)
                translateArrs[i - 1].push(minDisplacement);
            }

            // el.className = `slide-${idx} ` + el.className;
        });

        slides = document.querySelectorAll(`.slider-${i} .slide`);
        slidesCount = slides.length;

        window.addEventListener("resize", () => {
            slides.forEach(el => {
                const height = window.getComputedStyle(el.querySelector("img")).height;
                sliderBox.style.height = height;
            });
        })

        const removeExtraSlide = () => {

            let elToRemoveIdx = [];

            for (let idx = 0; idx < slidesCount; idx++) {
                const val = translateArrs[i - 1][idx];
                if (val >= maxDisplacement || val < minDisplacement) {
                    elToRemoveIdx.push(idx);
                }
            }

            removeSlides(elToRemoveIdx, slides);

            slides = document.querySelectorAll(`.slider-${i} .slide`);
            const arr = [];
            let count = 0;
            translateArrs[i - 1].forEach((el, idx) => {
                if (!elToRemoveIdx.includes(idx)) arr[count++] = el;
            })
            slidesCount = slides.length;

            slides.forEach(el => {
                el.style.transitionDuration = `.5s`;
            })

            translateArrs[i - 1] = arr;
        };

        let timeoutId = 0;

        const intervalFn = () => {
            let addingIdx = -1;

            // first translation each slide by 100% to the left
            for (let idx = 0; idx < slidesCount; idx++) {
                if (translateArrs[i - 1][idx] === initialDisplacement) {
                    addingIdx = idx;
                    break;
                }
            }

            if (addingIdx !== -1) cloneAddTranslate(slides[addingIdx], maxDisplacement);

            slides = document.querySelectorAll(`.slider-${i} .slide`);
            translateArrs[i - 1].splice(addingIdx + 1, 0, maxDisplacement);
            slidesCount = slides.length;

            const currentDotIdx = +slides[addingIdx].classList[0].split("-").at(-1);
            const nextDotIdx = currentDotIdx === initialSlideCount - 1 ? 0 : currentDotIdx + 1;

            setTimeout(() => {
                // first translation each slide by 100% to the left
                slides.forEach((el, idx) => {
                    translateArrs[i - 1][idx] -= displacement;
                    updateTranslationNDotClass(el, translateArrs, dots, idx, i, nextDotIdx, initialSlideCount);
                    el.style.transitionDuration = `.5s`;
                });

                // changing the opacity of the slide with translation = -100
                timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs)
            }, durationOfTimeoutAfterInterval)
        };


        // let intervalId = 0;
        let intervalId = setInterval(intervalFn, intervalDurationMs);


        dots.forEach((el, idx) => {
            el.addEventListener("mousedown", (e) => {
                e.stopPropagation();
                clearTimeout(timeoutId);
                clearInterval(intervalId);

                removeExtraSlide();


                const nxtDotIdx = idx;

                let currentSlidePosition = 0, currentDotIdx = 0, maxTranslatedSlideIdx = 0;

                for (let slideIdx = 0; slideIdx < slides.length; slideIdx++) {
                    const slideActualIdx = +slides[slideIdx].classList[0].split("-").at(-1);

                    if (translateArrs[i - 1][slideIdx] !== minDisplacement && slideActualIdx === nxtDotIdx) {
                        currentSlidePosition = translateArrs[i - 1][slideIdx];
                    } if (translateArrs[i - 1][slideIdx] === initialDisplacement) {
                        currentDotIdx = slideActualIdx;
                    } if (translateArrs[i - 1][slideIdx] === maxDisplacement - displacement) {
                        maxTranslatedSlideIdx = slideActualIdx;
                    }
                }


                const arr = [];
                let arrCurrIdx = 0, count = 0;


                slides.forEach((slide, idx) => {
                    arr[arrCurrIdx] = translateArrs[i - 1][idx];
                    slide.style.transform = `translate(${arr[arrCurrIdx++]}%, 0)`;

                    const slideActualIdx = +slides[idx].classList[0].split("-").at(-1);

                    if (translateArrs[i - 1][idx] !== minDisplacement) {
                        let newSlideTranslation = 0;

                        if (slideActualIdx <= maxTranslatedSlideIdx) {
                            newSlideTranslation = (maxDisplacement + (((initialSlideCount - maxTranslatedSlideIdx) - 1 + slideActualIdx) * displacement));
                        } else {
                            newSlideTranslation = maxDisplacement + (count * displacement);
                            count++;
                        }

                        cloneAddTranslate(slide, newSlideTranslation);
                        arr[arrCurrIdx++] = newSlideTranslation;
                    }
                });

                translateArrs[i - 1] = arr;

                slides = document.querySelectorAll(`.slider-${i} .slide`);
                slidesCount = slides.length;

                setTimeout(() => {
                    const arr = [];
                    slides.forEach((el, idx) => {
                        arr[idx] = translateArrs[i - 1][idx] - currentSlidePosition + initialDisplacement;
                        el.style.transform = `translate(${arr[idx]}%, 0)`;
                    });

                    translateArrs[i - 1] = arr;

                    dots[currentDotIdx].classList.remove("dot-active");
                    dots[nxtDotIdx].classList.add("dot-active");


                }, 100)


                timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs);
                intervalId = setInterval(intervalFn, intervalDurationMs);

            })
        })

        // events to swipe the silds
        let tempTranslationArr = new Array(slidesCount).fill(0);
        let oldWalkingDistance = 0;
        // adding mousedown to each Slide

        if (isDragable) {
            sliderBox.addEventListener("mousedown", (e) => {
                e.preventDefault();
                [lastZerothIdx, tempTranslationArr, slides, slidesCount] = afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount, maxDisplacement, minDisplacement, displacement, initialDisplacement);

                // getting the initial position
                initialPos = e.pageX - sliderBox.offsetLeft;
                isMouseDown = true;
            });

            sliderBox.addEventListener("touchstart", (e) => {

                [lastZerothIdx, tempTranslationArr, slides, slidesCount] = afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount, maxDisplacement, minDisplacement, displacement, initialDisplacement);
                // getting the initial position
                initialPos = e.touches[0].pageX - sliderBox.offsetLeft;
                isMouseDown = true;

            });

            sliderBox.addEventListener("mouseup", (e) => {
                e.preventDefault();
                if (isMouseDown) {
                    [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e, displacement, initialDisplacement);
                }

            });

            sliderBox.addEventListener("touchend", (e) => {
                if (isMouseDown) {
                    [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e, displacement, initialDisplacement);
                }
            })

            sliderBox.addEventListener("mousemove", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isMouseDown) {
                    let movement = e.pageX - sliderBox.offsetLeft;
                    const walk = (initialPos - movement);
                    const walkInPercent = parseInt(walk / parseInt(window.getComputedStyle(sliderBox).width) * 100);
                    tempTranslationArr = tempTranslationArr.map(val => val - walkInPercent + oldWalkingDistance);
                    oldWalkingDistance = walkInPercent;
                    slides.forEach((val, i) => val.style.transform = `translate(${tempTranslationArr[i]}%, 0)`);
                }
            })

            sliderBox.addEventListener('touchmove', (e) => {
                if (isMouseDown) {
                    let movement = e.touches[0].pageX - sliderBox.offsetLeft;
                    const walk = (initialPos - movement);
                    const walkInPercent = parseInt(walk / parseInt(window.getComputedStyle(sliderBox).width) * 100);
                    tempTranslationArr = tempTranslationArr.map(val => val - walkInPercent + oldWalkingDistance);
                    oldWalkingDistance = walkInPercent;
                    slides.forEach((val, i) => val.style.transform = `translate(${tempTranslationArr[i]}%, 0)`);
                }
            }, { passive: false });

            sliderBox.addEventListener("mouseout", (e) => {
                e.preventDefault();
                if (isMouseDown) {
                    [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e, displacement, initialDisplacement);
                }
            })
        }

    }


    function updateTranslationNDotClass(el, translateArrs, dots, idx, i, currentDotIdx, initialSlideCount) {
        el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
        if (idx === currentDotIdx) dots[idx].classList.add("dot-active");
        else if (idx < initialSlideCount) dots[idx].classList.remove("dot-active");
    }


    function afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount, maxDisplacement, minDisplacement, displacement, initialDisplacement) {
        e.stopPropagation();

        // clearing all the interval and timeouts
        clearTimeout(timeoutId);
        clearInterval(intervalId);

        let lastZerothIdx = null, prevToFirstSlideIdx = null, elToRemoveIdx = [];

        for (let idx = 0; idx < slidesCount; idx++) {
            const val = translateArrs[i - 1][idx];
            const slideActualIdx = +slides[idx].classList[0].split("-").at(-1);
            if (val === minDisplacement) {
                const firstSlideIdx = +slides[idx].classList[0].split("-").at(-1);
                prevToFirstSlideIdx = firstSlideIdx === 0 ? initialSlideCount - 1 : firstSlideIdx - 1;
            }

            if (slideActualIdx === prevToFirstSlideIdx) prevToFirstSlideIdx = idx;


            if (val === initialDisplacement) {
                lastZerothIdx = idx;
            }
            if (val >= maxDisplacement || val < minDisplacement) elToRemoveIdx.push(idx);

        }

        cloneAddTranslate(slides[prevToFirstSlideIdx], minDisplacement - displacement);

        cloneAddTranslate(slides[lastZerothIdx], maxDisplacement);

        removeSlides(elToRemoveIdx, slides);

        slides = document.querySelectorAll(`.slider-${i} .slide`);
        const arr = [];
        let count = 0;
        translateArrs[i - 1].forEach((el, idx) => {

            if (!elToRemoveIdx.includes(idx)) arr[count++] = el;

            if (idx === lastZerothIdx) {
                arr[count++] = maxDisplacement;
            }
            if (idx === prevToFirstSlideIdx) {
                arr[count++] = minDisplacement - displacement;
            }
        })
        slidesCount = slides.length;

        slides.forEach(el => {
            el.style.transitionDuration = `0s`;
        })

        const tempTranslationArr = [];

        arr.forEach((val, idx) => {
            tempTranslationArr[idx] = val;
            translateArrs[i - 1][idx] = val
        });

        return [lastZerothIdx, tempTranslationArr, slides, slidesCount];
    }


    function afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e, displacement, initialDisplacement) {
        e.stopPropagation();

        let displaceAmount = 0, currentZero = -1, prevZero = -1;

        if (Math.abs(oldWalkingDistance) > 30) {
            displaceAmount = oldWalkingDistance > 0 ? -displacement : displacement;
        }

        slides.forEach((el, idx) => {
            el.style.transitionDuration = `.5s`
            el.style.transform = `translate(${translateArrs[i - 1][idx] + displaceAmount}%, 0)`;
            if (translateArrs[i - 1][idx] === initialDisplacement) prevZero = +el.classList[0].split("-").at(-1);
            translateArrs[i - 1][idx] += displaceAmount;
            if (translateArrs[i - 1][idx] === initialDisplacement) currentZero = +el.classList[0].split("-").at(-1);
        });

        slides = document.querySelectorAll(`.slider-${i} .slide`);
        slidesCount = slides.length;

        oldWalkingDistance = 0;

        dots[prevZero].classList.remove("dot-active");
        dots[currentZero].classList.add("dot-active");

        const timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs);
        // const timeoutId = 0;
        const intervalId = setInterval(intervalFn, intervalDurationMs);
        // const intervalId = 0;

        return [false, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides]
    }

    const removeSlides = (elToRemoveIdx = [], slides = []) => {
        if (elToRemoveIdx.length) {
            elToRemoveIdx.forEach(el => {
                const elToRemove = slides[el];
                elToRemove.remove();
            })
        }
    }

})

const cloneAddTranslate = (elToClone, translate) => {
    const cloned = elToClone.cloneNode(true);
    elToClone.insertAdjacentElement('afterend', cloned);
    cloned.style.transform = `translate(${translate}%, 0)`;
}