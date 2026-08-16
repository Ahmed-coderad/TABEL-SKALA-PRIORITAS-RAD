/* =========================================
   MAIN.JS
   Titik masuk aplikasi — dijalankan saat
   halaman pertama kali dibuka.
   ========================================= */

renderTasks();
updateStats();

initFlatpickr();

document.getElementById("plannerName").value =
  plannerData.plannerName || "";

updatePlannerTitle();

scheduleAutoExportPDF();
