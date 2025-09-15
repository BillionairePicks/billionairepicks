// Initialize Firebase (insert your Firebase config here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
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