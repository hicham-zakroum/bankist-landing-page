"use strict";

///////////////////////////////////////
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnLearn = document.querySelector(".btn--text");
const section1 = document.getElementById("section--1");
const navLinks = document.querySelectorAll(".nav__link");
const opTabContainer = document.querySelector(".operations__tab-container");
const opTabs = document.querySelectorAll(".operations__tab");
const opContents = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (const btn of btnsOpenModal) {
  btn.addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
/////////////////////////////
// page navigation

// const clickNavLink = function (e) {
//   e.preventDefault();
//   const id = this.getAttribute("href");
//   document.querySelector(id).scrollIntoView({ behavior: "smooth" });
// };
// navLinks.forEach(function (el) {
//   el.addEventListener("click", clickNavLink);
// });
//////////////////    (((((better way)))))

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});
////////////////////////////
// learn more button
const learnMore = function () {
  ////////////////// ----old school
  // const s1cords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  ///////////////// ------new one
  section1.scrollIntoView({ behavior: "smooth" });
};
btnLearn.addEventListener("click", learnMore);

//////////////////////////////
// the tabbed coomponent
opTabContainer.addEventListener("click", function (e) {
  const target = e.target.closest(".operations__tab");
  if (!target) return;
  opTabs.forEach((t) => t.classList.remove("operations__tab--active"));
  target.classList.add("operations__tab--active");
  opContents.forEach((c) => c.classList.remove("operations__content--active"));
  // display the content of the target button
  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add("operations__content--active");
});

////////////////////////
// navbar fade animation

const fadeNav = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    /////
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener("mouseover", (e) => fadeNav(e, "0.5"));
nav.addEventListener("mouseout", (e) => fadeNav(e, "1"));

///////////////////////
// sticky navbar
const navHeight = nav.getBoundingClientRect().height;
const navSticky = function (entries) {
  if (!entries[0].isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const obsNavSticky = new IntersectionObserver(navSticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
obsNavSticky.observe(header);
///////////////////////////////////
// revealing elements
const sections = document.querySelectorAll(".section");
const revealing = function (entries, observer) {
  if (!entries[0].isIntersecting) return;
  entries[0].target.classList.remove("section--hidden");
  observer.unobserve(entries[0].target);
};
const obsSection = new IntersectionObserver(revealing, {
  root: null,
  threshold: 0.15,
});
sections.forEach((s) => {
  obsSection.observe(s);
  s.classList.add("section--hidden");
});
////////////////////////////////////
// lazy loading images
const imgsTarget = document.querySelectorAll(".features__img");
const loadImg = function (entries, observer) {
  if (!entries[0].isIntersecting) return;
  entries[0].target.src = entries[0].target.dataset.src;
  entries[0].target.addEventListener("load", function () {
    entries[0].target.classList.remove("lazy-img");
  });
  observer.unobserve(entries[0].target);
};
const obsImgLoad = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgsTarget.forEach((i) => {
  obsImgLoad.observe(i);
});
////////////////////////////////
// slider
let curSlide = 0;
const maxSlide = slides.length - 1;

// go to slide
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
goToSlide(0);
// next slide
btnRight.addEventListener("click", function () {
  if (curSlide === maxSlide) curSlide = 0;
  else curSlide++;
  goToSlide(curSlide);
  activeDot(curSlide);
});
// previous slide
btnLeft.addEventListener("click", function () {
  if (curSlide === 0) curSlide = 0;
  else curSlide--;
  goToSlide(curSlide);
  activeDot(curSlide);
});
// creating dots button
slides.forEach((_, i) => {
  dotsContainer.insertAdjacentHTML(
    "beforeend",
    `<button class="dots__dot" data-slide="${i}"></button>`
  );
});
const activeDot = function (slide) {
  const dotsDot = document.querySelectorAll(".dots__dot");
  dotsDot.forEach((dot) => {
    dot.classList.remove("dots__dot--active");
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  });
};
activeDot(0);
dotsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activeDot(slide);
  }
});
