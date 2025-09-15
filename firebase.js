// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsSHeTgN10bkdywhlJoi_p4ni7bxUAm6c",
  authDomain: "stat-stake.firebaseapp.com",
  projectId: "stat-stake",
  storageBucket: "stat-stake.appspot.com",
  messagingSenderId: "128167594111",
  appId: "1:128167594111:web:20d36adbae750494efd74a",
  measurementId: "G-H4HSTHZXX1"
};

// Initialize Firebase once
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const modal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const authForm = document.getElementById("authForm");
  const messageBox = document.getElementById("authMessage");

  let isLogin = true;

  // Show login modal
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      isLogin = true;
      modalTitle.textContent = "Login";
      modal.classList.remove("hidden");
      if (messageBox) messageBox.textContent = "";
    });
  }

  // Show signup modal
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      isLogin = false;
      modalTitle.textContent = "Sign Up";
      modal.classList.remove("hidden");
      if (messageBox) messageBox.textContent = "";
    });
  }

  // Hide modal
  if (closeModal) {
    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
  }

  // Handle login/signup form
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        let userCredential;
        if (isLogin) {
          userCredential = await auth.signInWithEmailAndPassword(email, password);
          messageBox.textContent = "✅ Login successful! Redirecting...";
        } else {
          userCredential = await auth.createUserWithEmailAndPassword(email, password);
          messageBox.textContent = "✅ Signup successful! Redirecting...";
          // Capture user data in Firestore
          await db.collection("users").doc(userCredential.user.uid).set({
            email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        messageBox.style.color = "green";
        setTimeout(() => {
          modal.classList.add("hidden");
          window.location.href = "index.html";
        }, 1500);
      } catch (error) {
        messageBox.textContent = `❌ ${error.message}`;
        messageBox.style.color = "red";
      }
    });
  }
});
// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyAsSHeTgN10bkdywhlJoi_p4ni7bxUAm6c",
  authDomain: "stat-stake.firebaseapp.com",
  // ... your other config
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Define your admin emails (or use custom claims for production)
const adminEmails = ["langa9660@gmail.com"]; // Replace with your admin emails

// Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');
const isAdminCheckbox = document.getElementById('isAdmin');

if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleAuth('login');
  });
}

if (signupBtn) {
  signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleAuth('signup');
  });
}

function handleAuth(type) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const isAdmin = isAdminCheckbox && isAdminCheckbox.checked;

  if (!email || !password) {
    showMessage('Email and password required.');
    return;
  }

  if (type === 'login') {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (isAdmin && !adminEmails.includes(email)) {
          showMessage('Not authorized as admin.');
          auth.signOut();
        } else {
          showMessage(isAdmin ? 'Admin login successful!' : 'User login successful!');
          // Redirect or show content based on role
        }
      })
      .catch((error) => showMessage(error.message));
  } else if (type === 'signup') {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        showMessage('Signup successful! Please login.');
        // Optionally: set custom claims via admin SDK on backend
      })
      .catch((error) => showMessage(error.message));
  }
}

function showMessage(msg) {
  if (authMessage) authMessage.textContent = msg;
}
