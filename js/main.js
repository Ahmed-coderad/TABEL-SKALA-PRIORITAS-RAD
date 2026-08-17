/* =========================================
   MAIN.JS
   Titik masuk aplikasi: mengatur alur
   login/register -> aplikasi utama, serta
   mengikat kontrol bar atas & panel setelan.
   ========================================= */

function toggleSettingsPanel(forceState){

  const panel = document.getElementById('settingsPanel');

  if(forceState === undefined){
    panel.classList.toggle('hidden');
  }
  else{
    panel.classList.toggle('hidden', !forceState);
  }

}

function bindTopBar(){

  document.getElementById('settingsBtn')
    .addEventListener('click', () => toggleSettingsPanel());

  document.getElementById('closeSettingsBtn')
    .addEventListener('click', () => toggleSettingsPanel(false));

  document.getElementById('languageSelect')
    .addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });

  document.getElementById('requestNotifBtn')
    .addEventListener('click', requestNotificationPermission);

  document.getElementById('testNotifBtn')
    .addEventListener('click', () => {
      openAlertModal({
        id: 'test',
        name: t('testReminderName'),
        desc: t('testReminderDesc'),
        timeType: 'daily',
        timeValue: new Date().toISOString().slice(0, 10)
      });
    });

  document.getElementById('syncAllCalendarBtn')
    .addEventListener('click', exportAllToCalendar);

  document.getElementById('dismissAlertBtn')
    .addEventListener('click', () => dismissAlert(currentAlertingTaskId));

}

function showApp(){

  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');

  reloadUserData();

  document.getElementById('plannerName').value = plannerData.plannerName || "";
  updatePlannerTitle();
  renderTasks();
  updateStats();
  initFlatpickr();
  scheduleAutoExportPDF();
  startReminderEngine();
  updateNotificationStatusUI();

  const user = getCurrentUser();
  document.getElementById('currentUserLabel').textContent =
    user ? `${t('welcomeUser')}, ${user.username}` : '';

}

function showAuth(){
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
}

(async function init(){

  await seedDefaultAdmin();

  applyLanguage(getSavedLanguage());

  bindAuthForms();
  bindTopBar();
  bindContactModal();
  bindReminderAlignment();

  if(getCurrentUser()){
    showApp();
  }
  else{
    showAuth();
  }

})();
