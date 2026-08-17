/* =========================================
   STORAGE.JS
   Menyimpan & memuat state aplikasi (planner
   name + daftar tugas) dari localStorage —
   terpisah per akun pengguna yang sedang
   login (lihat auth.js).
   ========================================= */

function getStorageKey(){
  const user = getCurrentUser();
  return `${CONFIG.STORAGE_KEY}_${user ? user.username.toLowerCase() : 'guest'}`;
}

function loadPlannerData(){
  const raw = localStorage.getItem(getStorageKey());
  return raw ? JSON.parse(raw) : { plannerName: "", tasks: [] };
}

let plannerData = loadPlannerData();
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
    getStorageKey(),
    JSON.stringify(plannerData)
  );

}

// Dipanggil setelah login/logout untuk memuat ulang data
// milik akun yang sedang aktif.
function reloadUserData(){
  plannerData = loadPlannerData();
  tasks = plannerData.tasks || [];
}
