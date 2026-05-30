// assets/js/controllers/ProfilController.js
import { getProfil } from '../models/ProfilModel.js';

export async function initProfil() {
  try {
    const data = await getProfil();
    if (!data) throw new Error('Data profil belum tersedia.');

    document.getElementById('p-nama').textContent      = data.nama       || '-';
    document.getElementById('p-institusi').textContent = data.institusi   || '-';
    document.getElementById('p-email').textContent     = data.email       || '-';
    document.getElementById('p-email').href            = 'mailto:' + (data.email || '');
    document.getElementById('p-foto').src              = data.foto_url    || '/assets/img/logo-Photoroom.png';

    document.getElementById('skeleton').classList.add('hidden');
    document.getElementById('profil-card').classList.remove('hidden');

  } catch (e) {
    document.getElementById('skeleton').classList.add('hidden');
    const err = document.getElementById('profil-error');
    err.textContent = e.message;
    err.classList.remove('hidden');
  }
}