/* =========================================
   PLANNER-LOCK.JS
   Menjadikan "Project Tabel Skala Prioritas"
   (#plannerName) sebagai gerbang wajib: selama
   field itu kosong, seluruh form "Tambah
   Prioritas" (input, tombol waktu, tombol aksi)
   dikunci total — baik secara visual (dim +
   overlay peringatan) maupun fungsional
   (atribut disabled + validasi ganda di
   tasks.js), supaya tidak bisa dilewati lewat
   devtools atau submit paksa.
   ========================================= */

// ID elemen statis yang ikut dikunci/dibuka setiap kali status
// planner berubah. Input Waktu Keperluan (#dailyInput /
// #monthlyInput / #yearlyInput) & tombol .time-btn ditangani
// terpisah di bawah karena elemennya dibangun ulang secara dinamis
// oleh time-picker.js.
const PLANNER_LOCK_STATIC_IDS = [
  'taskName',
  'taskDesc',
  'taskReminder',
  'taskType',
  'addTaskBtn',
  'saveBtn',
  'resetBtn',
  'exportPdfBtn'
];

function isPlannerNameFilled(){

  const el = document.getElementById('plannerName');
  return !!(el && el.value.trim().length > 0);

}

function getPlannerLockManagedElements(){

  const els = PLANNER_LOCK_STATIC_IDS
    .map(id => document.getElementById(id))
    .filter(Boolean);

  document
    .querySelectorAll('.time-btn')
    .forEach(btn => els.push(btn));

  const timeInput = document.querySelector(
    '#timeInputWrapper input, #timeInputWrapper select'
  );

  if(timeInput) els.push(timeInput);

  return els;

}

// Dipanggil setiap kali #plannerName berubah, saat aplikasi
// pertama kali dimuat, dan setiap kali Waktu Keperluan dibangun
// ulang (lihat time-picker.js & tasks.js) supaya elemen baru ikut
// terkunci/terbuka sesuai status terkini.
function updatePlannerLockState(){

  const plannerInput = document.getElementById('plannerName');
  if(!plannerInput) return;

  const filled = isPlannerNameFilled();

  getPlannerLockManagedElements().forEach(el => {
    el.disabled = !filled;
    el.setAttribute('aria-disabled', String(!filled));
  });

  const card = document.getElementById('plannerLockableFields');
  if(card) card.classList.toggle('is-locked', !filled);

  const progressWrap = document.getElementById('formProgressWrap');
  if(progressWrap) progressWrap.classList.toggle('is-locked', !filled);

  const notice = document.getElementById('plannerLockNotice');
  if(notice) notice.classList.toggle('is-visible', !filled);

  const header = document.getElementById('plannerHeader');
  if(header) header.classList.toggle('needs-attention', !filled);

  plannerInput.classList.toggle('field-required-empty', !filled);
  plannerInput.setAttribute('aria-invalid', String(!filled));

}

let plannerLockBound = false;

// Dipanggil dari main.js (sekali per sesi tampilan app) — memasang
// listener hanya sekali walau showApp() bisa dipanggil ulang
// (login/ganti pengguna), lalu langsung menyinkronkan status kunci.
function bindPlannerLock(){

  const plannerInput = document.getElementById('plannerName');
  if(!plannerInput) return;

  if(!plannerLockBound){

    plannerLockBound = true;

    plannerInput.addEventListener('input', updatePlannerLockState);
    plannerInput.addEventListener('blur', () => {

      if(!isPlannerNameFilled()){
        if(typeof shakeField === 'function') shakeField('#plannerName');
      }

    });

  }

  updatePlannerLockState();

}

// Pertahanan lapis kedua: dipanggil dari tasks.js sebelum aktivitas
// apa pun diproses, supaya field ini tetap wajib walau atribut
// disabled di DOM sempat dimanipulasi manual.
function requirePlannerNameOrBlock(){

  if(isPlannerNameFilled()) return true;

  if(typeof showToast === 'function'){
    showToast(t('errPlannerNameRequired'), 'error');
  }

  if(typeof shakeField === 'function'){
    shakeField('#plannerName');
  }

  document.getElementById('plannerName')?.focus();

  return false;

}
