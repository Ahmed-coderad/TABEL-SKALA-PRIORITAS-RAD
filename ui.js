/* =========================================
   UI.JS
   Semua yang berhubungan dengan tampilan:
   toast, kartu statistik, render tugas,
   dan judul planner.
   ========================================= */

function showToast(message, type = "success"){

  const toast = document.getElementById("toast");

  toast.innerText = message;

  toast.style.borderLeftColor =
    type === "error"
    ? "var(--danger)"
    : "var(--success)";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}

function updateStats(){

  const total = tasks.length;

  const important =
    tasks.filter(t =>
      t.type === 'q1' || t.type === 'q2'
    ).length;

  const urgent =
    tasks.filter(t =>
      t.type === 'q1' || t.type === 'q3'
    ).length;

  const completed =
    tasks.filter(t => t.completed).length;

  document.getElementById("totalTask").innerText = total;
  document.getElementById("importantTask").innerText = important;
  document.getElementById("urgentTask").innerText = urgent;
  document.getElementById("completedTask").innerText = completed;

}

function formatTime(task){

  if(task.timeType === 'daily'){

    return task.timeValue;

  }
  else if(task.timeType === 'monthly'){

    const [year, month] = task.timeValue.split('-');

    const monthNames = [
      "Januari","Februari","Maret",
      "April","Mei","Juni",
      "Juli","Agustus","September",
      "Oktober","November","Desember"
    ];

    return `${monthNames[month - 1]} ${year}`;

  }
  else{

    return `Tahun ${task.timeValue}`;

  }

}

function renderTasks(){

  ['q1','q2','q3','q4'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  tasks.forEach(task => {

    const card = document.createElement("div");
    card.className = "task";

    if(task.completed){
      card.classList.add("completed");
    }

    card.innerHTML = `
      <h4>${task.name}</h4>

      <small>
        ${task.desc || 'Tidak ada deskripsi'}
      </small>

      <small>
        📅 ${formatTime(task)}
      </small>

      <div class="task-footer">

        <button class="done-btn">
          ${task.completed ? 'Undo' : 'Selesai'}
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Hapus
        </button>

      </div>
    `;

    card.querySelector(".done-btn")
      .addEventListener("click", () => {

        task.completed = !task.completed;

        saveTasks();
        renderTasks();
        updateStats();

      });

    card.querySelector(".edit-btn")
      .addEventListener("click", () => {

        editTask(task.id);

      });

    card.querySelector(".delete-btn")
      .addEventListener("click", () => {

        tasks = tasks.filter(t => t.id !== task.id);

        if(editingTaskId === task.id){
          cancelEdit();
        }

        saveTasks();
        renderTasks();
        updateStats();

        showToast("Aktivitas berhasil dihapus");

      });

    document.getElementById(task.type)
      .appendChild(card);

  });

  ['q1','q2','q3','q4'].forEach(id => {

    const container = document.getElementById(id);

    if(container.innerHTML.trim() === ''){
      container.innerHTML =
        `<div class="empty">Belum ada aktivitas</div>`;
    }

  });

}

function updatePlannerTitle(){

  const value =
    document.getElementById("plannerName").value.trim();

  document.getElementById("plannerTitle").innerText =
    value || "Belum Ada Nama Planner";

  saveTasks();

}
