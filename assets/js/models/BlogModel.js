// assets/js/models/BlogModel.js
// ================================================
// MODEL — BlogModel
// Tugasnya: semua operasi Firestore collection blog
// ================================================

import { db } from "../config/firebase-config.js";
import {
  collection, getDocs, getDoc,
  doc, query, orderBy, where, limit
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const BlogModel = {

  // Ambil semua artikel published
  async getAll() {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "published"),
      orderBy("tanggal", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Ambil artikel terbaru (untuk home)
  async getLatest(n = 3) {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "published"),
      orderBy("tanggal", "desc"),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Ambil satu artikel by ID
  async getById(id) {
    const snap = await getDoc(doc(db, "blog", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  // Ambil artikel by kategori
  async getByKategori(kategori) {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "published"),
      where("kategori", "==", kategori),
      orderBy("tanggal", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

};

export default BlogModel;