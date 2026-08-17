/* =========================================
   TASKS.JS
   Logika inti CRUD tugas: tambah, edit,
   batal edit, dan reset form/data.
   ========================================= */

function addTask(){

  const name =
    document.getElementById("taskName").value.trim();

  const desc =
    document.getElementById("taskDesc").value.trim();

  const type =
    document.getElementById("taskType").value;

  const reminderAt =
    document.getElementById("taskReminder").value || '';

  let timeValue = '';

  if(selectedTimeType === "daily"){

    timeValue = document.getElementById("dailyInput").value;

  }
  else if(selectedTimeType === "monthly"){

    timeValue = document.getElementById("monthlyInput").value;

    const now = new Date();
    const current =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    if(timeValue < current){
      showToast(t('errMonthPast'), "error");
      return;
    }

  }
  else{

    timeValue = document.getElementById("yearlyInput").value;

    const currentYear = new Date().getFullYear();

    if(parseInt(timeValue) < currentYear){
      showToast(t('errYearPast'), "error");
      return;
    }

  }

  if(!timeValue){
    showToast(t('errTimeRequired'), "error");
    return;
  }

  if(!isReminderAlignedWithTimeValue(selectedTimeType, timeValue, reminderAt)){
    showToast(t('errReminderMismatch'), "error");
    return;
  }

  if(name === ''){
    showToast(t('errNameRequired'), "error");
    return;
  }

  const duplicate = tasks.find(t =>
    t.name.toLowerCase() === name.toLowerCase() &&
    t.id !== editingTaskId
  );

  if(duplicate){
    showToast(t('errDuplicate'), "error");
    return;
  }

  if(editingTaskId){

    const idx = tasks.findIndex(t => t.id === editingTaskId);

    if(idx !== -1){

      const reminderChanged = tasks[idx].reminderAt !== reminderAt;

      tasks[idx] = {
        ...tasks[idx],
        name,
        desc,
        type,
        timeType: selectedTimeType,
        timeValue,
        reminderAt,
        reminderFired: reminderChanged ? false : tasks[idx].reminderFired
      };

    }

    cancelEdit();

    saveTasks();
    renderTasks();
    updateStats();

    document.getElementById("taskName").value = '';
    document.getElementById("taskDesc").value = '';
    document.getElementById("taskReminder").value = '';

    showToast(t('msgUpdated'));

  }
  else{

    const task = {

      id: Date.now(),
      name,
      desc,
      type,
      completed: false,
      timeType: selectedTimeType,
      timeValue,
      reminderAt,
      reminderFired: false

    };

    tasks.unshift(task);

    saveTasks();
    renderTasks();
    updateStats();

    sendEmail(task, generateAnalysis());

    document.getElementById("taskName").value = '';
    document.getElementById("taskDesc").value = '';
    document.getElementById("taskReminder").value = '';

    showToast(t('msgAdded'));

  }

}

function editTask(id){

  const task = tasks.find(t => t.id === id);

  if(!task) return;

  editingTaskId = id;

  document.getElementById("taskName").value = task.name;
  document.getElementById("taskDesc").value = task.desc;
  document.getElementById("taskType").value = task.type;
  document.getElementById("taskReminder").value = task.reminderAt || '';

  const timeIndex = { daily: 0, monthly: 1, yearly: 2 }[task.timeType];

  const timeButtons =
    document.querySelectorAll('.time-btn');

  timeButtons.forEach(btn => btn.classList.remove('active'));
  timeButtons[timeIndex].classList.add('active');

  selectTimeType(task.timeType, timeButtons[timeIndex]);

  // isi ulang input waktu setelah wrapper dibangun ulang
  setTimeout(() => {

    if(task.timeType === 'daily'){
      const input = document.getElementById('dailyInput');
      if(input) input.value = task.timeValue;
    }
    else if(task.timeType === 'monthly'){
      const input = document.getElementById('monthlyInput');
      if(input) input.value = task.timeValue;
    }
    else{
      const input = document.getElementById('yearlyInput');
      if(input) input.value = task.timeValue;
    }

  }, 0);

  const addBtn = document.getElementById('addTaskBtn');
  addBtn.innerText = t('btnUpdate');

  document.querySelector('.card').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  showToast(t('editModeActive'));

}

function cancelEdit(){

  editingTaskId = null;

  const addBtn = document.getElementById('addTaskBtn');

  if(addBtn){
    addBtn.innerText = t('btnAdd');
  }

}

function resetForm(){

  const confirmReset = confirm(
    "Reset akan mengosongkan seluruh aktivitas di Kuadran 1-4. Lanjutkan?"
  );

  if(!confirmReset){
    return;
  }

  // kosongkan seluruh data tugas
  tasks = [];
  cancelEdit();

  saveTasks();
  renderTasks();
  updateStats();

  // reset input form
  document.getElementById("taskName").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskReminder").value = '';

  // reset ke harian
  selectedTimeType = 'daily';

  document
    .querySelectorAll('.time-btn')
    .forEach(btn => btn.classList.remove('active'));

  document
    .querySelector('.time-btn')
    .classList.add('active');

  document.getElementById('timeInputWrapper').innerHTML = `
    <input
      type="text"
      id="dailyInput"
      placeholder="${t('datePlaceholder')}">
  `;

  initFlatpickr();

  showToast(t('msgReset'));

}

// Tombol "Simpan": minta nomor WhatsApp & email tujuan milik akun
// yang sedang login (diisi otomatis dari data tersimpan sebelumnya
// jika ada), lalu kirim & simpan data ke tujuan tersebut.
function saveAllData(){

  if(tasks.length === 0){
    showToast(t('errNoTasks'), 'error');
    return;
  }

  openContactModal((whatsapp, email) => {

    const analysis = generateAnalysis();

    tasks.forEach(task => {
      sendEmail(task, analysis, email);
    });

    sendWhatsAppSummary(whatsapp);

    showToast(t('msgSaved'));

  });

}

function exportData(){

  const dataStr =
    JSON.stringify(tasks, null, 2);

  const blob =
    new Blob([dataStr], {
      type: "application/json"
    });

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = "priority-planner.json";

  a.click();

}
