// assets/js/controllers/GalleryController.js
// ================================================
// CONTROLLER — GalleryController
// Tugasnya: proses data dari Model + CRUD operations
// ================================================

import GalleryModel from "../models/GalleryModel.js";
import {
  collection, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "../config/firebase-config.js";

// Konversi URL Google Drive → proxy
function toProxyUrl(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `/gdrive-img?id=${match[1]}`;
  return url;
}

const GalleryController = {

  // ─── READ ──────────────────────────────────────

  async getFoto(kategoriFilter = null) {
    try {
      let data;
      if (kategoriFilter) {
        data = await GalleryModel.getByKategori(kategoriFilter);
      } else {
        data = await GalleryModel.getAll();
      }
      return data.map(item => ({
        ...item,
        img_url:          toProxyUrl(item.img_url),
        tanggalFormatted: GalleryController.formatTanggal(item.tanggal)
      }));
    } catch (e) {
      console.error("GalleryController.getFoto:", e);
      return [];
    }
  },

  async getLatest(n = 6) {
    try {
      const data = await GalleryModel.getLatest(n);
      return data.map(item => ({
        ...item,
        img_url:          toProxyUrl(item.img_url),
        tanggalFormatted: GalleryController.formatTanggal(item.tanggal)
      }));
    } catch (e) {
      console.error("GalleryController.getLatest:", e);
      return [];
    }
  },

  async getDetail(id) {
    try {
      const data = await GalleryModel.getById(id);
      if (!data) return null;
      return {
        ...data,
        img_url:          toProxyUrl(data.img_url),
        tanggalFormatted: GalleryController.formatTanggal(data.tanggal)
      };
    } catch (e) {
      console.error("GalleryController.getDetail:", e);
      return null;
    }
  },

  // Untuk admin — ambil semua tanpa proxy
  async getAll() {
    try {
      return await GalleryModel.getAll();
    } catch (e) {
      console.error("GalleryController.getAll:", e);
      return [];
    }
  },

  async getById(id) {
    try {
      return await GalleryModel.getById(id);
    } catch (e) {
      console.error("GalleryController.getById:", e);
      return null;
    }
  },

  // ─── CREATE ────────────────────────────────────

  async create(data) {
    try {
      GalleryController.validate(data);
      await addDoc(collection(db, "galeri"), {
        judul:     data.judul.trim(),
        deskripsi: data.deskripsi?.trim() || '',
        img_url:   data.img_url.trim(),
        kategori:  data.kategori,
        tanggal:   data.tanggal,
        urutan:    parseInt(data.urutan) || 0,
      });
      return { success: true, message: 'Foto berhasil ditambahkan ✓' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // ─── UPDATE ────────────────────────────────────

  async update(id, data) {
    try {
      GalleryController.validate(data);
      await updateDoc(doc(db, "galeri", id), {
        judul:     data.judul.trim(),
        deskripsi: data.deskripsi?.trim() || '',
        img_url:   data.img_url.trim(),
        kategori:  data.kategori,
        tanggal:   data.tanggal,
        urutan:    parseInt(data.urutan) || 0,
      });
      return { success: true, message: 'Foto berhasil diupdate ✓' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // ─── DELETE ────────────────────────────────────

  async delete(id) {
    try {
      await deleteDoc(doc(db, "galeri", id));
      return { success: true, message: 'Foto berhasil dihapus ✓' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // ─── VALIDATE ──────────────────────────────────

  validate(data) {
    if (!data.judul?.trim())   throw new Error('Judul tidak boleh kosong');
    if (!data.img_url?.trim()) throw new Error('URL Gambar tidak boleh kosong');
    if (!data.tanggal)         throw new Error('Tanggal tidak boleh kosong');
  },

  // ─── HELPERS ───────────────────────────────────

  formatTanggal(tanggal) {
    if (!tanggal) return "-";
    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];
    const d = new Date(tanggal);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  },

  badgeKategori(kategori) {
    const map = {
      "Kegiatan":   "bg-blue-100 text-blue-700",
      "Kampus":     "bg-green-100 text-green-700",
      "Penelitian": "bg-purple-100 text-purple-700",
      "Umum":       "bg-gray-100 text-gray-700"
    };
    return map[kategori] || "bg-gray-100 text-gray-700";
  }

};

export default GalleryController;