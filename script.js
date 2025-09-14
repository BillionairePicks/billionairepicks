// script.js (module)
// ---------------------------
// Firebase + App Logic
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ========== CONFIG: replace with your Firebase project config ========== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
/* ====================================================================== */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- DOM refs ---------- */
const matchesList = document.getElementById("matchesList");
const refreshBtn = document.getElementById("refreshBtn");
const leagueFilter = document.getElementById("leagueFilter");

const predictionsList = document.getElementById("predictionsList");
const newPredictionBtn = document.getElementById("newPredictionBtn");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const predictionModal = document.getElementById("predictionModal");
const closePrediction = document.getElementById("closePrediction");
const predictionForm = document.getElementById("predictionForm");

const userArea = document.getElementById("userArea");
const userDisplay = document.getElementById("userDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const authButtons = document.getElementById("authButtons");
const adminControls = document.getElementById("adminControls");

const backToTop = document.getElementById("backToTop");

/* ---------- UI helpers ---------- */
function showModal(modal){ modal.style.display = "flex"; }
function hideModal(modal){ modal.style.display = "none"; }

/* Modal handlers */
loginBtn.onclick = () => showModal(loginModal);
signupBtn.onclick = () => showModal(signupModal);
closeLogin.onclick = () => hideModal(loginModal);
closeSignup.onclick = () => hideModal(signupModal);
window.addEventListener("click", (e)=> {
  if(e.target === loginModal) hideModal(loginModal);
  if(e.target === signupModal) hideModal(signupModal);
  if(e.target === predictionModal) hideModal(predictionModal);
});

newPredictionBtn && (newPredictionBtn.onclick = ()=> showModal(predictionModal));
closePrediction && (closePrediction.onclick = ()=> hideModal(predictionModal));

/* Back to top */
window.addEventListener("scroll", ()=> {
  backToTop.style.display = window.scrollY > 240 ? "block" : "none";
});
backToTop.onclick = ()=> window.scrollTo({top:0, behavior:"smooth"});

/* ---------- Live matches fetch (TheSportsDB) ---------- */
async function fetchMatches() {
  const today = new Date().toISOString().split("T")[0];
  matchesList.innerHTML = `<p>Loading matches for ${today}…</p>`;
  try {
    // eventsday endpoint returns events for a given date and sport
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`;
    const res = await fetch(url);
    const json = await res.json();

    const events = json.events || [];
    renderMatches(events);
  } catch (err) {
    console.error("Failed to fetch matches", err);
    matchesList.innerHTML = `<p>Failed to load matches.</p>`;
  }
}

function renderMatches(events) {
  if (!events.length) {
    matchesList.innerHTML = "<p>No matches found today.</p>";
    return;
  }

  // Optionally filter by league
  const league = leagueFilter.value;
  const filtered = league ? events.filter(e => (e.strLeague || "").includes(league)) : events;

  matchesList.innerHTML = "";
  filtered.forEach(ev => {
    const el = document.createElement("div");
    el.className = "match";
    const left = document.createElement("div"); left.className = "left";
    const teams = document.createElement("div"); teams.className = "teams";
    teams.innerText = `${ev.strHomeTeam} vs ${ev.strAwayTeam}`;
    const leagueEl = document.createElement("div"); leagueEl.className = "league";
    leagueEl.innerText = ev.strLeague || "";
    const timeEl = document.createElement("div"); timeEl.className = "time";
    timeEl.innerText = `${ev.dateEvent} ${ev.strTime || ""}`;

    left.appendChild(teams);
    left.appendChild(leagueEl);

    const right = document.createElement("div");
    right.style.textAlign = "right";
    right.appendChild(timeEl);

    // AI-insight generation (quick local heuristic)
    const insight = document.createElement("div");
    insight.className = "insight";
    insight.innerText = generateInsight(ev); // simple AI-like heuristic

    el.appendChild(left);
    el.appendChild(right);
    el.appendChild(insight);

    // Admin quick-predict button (if admin UI visible, will show via CSS/JS)
    const adminBtn = document.createElement("button");
    adminBtn.className = "btn small outline";
    adminBtn.style.marginLeft = "8px";
    adminBtn.innerText = "Use for Prediction";
    adminBtn.onclick = () => {
      // prefill prediction modal
      document.getElementById("pred-match").value = `${ev.strHomeTeam} vs ${ev.strAwayTeam}`;
      document.getElementById("pred-date").value = ev.dateEvent || (new Date().toISOString().split("T")[0]);
      document.getElementById("pred-text").value = generateInsight(ev, true); // longer detail
      showModal(predictionModal);
    };
    right.appendChild(adminBtn);

    matchesList.appendChild(el);
  });
}

/* ---------- Simple AI-insight generator (client-only heuristic) ---------- */
function generateInsight(eventObj, long=false) {
  // eventObj has limited fields from TheSportsDB. This is a heuristic "AI-like" insight:
  // - If scores exist (live/finished) use them
  // - Otherwise compute pseudo-probabilities based on event id (random seeded) and league strength
  const home = eventObj.strHomeTeam || "Home";
  const away = eventObj.strAwayTeam || "Away";
  const league = eventObj.strLeague || "";

  // If match has score fields, use them
  const homeScore = eventObj.intHomeScore;
  const awayScore = eventObj.intAwayScore;
  if (homeScore != null && awayScore != null) {
    const lead = homeScore - awayScore;
    if (lead > 0) return `${home} leading ${homeScore}-${awayScore} — ${home} favored to win.`;
    if (lead < 0) return `${away} leading ${awayScore}-${homeScore} — ${away} favored to win.`;
    return `Draw ${homeScore}-${awayScore} — tight match.`;
  }

  // Otherwise produce a deterministic pseudo-random probability based on event id
  const idSeed = eventObj.idEvent || eventObj.strEvent || Math.random().toString();
  let hash = 0;
  for (let i=0;i<idSeed.length;i++) hash = ((hash<<5)-hash) + idSeed.charCodeAt(i);
  const rnd = Math.abs(hash % 100) / 100; // 0..0.99

  // league bonus heuristic
  const strongLeagues = ["English", "Premier", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];
  const leagueBoost = strongLeagues.some(s => league.includes(s)) ? 0.03 : 0;

  const homeProb = Math.round(((0.45 + rnd*0.1 + leagueBoost) * 100));
  const awayProb = 100 - homeProb;

  if (!long) return `${homeProb}% ${home} • ${awayProb}% ${away} (heuristic)`;
  // longer explanation
  return `Heuristic insight: ${homeProb}% chance for ${home} vs ${awayProb}% for ${away}. This is a quick model using event signature + league strength heuristic — replace with real model for higher accuracy.`;
}

/* ---------- Predictions (Firestore) ---------- */
async function loadPredictions() {
  predictionsList.innerHTML = `<p>Loading predictions…</p>`;
  try {
    // load upcoming/past predictions ordered by date desc
    const q = query(collection(db, "predictions"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    const docs = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderPredictions(docs);
  } catch (err) {
    console.error("Failed to load predictions", err);
    predictionsList.innerHTML = `<p>Failed to load predictions.</p>`;
  }
}

function renderPredictions(docs) {
  if (!docs.length) {
    predictionsList.innerHTML = "<p>No predictions published yet.</p>";
    return;
  }
  predictionsList.innerHTML = "";
  docs.forEach(d => {
    const card = document.createElement("div");
    card.className = "pred-card";
    card.innerHTML = `
      <div class="pred-meta">${d.date || ""} • by ${d.authorName || "admin"}</div>
      <div class="pred-match"><strong>${d.match}</strong></div>
      <div class="pred-text" style="margin-top:6px;">${d.text}</div>
      <div style="margin-top:8px; font-size:13px; color:#666">Confidence: ${d.confidence || 0}%</div>
    `;
    // if current user is admin (we'll check) allow delete
    if (window.currentUserIsAdmin) {
      const del = document.createElement("button");
      del.className = "btn small outline";
      del.style.marginTop = "8px";
      del.innerText = "Delete";
      del.onclick = async ()=> {
        if (!confirm("Delete this prediction?")) return;
        try{
          await deleteDoc(doc(db, "predictions", d.id));
          loadPredictions();
        }catch(err){alert("Failed to delete"); console.error(err)}
      };
      card.appendChild(del);
    }
    predictionsList.appendChild(card);
  });
}

/* ---------- Signup/Login handlers ---------- */
signupForm && signupForm.addEventListener("submit", async (e)=> {
  e.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  if(password.length < 6) return alert("Password must be 6+ chars");
  if(password !== confirm) return alert("Passwords do not match");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    // store profile; default isAdmin false; set true manually for admin users in Firestore or implement invite flow
    await setDoc(doc(db, "users", uid), {
      username,
      email,
      isAdmin: false,
      createdAt: serverTimestamp()
    });
    await updateProfile(userCred.user, { displayName: username }).catch(()=>{});
    alert("Account created — you are signed in.");
    hideModal(signupModal);
  } catch (err) {
    console.error(err); alert(err.message || "Signup failed");
  }
});

loginForm && loginForm.addEventListener("submit", async (e)=> {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in");
    hideModal(loginModal);
  } catch (err) {
    console.error(err); alert(err.message || "Login failed");
  }
});

logoutBtn && (logoutBtn.onclick = async ()=> {
  try { await signOut(auth); alert("Logged out"); } catch(e){ console.error(e); alert("Logout failed"); }
});

/* ---------- Prediction publish (admin) ---------- */
predictionForm && predictionForm.addEventListener("submit", async (e)=> {
  e.preventDefault();
  // must be admin
  if (!window.currentUserIsAdmin) return alert("Only admins can publish predictions.");
  const date = document.getElementById("pred-date").value;
  const match = document.getElementById("pred-match").value.trim();
  const text = document.getElementById("pred-text").value.trim();
  const confidence = Number(document.getElementById("pred-confidence").value || 0);

  if (!date || !match || !text) return alert("Please fill all fields.");
  try {
    const docRef = await addDoc(collection(db, "predictions"), {
      date, match, text, confidence,
      authorUid: window.currentUserUid || null,
      authorName: window.currentUserName || "admin",
      createdAt: serverTimestamp()
    });
    alert("Prediction published.");
    hideModal(predictionModal);
    predictionForm.reset();
    loadPredictions();
  } catch (err) {
    console.error("Failed to publish", err); alert("Failed to publish.");
  }
});

/* ---------- Auth state: update UI & admin status ---------- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // fetch user profile from Firestore to check isAdmin & displayName
    const uid = user.uid;
    window.currentUserUid = uid;
    let username = user.displayName || user.email;
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        username = data.username || username;
        window.currentUserIsAdmin = !!data.isAdmin;
      } else {
        window.currentUserIsAdmin = false;
      }
    } catch (err) {
      console.warn("Failed to load user profile", err);
      window.currentUserIsAdmin = false;
    }

    userDisplay.innerText = `Hi, ${username}`;
    userArea.style.display = "flex";
    authButtons.style.display = "none";
    adminControls.style.display = window.currentUserIsAdmin ? "block" : "none";
    // show admin UI on predictions if admin
    loadPredictions();
  } else {
    window.currentUserUid = null;
    window.currentUserIsAdmin = false;
    userArea.style.display = "none";
    authButtons.style.display = "flex";
    adminControls.style.display = "none";
    loadPredictions();
  }
});

/* ---------- Init ---------- */
refreshBtn && (refreshBtn.onclick = fetchMatches);
leagueFilter && (leagueFilter.onchange = fetchMatches);

// initial load
fetchMatches();
loadPredictions();
