// firebase-config.js
// Small module that initializes Firebase and exports `auth`.
// Replace the firebaseConfig object with values from your Firebase Console.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
