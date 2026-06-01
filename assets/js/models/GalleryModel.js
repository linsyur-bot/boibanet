// assets/js/models/GalleryModel.js
// ================================================
// MODEL — GalleryModel
// Tugasnya: semua operasi Firestore collection galeri
// ================================================

import { db } from "../config/firebase-config.js";
import {
  collection, getDocs, getDoc,
  doc, query, orderBy, where, limit
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const GalleryModel = {

  // Ambil semua foto
  async getAll() {
    const q = query(
      collection(db, "galeri"),
      orderBy("urutan", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Ambil foto terbaru (untuk home)
  async getLatest(n = 6) {
    const q = query(
      collection(db, "galeri"),
      orderBy("urutan", "asc"),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Ambil satu foto by ID
  async getById(id) {
    const snap = await getDoc(doc(db, "galeri", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // Ambil foto by kategori
  async getByKategori(kategori) {
    const q = query(
      collection(db, "galeri"),
      where("kategori", "==", kategori),
      orderBy("urutan", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

};

export default GalleryModel;