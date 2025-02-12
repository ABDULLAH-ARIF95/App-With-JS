import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb9XP3osjXrmcqdxZASryQ3Es16Eaaeh8",
  authDomain: "fir-assignment2-42778.firebaseapp.com",
  projectId: "fir-assignment2-42778",
  storageBucket: "fir-assignment2-42778.firebasestorage.app",
  messagingSenderId: "547216106075",
  appId: "1:547216106075:web:ecae3b97b8a5f8f109557e",
  measurementId: "G-2L7VSL1HS9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
