// Example: simple welcome log
console.log("Welcome to StatStake! 🚀");
// Utility: fetch & display events
async function loadEvents(sport, containerId) {
  const container = document.getElementById(containerId);

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=${sport}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.events) {
      container.innerHTML = `<p>No ${sport} events today.</p>`;
      return;
    }

    // Build events list
    let html = "<ul>";
    data.events.slice(0, 5).forEach(event => {
      html += `
        <li>
          ${event.strEvent} <br>
          <small>${event.dateEvent} • ${event.strLeague}</small>
        </li>
      `;
    });
    html += "</ul>";

    container.innerHTML = html;
  } catch (err) {
    console.error(`Error loading ${sport} events:`, err);
    container.innerHTML = `<p>Failed to load ${sport} events.</p>`;
  }
}

// Load all sports
loadEvents("Soccer", "live-football");
loadEvents("Basketball", "live-basketball");
loadEvents("Tennis", "live-tennis");
// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");
// Login modal
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

loginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// Sign Up modal
const signupBtn = document.getElementById("signupBtn");
const signupModal = document.getElementById("signupModal");
const closeSignup = document.getElementById("closeSignup");

signupBtn.addEventListener("click", () => {
  signupModal.style.display = "block";
});

closeSignup.addEventListener("click", () => {
  signupModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.style.display = "none";
  }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // ✅ Check reCAPTCHA
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("Please verify that you are not a robot.");
    return;
  }

  // continue with Firebase signup...
});
// Show button when scrolled down
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// Smooth scroll to top
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
