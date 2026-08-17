/* =========================================
   TIME-PICKER.JS
   Mengatur jenis input waktu (harian/bulanan/
   tahunan) beserta inisialisasi flatpickr.
   ========================================= */

function initFlatpickr(){

  flatpickr("#dailyInput", {
    minDate: "today",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d F Y",
    onChange: () => {
      updateReminderDateDisplay();
    }
  });

}

/* =========================================
   TANGGAL ALARM PENGINGAT TERKUNCI
   Alarm pengingat (#taskReminder) sekarang HANYA
   berupa input jam (00:00 s/d 23:59, siklus 24 jam)
   — tidak punya bagian tanggal sama sekali di UI.
   Tanggalnya SELALU diturunkan langsung dari
   "Waktu Keperluan" (harian/bulanan/tahunan) yang
   sedang dipilih, jadi tanggal tidak pernah bisa
   diubah sendiri oleh pengguna: satu-satunya cara
   mengubah tanggal alarm adalah mengubah Waktu
   Keperluan itu sendiri. Ini menghilangkan
   kemungkinan tanggal alarm "tidak selaras" sama
   sekali (dulu divalidasi manual, sekarang dijamin
   oleh struktur datanya).
   ========================================= */

// Mengembalikan tanggal (Y-m-d) yang cocok untuk timeType+timeValue
// tertentu, dipakai sebagai satu-satunya sumber tanggal reminder.
function resolveReminderDateForTimeValue(timeType, timeValue){

  if(!timeValue) return null;

  if(timeType === 'daily'){
    return timeValue; // sudah dalam format Y-m-d
  }

  if(timeType === 'monthly'){
    // timeValue = "YYYY-MM" -> pakai tanggal 1 di bulan tersebut
    return `${timeValue}-01`;
  }

  // yearly: timeValue = "YYYY" -> pakai 1 Januari tahun tersebut
  return `${timeValue}-01-01`;

}

// Membaca nilai Waktu Keperluan yang sedang aktif dari input terkait,
// sesuai jenis (harian/bulanan/tahunan) yang sedang dipilih.
function getCurrentTimeValue(){

  if(selectedTimeType === 'daily'){
    const el = document.getElementById('dailyInput');
    return el ? el.value : '';
  }

  if(selectedTimeType === 'monthly'){
    const el = document.getElementById('monthlyInput');
    return el ? el.value : '';
  }

  const el = document.getElementById('yearlyInput');
  return el ? el.value : '';

}

// Menampilkan (read-only) tanggal alarm yang berlaku saat ini di
// bawah input jam #taskReminder, supaya pengguna tetap tahu tanggal
// alarmnya walau field itu sendiri tidak bisa diedit. Dipanggil setiap
// kali Waktu Keperluan berubah (dailyInput/monthlyInput/yearlyInput)
// atau saat jenisnya diganti (harian/bulanan/tahunan).
function updateReminderDateDisplay(){

  const displayEl = document.getElementById('reminderDateDisplay');
  if(!displayEl) return;

  const timeValue = getCurrentTimeValue();
  const resolvedDate = resolveReminderDateForTimeValue(selectedTimeType, timeValue);

  if(!resolvedDate){
    displayEl.textContent = t('reminderDateEmpty');
    displayEl.classList.add('is-empty');
    return;
  }

  displayEl.classList.remove('is-empty');

  const formatted = new Date(`${resolvedDate}T00:00:00`)
    .toLocaleDateString(getLocaleTag(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  displayEl.textContent = `${t('reminderDatePrefix')} ${formatted}`;

}

// Menggabungkan tanggal yang terkunci (dari Waktu Keperluan) dengan
// jam yang dipilih pengguna di #taskReminder menjadi satu nilai
// reminder lengkap ("Y-m-dTHH:MM"). Mengembalikan '' jika jam belum
// diisi (field tetap opsional) atau tanggalnya belum bisa ditentukan.
function buildReminderAt(timeType, timeValue){

  const reminderTimeInput = document.getElementById('taskReminder');
  const reminderTime = reminderTimeInput ? reminderTimeInput.value : '';

  if(!reminderTime) return '';

  const reminderDate = resolveReminderDateForTimeValue(timeType, timeValue);
  if(!reminderDate) return '';

  return `${reminderDate}T${reminderTime}`;

}

function selectTimeType(type, element){

  selectedTimeType = type;

  document
    .querySelectorAll('.time-btn')
    .forEach(btn => btn.classList.remove('active'));

  element.classList.add('active');

  const wrapper =
    document.getElementById('timeInputWrapper');

  // HARIAN
  if(type === 'daily'){

    wrapper.innerHTML = `
      <input
        type="text"
        id="dailyInput"
        placeholder="${t('datePlaceholder')}">
    `;

    initFlatpickr();

  }

  // BULANAN
  else if(type === 'monthly'){

    const today = new Date();

    const minMonth =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    wrapper.innerHTML = `
      <input
        type="month"
        id="monthlyInput"
        min="${minMonth}">
    `;

    document.getElementById('monthlyInput')
      .addEventListener('change', () => {
        updateReminderDateDisplay();
      });

  }

  // TAHUNAN
  else{

    let yearOptions = '';

    const currentYear = new Date().getFullYear();

    for(let y = currentYear; y <= currentYear + 10; y++){

      yearOptions += `
        <option value="${y}">
          ${y}
        </option>
      `;

    }

    wrapper.innerHTML = `
      <select id="yearlyInput">
        <option value="">
          Pilih Tahun
        </option>

        ${yearOptions}

      </select>
    `;

    document.getElementById('yearlyInput')
      .addEventListener('change', () => {
        updateReminderDateDisplay();
      });

  }

  // Waktu Keperluan baru saja diganti/dibangun ulang -> tanggal alarm
  // yang terkunci ikut berubah, segarkan tampilannya.
  updateReminderDateDisplay();

  // Input Waktu Keperluan baru dibangun ulang lewat innerHTML di atas
  // (kehilangan atribut disabled sebelumnya) -> sinkronkan lagi ke
  // status kunci "Project Tabel Skala Prioritas" saat ini.
  if(typeof updatePlannerLockState === 'function') updatePlannerLockState();

}
