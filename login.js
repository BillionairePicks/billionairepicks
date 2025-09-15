// Initialize Firebase (insert your Firebase config here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
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
