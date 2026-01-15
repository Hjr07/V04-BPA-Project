import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, setDoc } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// SIGN UP: Auth account + Firestore user doc
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    role: "user",
    createdAt: Date.now()
  });

  window.location.href = "profile.html";
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "profile.html";
});
