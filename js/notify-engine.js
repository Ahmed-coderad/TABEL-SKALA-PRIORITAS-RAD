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

// Membuat pola nada dering dua-nada mirip panggilan telepon masuk.
// Memakai dua oscillator per nada (nada dasar + oktaf) plus limiter
// (DynamicsCompressor) supaya terdengar lebih keras & lebih tebal
// tanpa clipping, dan diulang lebih rapat supaya lebih mendesak.
function playRingtone(){

  stopRingtone();

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;

  ringtoneAudioCtx = new Ctx();

  // Limiter di ujung chain audio: menaikkan volume keseluruhan
  // dengan aman (mencegah distorsi/clipping saat gain dinaikkan).
  const limiter = ringtoneAudioCtx.createDynamicsCompressor();
  limiter.threshold.setValueAtTime(-12, ringtoneAudioCtx.currentTime);
  limiter.knee.setValueAtTime(6, ringtoneAudioCtx.currentTime);
  limiter.ratio.setValueAtTime(16, ringtoneAudioCtx.currentTime);
  limiter.attack.setValueAtTime(0.003, ringtoneAudioCtx.currentTime);
  limiter.release.setValueAtTime(0.15, ringtoneAudioCtx.currentTime);
  limiter.connect(ringtoneAudioCtx.destination);

  function tone(startAt, freq, peakGain, duration){

    [freq, freq * 2].forEach((f, i) => {

      const osc = ringtoneAudioCtx.createOscillator();
      const gain = ringtoneAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startAt);

      // oktaf kedua lebih pelan, hanya menebalkan warna suara
      const peak = i === 0 ? peakGain : peakGain * 0.35;

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      osc.connect(gain).connect(limiter);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.02);

    });

  }

  function ring(){

    if(!ringtoneAudioCtx) return;

    const now = ringtoneAudioCtx.currentTime;

    // volume dinaikkan mendekati batas aman (limiter menjaga dari distorsi)
    [0, 0.45].forEach(offset => {
      tone(now + offset, 480, 0.85, 0.38);
    });

  }

  ring();
  // interval dipercepat (dari 1200ms -> 950ms) supaya dering terasa
  // lebih bertubi-tubi/mendesak, seperti panggilan telepon masuk.
  ringtoneInterval = setInterval(ring, 950);

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

// Pola getar diperkuat: pulsa lebih panjang & jeda lebih singkat
// dibanding sebelumnya, dan diulang lebih sering supaya lebih terasa
// (catatan: Vibration API tidak mendukung "intensitas", hanya
// durasi on/off — durasi lebih panjang & lebih rapat adalah cara
// paling dekat untuk membuat getaran terasa lebih kuat/mendesak).
const STRONG_VIBRATE_PATTERN = [700, 150, 700, 150, 700, 150, 900];

function vibrateDevice(){

  if(!("vibrate" in navigator)) return;

  navigator.vibrate(STRONG_VIBRATE_PATTERN);

  vibrateInterval = setInterval(() => {
    navigator.vibrate(STRONG_VIBRATE_PATTERN);
  }, 1800);

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
        vibrate: STRONG_VIBRATE_PATTERN,
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
