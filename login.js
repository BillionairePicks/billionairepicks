// Initialize Firebase (insert your Firebase config here)
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
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const loginForm = document.getElementById('login-form');
const loginErrorDiv = document.getElementById('error');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    loginErrorDiv.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = '/'; // Redirect after successful login
      })
      .catch(err => {
        loginErrorDiv.textContent = err.message;
      });
  });
}
