// Simple dot slider control
let slideIndex = 0;
const dots = document.querySelectorAll(".dot");
const slides = document.querySelector(".slides");

function showSlide() {
  dots.forEach((dot, i) => {
    dot.classList.remove("active");
    if (i === slideIndex) {
      dot.classList.add("active");
    }
  });
}

setInterval(() => {
  slideIndex = (slideIndex + 1) % dots.length;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
  showSlide();
}, 4000);
