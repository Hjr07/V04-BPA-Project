import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let uid = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  uid = user.uid;

  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("skillsOffered").value = data.skillsOffered ?? "";
    document.getElementById("skillsSeeking").value = data.skillsSeeking ?? "";
    document.getElementById("bio").value = data.bio ?? "";
  }
});

document.getElementById("profileForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!uid) return;

  try {
    await setDoc(doc(db, "users", uid), {
      skillsOffered: document.getElementById("skillsOffered").value.trim(),
      skillsSeeking: document.getElementById("skillsSeeking").value.trim(),
      bio: document.getElementById("bio").value.trim(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    alert("Profile saved ✅");
  } catch (err) {
    console.error(err);
    alert(err?.message ?? "Profile save failed");
  }
});

document.getElementById("skipProfileBtn")?.addEventListener("click", () => {
  window.location.replace("./dashboard.html");
});

let redirected = false;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (redirected) return;
    redirected = true;
    window.location.replace("./login.html");
    return;
  }

  uid = user.uid;
  // ...rest of your code
});





