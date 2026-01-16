import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let uid = null;

const listEl = document.getElementById("requestList");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }
  uid = user.uid;

  // Live list of this user's requests
  const q = query(
    collection(db, "requests"),
    where("fromUser", "==", uid),
    orderBy("createdAt", "desc")
  );

  const listEl = document.getElementById("requestList");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }
  uid = user.uid;

  if (!listEl) {
    console.warn("No #requestList found on this page.");
    return;
  }

  const q = query(
    collection(db, "requests"),
    where("fromUser", "==", uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(
    q,
    (snap) => {
      listEl.innerHTML = "";

      if (snap.empty) {
        listEl.innerHTML = `<div class="card"><p>No requests yet.</p></div>`;
        return;
      }

      snap.forEach((d) => {
        const r = d.data();
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${r.requestedSkill ?? ""}</h3>
          <p><strong>Status:</strong> ${r.status ?? "Pending"}</p>
          <p><strong>Date:</strong> ${r.sessionDate ?? ""}</p>
          <p>${r.message ?? ""}</p>
        `;
        listEl.appendChild(card);
      });
    },
    (err) => {
      console.error("onSnapshot error:", err);
      listEl.innerHTML = `<div class="card"><p><strong>Error:</strong> ${err.message}</p></div>`;
    }
  );
});

});

// Submit request
document.getElementById("requestForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!uid) return;

  try {
    const requestedSkill = document.getElementById("requestedSkill").value.trim();
    const sessionDate = document.getElementById("sessionDate").value;
    const message = document.getElementById("requestMessage").value.trim();

    await addDoc(collection(db, "requests"), {
      fromUser: uid,
      requestedSkill,
      sessionDate,
      message,
      status: "Pending",
      createdAt: serverTimestamp()
    });

const msg = document.getElementById("reqMsg");
if (msg) {
  msg.textContent = "Request submitted successfully ✅";
  msg.className = "form-msg success";
}
setTimeout(() => {
  if (msg) msg.textContent = "";
}, 3000);

    e.target.reset();
  } catch (err) {
    console.error(err);
    alert(err?.message ?? "Request failed");
  }
});
