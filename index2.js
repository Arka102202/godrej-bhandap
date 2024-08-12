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
let isMouseDown = false;
let initialPos = 0;

for (let i = 1; i <= sliderCount; i++) {
  // slider box element
  const sliderBox = document.querySelector(`.slider-${i}`);
  // each slide
  const slides = document.querySelectorAll(`.slider-${i} .slide`);

  const slidesCount = slides.length;

  // array of translation values to maintain the translations
  const translateArr = [];

  for (let k = 0; k < slidesCount; k++) translateArr[k] = k * 100;

  translateArrs.push(translateArr);

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
    updateOpacityNDotClass(el, translateArrs, dots, idx, i);
    if (idx > 0) el.style.zIndex = -1;
    else el.style.zIndex = 1;
  });

  // function that will run at each interval

  const timeoutFunc800 = () => {
    slides.forEach((el, idx) => {
      if (translateArrs[i - 1][idx] !== 0) {
        el.style.zIndex = -1;
      } else el.style.zIndex = 1;
    });
  };

  let timeoutFunc800Id1 = 0;
  let timeoutFunc800Id2 = 0;

  const timeoutFunc1800 = () => {
    slides.forEach((el, idx) => {
      if (translateArrs[i - 1][idx] === -100) {
        translateArrs[i - 1][idx] = (slidesCount - 1) * 100;
        el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
      }
      el.style.transitionDuration = `.5s`;
    });
  };

  let timeoutFunc1800Id1 = 0;
  let timeoutFunc1800Id2 = 0;

  const intervalFn = () => {
    // first translation each slide by 100% to the left
    slides.forEach((el, idx) => {
      translateArrs[i - 1][idx] -= 100;
      updateOpacityNDotClass(el, translateArrs, dots, idx, i);
    });

    // changing the opacity of the slide with translation = -100
    timeoutFunc800Id1 = setTimeout(timeoutFunc800, 800);
    timeoutFunc1800Id1 = setTimeout(timeoutFunc1800, 1800)
  };

  let interval = setInterval(intervalFn, 5000);


  // dots.forEach((el, idx) => {
  //     el.addEventListener("click", (e) => {
  //         e.stopPropagation();
  //         clearTimeout(timeoutFunc800Id1);
  //         clearTimeout(timeoutFunc1800Id1);
  //         clearTimeout(timeoutFunc800Id2);
  //         clearTimeout(timeoutFunc1800Id2);
  //         clearInterval(interval);

  //         const currentDot = translateArrs[i - 1].findIndex(el => el === 0);
  //         let count = 0;
  //         for (let x = 0; x < slidesCount; x++) {
  //             if (x < idx) translateArrs[i - 1][x] = (slidesCount - idx + x) * 100;
  //             else translateArrs[i - 1][x] = 100 * count++;
  //         }

  //         slides.forEach((el, idx) => {
  //             if (translateArrs[i - 1][idx] === 0) {
  //                 updateOpacityNDotClass(el, translateArrs, dots, idx, i);
  //                 el.style.zIndex = 1;
  //             } else el.style.zIndex = -1;
  //         });

  //         dots[currentDot].classList.remove("dot-active");

  //         setTimeout(() => {
  //             slides.forEach((el, idx) => {
  //                 updateOpacityNDotClass(el, translateArrs, dots, idx, i);
  //                 el.style.transitionDuration = `.5s`;
  //             });
  //         }, 1800);

  //         interval = setInterval(intervalFn, 5000);
  //     })
  // })

  window.addEventListener("resize", () => {
    slides.forEach(el => {
      const height = window.getComputedStyle(el.querySelector("img")).height;
      sliderBox.style.height = height;
    });
  })

  // // events to swipe the silds

  // let tempTranslationArr = new Array(slidesCount);
  // let oldWalkingDistance = 0;
  // let lastZerothIdx = -1;
  // // adding mousedown to each Slide

  // sliderBox.addEventListener("mousedown", (e) => {
  //     e.preventDefault();
  //     lastZerothIdx = afterMouseMovesDown(slides, e, timeoutFunc800Id1, timeoutFunc1800Id1, timeoutFunc800Id2, timeoutFunc1800Id2, interval, translateArrs, i, slidesCount, dots, tempTranslationArr);
  //     // getting the initial position
  //     initialPos = e.pageX - sliderBox.offsetLeft;
  //     isMouseDown = true;
  // });

  // sliderBox.addEventListener("touchstart", (e) => {
  //     lastZerothIdx = afterMouseMovesDown(slides, e, timeoutFunc800Id1, timeoutFunc1800Id1, timeoutFunc800Id2, timeoutFunc1800Id2, interval, translateArrs, i, slidesCount, dots, tempTranslationArr);
  //     // getting the initial position
  //     initialPos = e.touches[0].pageX - sliderBox.offsetLeft;
  //     isMouseDown = true;

  // });

  // sliderBox.addEventListener("mouseup", (e) => {
  //     e.preventDefault();
  //     if (isMouseDown) {
  //         [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e);
  //     }

  //     // console.log({ isMouseDown });
  // });

  // sliderBox.addEventListener("touchend", (e) => {
  //     [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e);
  // })

  // sliderBox.addEventListener("mousemove", (e) => {
  //     e.preventDefault();
  //     if (isMouseDown) {
  //         let movement = e.pageX - sliderBox.offsetLeft;
  //         const walk = (initialPos - movement);
  //         const walkInPercent = parseInt(walk / parseInt(window.getComputedStyle(sliderBox).width) * 100);
  //         tempTranslationArr = tempTranslationArr.map(val => val - walkInPercent + oldWalkingDistance);
  //         oldWalkingDistance = walkInPercent;
  //         slides.forEach((val, i) => val.style.transform = `translate(${tempTranslationArr[i]}%, 0)`);
  //     }
  // })

  // sliderBox.addEventListener('touchmove', (e) => {
  //     if (isMouseDown) {
  //         let movement = e.touches[0].pageX - sliderBox.offsetLeft;
  //         const walk = (initialPos - movement);
  //         const walkInPercent = parseInt(walk / parseInt(window.getComputedStyle(sliderBox).width) * 100);
  //         tempTranslationArr = tempTranslationArr.map(val => val - walkInPercent + oldWalkingDistance);
  //         oldWalkingDistance = walkInPercent;
  //         slides.forEach((val, i) => val.style.transform = `translate(${tempTranslationArr[i]}%, 0)`);
  //     }
  // }, { passive: false });

  // sliderBox.addEventListener("mouseout", (e) => {
  //     e.preventDefault();
  //     // console.log("from mouse out ===> ", { isMouseDown });
  //     if (isMouseDown) {
  //         [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e);
  //     }
  // })

}


function updateOpacityNDotClass(el, translateArrs, dots, idx, i) {
  el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
  if (translateArrs[i - 1][idx] === 0) dots[idx].classList.add("dot-active");
  else dots[idx].classList.remove("dot-active");
}

function updateSlideCss(slides, idx, slidesCount, tempTranslationArr, dots, setDuration) {
  let tempCount = 0;

  slides.forEach((e, i) => {
    let translate = 0;
    if (idx === 0 && i === slidesCount - 1) translate = -100;
    else if (i < idx - 1) translate = (slidesCount - idx + i) * 100;
    else if (i === idx - 1) translate = -100;
    else translate = 100 * tempCount++;
    e.style.transform = `translate(${translate}%, 0)`;
    e.style.zIndex = i === idx ? 1 : -1;
    if (setDuration) e.style.transitionDuration = `0s`;
    i === idx ? dots[i].classList.add("dot-active") : dots[i].classList.remove("dot-active");
    tempTranslationArr[i] = translate;
  });
}

function afterMouseMovesDown(slides, e, timeoutFunc800Id1, timeoutFunc1800Id1, timeoutFunc800Id2, timeoutFunc1800Id2, interval, translateArrs, i, slidesCount, dots, tempTranslationArr) {
  e.stopPropagation();

  // clearing all the interval and timeouts
  clearTimeout(timeoutFunc800Id1);
  clearTimeout(timeoutFunc1800Id1);
  clearTimeout(timeoutFunc800Id2);
  clearTimeout(timeoutFunc1800Id2);
  clearInterval(interval);

  // getting slide index with zero translation
  const idx = translateArrs[i - 1].findIndex(val => val === 0);
  const lastZerothIdx = idx;

  // initial preparation of the slides
  updateSlideCss(slides, idx, slidesCount, tempTranslationArr, dots, true);

  return lastZerothIdx;
}


function afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e) {
  e.stopPropagation();
  let idx = 0;
  let min = 200;
  for (let a = 0; a < slidesCount; a++) {
    if (Math.abs(tempTranslationArr[a]) < min) {
      idx = a;
      min = Math.abs(tempTranslationArr[a]);
    }
  }

  let nextZerothIndex = oldWalkingDistance < 0 ?
    (lastZerothIdx === 0 ? slidesCount - 1 : lastZerothIdx - 1) :
    (lastZerothIdx === slidesCount - 1 ? 0 : lastZerothIdx + 1);
  if (Math.abs(oldWalkingDistance) < 10) {
    updateSlideCss(slides, idx, slidesCount, tempTranslationArr, dots, false);

  } else {
    updateSlideCss(slides, nextZerothIndex, slidesCount, tempTranslationArr, dots, false);
  }

  slides.forEach(el => el.style.transitionDuration = `.5s`);

  translateArrs[i - 1] = tempTranslationArr;

  oldWalkingDistance = 0;

  const timeoutFunc800Id2 = setTimeout(timeoutFunc800, 800);
  const timeoutFunc1800Id2 = setTimeout(timeoutFunc1800, 1800)
  const interval = setInterval(intervalFn, 5000);

  return [false, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance]
}


// const img = new Image();
// img.onload = function () {
//     alert(this.width + 'x' + this.height);
// }
// img.src = 'http://www.google.com/intl/en_ALL/images/logo.gif';


// const formIcon = document.querySelector(".form-icon");

// formIcon.addEventListener("click", (e) => {
//     e.stopPropagation();
//     document.querySelector(".form-box").classList.toggle("translation-up");
//     document.querySelector(".full-bg").style.backgroundColor = "#02020275";
// })

// document.querySelector(".full-bg").addEventListener("click", (e) => {
//     e.stopPropagation();
//     document.querySelector(".form-box").classList.toggle("translation-up");
//     document.querySelector(".full-bg").style.backgroundColor = "transparent";
//     document.querySelector(".full-bg").style.pointerEvents = none;
// });

// document.querySelector(".form-box").addEventListener("click", e => {
//     e.stopPropagation();
// })














































































// const sliderCount = document.querySelectorAll(".slider").length;
// const translateArrs = [];

// for (let i = 1; i <= sliderCount; i++) {
//     // slider box element
//     const sliderBox = document.querySelector(`.slider-${i}`);
//     // each slide
//     const slides = document.querySelectorAll(`.slider-${i} .slide`);

//     // array of translation values to maintain the translations
//     const translateArr = [];

//     for (let k = 0; k < slides.length; k++) translateArr[k] = k * 100;

//     translateArrs.push(translateArr);

//     // box for the dots
//     const dotBox = document.querySelector(`.dots-${i}`);

//     // creating and adding dots to the dot box
//     for (let j = 0; j < translateArrs[i - 1].length; j++) {
//         const dot = document.createElement("div");
//         dot.classList.add("dot");
//         dotBox.appendChild(dot);
//     }

//     // capturing the dots as element
//     const dots = document.querySelectorAll(`.dots-${i} .dot`);


//     // providing the initial translation to each slide
//     slides.forEach((el, idx) => {
//         // providing height to the slider box according the slide
//         const height = window.getComputedStyle(el).height;
//         sliderBox.style.height = height;
//         updateOpacityNDotClass(el, translateArrs, dots, idx, i);
//     });

//     // function that will run at each interval
//     const intervalFn = () => {
//         // first translation each slide by 100% to the left
//         slides.forEach((el, idx) => {
//             translateArrs[i - 1][idx] -= 100;
//             updateOpacityNDotClass(el, translateArrs, dots, idx, i);
//         });

//         // changing the opacity of the slide with translation = -100
//         setTimeout(() => {
//             slides.forEach((el, idx) => {
//                 if (translateArrs[i - 1][idx] === -100) {
//                     el.style.opacity = 0;
//                 }
//             });
//         }, 800);


//         setTimeout(() => {
//             slides.forEach((el, idx) => {
//                 if (translateArrs[i - 1][idx] === -100) {
//                     translateArrs[i - 1][idx] = (slides.length - 1) * 100;
//                     el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
//                 }
//             });
//         }, 1800)
//     };

//     let interval = setInterval(intervalFn, 5000);


//     dots.forEach((el, idx) => {
//         el.addEventListener("click", (e) => {
//             e.stopPropagation();
//             clearInterval(interval);
//             const len = translateArrs[i - 1].length;
//             let count = 0;
//             const currentDot = translateArrs[i - 1].findIndex(el => el === 0);
//             for (let x = 0; x < len; x++) {
//                 if (x < idx)
//                     translateArrs[i - 1][x] = (len - idx + x) * 100;
//                 else {
//                     translateArrs[i - 1][x] = count * 100;
//                     count++;
//                 }
//             }

//             slides.forEach((el, idx) => {
//                 if (translateArrs[i - 1][idx] === 0) {
//                     updateOpacityNDotClass(el, translateArrs, dots, idx, i);
//                     el.style.zIndex = 2;
//                 }
//             });

//             dots[currentDot].classList.remove("dot-active");

//             setTimeout(() => {
//                 slides.forEach((el, idx) => {
//                     updateOpacityNDotClass(el, translateArrs, dots, idx, i);
//                     el.style.zIndex = 0;
//                     if (translateArrs[i - 1][idx] !== 0)
//                         el.style.opacity = 0;
//                 });
//             }, 800);

//             interval = setInterval(intervalFn, 5000);
//         })
//     })

//     window.addEventListener("resize", () => {
//         slides.forEach(el => {
//             const height = window.getComputedStyle(el).height;
//             sliderBox.style.height = height;
//         });
//     })
// }


// function updateOpacityNDotClass(el, translateArrs, dots, idx, i) {
//     el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
//     if (translateArrs[i - 1][idx] === 0) dots[idx].classList.add("dot-active");
//     else dots[idx].classList.remove("dot-active");
//     el.style.opacity = 1;
// }
