/* =========================================
   AUTH.JS
   Sistem akun multi-pengguna. Kata sandi
   disimpan sebagai hash SHA-256 (bukan teks
   polos). Setiap pengguna punya data planner
   yang terpisah (lihat storage.js).

   Catatan keamanan: karena aplikasi ini murni
   berjalan di browser (tanpa server), akun
   hanya tersimpan secara lokal di perangkat ini
   (localStorage) dan bukan pengganti sistem
   autentikasi sungguhan yang butuh server.
   ========================================= */

const USERS_KEY = "radPlannerUsers";
const SESSION_KEY = "radPlannerSession";

async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers(){
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function seedDefaultAdmin(){

  const users = loadUsers();

  if(!users["ahmed"]){

    users["ahmed"] = {
      username: "Ahmed",
      passwordHash: await sha256Hex("12345678"),
      createdAt: Date.now()
    };

    saveUsers(users);

  }

}

function getCurrentUser(){
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user){
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username: user.username })
  );
}

function logoutUser(){
  localStorage.removeItem(SESSION_KEY);
  showAuth();
  showToast(t('msgLoggedOut'));
}

async function loginUser(username, password){

  const users = loadUsers();
  const key = username.trim().toLowerCase();
  const user = users[key];

  if(!user){
    return { ok: false, error: t('errLoginInvalid') };
  }

  const hash = await sha256Hex(password);

  if(hash !== user.passwordHash){
    return { ok: false, error: t('errLoginInvalid') };
  }

  setCurrentUser(user);

  return { ok: true };

}

async function registerUser(username, password, confirmPassword){

  username = username.trim();

  if(!username || !password || !confirmPassword){
    return { ok: false, error: t('errFieldsRequired') };
  }

  if(password.length < 6){
    return { ok: false, error: t('errPasswordLength') };
  }

  if(password !== confirmPassword){
    return { ok: false, error: t('errPasswordMismatch') };
  }

  const users = loadUsers();
  const key = username.toLowerCase();

  if(users[key]){
    return { ok: false, error: t('errUserExists') };
  }

  users[key] = {
    username,
    passwordHash: await sha256Hex(password),
    createdAt: Date.now()
  };

  saveUsers(users);
  setCurrentUser(users[key]);

  return { ok: true };

}

function bindAuthForms(){

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toRegister = document.getElementById('showRegister');
  const toLogin = document.getElementById('showLogin');

  function setActiveTab(activeTab, inactiveTab){
    activeTab.classList.add('is-active');
    activeTab.setAttribute('aria-selected', 'true');
    inactiveTab.classList.remove('is-active');
    inactiveTab.setAttribute('aria-selected', 'false');
  }

  toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    setActiveTab(toRegister, toLogin);
  });

  toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    setActiveTab(toLogin, toRegister);
  });

  loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';

    const result = await loginUser(username, password);

    if(result.ok){
      loginForm.reset();
      showApp();
    }
    else{
      errorEl.textContent = result.error;
    }

  });

  registerForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const errorEl = document.getElementById('registerError');

    errorEl.textContent = '';

    const result = await registerUser(username, password, confirmPassword);

    if(result.ok){
      registerForm.reset();
      showApp();
      showToast(t('msgAccountCreated'));
    }
    else{
      errorEl.textContent = result.error;
    }

  });

  document.getElementById('logoutBtn')
    .addEventListener('click', logoutUser);

  bindPasswordVisibilityToggles();

}

/**
 * Menambahkan tombol mata pada kolom kata sandi di layar
 * masuk/daftar, agar pengguna dari berbagai usia dapat
 * memeriksa ketikannya sebelum submit — mengurangi kesalahan
 * login/registrasi akibat salah ketik.
 */
function bindPasswordVisibilityToggles(){

  document.querySelectorAll('.input-toggle-visibility').forEach(btn => {

    btn.addEventListener('click', () => {

      const targetInput = document.getElementById(btn.dataset.target);
      if(!targetInput){
        return;
      }

      const isHidden = targetInput.type === 'password';

      targetInput.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? '🙈' : '👁️';

      const labelKey = isHidden ? 'togglePasswordHide' : 'togglePasswordShow';
      btn.setAttribute('aria-label', t(labelKey));
      btn.setAttribute('data-i18n-aria-label', labelKey);

    });

  });

}
