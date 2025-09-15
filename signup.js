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
const signupForm = document.getElementById('signup-form');
const signupErrorDiv = document.getElementById('error');

if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    signupErrorDiv.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = '/'; // Redirect after successful signup
      })
      .catch(err => {
        signupErrorDiv.textContent = err.message;
      });
  });
}
