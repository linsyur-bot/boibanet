// assets/js/models/ProfilModel.js
import { db } from '../config/firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export async function getProfil() {
  const snap = await getDocs(collection(db, 'profil'));
  if (snap.empty) return null;
  let data = {};
  snap.forEach(d => { data = { id: d.id, ...d.data() }; });
  return data;
}