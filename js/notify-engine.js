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

// Membuat nada dering bernuansa ANGKLUNG: setiap nada memakai
// timbre bambu (fundamental + overtone tak-harmonis khas tabung
// bambu) yang digetarkan lewat tremolo cepat (LFO pada gain) —
// meniru cara angklung fisik dikocok/digoyang supaya bunyinya terasa
// "bergetar". Susunan nadanya berupa frasa pentatonik naik-turun
// (nuansa slendro) yang enak didengar, jauh lebih hangat/ramah
// dibanding nada sirene dua-nada sebelumnya, sambil tetap terdengar
// jelas & mendesak sebagai alarm. Semua nada melewati limiter
// (DynamicsCompressor) di ujung chain supaya volume bisa dinaikkan
// lebih keras dengan aman tanpa distorsi/clipping.
function playRingtone(){

  stopRingtone();

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;

  ringtoneAudioCtx = new Ctx();

  // Limiter: ambang diturunkan & ratio dinaikkan supaya headroom
  // volume keseluruhan bisa digenjot lebih tinggi (lebih keras)
  // tanpa membuat suara pecah.
  const limiter = ringtoneAudioCtx.createDynamicsCompressor();
  limiter.threshold.setValueAtTime(-10, ringtoneAudioCtx.currentTime);
  limiter.knee.setValueAtTime(8, ringtoneAudioCtx.currentTime);
  limiter.ratio.setValueAtTime(18, ringtoneAudioCtx.currentTime);
  limiter.attack.setValueAtTime(0.002, ringtoneAudioCtx.currentTime);
  limiter.release.setValueAtTime(0.18, ringtoneAudioCtx.currentTime);
  limiter.connect(ringtoneAudioCtx.destination);

  // Gain master: menaikkan volume keseluruhan (lebih keras),
  // limiter di belakangnya menjaga supaya tetap aman dari clipping.
  const masterGain = ringtoneAudioCtx.createGain();
  masterGain.gain.setValueAtTime(1.15, ringtoneAudioCtx.currentTime);
  masterGain.connect(limiter);

  // Satu "nada" angklung: fundamental + oktaf + overtone tak-harmonis
  // (2.76x, khas resonansi tabung bambu) dibungkus tremolo cepat
  // (~19Hz) supaya karakternya bergetar/bergemerincing seperti
  // tabung angklung yang digoyang, bukan nada datar/statis.
  function angklungNote(startAt, freq, peakGain, duration){

    const noteGain = ringtoneAudioCtx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startAt);
    // serangan cepat (mirip dipukul/digoyang), lalu peluruhan alami
    noteGain.gain.exponentialRampToValueAtTime(peakGain, startAt + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    noteGain.connect(masterGain);

    // LFO tremolo: menggoyang volume nada dengan cepat supaya
    // terdengar "bergetar" seperti tabung bambu angklung yang dikocok.
    const tremoloOsc = ringtoneAudioCtx.createOscillator();
    const tremoloDepth = ringtoneAudioCtx.createGain();
    tremoloOsc.frequency.setValueAtTime(19, startAt);
    tremoloDepth.gain.setValueAtTime(peakGain * 0.55, startAt);
    tremoloOsc.connect(tremoloDepth).connect(noteGain.gain);
    tremoloOsc.start(startAt);
    tremoloOsc.stop(startAt + duration + 0.05);

    // fundamental + oktaf (lebih pelan) + overtone bambu (paling pelan)
    [
      { mult: 1,    weight: 1    },
      { mult: 2,    weight: 0.4  },
      { mult: 2.76, weight: 0.18 }
    ].forEach(partial => {

      const osc = ringtoneAudioCtx.createOscillator();
      const partialGain = ringtoneAudioCtx.createGain();

      // 'triangle' terdengar lebih hangat & lembut dibanding 'sine'
      // murni, mendekati warna bambu dibanding nada elektronik datar.
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * partial.mult, startAt);

      partialGain.gain.setValueAtTime(partial.weight, startAt);

      osc.connect(partialGain).connect(noteGain);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.05);

    });

  }

  // Frasa pentatonik (nuansa slendro) naik-turun — enak didengar,
  // bukan sirene monoton. Nada dimainkan susul-menyusul.
  const PHRASE = [
    { freq: 523.25, offset: 0.00, dur: 0.42 }, // C5
    { freq: 587.33, offset: 0.16, dur: 0.42 }, // D5
    { freq: 698.46, offset: 0.32, dur: 0.42 }, // F5
    { freq: 783.99, offset: 0.48, dur: 0.5  }, // G5
    { freq: 987.77, offset: 0.68, dur: 0.6  }  // B5 (nada puncak, paling menonjol)
  ];

  function ring(){

    if(!ringtoneAudioCtx) return;

    const now = ringtoneAudioCtx.currentTime;

    // volume dinaikkan mendekati batas aman (limiter menjaga dari distorsi)
    PHRASE.forEach(note => {
      angklungNote(now + note.offset, note.freq, 0.95, note.dur);
    });

  }

  ring();
  // frasa diulang tiap 1.4 detik supaya masih terasa mendesak/berulang
  // sebagai alarm, sambil tetap memberi ruang bagi resonansi tiap nada.
  ringtoneInterval = setInterval(ring, 1400);

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
