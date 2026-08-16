/* =========================================
   STORAGE.JS
   Menyimpan & memuat state aplikasi (planner
   name + daftar tugas) dari localStorage.
   ========================================= */

let plannerData =
  JSON.parse(
    localStorage.getItem(CONFIG.STORAGE_KEY)
  ) || {

    plannerName: "",
    tasks: []

  };

let tasks = plannerData.tasks || [];

let selectedTimeType = 'daily';
let editingTaskId = null;

function saveTasks(){

  plannerData = {

    plannerName:
      document.getElementById("plannerName").value,

    tasks

  };

  localStorage.setItem(
    CONFIG.STORAGE_KEY,
    JSON.stringify(plannerData)
  );

}
