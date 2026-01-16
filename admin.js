import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const userList = document.getElementById("userList");
const adminRequests = document.getElementById("adminRequests");

async function requireAdmin(user) {
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();
  return data?.role === "admin";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const isAdmin = await requireAdmin(user);
  if (!isAdmin) {
    // non-admins should not access admin page
    alert("Admins only.");
    window.location.href = "./index.html";
    return;
  }

  // USERS live list
  onSnapshot(collection(db, "users"), (snap) => {
    userList.innerHTML = "";
    snap.forEach((d) => {
      const u = d.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${u.name ?? "Unnamed"}</h3>
        <p>${u.email ?? ""}</p>
        <p><strong>Role:</strong> ${u.role ?? "user"}</p>
        <p><strong>Offers:</strong> ${u.skillsOffered ?? "-"}</p>
        <p><strong>Wants:</strong> ${u.skillsSeeking ?? "-"}</p>
      `;
      userList.appendChild(card);
    });
  });

  // REQUESTS live list
  const rq = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  onSnapshot(rq, (snap) => {
    adminRequests.innerHTML = "";
    snap.forEach((d) => {
      const r = d.data();
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${r.requestedSkill ?? ""}</h3>
        <p><strong>From:</strong> ${r.fromUser ?? ""}</p>
        <p><strong>Date:</strong> ${r.sessionDate ?? ""}</p>
        <p><strong>Status:</strong> <span data-status>${r.status ?? "Pending"}</span></p>
        <p>${r.message ?? ""}</p>

        <div style="display:flex; gap:.5rem; margin-top:.75rem; flex-wrap:wrap;">
          <button class="btn primary" data-action="approve">Approve</button>
          <button class="btn secondary" data-action="deny">Deny</button>
          <button class="btn secondary" data-action="complete">Complete</button>
        </div>
      `;

      card.querySelectorAll("button[data-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const action = btn.getAttribute("data-action");
          const newStatus =
            action === "approve" ? "Approved" :
            action === "deny" ? "Denied" :
            "Completed";

          await updateDoc(doc(db, "requests", d.id), {
            status: newStatus,
            updatedAt: serverTimestamp()
          });
        });
      });

      adminRequests.appendChild(card);
    });

    if (snap.empty) {
      adminRequests.innerHTML = `<div class="card"><p>No requests yet.</p></div>`;
    }
  });
}); 
