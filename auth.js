import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { doc, setDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

function showMsg(text, type = "error") {
  const el = document.getElementById("formMsg");
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

const onAuthPage =
  document.getElementById("loginForm") ||
  document.getElementById("signupForm");

// If already logged in, keep them out of login/signup
onAuthStateChanged(auth, (user) => {
  if (user && onAuthPage) window.location.replace("./dashboard.html");
});

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Go to profile first (main path)
    window.location.replace("./profile.html?new=1");
 } catch (err) {
  console.error(err);

  if (err.code === "auth/email-already-in-use") {
    showMsg(
      "An account with this email already exists. Please log in instead.",
      "error"
    );
  } else if (err.code === "auth/weak-password") {
    showMsg(
      "Password must be at least 6 characters long.",
      "error"
    );
  } else if (err.code === "auth/invalid-email") {
    showMsg(
      "Please enter a valid email address.",
      "error"
    );
  } else {
    showMsg("Signup failed. Please try again.", "error");
  }
}



});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("./dashboard.html");
  } catch (err) {
    console.error(err);
    showMsg(err?.message ?? "Login failed", "error");
  }
});


