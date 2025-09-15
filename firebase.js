// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsSHeTgN10bkdywhlJoi_p4ni7bxUAm6c",
  authDomain: "stat-stake.firebaseapp.com",
  projectId: "stat-stake",
  storageBucket: "stat-stake.firebasestorage.app",
  messagingSenderId: "128167594111",
  appId: "1:128167594111:web:20d36adbae750494efd74a",
  measurementId: "G-H4HSTHZXX1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Elements
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const modal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const authForm = document.getElementById("authForm");

let isLogin = true;

// Open modal
loginBtn.addEventListener("click", () => {
  isLogin = true;
  modalTitle.textContent = "Login";
  modal.classList.remove("hidden");
});
signupBtn.addEventListener("click", () => {
  isLogin = false;
  modalTitle.textContent = "Sign Up";
  modal.classList.remove("hidden");
});

// Close modal
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// Handle form submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    if (isLogin) {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login successful!");
    } else {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Signup successful!");
    }
    modal.classList.add("hidden");
  } catch (err) {
    alert(err.message);
  }
});

// ----------------- API-SPORTS LIVE FOOTBALL DATA -----------------
const statsContainer = document.getElementById("liveStats");

// Replace with your API-Sports key
const API_KEY = "ea44b839d82e5238bc3f3ffd4fbe465b";
const LEAGUE_ID = 39; // Example: Premier League
const SEASON = 2025;

// Fetch live fixtures
async function fetchLiveStats() {
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?live=all`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": ea44b839d82e5238bc3f3ffd4fbe465b
          "x-rapidapi-host": "v3.football.api-sports.io"
        }
      }
    );

    const data = await response.json();

    if (data.response.length === 0) {
      statsContainer.innerHTML = "<p>No live matches right now.</p>";
      return;
    }

    // Build HTML for live matches
    let html = "<ul>";
    data.response.forEach(match => {
      const home = match.teams.home.name;
      const away = match.teams.away.name;
      const score = `${match.goals.home} - ${match.goals.away}`;
      html += `<li><strong>${home}</strong> vs <strong>${away}</strong> : ${score}</li>`;
    });
    html += "</ul>";

    statsContainer.innerHTML = html;

  } catch (error) {
    console.error(error);
    statsContainer.innerHTML = "<p>Failed to load live stats.</p>";
  }
}

// Auto-refresh every 60s
fetchLiveStats();
setInterval(fetchLiveStats, 60000);
