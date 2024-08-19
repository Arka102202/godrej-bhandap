// some test cases:
// 1. if slide_count >= 3 ===> works fine if completely blocked carousel 
// 2, 

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
  let slides = document.querySelectorAll(`.slider-${i} .slide`);

  let slidesCount = slides.length;

  const isOnly2Slides = slidesCount === 2;

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
    console.log("providing the initial translation to each slide");
    // providing height to the slider box according the slide
    const height = window.getComputedStyle(el.querySelector("img")).height;
    sliderBox.style.height = height;
    updateOpacityNDotClass(el, translateArrs, dots, idx, i);
    if (idx > 0) el.style.zIndex = -1;
    else el.style.zIndex = 1;
  });

  window.addEventListener("resize", () => {
    slides.forEach(el => {
      const height = window.getComputedStyle(el.querySelector("img")).height;
      sliderBox.style.height = height;
    });
  })

  if (slidesCount === 1) continue;

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
    console.log(slides);
    // first translation each slide by 100% to the left
    slides.forEach((el, idx) => {
      translateArrs[i - 1][idx] -= 100;
      updateOpacityNDotClass(el, translateArrs, dots, idx, i);
      el.style.transitionDuration = `.5s`;
    });

    // changing the opacity of the slide with translation = -100
    timeoutFunc800Id1 = setTimeout(timeoutFunc800, 800);
    timeoutFunc1800Id1 = setTimeout(timeoutFunc1800, 1800)
  };

  let interval = setInterval(intervalFn, 5000);


  dots.forEach((el, idx) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      clearTimeout(timeoutFunc800Id1);
      clearTimeout(timeoutFunc1800Id1);
      clearTimeout(timeoutFunc800Id2);
      clearTimeout(timeoutFunc1800Id2);
      clearInterval(interval);

      const currentDot = translateArrs[i - 1].findIndex(el => el === 0);
      let count = 0;
      for (let x = 0; x < slidesCount; x++) {
        if (x < idx) translateArrs[i - 1][x] = (slidesCount - idx + x) * 100;
        else translateArrs[i - 1][x] = 100 * count++;
      }

      slides.forEach((el, idx) => {
        el.style.transitionDuration = `0s`;
        if (translateArrs[i - 1][idx] === 0) {
          updateOpacityNDotClass(el, translateArrs, dots, idx, i);
          el.style.zIndex = 1;
        } else el.style.zIndex = -1;

      });

      dots[currentDot].classList.remove("dot-active");

      setTimeout(() => {
        slides.forEach((el, idx) => {
          updateOpacityNDotClass(el, translateArrs, dots, idx, i);
          el.style.transitionDuration = `.5s`;
        });
      }, 1800);

      interval = setInterval(intervalFn, 5000);
    })
  })



  // events to swipe the silds

  let tempTranslationArr = new Array(slidesCount);
  let oldWalkingDistance = 0;
  let lastZerothIdx = -1;
  // adding mousedown to each Slide

  sliderBox.addEventListener("mousedown", (e) => {
    e.preventDefault();

    lastZerothIdx = afterMouseMovesDown(slides, e, timeoutFunc800Id1, timeoutFunc1800Id1, timeoutFunc800Id2, timeoutFunc1800Id2, interval, translateArrs, i, slidesCount, dots, tempTranslationArr);

    if (slidesCount === 2) {

      const currentElem = slides[lastZerothIdx === slidesCount - 1 ? 0 : lastZerothIdx + 1];
      const newElem = currentElem.cloneNode(true);

      console.log(newElem);

      newElem.style.transform = `translate(100%, 0)`;

      if (lastZerothIdx === 0) {
        sliderBox.insertBefore(newElem, dotBox);
        tempTranslationArr.push(100);
      }
      else {
        sliderBox.insertBefore(newElem, slides[sliderCount - 1]);
        tempTranslationArr.splice(1, 0, 100);
      }


      slides = document.querySelectorAll(`.slider-${i} .slide`);

      slidesCount = slides.length;


    }


    // getting the initial position
    initialPos = e.pageX - sliderBox.offsetLeft;
    isMouseDown = true;
  });

  sliderBox.addEventListener("touchstart", (e) => {
    lastZerothIdx = afterMouseMovesDown(slides, e, timeoutFunc800Id1, timeoutFunc1800Id1, timeoutFunc800Id2, timeoutFunc1800Id2, interval, translateArrs, i, slidesCount, dots, tempTranslationArr);

    if (slidesCount === 2) {

      const currentElem = slides[lastZerothIdx === slidesCount - 1 ? 0 : lastZerothIdx + 1];
      const newElem = currentElem.cloneNode(true);

      console.log(newElem);

      newElem.style.transform = `translate(100%, 0)`;

      if (lastZerothIdx === 0) {
        sliderBox.insertBefore(newElem, dotBox);
        tempTranslationArr.push(100);
      }
      else {
        sliderBox.insertBefore(newElem, slides[sliderCount - 1]);
        tempTranslationArr.splice(1, 0, 100);
      }


      slides = document.querySelectorAll(`.slider-${i} .slide`);

      slidesCount = slides.length;


    }


    // getting the initial position
    initialPos = e.touches[0].pageX - sliderBox.offsetLeft;
    isMouseDown = true;

  });

  sliderBox.addEventListener("mouseup", (e) => {
    e.preventDefault();
    if (isMouseDown) {
      [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e, isOnly2Slides);
    }

    // console.log({ isMouseDown });
  });

  sliderBox.addEventListener("touchend", (e) => {
    [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e, isOnly2Slides);
  })

  sliderBox.addEventListener("mousemove", (e) => {
    e.preventDefault();
    if (isMouseDown) {
      // console.log("from mousemove", slides);
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
    // console.log("from mouse out ===> ", { isMouseDown });
    if (isMouseDown) {
      [isMouseDown, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance, slidesCount, slides] = afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e, isOnly2Slides);
    }
  })

}


function updateOpacityNDotClass(el, translateArrs, dots, idx, i) {
  el.style.transform = `translate(${translateArrs[i - 1][idx]}%, 0)`;
  if (translateArrs[i - 1][idx] === 0) dots[idx].classList.add("dot-active");
  else dots[idx].classList.remove("dot-active");
}

function updateSlideCss(slides, idx, slidesCount, tempTranslationArr, dots, setDuration, translateArrOnlyFor2Slides = [], hasNormalFlow = true, lastZerothIdx = null) {
  let tempCount = 0;

  slides.forEach((e, i) => {
    let translate = 0;
    if (hasNormalFlow) {
      if (idx === 0 && i === slidesCount - 1) translate = -100;
      else if (i < idx - 1) translate = (slidesCount - idx + i) * 100;
      else if (i === idx - 1) translate = -100;
      else translate = 100 * tempCount++;
    } else {
      translate = translateArrOnlyFor2Slides[i] + 100;
    }
    e.style.transform = `translate(${translate}%, 0)`;
    let zIndex = i === idx ? 1 : -1;
    if (lastZerothIdx !== null && i === lastZerothIdx) zIndex = 1;
    e.style.zIndex = zIndex;
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


function afterMouseMovesUp(slides, slidesCount, tempTranslationArr, translateArrs, i, oldWalkingDistance, lastZerothIdx, dots, timeoutFunc800, timeoutFunc1800, intervalFn, e, isOnly2Slides) {
  e.stopPropagation();

  let nextZerothIndex = lastZerothIdx;

  console.log({ oldWalkingDistance });

  let translateArrOnlyFor2Slides = [0, 100], callNormalUpdateFunc = true;

  if (Math.abs(oldWalkingDistance) < 10) {
    if (isOnly2Slides) {
      let elemToRemove = slides[slidesCount - 1];
      if (lastZerothIdx === 1) elemToRemove = slides[1];
      elemToRemove.remove();

      slides = document.querySelectorAll(`.slider-${i} .slide`);

      slidesCount = slides.length;

      tempTranslationArr.pop();

      console.log(slides, slidesCount, tempTranslationArr);

    }

  } else {
    if (isOnly2Slides) {

      let elemToRemove = null;

      if (oldWalkingDistance < 0) {
        if (lastZerothIdx === 0) {
          elemToRemove = slides[slidesCount - 1];
          translateArrOnlyFor2Slides = [0, -100];
        }
        else {
          elemToRemove = slides[1];
          translateArrOnlyFor2Slides = [-100, 0];
        }
        callNormalUpdateFunc = false;

      } else {
        if (lastZerothIdx === 0) elemToRemove = slides[1];
        else elemToRemove = slides[0];
      }

      elemToRemove.remove();

      slides = document.querySelectorAll(`.slider-${i} .slide`);

      slidesCount = slides.length;

      tempTranslationArr.shift();
      console.log(slides, slidesCount, tempTranslationArr);


    }

    nextZerothIndex = oldWalkingDistance < 0 ?
      (lastZerothIdx === 0 ? slidesCount - 1 : lastZerothIdx - 1) :
      (lastZerothIdx === slidesCount - 1 ? 0 : lastZerothIdx + 1);

  }

  console.log({ lastZerothIdx });

  updateSlideCss(slides, nextZerothIndex, slidesCount, tempTranslationArr, dots, false, translateArrOnlyFor2Slides, callNormalUpdateFunc, lastZerothIdx);

  slides.forEach(el => el.style.transitionDuration = `.5s`);

  translateArrs[i - 1] = tempTranslationArr;

  oldWalkingDistance = 0;

  const timeoutFunc800Id2 = setTimeout(timeoutFunc800, 800);
  const timeoutFunc1800Id2 = setTimeout(timeoutFunc1800, 1800)
  const interval = setInterval(intervalFn, 5000);

  return [false, timeoutFunc800Id2, timeoutFunc1800Id2, interval, oldWalkingDistance, slidesCount, slides]
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

