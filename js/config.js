/* =========================================
   CONFIG.JS
   Konfigurasi & konstanta global aplikasi.
   ========================================= */

/*
EMAILJS CONFIGURATION
----------------------
1. Buat akun di https://www.emailjs.com/
2. Buat Email Service & Email Template
3. Ganti nilai di bawah ini dengan milikmu:
   - YOUR_PUBLIC_KEY
   - YOUR_SERVICE_ID
   - YOUR_TEMPLATE_ID
*/

const CONFIG = {

  EMAILJS_PUBLIC_KEY: "YOUR_PUBLIC_KEY",
  EMAILJS_SERVICE_ID: "YOUR_SERVICE_ID",
  EMAILJS_TEMPLATE_ID: "YOUR_TEMPLATE_ID",

  NOTIFY_EMAIL: "rizkyahmeddarmawan98@gmail.com",
  WHATSAPP_NUMBER: "6285888082504",

  STORAGE_KEY: "coveyPlanner",

  PDF_BRAND_COLOR: [17, 113, 177],   // BLUE
  PDF_ACCENT_COLOR: [252, 193, 2]    // YELLOW

};

emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
