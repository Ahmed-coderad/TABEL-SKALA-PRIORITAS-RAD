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
    onChange: (selectedDates, dateStr) => {
      alignReminderDateWithTimeValue('daily', dateStr);
    }
  });

}

/* =========================================
   SELARAS TANGGAL ALARM PENGINGAT
   Alarm pengingat (taskReminder, datetime-local)
   harus selalu mengacu ke tanggal/bulan/tahun
   yang sama dengan "Waktu Keperluan" yang sedang
   dipilih (harian/bulanan/tahunan).
   ========================================= */

// Mengembalikan tanggal (Y-m-d) yang cocok untuk timeType+timeValue
// tertentu, dipakai sebagai bagian tanggal dari reminder.
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

// Menyesuaikan bagian tanggal pada input #taskReminder supaya
// selaras dengan Waktu Keperluan yang baru dipilih, tanpa mengubah
// jam yang sudah diisi pengguna (jika reminder belum diisi sama
// sekali, biarkan kosong karena field ini opsional).
function alignReminderDateWithTimeValue(timeType, timeValue){

  const reminderInput = document.getElementById('taskReminder');
  if(!reminderInput || !reminderInput.value) return;

  const newDate = resolveReminderDateForTimeValue(timeType, timeValue);
  if(!newDate) return;

  const timePart = reminderInput.value.split('T')[1] || '00:00';

  reminderInput.value = `${newDate}T${timePart}`;

}

// Dipasang sekali saat aplikasi dimuat: setiap kali pengguna mengubah
// jam pengingat secara langsung, bagian tanggalnya otomatis dipaksa
// mengikuti Waktu Keperluan yang sedang aktif (harian/bulanan/tahunan)
// supaya keduanya tidak pernah bisa tidak selaras.
function bindReminderAlignment(){

  const reminderInput = document.getElementById('taskReminder');
  if(!reminderInput) return;

  reminderInput.addEventListener('change', () => {

    if(!reminderInput.value) return;

    const timeValue = getCurrentTimeValue();
    if(!timeValue) return;

    const requiredDate = resolveReminderDateForTimeValue(selectedTimeType, timeValue);
    if(!requiredDate) return;

    const timePart = reminderInput.value.split('T')[1] || '00:00';

    reminderInput.value = `${requiredDate}T${timePart}`;

  });

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

// Memvalidasi bahwa tanggal alarm pengingat (jika diisi) selaras
// dengan Waktu Keperluan yang dipilih. Mengembalikan true jika
// selaras (atau reminder kosong/opsional), false jika tidak selaras.
function isReminderAlignedWithTimeValue(timeType, timeValue, reminderAt){

  if(!reminderAt) return true; // opsional, kosong = selalu valid

  const reminderDatePart = reminderAt.split('T')[0];

  if(timeType === 'daily'){
    return reminderDatePart === timeValue;
  }

  if(timeType === 'monthly'){
    return reminderDatePart.slice(0, 7) === timeValue;
  }

  // yearly
  return reminderDatePart.slice(0, 4) === String(timeValue);

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
      .addEventListener('change', (e) => {
        alignReminderDateWithTimeValue('monthly', e.target.value);
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
      .addEventListener('change', (e) => {
        alignReminderDateWithTimeValue('yearly', e.target.value);
      });

  }

}
