/* =========================================
   NOTIFY-ENGINE.JS
   Mesin notifikasi: nada dering (Web Audio
   API), getar (Vibration API), notifikasi
   sistem (Notification API), dan loop
   pengecekan alarm pengingat.

   BATASAN JUJUR:
   - Ini berjalan selama browser terbuka
     (foreground maupun tab di background).
     Untuk notifikasi yang tetap masuk saat
     browser/tab benar-benar tertutup di HP,
     dibutuhkan server push (Web Push API +
     VAPID) — di luar cakupan situs statis ini.
   - Vibration API hanya didukung sebagian
     browser (umumnya Chrome Android). Safari/
     iOS tidak mendukungnya, jadi getar tidak
     akan terasa di iPhone.
   ========================================= */

let ringtoneAudioCtx = null;
let ringtoneInterval = null;
let vibrateInterval = null;
let reminderTimer = null;
let currentAlertingTaskId = null;

async function requestNotificationPermission(){

  if(!("Notification" in window)){
    showToast(t('errNotifUnsupported'), 'error');
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  updateNotificationStatusUI();
  return permission;

}

function updateNotificationStatusUI(){

  const statusEl = document.getElementById('notifStatus');
  if(!statusEl) return;

  if(!("Notification" in window)){
    statusEl.textContent = t('errNotifUnsupported');
    return;
  }

  const map = {
    granted: t('notifStatusGranted'),
    denied: t('notifStatusDenied'),
    default: t('notifStatusDefault')
  };

  statusEl.textContent = map[Notification.permission];

}

// Membuat pola nada dering dua-nada mirip panggilan telepon masuk
function playRingtone(){

  stopRingtone();

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;

  ringtoneAudioCtx = new Ctx();

  function ring(){

    if(!ringtoneAudioCtx) return;

    const now = ringtoneAudioCtx.currentTime;

    [0, 0.45].forEach(offset => {

      const osc = ringtoneAudioCtx.createOscillator();
      const gain = ringtoneAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now + offset);

      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.28, now + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.38);

      osc.connect(gain).connect(ringtoneAudioCtx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.4);

    });

  }

  ring();
  ringtoneInterval = setInterval(ring, 1200);

}

function stopRingtone(){

  if(ringtoneInterval){
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }

  if(ringtoneAudioCtx){
    ringtoneAudioCtx.close().catch(() => {});
    ringtoneAudioCtx = null;
  }

}

function vibrateDevice(){

  if(!("vibrate" in navigator)) return;

  const pattern = [500, 200, 500, 200, 500, 700];

  navigator.vibrate(pattern);

  vibrateInterval = setInterval(() => {
    navigator.vibrate(pattern);
  }, 2500);

}

function stopVibration(){

  if(vibrateInterval){
    clearInterval(vibrateInterval);
    vibrateInterval = null;
  }

  if("vibrate" in navigator) navigator.vibrate(0);

}

function showSystemNotification(task){

  if(!("Notification" in window) || Notification.permission !== 'granted') return;

  const body = `${formatTime(task)} • ${task.desc || t('noDescription')}`;

  if(navigator.serviceWorker && navigator.serviceWorker.controller){

    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(`⏰ ${task.name}`, {
        body,
        vibrate: [500, 200, 500],
        tag: `reminder-${task.id}`,
        requireInteraction: true
      });
    });

  }
  else{

    new Notification(`⏰ ${task.name}`, { body, tag: `reminder-${task.id}` });

  }

}

function openAlertModal(task){

  currentAlertingTaskId = task.id;

  document.getElementById('alertTaskName').textContent = task.name;
  document.getElementById('alertTaskTime').textContent = formatTime(task);
  document.getElementById('alertTaskDesc').textContent = task.desc || t('noDescription');

  document.getElementById('alertModal').classList.remove('hidden');

  playRingtone();
  vibrateDevice();
  showSystemNotification(task);

}

function dismissAlert(taskId){

  document.getElementById('alertModal').classList.add('hidden');

  stopRingtone();
  stopVibration();

  if(taskId === 'test') return;

  const task = tasks.find(tk => tk.id === taskId);

  if(task){
    task.reminderFired = true;
    saveTasks();
    renderTasks();
  }

}

function checkReminders(){

  // Jangan pop alarm baru selagi satu alarm masih tampil
  if(!document.getElementById('alertModal').classList.contains('hidden')) return;

  const now = Date.now();

  const due = tasks.find(task =>
    task.reminderAt &&
    !task.reminderFired &&
    new Date(task.reminderAt).getTime() <= now
  );

  if(due){
    openAlertModal(due);
  }

}

function startReminderEngine(){

  if(reminderTimer) clearInterval(reminderTimer);

  checkReminders();
  reminderTimer = setInterval(checkReminders, 20000);

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

}
