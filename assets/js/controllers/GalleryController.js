// assets/js/controllers/GalleryController.js
// ================================================
// CONTROLLER — GalleryController
// Tugasnya: proses data dari Model → siap tampil di View
// ================================================

import GalleryModel from "../models/GalleryModel.js";

// Konversi URL Google Drive → proxy
function toProxyUrl(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `/gdrive-img?id=${match[1]}`;
  return url;
}

const GalleryController = {

  // Untuk galeri/index.html — semua foto
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

  // Untuk home — foto terbaru
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

  // Untuk modal detail
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

  // Format tanggal → "12 Januari 2025"
  formatTanggal(tanggal) {
    if (!tanggal) return "-";
    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];
    const d = new Date(tanggal);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  },

  // Badge warna kategori
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