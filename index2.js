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

  const sliderCount = document.querySelectorAll(".slider").length;
  let translateArrs = [];
  for (let i = 0; i < sliderCount; i++) {
    translateArrs.push([]);
  }
  let isMouseDown = false;
  let initialPos = 0, displacement = 110;
  const timeoutDurationMs2 = 500, intervalDurationMs = 5000, durationOfTimeoutAfterInterval = 100;
  // const timeoutDurationMs2 = 10000, intervalDurationMs = 15000, durationOfTimeoutAfterInterval = 2000;


  for (let i = 1; i <= sliderCount; i++) {
    // slider box element
    const sliderBox = document.querySelector(`.slider-${i}`);

    // each slide
    let slides = document.querySelectorAll(`.slider-${i} .slide`);

    let slidesCount = slides.length;
    const initialSlideCount = slides.length;

    // array of translation values to maintain the translations
    for (let k = 0; k < slidesCount; k++) translateArrs[i - 1][k] = k * displacement;

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
    });

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
        if (val >= initialSlideCount * displacement || val < 0) {
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
        if (translateArrs[i - 1][idx] === 0) {
          addingIdx = idx;
          break;
        }
      }

      if (addingIdx !== -1) cloneAddTranslate(slides[addingIdx], slidesCount * displacement);

      slides = document.querySelectorAll(`.slider-${i} .slide`);
      translateArrs[i - 1].splice(addingIdx + 1, 0, slidesCount * displacement);
      slidesCount = slides.length;

      const currentDotIdx = addingIdx === initialSlideCount - 1 ? 0 : addingIdx + 1;

      setTimeout(() => {
        // first translation each slide by 100% to the left
        slides.forEach((el, idx) => {
          translateArrs[i - 1][idx] -= displacement;
          updateTranslationNDotClass(el, translateArrs, dots, idx, i, currentDotIdx, initialSlideCount);
          el.style.transitionDuration = `.5s`;
        });
        // changing the opacity of the slide with translation = -100
        timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs2)
      }, durationOfTimeoutAfterInterval)
    };


    // let intervalId = 0;
    let intervalId = setInterval(intervalFn, intervalDurationMs);


    dots.forEach((el, idx) => {
      el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        console.log("dot's clicked");
        clearTimeout(timeoutId);
        clearInterval(intervalId);

        removeExtraSlide();

        const nxtDotIdx = idx;
        const currentDotIdx = translateArrs[i - 1].findIndex(el => el === 0);
        const currentSlidePosition = translateArrs[i - 1][nxtDotIdx];
        const maxTranslatedSlideIdx = translateArrs[i - 1].findIndex(el => el === (initialSlideCount - 1) * displacement);


        const arr = [];
        let arrCurrIdx = 0, count = 0;

        slides.forEach((slide, idx) => {
          arr[arrCurrIdx] = translateArrs[i - 1][idx];
          slide.style.transform = `translate(${arr[arrCurrIdx++]}%, 0)`;

          let newSlideTranslation = 0;

          if (idx <= maxTranslatedSlideIdx) {
            newSlideTranslation = ((initialSlideCount * displacement) + (((initialSlideCount - maxTranslatedSlideIdx) - 1 + idx) * displacement));
          } else {
            newSlideTranslation = (initialSlideCount * displacement) + (count * displacement);
            count++;
          }

          cloneAddTranslate(slide, newSlideTranslation);
          arr[arrCurrIdx++] = newSlideTranslation;
        });

        translateArrs[i - 1] = arr;

        slides = document.querySelectorAll(`.slider-${i} .slide`);
        slidesCount = slides.length;

        setTimeout(() => {
          const arr = [];
          slides.forEach((el, idx) => {
            arr[idx] = translateArrs[i - 1][idx] - currentSlidePosition;
            el.style.transform = `translate(${arr[idx]}%, 0)`;
          });

          translateArrs[i - 1] = arr;

          dots[currentDotIdx].classList.remove("dot-active");
          dots[nxtDotIdx].classList.add("dot-active");


        }, 100)


        timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs2);
        intervalId = setInterval(intervalFn, intervalDurationMs);

      })
    })

    // events to swipe the silds
    let tempTranslationArr = new Array(slidesCount).fill(0);
    let oldWalkingDistance = 0;
    // adding mousedown to each Slide

    sliderBox.addEventListener("mousedown", (e) => {
      e.preventDefault();
      [lastZerothIdx, tempTranslationArr, slides, slidesCount] = afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount);

      // getting the initial position
      initialPos = e.pageX - sliderBox.offsetLeft;
      isMouseDown = true;
    });

    sliderBox.addEventListener("touchstart", (e) => {

      [lastZerothIdx, tempTranslationArr, slides, slidesCount] = afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount);
      // getting the initial position
      initialPos = e.touches[0].pageX - sliderBox.offsetLeft;
      isMouseDown = true;

    });

    sliderBox.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (isMouseDown) {
        [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e);
      }

    });

    sliderBox.addEventListener("touchend", (e) => {
      if (isMouseDown) {
        [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e);
      }
    })

    sliderBox.addEventListener("mousemove", (e) => {
      e.preventDefault();
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
        [isMouseDown, timeoutId, intervalId, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e);
      }
    })

  }


  function updateTranslationNDotClass(el, translateArrs, dots, idx, i, currentDotIdx, initialSlideCount) {
    el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
    if (idx === currentDotIdx) dots[idx].classList.add("dot-active");
    else if (idx < initialSlideCount) dots[idx].classList.remove("dot-active");
  }


  function afterMouseMovesDown(slides, e, timeoutId, intervalId, translateArrs, i, slidesCount, initialSlideCount) {
    e.stopPropagation();

    // clearing all the interval and timeouts
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    let lastZerothIdx = null, prevToLastZero = null, elToRemoveIdx = [];

    for (let idx = 0; idx < slidesCount; idx++) {
      const val = translateArrs[i - 1][idx];
      if (val === 0) {
        lastZerothIdx = idx;
        prevToLastZero = idx === 0 ? slidesCount - 1 : idx - 1;
      }
      if (val >= initialSlideCount * displacement || val < 0) elToRemoveIdx.push(idx);
    }

    removeSlides(elToRemoveIdx, slides);

    const elToClone = slides[prevToLastZero];
    elToClone.style.transform = "translate(-100%, 0)";
    translateArrs[i - 1][prevToLastZero] = -displacement;

    cloneAddTranslate(elToClone, (initialSlideCount - 1) * displacement);

    cloneAddTranslate(slides[lastZerothIdx], (initialSlideCount) * displacement);

    slides = document.querySelectorAll(`.slider-${i} .slide`);
    const arr = [];
    let count = 0;
    translateArrs[i - 1].forEach((el, idx) => {

      if (!elToRemoveIdx.includes(idx)) arr[count++] = el;

      if (idx === lastZerothIdx) {
        arr[count++] = initialSlideCount * displacement;
      } else if (idx === prevToLastZero) {
        arr[count++] = (initialSlideCount - 1) * displacement;
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


  function afterMouseMovesUp(slides, slidesCount, translateArrs, i, oldWalkingDistance, dots, removeExtraSlide, intervalFn, e) {
    e.stopPropagation();

    let displaceAmount = 0, currentZero = -1, prevZero = -1;

    if (Math.abs(oldWalkingDistance) > 30) {
      displaceAmount = oldWalkingDistance > 0 ? -displacement : displacement;
    }

    slides.forEach((el, idx) => {
      el.style.transitionDuration = `.5s`
      el.style.transform = `translate(${translateArrs[i - 1][idx] + displaceAmount}%, 0)`;
      if (translateArrs[i - 1][idx] === 0) prevZero = +el.classList[0].split("-").at(-1);
      translateArrs[i - 1][idx] += displaceAmount;

      if (translateArrs[i - 1][idx] === 0) currentZero = +el.classList[0].split("-").at(-1);
    });

    oldWalkingDistance = 0;

    dots[prevZero - 1].classList.remove("dot-active");
    dots[currentZero - 1].classList.add("dot-active");

    const timeoutId = setTimeout(removeExtraSlide, timeoutDurationMs2);
    const intervalId = setInterval(intervalFn, intervalDurationMs);

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

  const cloneAddTranslate = (elToClone, translate) => {
    const cloned = elToClone.cloneNode(true);
    elToClone.insertAdjacentElement('afterend', cloned);
    cloned.style.transform = `translate(${translate}%, 0)`;
  }

})