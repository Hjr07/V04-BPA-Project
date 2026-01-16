import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    console.log("Logout clicked ✅");
    await signOut(auth);
    console.log("Signed out ✅ currentUser =", auth.currentUser);
    window.location.replace("./index.html"); // replace prevents weird back-button behavior
  } catch (err) {
    console.error("Logout failed:", err);
  }
});
