/* =========================================
   ONBOARDING.JS
   Tur panduan interaktif (spotlight + tooltip
   berjalan) yang menuntun pengguna mengisi form
   "Tambah Prioritas" langkah demi langkah, plus:
   - progress bar animasi kelengkapan form
   - checklist per-field yang muncul saat terisi
   - animasi getar (shake) untuk field yang error
   - animasi "sukses" (confetti ringan) saat
     aktivitas berhasil ditambahkan
   Tur berjalan otomatis sekali per akun saat
   pertama kali membuka aplikasi, dan bisa diputar
   ulang kapan saja lewat tombol bantuan (?)
   mengambang di pojok layar.
   ========================================= */

const TOUR_SEEN_PREFIX = "radPlannerTourSeen_";

function getTourStorageKey(){
  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  return TOUR_SEEN_PREFIX + (user ? user.username.toLowerCase() : 'guest');
}

function hasTourBeenSeen(){
  return localStorage.getItem(getTourStorageKey()) === '1';
}

function markTourSeen(){
  localStorage.setItem(getTourStorageKey(), '1');
}

/* ---------- Langkah-langkah tur ---------- */

function getTourSteps(){

  return [
    {
      target: '#plannerName',
      title: t('tourStep1Title'),
      text: t('tourStep1Text'),
      placement: 'bottom'
    },
    {
      target: '[data-tour="taskName"]',
      title: t('tourStep2Title'),
      text: t('tourStep2Text'),
      placement: 'bottom'
    },
    {
      target: '[data-tour="timeType"]',
      title: t('tourStep3Title'),
      text: t('tourStep3Text'),
      placement: 'bottom'
    },
    {
      target: '[data-tour="reminder"]',
      title: t('tourStep4Title'),
      text: t('tourStep4Text'),
      placement: 'top'
    },
    {
      target: '[data-tour="category"]',
      title: t('tourStep5Title'),
      text: t('tourStep5Text'),
      placement: 'top'
    },
    {
      target: '#addTaskBtn',
      title: t('tourStep6Title'),
      text: t('tourStep6Text'),
      placement: 'top'
    }
  ];

}

let tourState = { steps: [], index: 0, active: false };
let tourReflowHandler = null;

function buildTourDOM(){

  if(document.getElementById('tourOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'tourOverlay';
  overlay.className = 'tour-overlay hidden';

  overlay.innerHTML = `
    <div class="tour-spotlight" id="tourSpotlight"></div>
    <div class="tour-beacon" id="tourBeacon"></div>
    <div class="tour-tooltip" id="tourTooltip" role="dialog" aria-live="polite">
      <span class="tour-tooltip-arrow" id="tourArrow"></span>
      <span class="tour-step-badge" id="tourStepBadge">1/6</span>
      <h3 id="tourTitle"></h3>
      <p id="tourText"></p>
      <div class="tour-dots" id="tourDots"></div>
      <div class="tour-nav">
        <button type="button" class="tour-skip" id="tourSkipBtn"></button>
        <div class="tour-nav-right">
          <button type="button" class="tour-prev" id="tourPrevBtn" aria-label="Back">‹</button>
          <button type="button" class="tour-next" id="tourNextBtn"></button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('tourSkipBtn').addEventListener('click', () => endTour(false));
  document.getElementById('tourPrevBtn').addEventListener('click', () => stepTour(-1));
  document.getElementById('tourNextBtn').addEventListener('click', () => stepTour(1));

  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) endTour(false);
  });

  document.addEventListener('keydown', (e) => {
    if(!tourState.active) return;
    if(e.key === 'Escape') endTour(false);
    if(e.key === 'ArrowRight') stepTour(1);
    if(e.key === 'ArrowLeft') stepTour(-1);
  });

}

function startTour(){

  buildTourDOM();

  tourState.steps = getTourSteps().filter(s => document.querySelector(s.target));
  tourState.index = 0;
  tourState.active = true;

  if(tourState.steps.length === 0) return;

  const overlay = document.getElementById('tourOverlay');
  overlay.classList.remove('hidden');
  document.body.classList.add('tour-locked');

  renderTourStep();

  tourReflowHandler = () => renderTourStep(true);
  window.addEventListener('resize', tourReflowHandler);
  window.addEventListener('scroll', tourReflowHandler, true);

}

function stepTour(direction){

  const next = tourState.index + direction;

  if(next < 0) return;

  if(next >= tourState.steps.length){
    endTour(true);
    return;
  }

  tourState.index = next;
  renderTourStep();

}

function endTour(completed){

  tourState.active = false;

  const overlay = document.getElementById('tourOverlay');
  if(overlay) overlay.classList.add('hidden');

  document.body.classList.remove('tour-locked');

  if(tourReflowHandler){
    window.removeEventListener('resize', tourReflowHandler);
    window.removeEventListener('scroll', tourReflowHandler, true);
    tourReflowHandler = null;
  }

  markTourSeen();

  if(completed){
    showToast(t('tourCompleteMsg'));
    const fab = document.getElementById('helpFab');
    burstConfetti(fab || document.getElementById('addTaskBtn'));
  }

}

function renderTourStep(silent){

  const step = tourState.steps[tourState.index];
  if(!step) return;

  const targetEl = document.querySelector(step.target);

  if(!targetEl){
    stepTour(1);
    return;
  }

  targetEl.scrollIntoView({
    behavior: silent ? 'auto' : 'smooth',
    block: 'center'
  });

  // beri jeda singkat supaya scroll selesai dulu sebelum menghitung posisi
  setTimeout(() => positionTourStep(targetEl, step), silent ? 0 : 280);

}

function positionTourStep(targetEl, step){

  const rect = targetEl.getBoundingClientRect();
  const pad = 10;

  const spotlight = document.getElementById('tourSpotlight');
  spotlight.style.top = `${rect.top - pad}px`;
  spotlight.style.left = `${rect.left - pad}px`;
  spotlight.style.width = `${rect.width + pad * 2}px`;
  spotlight.style.height = `${rect.height + pad * 2}px`;

  const beacon = document.getElementById('tourBeacon');
  beacon.style.top = `${rect.top - pad}px`;
  beacon.style.left = `${rect.left - pad}px`;
  beacon.style.width = `${rect.width + pad * 2}px`;
  beacon.style.height = `${rect.height + pad * 2}px`;

  const tooltip = document.getElementById('tourTooltip');
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourText').textContent = step.text;
  document.getElementById('tourStepBadge').textContent =
    `${tourState.index + 1}/${tourState.steps.length}`;

  document.getElementById('tourSkipBtn').textContent = t('tourSkip');
  document.getElementById('tourPrevBtn').disabled = tourState.index === 0;
  document.getElementById('tourNextBtn').textContent =
    tourState.index === tourState.steps.length - 1 ? t('tourFinish') : t('tourNext');

  const dotsWrap = document.getElementById('tourDots');
  dotsWrap.innerHTML = tourState.steps
    .map((_, i) => `<span class="tour-dot ${i === tourState.index ? 'active' : ''}"></span>`)
    .join('');

  // retrigger animasi masuk tooltip setiap ganti langkah
  tooltip.classList.remove('tour-tooltip-anim');
  void tooltip.offsetWidth;
  tooltip.classList.add('tour-tooltip-anim');

  const tooltipWidth = Math.min(330, window.innerWidth - 32);
  tooltip.style.width = `${tooltipWidth}px`;

  const estHeight = tooltip.offsetHeight || 220;
  const spaceBelow = window.innerHeight - rect.bottom;
  const placeBelow = step.placement !== 'top' || spaceBelow < (estHeight + 30);

  let top = placeBelow ? rect.bottom + 22 : rect.top - estHeight - 22;
  top = Math.max(12, Math.min(top, window.innerHeight - estHeight - 12));

  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;

  const arrow = document.getElementById('tourArrow');
  arrow.className = 'tour-tooltip-arrow ' + (placeBelow ? 'arrow-up' : 'arrow-down');
  const arrowLeft = Math.max(20, Math.min(rect.left + rect.width / 2 - left - 8, tooltipWidth - 28));
  arrow.style.left = `${arrowLeft}px`;

}

/* ---------- Tombol bantuan mengambang (putar ulang tur) ---------- */

function buildHelpFab(){

  if(document.getElementById('helpFab')) return;

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.id = 'helpFab';
  fab.className = 'help-fab';
  fab.setAttribute('aria-label', t('tourReplayBtn'));
  fab.title = t('tourReplayBtn');

  fab.innerHTML = `
    <span class="help-fab-ring"></span>
    <span class="help-fab-icon">?</span>
  `;

  fab.addEventListener('click', () => startTour());

  document.body.appendChild(fab);

}

/* ---------- Progress bar kelengkapan form ---------- */

function getFormProgressFields(){

  return [
    {
      filled: () => document.getElementById('taskName').value.trim().length > 0,
      checkId: 'checkTaskName'
    },
    {
      filled: () => document.getElementById('taskDesc').value.trim().length > 0,
      checkId: 'checkTaskDesc'
    },
    {
      filled: () => typeof getCurrentTimeValue === 'function' && !!getCurrentTimeValue(),
      checkId: 'checkTimeValue'
    },
    {
      filled: () => document.getElementById('taskReminder').value.trim().length > 0,
      checkId: 'checkReminder'
    }
  ];

}

function updateFormProgress(){

  const nameEl = document.getElementById('taskName');
  if(!nameEl) return;

  const fields = getFormProgressFields();
  let filledCount = 0;

  fields.forEach(field => {

    let isFilled = false;

    try{
      isFilled = !!field.filled();
    }catch(e){
      isFilled = false;
    }

    if(isFilled) filledCount++;

    const badge = document.getElementById(field.checkId);
    if(badge) badge.classList.toggle('is-filled', isFilled);

  });

  const percent = Math.round((filledCount / fields.length) * 100);

  const bar = document.getElementById('formProgressBar');
  const label = document.getElementById('formProgressLabel');
  const wrap = document.getElementById('formProgressWrap');

  if(bar) bar.style.width = `${percent}%`;

  if(label){
    label.textContent = percent === 100
      ? t('formProgressComplete')
      : `${percent}% ${t('formProgressLabel')}`;
  }

  if(wrap) wrap.classList.toggle('is-complete', percent === 100);

}

let formProgressBound = false;

function bindFormProgressEvents(){

  if(formProgressBound){
    updateFormProgress();
    return;
  }

  formProgressBound = true;

  ['taskName', 'taskDesc', 'taskReminder'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', updateFormProgress);
  });

  // Waktu Keperluan diganti elemen DOM-nya secara dinamis (lihat
  // time-picker.js), jadi didengarkan lewat delegasi pada wrapper.
  const wrapper = document.getElementById('timeInputWrapper');
  if(wrapper){
    wrapper.addEventListener('input', updateFormProgress);
    wrapper.addEventListener('change', updateFormProgress);
  }

  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(updateFormProgress, 30));
  });

  updateFormProgress();

}

/* ---------- Animasi validasi & sukses ---------- */

// Menggetarkan sebuah field/kontainer untuk menandai input keliru,
// dipakai oleh tasks.js saat validasi addTask() gagal.
function shakeField(elOrSelector){

  const el = typeof elOrSelector === 'string'
    ? document.querySelector(elOrSelector)
    : elOrSelector;

  if(!el) return;

  el.classList.remove('field-shake');
  void el.offsetWidth; // paksa reflow supaya animasi bisa diulang
  el.classList.add('field-shake');

  el.addEventListener('animationend', function handler(){
    el.classList.remove('field-shake');
    el.removeEventListener('animationend', handler);
  });

  if(el.scrollIntoView){
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

}

// Ledakan confetti kecil di sekitar sebuah elemen — dipakai untuk
// merayakan keberhasilan menambah aktivitas / menyelesaikan tur.
function burstConfetti(anchorEl){

  if(!anchorEl) return;

  const rect = anchorEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const colors = ['#1171B1', '#FCC102', '#22c55e', '#ef4444', '#0d5c90'];
  const total = 16;

  for(let i = 0; i < total; i++){

    const dot = document.createElement('span');
    dot.className = 'confetti-dot';

    const angle = (Math.PI * 2 * i) / total + (Math.random() * 0.5 - 0.25);
    const distance = 55 + Math.random() * 45;

    dot.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    dot.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    dot.style.left = `${originX}px`;
    dot.style.top = `${originY}px`;
    dot.style.background = colors[i % colors.length];

    document.body.appendChild(dot);

    dot.addEventListener('animationend', () => dot.remove());
    setTimeout(() => dot.remove(), 1200);

  }

}

// Animasi "pop + confetti" pada tombol Tambah/Update Prioritas saat
// aktivitas berhasil disimpan — dipanggil dari tasks.js.
function pulseAddSuccess(){

  const btn = document.getElementById('addTaskBtn');
  if(!btn) return;

  btn.classList.remove('btn-success-pulse');
  void btn.offsetWidth;
  btn.classList.add('btn-success-pulse');

  burstConfetti(btn);

  btn.addEventListener('animationend', function handler(){
    btn.classList.remove('btn-success-pulse');
    btn.removeEventListener('animationend', handler);
  });

}

/* ---------- Bootstrap ---------- */

function initOnboarding(){

  buildHelpFab();
  bindFormProgressEvents();

  if(!hasTourBeenSeen()){
    setTimeout(() => startTour(), 800);
  }

}
