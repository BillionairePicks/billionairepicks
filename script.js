// script.js - slider logic
(() => {
  const slides = document.querySelector('.slides');
  const dots = Array.from(document.querySelectorAll('.dot'));
  let index = 0;
  const setSlide = i => {
    index = i;
    slides.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[i].classList.add('active');
  };

  // dot clicks
  dots.forEach(d => {
    d.addEventListener('click', () => setSlide(Number(d.dataset.index)));
  });

  // auto rotate
  let interval = setInterval(() => {
    setSlide((index + 1) % dots.length);
  }, 4500);

  // pause on hover
  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', () => clearInterval(interval));
  slider.addEventListener('mouseleave', () => {
    interval = setInterval(() => setSlide((index + 1) % dots.length), 4500);
  });

  // init
  setSlide(0);
})();
