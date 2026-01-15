import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

await setDoc(doc(db, "test", "hello"), {
  createdAt: Date.now(),
  message: "Firestore is working!"
});

console.log("Wrote to Firestore ✅");
