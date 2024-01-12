'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
btnScrollTo.addEventListener('click', function(e) {
  const targetScroll = document.getElementById('section--1');
  window.scrollTo({
    left: targetScroll.getBoundingClientRect().x + window.pageXOffset, 
    top: targetScroll.getBoundingClientRect().y + window.pageYOffset,
    behavior: 'smooth'
  });
})

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const tabContainer = document.querySelector('.operations__tab-container');

tabContainer.addEventListener('click', function(e) {
  const cliked = e.target.closest('.operations__tab');
  
  if (!cliked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(tc => tc.classList.remove('operations__content--active'));
  cliked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${cliked.dataset.tab}`).classList.add('operations__content--active');
})

const nav = document.querySelector('nav');
const handleNav = function(e) {
  const link = e.target;
  if (link.classList.contains('nav__link')) {
      const links = nav.closest('nav').querySelectorAll('.nav__link');
      links.forEach(el => {
        if (el !== link)
          el.style.opacity = this;
      })
  }
}
nav.addEventListener('mouseover', handleNav.bind(0.5))

nav.addEventListener('mouseout', handleNav.bind(1))

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  }
  else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

/* Reveal sections */
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
})

/* Loading image */

const lazyImg = document.querySelectorAll('img[data-src]');

const loading = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0
});

lazyImg.forEach(img => {
  imgObserver.observe(img);
})

/* SLIDER */
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const maxSlides = slides.length;
let curIndex = 0;
const slide = function(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i-slide)}%)`;
  })
}
slide(curIndex);

const dots = document.querySelector('.dots');
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');

const createDots = ()=> {
  slides.forEach((_ , i) => {
    dots.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${i}></button>`);
  })
}
createDots();

const activeDot = function(active) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${active}"]`).classList.add('dots__dot--active');
}
activeDot(curIndex);

const nextSlide = function() {
  curIndex = (curIndex === maxSlides - 1) ? 0 : ++curIndex;
  slide(curIndex);
  activeDot(curIndex);
}

const previewSlide = function() {
  curIndex = (curIndex === 0) ? maxSlides - 1 : --curIndex;
  slide(curIndex);
  activeDot(curIndex);
}

dots.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    slide(e.target.dataset.slide);
    activeDot(e.target.dataset.slide);
  }
})

leftBtn.addEventListener('click', previewSlide);
rightBtn.addEventListener('click', nextSlide);

document.onkeyup = (e)=> {
  if (e.key === "ArrowLeft") previewSlide();
  e.key === "ArrowRight" && nextSlide();
}