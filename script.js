// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI Elements
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const liveStats = document.getElementById("liveStats");
const matchesDiv = document.getElementById("matches");

// Toggle forms
showSignup.addEventListener("click", () => {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});
showLogin.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

// Signup
document.getElementById("signupBtn").addEventListener("click", async () => {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store extra info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    alert("Signup successful!");
  } catch (err) {
    alert(err.message);
  }
});

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (err) {
    alert(err.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    signupForm.classList.add("hidden");
    loginForm.classList.add("hidden");
    showLogin.classList.add("hidden");
    showSignup.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    userInfo.classList.remove("hidden");
    liveStats.classList.remove("hidden");

    userEmail.textContent = user.email;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    userName.textContent = docSnap.exists() ? docSnap.data().username : "User";

    loadLiveMatches(); // load stats when logged in
  } else {
    userInfo.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    showLogin.classList.remove("hidden");
    showSignup.classList.remove("hidden");
    liveStats.classList.add("hidden");
  }
});

// ⚽ Load Live Football Matches from API-Football
async function loadLiveMatches() {
  matchesDiv.innerHTML = "Loading live matches...";

  try {
    // Example with API-Football (sign up for a free API key at rapidapi.com/api-sports)
    const url = "https://v3.football.api-sports.io/fixtures?live=all";
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": "ea44b839d82e5238bc3f3ffd4fbe465b"  // ✅ replace with your API key
      }
    });
    const data = await res.json();

    matchesDiv.innerHTML = "";

    if (data.response.length === 0) {
      matchesDiv.innerHTML = "<p>No live matches right now.</p>";
    } else {
      data.response.forEach(match => {
        const div = document.createElement("div");
        div.classList.add("match");
        div.innerHTML = `
          <strong>${match.teams.home.name}</strong> ${match.goals.home} 
          - ${match.goals.away} <strong>${match.teams.away.name}</strong>
          <br><small>${match.league.name}, ${match.fixture.status.long}</small>
        `;
        matchesDiv.appendChild(div);
      });
    }
  } catch (err) {
    matchesDiv.innerHTML = "<p>Error loading live matches.</p>";
    console.error(err);
  }
}
