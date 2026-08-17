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
    altFormat: "d F Y"
  });

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

  }

}
