import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArDl9x3h7qZH3_ziq1ugITZKi3KvTVk6k",
  authDomain: "v04-web-application-team.firebaseapp.com",
  projectId: "v04-web-application-team",
  storageBucket: "v04-web-application-team.firebasestorage.app",
  messagingSenderId: "1061941570444",
  appId: "1:1061941570444:web:c3241b0bfc3cf1a92904a9",
  measurementId: "G-D64VXX6SBK"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
