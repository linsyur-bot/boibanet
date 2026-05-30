// assets/js/controllers/BlogController.js
// ================================================
// CONTROLLER — BlogController
// Tugasnya: proses data dari Model → siap tampil di View
// ================================================

import BlogModel from "../models/BlogModel.js";

const BlogController = {

  // Untuk blog/index.html — daftar semua artikel
  async getArtikel(kategoriFilter = null) {
    try {
      let data;
      if (kategoriFilter) {
        data = await BlogModel.getByKategori(kategoriFilter);
      } else {
        data = await BlogModel.getAll();
      }
      return data.map(item => ({
        ...item,
        tanggalFormatted: BlogController.formatTanggal(item.tanggal),
        excerptText:      BlogController.stripHtml(item.konten, 120)
      }));
    } catch (e) {
      console.error("BlogController.getArtikel:", e);
      return [];
    }
  },

  // Untuk blog/post.html — detail satu artikel
  async getDetail(id) {
    try {
      const data = await BlogModel.getById(id);
      if (!data) return null;
      return {
        ...data,
        tanggalFormatted: BlogController.formatTanggal(data.tanggal)
      };
    } catch (e) {
      console.error("BlogController.getDetail:", e);
      return null;
    }
  },

  // Untuk home — artikel terbaru
  async getLatest(n = 3) {
    try {
      const data = await BlogModel.getLatest(n);
      return data.map(item => ({
        ...item,
        tanggalFormatted: BlogController.formatTanggal(item.tanggal),
        excerptText:      BlogController.stripHtml(item.konten, 100)
      }));
    } catch (e) {
      console.error("BlogController.getLatest:", e);
      return [];
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

  // Strip HTML → plain text untuk excerpt
  stripHtml(html, maxLength = 100) {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  },

  // Warna badge kategori
  badgeKategori(kategori) {
    const map = {
      "Jaringan":  "bg-blue-100 text-blue-700",
      "Teknologi": "bg-green-100 text-green-700",
      "AI":        "bg-purple-100 text-purple-700",
      "Umum":      "bg-gray-100 text-gray-700"
    };
    return map[kategori] || "bg-gray-100 text-gray-700";
  }

};

export default BlogController;