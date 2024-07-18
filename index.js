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

const slides1 = document.querySelectorAll(".slider-1 .slide");
const slides2 = document.querySelectorAll(".slider-2 .slide");
const translateArr = [0, 100, 200, 300, 400, 500];
const dotBox1 = document.querySelector(".dots-1");
const dotBox2 = document.querySelector(".dots-2");

for(let i=0; i<translateArr.length; i++){
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dotBox1.appendChild(dot);
    dotBox2.appendChild(dot.cloneNode());
}

const dots1 = document.querySelectorAll(".dots-1 .dot");
const dots2 = document.querySelectorAll(".dots-2 .dot");

console.log(dots1);

slides1.forEach((el, idx) => {
    el.style.transform = `translate(${translateArr[idx]}%, 0)`;
    if(translateArr[idx] === 0) {
        el.style.opacity = 1;
        dots1[idx].classList.add("dot-active");
    }
    else {
        el.style.opacity = 0;
        dots1[idx].classList.remove("dot-active");
    }
});
slides2.forEach((el, idx) => {
    el.style.transform = `translate(${translateArr[idx]}%, 0)`;
    if(translateArr[idx] === 0) {
        el.style.opacity = 1;
        dots2[idx].classList.add("dot-active");
    }
    else {
        el.style.opacity = 0;
        dots2[idx].classList.remove("dot-active");
    }
});

const interval = setInterval(() => {
    slides1.forEach((el, idx) => {
        translateArr[idx] -= 100;
        el.style.transform = `translate(${translateArr[idx]}%, 0)`;
        if(translateArr[idx] === 0) {
            el.style.opacity = 1;
            dots1[idx].classList.add("dot-active");
        }
        else {
            el.style.opacity = 0;
            dots1[idx].classList.remove("dot-active");
        }
    });
    slides2.forEach((el, idx) => {
        // translateArr[idx] -= 100;
        el.style.transform = `translate(${translateArr[idx]}%, 0)`;
        if(translateArr[idx] === 0) {
            el.style.opacity = 1;
            dots2[idx].classList.add("dot-active");
        }
        else {
            el.style.opacity = 0;
            dots2[idx].classList.remove("dot-active");
        }
    });
    setTimeout(() => {
        slides1.forEach((el, idx) => {

            if(translateArr[idx] === -100){
                // translateArr[idx] = 500;
            el.style.transform = `translate(${500}%, 0)`;
            }
        });
        slides2.forEach((el, idx) => {

            if(translateArr[idx] === -100){
                translateArr[idx] = 500;
            el.style.transform = `translate(${translateArr[idx]}%, 0)`;
            }
        });
    }, 1000)
}, 5000);