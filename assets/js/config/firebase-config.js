// ================================================
// Firebase Configuration
// boibanet - Web Pribadi Dosen
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// ─── Firebase Config ─────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCeE108oCH5F9hyGTLRmZu3bRW8ZxB3AbU",
  authDomain: "boibanet-f144c.firebaseapp.com",
  projectId: "boibanet-f144c",
  storageBucket: "boibanet-f144c.firebasestorage.app",
  messagingSenderId: "511701615381",
  appId: "1:511701615381:web:6c88c535ea817e941b5f1c"
};

// ─── Init Firebase ────────────────────────────────
const app = initializeApp(firebaseConfig);

// ─── Init Services ────────────────────────────────
const db       = getFirestore(app);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// Paksa pilih akun Google setiap login
provider.setCustomParameters({ prompt: "select_account" });

// ─── Export ───────────────────────────────────────
export { db, auth, provider };