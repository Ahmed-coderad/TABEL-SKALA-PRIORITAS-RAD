/* =========================================
   CONTACTS.JS
   Nomor WhatsApp & email tujuan pengiriman data,
   disimpan per akun pengguna (lihat auth.js).
   Semua data tetap tersimpan lokal di perangkat
   ini (localStorage) — tidak ada server pihak
   ketiga yang menyimpannya.
   ========================================= */

const CONTACTS_KEY = "radPlannerContacts";

function loadContactsStore(){
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || "{}");
}

function saveContactsStore(store){
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(store));
}

function getUserContact(){

  const user = getCurrentUser();
  if(!user) return null;

  const store = loadContactsStore();

  return store[user.username.toLowerCase()] || null;

}

function saveUserContact(whatsapp, email){

  const user = getCurrentUser();
  if(!user) return;

  const store = loadContactsStore();

  store[user.username.toLowerCase()] = { whatsapp, email };

  saveContactsStore(store);

}

// Normalisasi nomor WhatsApp: hanya digit, tanpa spasi/plus/simbol
function normalizeWhatsappNumber(value){
  return (value || "").replace(/[^0-9]/g, "");
}

function isValidWhatsappNumber(value){
  const digits = normalizeWhatsappNumber(value);
  return digits.length >= 8 && digits.length <= 15;
}

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
}

let pendingContactCallback = null;

// Membuka modal kontak, diisi otomatis dari data tersimpan (jika ada),
// lalu memanggil onConfirm(whatsapp, email) setelah pengguna submit.
function openContactModal(onConfirm){

  const saved = getUserContact();

  document.getElementById('contactWhatsapp').value = saved ? saved.whatsapp : '';
  document.getElementById('contactEmail').value = saved ? saved.email : '';
  document.getElementById('contactError').style.display = 'none';

  pendingContactCallback = onConfirm;

  document.getElementById('contactModal').classList.remove('hidden');

}

function closeContactModal(){
  document.getElementById('contactModal').classList.add('hidden');
  pendingContactCallback = null;
}

function bindContactModal(){

  document.getElementById('closeContactBtn')
    .addEventListener('click', closeContactModal);

  document.getElementById('contactCancelBtn')
    .addEventListener('click', closeContactModal);

  document.getElementById('contactForm')
    .addEventListener('submit', (e) => {

      e.preventDefault();

      const whatsappRaw = document.getElementById('contactWhatsapp').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const errorEl = document.getElementById('contactError');

      const whatsapp = normalizeWhatsappNumber(whatsappRaw);

      if(!isValidWhatsappNumber(whatsapp) || !isValidEmail(email)){
        errorEl.textContent = t('errContactInvalid');
        errorEl.style.display = 'block';
        return;
      }

      saveUserContact(whatsapp, email);

      const callback = pendingContactCallback;

      closeContactModal();

      if(typeof callback === 'function'){
        callback(whatsapp, email);
      }

    });

}
