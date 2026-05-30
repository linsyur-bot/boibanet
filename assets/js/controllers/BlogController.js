// assets/js/controllers/BlogController.js
import BlogModel from "../models/BlogModel.js";

// Konversi URL Google Drive → worker proxy (sama seperti ProfilController)
function toProxyUrl(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `/gdrive-img?id=${match[1]}`;
  return url;
}

const BlogController = {

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
        thumbnail:        toProxyUrl(item.thumbnail),   // ← tambahan
        tanggalFormatted: BlogController.formatTanggal(item.tanggal),
        excerptText:      BlogController.stripHtml(item.konten, 120)
      }));
    } catch (e) {
      console.error("BlogController.getArtikel:", e);
      return [];
    }
  },

  async getDetail(id) {
    try {
      const data = await BlogModel.getById(id);
      if (!data) return null;
      return {
        ...data,
        thumbnail:        toProxyUrl(data.thumbnail),   // ← tambahan
        tanggalFormatted: BlogController.formatTanggal(data.tanggal)
      };
    } catch (e) {
      console.error("BlogController.getDetail:", e);
      return null;
    }
  },

  async getLatest(n = 3) {
    try {
      const data = await BlogModel.getLatest(n);
      return data.map(item => ({
        ...item,
        thumbnail:        toProxyUrl(item.thumbnail),   // ← tambahan
        tanggalFormatted: BlogController.formatTanggal(item.tanggal),
        excerptText:      BlogController.stripHtml(item.konten, 100)
      }));
    } catch (e) {
      console.error("BlogController.getLatest:", e);
      return [];
    }
  },

  formatTanggal(tanggal) {
    if (!tanggal) return "-";
    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];
    const d = new Date(tanggal);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  },

  stripHtml(html, maxLength = 100) {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  },

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