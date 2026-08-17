/* =========================================
   I18N.JS
   Kamus terjemahan & penerapan bahasa UI.
   Bahasa didukung: Indonesia (id), Inggris (en),
   Melayu (ms), Jawa (jv), Sunda (su).

   Catatan: teks di kamus ini disusun agar
   fungsional dan konsisten di seluruh UI.
   Untuk jv/su, terjemahan menggunakan ragam
   umum/ngoko sehari-hari — disarankan ditinjau
   oleh penutur asli sebelum dipakai secara resmi.
   ========================================= */

const LANG_STORAGE_KEY = "radPlannerLanguage";

const TRANSLATIONS = {

  id: {
    appTitle: "Priority Planner",
    appDesc: "Susun aktivitas menggunakan Matrix Stephen R. Covey. Fokus pada prioritas penting, tingkatkan produktivitas, dan capai tujuan dengan lebih terarah.",

    statTotal: "Total Aktivitas",
    statImportant: "Penting",
    statUrgent: "Mendesak",
    statCompleted: "Selesai",

    plannerLabel: "Project Tabel Skala Prioritas",
    plannerPlaceholder: "Contoh: Prioritas Organisasi BEM 2026",
    plannerEmptyTitle: "Belum Ada Nama Planner",

    addPriorityTitle: "Tambah Prioritas",
    taskNameLabel: "Nama Aktivitas",
    taskNamePlaceholder: "Contoh: Menyelesaikan proposal",
    taskDescLabel: "Deskripsi Aktivitas",
    taskDescPlaceholder: "Tulis detail aktivitas...",
    timeLabel: "Waktu Keperluan",
    timeDaily: "Harian",
    timeMonthly: "Bulanan",
    timeYearly: "Tahunan",
    datePlaceholder: "Pilih tanggal",
    reminderLabel: "Alarm Pengingat (opsional)",
    reminderHint: "Notifikasi akan berbunyi seperti panggilan telepon pada waktu ini. Tanggalnya otomatis mengikuti Waktu Keperluan yang kamu pilih di atas.",
    reminderDatePrefix: "🔔 Alarm akan berbunyi pada:",
    reminderDateEmpty: "Pilih Waktu Keperluan di atas dulu untuk mengunci tanggal alarm.",
    categoryLabel: "Kategori Prioritas",
    catQ1: "Penting & Mendesak",
    catQ2: "Penting Tidak Mendesak",
    catQ3: "Tidak Penting Tapi Mendesak",
    catQ4: "Tidak Penting & Tidak Mendesak",

    btnAdd: "+ Tambah Prioritas",
    btnUpdate: "✓ Update Prioritas",
    btnSave: "Simpan",
    btnReset: "Reset",
    btnExportPdf: "Export PDF",
    btnSyncCalendar: "Sinkronkan Semua ke Kalender",

    q1Title: "🔥 Kuadran 1",
    q1Desc: "Penting & Mendesak",
    q2Title: "🌱 Kuadran 2",
    q2Desc: "Penting Tidak Mendesak",
    q3Title: "⚡ Kuadran 3",
    q3Desc: "Tidak Penting Tapi Mendesak",
    q4Title: "🛋️ Kuadran 4",
    q4Desc: "Tidak Penting & Tidak Mendesak",
    emptyQuadrant: "Belum ada aktivitas",
    noDescription: "Tidak ada deskripsi",

    taskDone: "Selesai",
    taskUndo: "Undo",
    taskEdit: "Edit",
    taskDelete: "Hapus",
    taskCalendar: "Kalender",

    errTimeRequired: "Waktu keperluan wajib diisi",
    errNameRequired: "Nama aktivitas wajib diisi",
    errDuplicate: "Aktivitas sudah ada",
    errMonthPast: "Bulan tidak boleh sebelum bulan sekarang",
    errYearPast: "Tahun tidak boleh kurang dari tahun sekarang",
    msgAdded: "Prioritas berhasil ditambahkan",
    msgUpdated: "Prioritas berhasil diperbarui",
    msgDeleted: "Aktivitas berhasil dihapus",
    msgReset: "Semua aktivitas dan form berhasil direset",
    msgSaved: "Data berhasil dikirim & disimpan",
    editModeActive: "Mode edit aktif, ubah data lalu klik Update Prioritas",
    msgCalendarExported: "Jadwal berhasil diunduh untuk kalender perangkat",
    msgCalendarExportedAll: "Semua jadwal berhasil diunduh untuk kalender perangkat",
    errNoTasks: "Belum ada aktivitas untuk disinkronkan",

    loginTitle: "Masuk ke Akun",
    loginSubtitle: "Masuk untuk mengakses planner prioritasmu",
    usernameLabel: "Nama Pengguna",
    usernamePlaceholder: "Masukkan nama pengguna",
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "Masukkan kata sandi",
    loginBtn: "Masuk",
    registerBtn: "Daftar",
    switchToRegister: "Belum punya akun? Daftar di sini",
    switchToLogin: "Sudah punya akun? Masuk di sini",
    registerTitle: "Buat Akun Baru",
    confirmPasswordLabel: "Konfirmasi Kata Sandi",
    confirmPasswordPlaceholder: "Ulangi kata sandi",
    logoutBtn: "Keluar",
    welcomeUser: "Halo",
    msgLoggedOut: "Berhasil keluar",
    msgAccountCreated: "Akun berhasil dibuat",

    errLoginInvalid: "Nama pengguna atau kata sandi salah",
    errUserExists: "Nama pengguna sudah digunakan",
    errPasswordMismatch: "Konfirmasi kata sandi tidak cocok",
    errFieldsRequired: "Semua kolom wajib diisi",
    errPasswordLength: "Kata sandi minimal 6 karakter",

    settingsTitle: "Pengaturan",
    settingsCloseBtn: "Tutup",
    languageLabel: "Bahasa",
    notifPermissionLabel: "Izin Notifikasi Perangkat",
    notifEnableBtn: "Aktifkan Notifikasi",
    notifTestBtn: "Uji Notifikasi",
    notifStatusGranted: "Aktif — perangkat ini akan menerima notifikasi",
    notifStatusDenied: "Ditolak — aktifkan lewat pengaturan browser",
    notifStatusDefault: "Belum diaktifkan",
    errNotifUnsupported: "Perangkat/browser ini tidak mendukung notifikasi",
    calendarSyncNote: "Tanggal & waktu mengikuti jam perangkatmu secara otomatis. Tombol ini mengunduh jadwal dalam format kalender standar (.ics) untuk ditambahkan ke aplikasi kalender bawaan perangkat (Google Calendar, Apple Calendar, Outlook, dsb).",

    contactModalTitle: "Kirim & Simpan Data",
    contactModalHint: "Masukkan nomor WhatsApp dan email tujuanmu sendiri. Data hanya tersimpan di perangkat ini dan dipakai untuk fitur Simpan akun ini saja.",
    contactWhatsappLabel: "Nomor WhatsApp",
    contactWhatsappPlaceholder: "Contoh: 6281234567890",
    contactEmailLabel: "Alamat Email",
    contactEmailPlaceholder: "Contoh: nama@email.com",
    contactSaveBtn: "Simpan & Kirim",
    contactCancelBtn: "Batal",
    errContactInvalid: "Masukkan nomor WhatsApp dan email yang valid",
    errReminderMismatch: "Tanggal alarm pengingat harus sesuai dengan waktu keperluan yang dipilih",

    alertIncoming: "Pengingat Prioritas",
    alertAnswer: "Matikan Alarm",
    testReminderName: "Pengingat Uji Coba",
    testReminderDesc: "Ini adalah contoh notifikasi pengingat."
  },

  en: {
    appTitle: "Priority Planner",
    appDesc: "Organize your activities using the Stephen R. Covey Matrix. Focus on what matters, boost your productivity, and reach your goals with clear direction.",

    statTotal: "Total Activities",
    statImportant: "Important",
    statUrgent: "Urgent",
    statCompleted: "Completed",

    plannerLabel: "Priority Scale Table Project",
    plannerPlaceholder: "e.g. Student Council Priorities 2026",
    plannerEmptyTitle: "No Planner Name Yet",

    addPriorityTitle: "Add Priority",
    taskNameLabel: "Activity Name",
    taskNamePlaceholder: "e.g. Finish the proposal",
    taskDescLabel: "Activity Description",
    taskDescPlaceholder: "Write the activity details...",
    timeLabel: "Time Needed",
    timeDaily: "Daily",
    timeMonthly: "Monthly",
    timeYearly: "Yearly",
    datePlaceholder: "Pick a date",
    reminderLabel: "Reminder Alarm (optional)",
    reminderHint: "The notification will ring like an incoming call at this time. Its date automatically follows the Time Setting you chose above.",
    reminderDatePrefix: "🔔 The alarm will ring on:",
    reminderDateEmpty: "Choose a Time Setting above first to lock in the alarm date.",
    categoryLabel: "Priority Category",
    catQ1: "Important & Urgent",
    catQ2: "Important, Not Urgent",
    catQ3: "Not Important, But Urgent",
    catQ4: "Not Important & Not Urgent",

    btnAdd: "+ Add Priority",
    btnUpdate: "✓ Update Priority",
    btnSave: "Save",
    btnReset: "Reset",
    btnExportPdf: "Export PDF",
    btnSyncCalendar: "Sync All to Calendar",

    q1Title: "🔥 Quadrant 1",
    q1Desc: "Important & Urgent",
    q2Title: "🌱 Quadrant 2",
    q2Desc: "Important, Not Urgent",
    q3Title: "⚡ Quadrant 3",
    q3Desc: "Not Important, But Urgent",
    q4Title: "🛋️ Quadrant 4",
    q4Desc: "Not Important & Not Urgent",
    emptyQuadrant: "No activities yet",
    noDescription: "No description",

    taskDone: "Done",
    taskUndo: "Undo",
    taskEdit: "Edit",
    taskDelete: "Delete",
    taskCalendar: "Calendar",

    errTimeRequired: "Time needed is required",
    errNameRequired: "Activity name is required",
    errDuplicate: "This activity already exists",
    errMonthPast: "Month cannot be before the current month",
    errYearPast: "Year cannot be earlier than the current year",
    msgAdded: "Priority added successfully",
    msgUpdated: "Priority updated successfully",
    msgDeleted: "Activity deleted successfully",
    msgReset: "All activities and the form were reset",
    msgSaved: "Data sent & saved successfully",
    editModeActive: "Edit mode is active — change the data, then click Update Priority",
    msgCalendarExported: "Schedule downloaded for your device calendar",
    msgCalendarExportedAll: "All schedules downloaded for your device calendar",
    errNoTasks: "There are no activities to sync yet",

    loginTitle: "Sign In",
    loginSubtitle: "Sign in to access your priority planner",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginBtn: "Sign In",
    registerBtn: "Register",
    switchToRegister: "Don't have an account? Register here",
    switchToLogin: "Already have an account? Sign in here",
    registerTitle: "Create a New Account",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    logoutBtn: "Sign Out",
    welcomeUser: "Hi",
    msgLoggedOut: "Signed out successfully",
    msgAccountCreated: "Account created successfully",

    errLoginInvalid: "Incorrect username or password",
    errUserExists: "This username is already taken",
    errPasswordMismatch: "Password confirmation doesn't match",
    errFieldsRequired: "All fields are required",
    errPasswordLength: "Password must be at least 6 characters",

    settingsTitle: "Settings",
    settingsCloseBtn: "Close",
    languageLabel: "Language",
    notifPermissionLabel: "Device Notification Permission",
    notifEnableBtn: "Enable Notifications",
    notifTestBtn: "Test Notification",
    notifStatusGranted: "Enabled — this device will receive notifications",
    notifStatusDenied: "Blocked — enable it from your browser settings",
    notifStatusDefault: "Not enabled yet",
    errNotifUnsupported: "This device/browser doesn't support notifications",
    calendarSyncNote: "Dates and times automatically follow your device's clock. This button downloads your schedule in the standard calendar format (.ics) so you can add it to your device's built-in calendar app (Google Calendar, Apple Calendar, Outlook, etc).",

    contactModalTitle: "Send & Save Data",
    contactModalHint: "Enter your own WhatsApp number and email. This data is only stored on this device and is used for this account's Save feature only.",
    contactWhatsappLabel: "WhatsApp Number",
    contactWhatsappPlaceholder: "e.g. 6281234567890",
    contactEmailLabel: "Email Address",
    contactEmailPlaceholder: "e.g. name@email.com",
    contactSaveBtn: "Save & Send",
    contactCancelBtn: "Cancel",
    errContactInvalid: "Please enter a valid WhatsApp number and email address",
    errReminderMismatch: "The reminder alarm date must match the selected time setting",

    alertIncoming: "Priority Reminder",
    alertAnswer: "Dismiss Alarm",
    testReminderName: "Test Reminder",
    testReminderDesc: "This is a sample reminder notification."
  },

  ms: {
    appTitle: "Priority Planner",
    appDesc: "Susun aktiviti menggunakan Matrik Stephen R. Covey. Fokus pada keutamaan penting, tingkatkan produktiviti, dan capai matlamat dengan lebih terarah.",

    statTotal: "Jumlah Aktiviti",
    statImportant: "Penting",
    statUrgent: "Mendesak",
    statCompleted: "Selesai",

    plannerLabel: "Projek Jadual Skala Keutamaan",
    plannerPlaceholder: "Contoh: Keutamaan Majlis Perwakilan Pelajar 2026",
    plannerEmptyTitle: "Belum Ada Nama Perancang",

    addPriorityTitle: "Tambah Keutamaan",
    taskNameLabel: "Nama Aktiviti",
    taskNamePlaceholder: "Contoh: Menyiapkan cadangan",
    taskDescLabel: "Penerangan Aktiviti",
    taskDescPlaceholder: "Tulis butiran aktiviti...",
    timeLabel: "Masa Diperlukan",
    timeDaily: "Harian",
    timeMonthly: "Bulanan",
    timeYearly: "Tahunan",
    datePlaceholder: "Pilih tarikh",
    reminderLabel: "Penggera Peringatan (pilihan)",
    reminderHint: "Notifikasi akan berbunyi seperti panggilan telefon pada masa ini. Tarikhnya mengikut Waktu Keperluan yang anda pilih di atas secara automatik.",
    reminderDatePrefix: "🔔 Penggera akan berbunyi pada:",
    reminderDateEmpty: "Pilih Waktu Keperluan di atas dahulu untuk mengunci tarikh penggera.",
    categoryLabel: "Kategori Keutamaan",
    catQ1: "Penting & Mendesak",
    catQ2: "Penting Tidak Mendesak",
    catQ3: "Tidak Penting Tapi Mendesak",
    catQ4: "Tidak Penting & Tidak Mendesak",

    btnAdd: "+ Tambah Keutamaan",
    btnUpdate: "✓ Kemas Kini Keutamaan",
    btnSave: "Simpan",
    btnReset: "Set Semula",
    btnExportPdf: "Eksport PDF",
    btnSyncCalendar: "Segerakkan Semua ke Kalendar",

    q1Title: "🔥 Kuadran 1",
    q1Desc: "Penting & Mendesak",
    q2Title: "🌱 Kuadran 2",
    q2Desc: "Penting Tidak Mendesak",
    q3Title: "⚡ Kuadran 3",
    q3Desc: "Tidak Penting Tapi Mendesak",
    q4Title: "🛋️ Kuadran 4",
    q4Desc: "Tidak Penting & Tidak Mendesak",
    emptyQuadrant: "Belum ada aktiviti",
    noDescription: "Tiada penerangan",

    taskDone: "Selesai",
    taskUndo: "Buat Asal",
    taskEdit: "Sunting",
    taskDelete: "Padam",
    taskCalendar: "Kalendar",

    errTimeRequired: "Masa diperlukan wajib diisi",
    errNameRequired: "Nama aktiviti wajib diisi",
    errDuplicate: "Aktiviti ini sudah wujud",
    errMonthPast: "Bulan tidak boleh sebelum bulan semasa",
    errYearPast: "Tahun tidak boleh kurang daripada tahun semasa",
    msgAdded: "Keutamaan berjaya ditambah",
    msgUpdated: "Keutamaan berjaya dikemas kini",
    msgDeleted: "Aktiviti berjaya dipadam",
    msgReset: "Semua aktiviti dan borang berjaya diset semula",
    msgSaved: "Data berjaya dihantar & disimpan",
    editModeActive: "Mod sunting aktif, ubah data kemudian klik Kemas Kini Keutamaan",
    msgCalendarExported: "Jadual berjaya dimuat turun untuk kalendar peranti",
    msgCalendarExportedAll: "Semua jadual berjaya dimuat turun untuk kalendar peranti",
    errNoTasks: "Belum ada aktiviti untuk diselaraskan",

    loginTitle: "Log Masuk Akaun",
    loginSubtitle: "Log masuk untuk mengakses perancang keutamaan anda",
    usernameLabel: "Nama Pengguna",
    usernamePlaceholder: "Masukkan nama pengguna",
    passwordLabel: "Kata Laluan",
    passwordPlaceholder: "Masukkan kata laluan",
    loginBtn: "Log Masuk",
    registerBtn: "Daftar",
    switchToRegister: "Belum ada akaun? Daftar di sini",
    switchToLogin: "Sudah ada akaun? Log masuk di sini",
    registerTitle: "Cipta Akaun Baharu",
    confirmPasswordLabel: "Sahkan Kata Laluan",
    confirmPasswordPlaceholder: "Masukkan semula kata laluan",
    logoutBtn: "Log Keluar",
    welcomeUser: "Helo",
    msgLoggedOut: "Berjaya log keluar",
    msgAccountCreated: "Akaun berjaya dicipta",

    errLoginInvalid: "Nama pengguna atau kata laluan salah",
    errUserExists: "Nama pengguna ini sudah digunakan",
    errPasswordMismatch: "Pengesahan kata laluan tidak sepadan",
    errFieldsRequired: "Semua ruangan wajib diisi",
    errPasswordLength: "Kata laluan sekurang-kurangnya 6 aksara",

    settingsTitle: "Tetapan",
    settingsCloseBtn: "Tutup",
    languageLabel: "Bahasa",
    notifPermissionLabel: "Kebenaran Notifikasi Peranti",
    notifEnableBtn: "Aktifkan Notifikasi",
    notifTestBtn: "Uji Notifikasi",
    notifStatusGranted: "Aktif — peranti ini akan menerima notifikasi",
    notifStatusDenied: "Ditolak — aktifkan melalui tetapan pelayar anda",
    notifStatusDefault: "Belum diaktifkan",
    errNotifUnsupported: "Peranti/pelayar ini tidak menyokong notifikasi",
    calendarSyncNote: "Tarikh & masa mengikut jam peranti anda secara automatik. Butang ini memuat turun jadual dalam format kalendar standard (.ics) untuk ditambah ke aplikasi kalendar peranti anda (Google Calendar, Apple Calendar, Outlook, dsb).",

    contactModalTitle: "Hantar & Simpan Data",
    contactModalHint: "Masukkan nombor WhatsApp dan emel tujuan anda sendiri. Data hanya disimpan di peranti ini dan digunakan untuk fungsi Simpan akaun ini sahaja.",
    contactWhatsappLabel: "Nombor WhatsApp",
    contactWhatsappPlaceholder: "Contoh: 6281234567890",
    contactEmailLabel: "Alamat Emel",
    contactEmailPlaceholder: "Contoh: nama@emel.com",
    contactSaveBtn: "Simpan & Hantar",
    contactCancelBtn: "Batal",
    errContactInvalid: "Sila masukkan nombor WhatsApp dan emel yang sah",
    errReminderMismatch: "Tarikh alarm peringatan mesti sepadan dengan tetapan waktu yang dipilih",

    alertIncoming: "Peringatan Keutamaan",
    alertAnswer: "Matikan Penggera",
    testReminderName: "Peringatan Percubaan",
    testReminderDesc: "Ini adalah contoh notifikasi peringatan."
  },

  jv: {
    appTitle: "Priority Planner",
    appDesc: "Nyusun kagiyatan nganggo Matrix Stephen R. Covey. Fokus ing prioritas sing penting, ningkatake produktivitas, lan nggayuh tujuan luwih terarah.",

    statTotal: "Total Kagiyatan",
    statImportant: "Penting",
    statUrgent: "Kebutuhan Cepet",
    statCompleted: "Rampung",

    plannerLabel: "Proyek Tabel Skala Prioritas",
    plannerPlaceholder: "Conto: Prioritas Organisasi BEM 2026",
    plannerEmptyTitle: "Durung Ana Jeneng Planner",

    addPriorityTitle: "Tambah Prioritas",
    taskNameLabel: "Jeneng Kagiyatan",
    taskNamePlaceholder: "Conto: Ngrampungake proposal",
    taskDescLabel: "Katrangan Kagiyatan",
    taskDescPlaceholder: "Tulis detail kagiyatan...",
    timeLabel: "Wektu Kabutuhan",
    timeDaily: "Saben Dina",
    timeMonthly: "Saben Wulan",
    timeYearly: "Saben Taun",
    datePlaceholder: "Pilih tanggal",
    reminderLabel: "Alarm Pangeling (opsional)",
    reminderHint: "Notifikasi bakal muni kaya telpon mlebu ing wektu iki. Tanggale otomatis ngetutake Wektu Keperluan sing dipilih ing dhuwur.",
    reminderDatePrefix: "🔔 Alarm bakal muni ing:",
    reminderDateEmpty: "Pilih Wektu Keperluan ing dhuwur dhisik kanggo ngunci tanggal alarm.",
    categoryLabel: "Kategori Prioritas",
    catQ1: "Penting & Kebutuhan Cepet",
    catQ2: "Penting Ora Kebutuhan Cepet",
    catQ3: "Ora Penting Nanging Kebutuhan Cepet",
    catQ4: "Ora Penting & Ora Kebutuhan Cepet",

    btnAdd: "+ Tambah Prioritas",
    btnUpdate: "✓ Update Prioritas",
    btnSave: "Simpen",
    btnReset: "Reset",
    btnExportPdf: "Export PDF",
    btnSyncCalendar: "Sinkronake Kabeh menyang Kalender",

    q1Title: "🔥 Kuadran 1",
    q1Desc: "Penting & Kebutuhan Cepet",
    q2Title: "🌱 Kuadran 2",
    q2Desc: "Penting Ora Kebutuhan Cepet",
    q3Title: "⚡ Kuadran 3",
    q3Desc: "Ora Penting Nanging Kebutuhan Cepet",
    q4Title: "🛋️ Kuadran 4",
    q4Desc: "Ora Penting & Ora Kebutuhan Cepet",
    emptyQuadrant: "Durung ana kagiyatan",
    noDescription: "Ora ana katrangan",

    taskDone: "Rampung",
    taskUndo: "Batalake",
    taskEdit: "Ewahi",
    taskDelete: "Busak",
    taskCalendar: "Kalender",

    errTimeRequired: "Wektu kabutuhan kudu diisi",
    errNameRequired: "Jeneng kagiyatan kudu diisi",
    errDuplicate: "Kagiyatan iki wis ana",
    errMonthPast: "Wulan ora kena sadurunge wulan saiki",
    errYearPast: "Taun ora kena kurang saka taun saiki",
    msgAdded: "Prioritas kasil ditambahake",
    msgUpdated: "Prioritas kasil dianyari",
    msgDeleted: "Kagiyatan kasil dibusak",
    msgReset: "Kabeh kagiyatan lan formulir kasil direset",
    msgSaved: "Data kasil dikirim & disimpen",
    editModeActive: "Mode ewah aktif, ewahi data banjur klik Update Prioritas",
    msgCalendarExported: "Jadwal kasil diundhuh kanggo kalender piranti",
    msgCalendarExportedAll: "Kabeh jadwal kasil diundhuh kanggo kalender piranti",
    errNoTasks: "Durung ana kagiyatan sing bisa disinkronake",

    loginTitle: "Mlebu Akun",
    loginSubtitle: "Mlebu kanggo ngakses planner prioritas sampeyan",
    usernameLabel: "Jeneng Pangguna",
    usernamePlaceholder: "Lebokna jeneng pangguna",
    passwordLabel: "Sandi",
    passwordPlaceholder: "Lebokna sandi",
    loginBtn: "Mlebu",
    registerBtn: "Daftar",
    switchToRegister: "Durung duwe akun? Daftar ing kene",
    switchToLogin: "Wis duwe akun? Mlebu ing kene",
    registerTitle: "Gawe Akun Anyar",
    confirmPasswordLabel: "Konfirmasi Sandi",
    confirmPasswordPlaceholder: "Ulangi sandi",
    logoutBtn: "Metu",
    welcomeUser: "Halo",
    msgLoggedOut: "Kasil metu",
    msgAccountCreated: "Akun kasil digawe",

    errLoginInvalid: "Jeneng pangguna utawa sandi salah",
    errUserExists: "Jeneng pangguna iki wis dipigunakake",
    errPasswordMismatch: "Konfirmasi sandi ora cocog",
    errFieldsRequired: "Kabeh kolom kudu diisi",
    errPasswordLength: "Sandi paling sethithik 6 karakter",

    settingsTitle: "Setelan",
    settingsCloseBtn: "Tutup",
    languageLabel: "Basa",
    notifPermissionLabel: "Idin Notifikasi Piranti",
    notifEnableBtn: "Aktifake Notifikasi",
    notifTestBtn: "Test Notifikasi",
    notifStatusGranted: "Aktif — piranti iki bakal nampa notifikasi",
    notifStatusDenied: "Ditolak — aktifake liwat setelan browser",
    notifStatusDefault: "Durung diaktifake",
    errNotifUnsupported: "Piranti/browser iki ora ndhukung notifikasi",
    calendarSyncNote: "Tanggal & wektu ngetutake jam piranti sampeyan kanthi otomatis. Tombol iki ngundhuh jadwal ing format kalender standar (.ics) kanggo ditambahake menyang aplikasi kalender bawaan piranti (Google Calendar, Apple Calendar, Outlook, lsp).",

    contactModalTitle: "Kirim & Simpen Data",
    contactModalHint: "Lebokna nomer WhatsApp lan email tujuanmu dhewe. Data mung kesimpen ing piranti iki lan dienggo kanggo fitur Simpen akun iki wae.",
    contactWhatsappLabel: "Nomer WhatsApp",
    contactWhatsappPlaceholder: "Tuladha: 6281234567890",
    contactEmailLabel: "Alamat Email",
    contactEmailPlaceholder: "Tuladha: jeneng@email.com",
    contactSaveBtn: "Simpen & Kirim",
    contactCancelBtn: "Batal",
    errContactInvalid: "Lebokna nomer WhatsApp lan email sing bener",
    errReminderMismatch: "Tanggal alarm pangeling kudu cocog karo setelan wektu sing dipilih",

    alertIncoming: "Pangeling Prioritas",
    alertAnswer: "Matèni Alarm",
    testReminderName: "Pangeling Uji Coba",
    testReminderDesc: "Iki conto notifikasi pangeling."
  },

  su: {
    appTitle: "Priority Planner",
    appDesc: "Susun kagiatan nganggo Matrix Stephen R. Covey. Fokus kana prioritas anu penting, tingkatkeun produktivitas, sarta hontal tujuan leuwih terarah.",

    statTotal: "Total Kagiatan",
    statImportant: "Penting",
    statUrgent: "Kudu Gancang",
    statCompleted: "Réngsé",

    plannerLabel: "Proyék Tabel Skala Prioritas",
    plannerPlaceholder: "Conto: Prioritas Organisasi BEM 2026",
    plannerEmptyTitle: "Acan Aya Ngaran Planner",

    addPriorityTitle: "Tambah Prioritas",
    taskNameLabel: "Ngaran Kagiatan",
    taskNamePlaceholder: "Conto: Ngaréngsékeun proposal",
    taskDescLabel: "Katerangan Kagiatan",
    taskDescPlaceholder: "Tulis detail kagiatan...",
    timeLabel: "Waktu Diperlukeun",
    timeDaily: "Sapopoé",
    timeMonthly: "Saban Bulan",
    timeYearly: "Saban Taun",
    datePlaceholder: "Pilih tanggal",
    reminderLabel: "Alarm Pangeling (opsional)",
    reminderHint: "Notifikasi bakal disada kawas telepon asup dina waktu ieu. Tanggalna otomatis nuturkeun Waktu Kaperluan anu dipilih di luhur.",
    reminderDatePrefix: "🔔 Alarm bakal disada dina:",
    reminderDateEmpty: "Pilih Waktu Kaperluan di luhur heula pikeun ngonci tanggal alarm.",
    categoryLabel: "Kategori Prioritas",
    catQ1: "Penting & Kudu Gancang",
    catQ2: "Penting Teu Kudu Gancang",
    catQ3: "Teu Penting Tapi Kudu Gancang",
    catQ4: "Teu Penting & Teu Kudu Gancang",

    btnAdd: "+ Tambah Prioritas",
    btnUpdate: "✓ Update Prioritas",
    btnSave: "Simpen",
    btnReset: "Reset",
    btnExportPdf: "Export PDF",
    btnSyncCalendar: "Singkronkeun Kabéh kana Kalénder",

    q1Title: "🔥 Kuadran 1",
    q1Desc: "Penting & Kudu Gancang",
    q2Title: "🌱 Kuadran 2",
    q2Desc: "Penting Teu Kudu Gancang",
    q3Title: "⚡ Kuadran 3",
    q3Desc: "Teu Penting Tapi Kudu Gancang",
    q4Title: "🛋️ Kuadran 4",
    q4Desc: "Teu Penting & Teu Kudu Gancang",
    emptyQuadrant: "Acan aya kagiatan",
    noDescription: "Teu aya katerangan",

    taskDone: "Réngsé",
    taskUndo: "Batalkeun",
    taskEdit: "Ropéa",
    taskDelete: "Hapus",
    taskCalendar: "Kalénder",

    errTimeRequired: "Waktu diperlukeun kudu dieusian",
    errNameRequired: "Ngaran kagiatan kudu dieusian",
    errDuplicate: "Kagiatan ieu geus aya",
    errMonthPast: "Bulan teu meunang saméméh bulan ayeuna",
    errYearPast: "Taun teu meunang kurang ti taun ayeuna",
    msgAdded: "Prioritas hasil ditambahkeun",
    msgUpdated: "Prioritas hasil dianyarkeun",
    msgDeleted: "Kagiatan hasil dihapus",
    msgReset: "Sadaya kagiatan sareng formulir hasil direset",
    msgSaved: "Data hasil dikirim & disimpen",
    editModeActive: "Mode ropéa aktif, robih data tuluy klik Update Prioritas",
    msgCalendarExported: "Jadwal hasil diundeur pikeun kalénder alat",
    msgCalendarExportedAll: "Sadaya jadwal hasil diundeur pikeun kalénder alat",
    errNoTasks: "Acan aya kagiatan pikeun disingkronkeun",

    loginTitle: "Asup ka Akun",
    loginSubtitle: "Asup pikeun ngaakses planner prioritas anjeun",
    usernameLabel: "Ngaran Pamaké",
    usernamePlaceholder: "Lebetkeun ngaran pamaké",
    passwordLabel: "Kecap Sandi",
    passwordPlaceholder: "Lebetkeun kecap sandi",
    loginBtn: "Asup",
    registerBtn: "Daptar",
    switchToRegister: "Acan gaduh akun? Daptar di dieu",
    switchToLogin: "Parantos gaduh akun? Asup di dieu",
    registerTitle: "Jieun Akun Anyar",
    confirmPasswordLabel: "Konfirmasi Kecap Sandi",
    confirmPasswordPlaceholder: "Lebetkeun deui kecap sandi",
    logoutBtn: "Kaluar",
    welcomeUser: "Wilujeng",
    msgLoggedOut: "Hasil kaluar",
    msgAccountCreated: "Akun hasil dijieun",

    errLoginInvalid: "Ngaran pamaké atanapi kecap sandi salah",
    errUserExists: "Ngaran pamaké ieu parantos dianggo",
    errPasswordMismatch: "Konfirmasi kecap sandi teu cocog",
    errFieldsRequired: "Sadaya kolom kudu dieusian",
    errPasswordLength: "Kecap sandi minimal 6 karakter",

    settingsTitle: "Setelan",
    settingsCloseBtn: "Tutup",
    languageLabel: "Basa",
    notifPermissionLabel: "Idin Notifikasi Alat",
    notifEnableBtn: "Aktipkeun Notifikasi",
    notifTestBtn: "Uji Notifikasi",
    notifStatusGranted: "Aktip — alat ieu bakal nampi notifikasi",
    notifStatusDenied: "Ditolak — aktipkeun ngaliwatan setelan browser",
    notifStatusDefault: "Acan diaktipkeun",
    errNotifUnsupported: "Alat/browser ieu teu ngadukung notifikasi",
    calendarSyncNote: "Tanggal & waktu nuturkeun jam alat anjeun sacara otomatis. Tombol ieu ngundeur jadwal dina format kalénder standar (.ics) pikeun ditambahkeun kana aplikasi kalénder bawaan alat (Google Calendar, Apple Calendar, Outlook, jsb).",

    contactModalTitle: "Kirim & Simpen Data",
    contactModalHint: "Asupkeun nomer WhatsApp jeung email tujuan anjeun sorangan. Data ngan disimpen di alat ieu jeung dipaké pikeun fitur Simpen akun ieu wungkul.",
    contactWhatsappLabel: "Nomer WhatsApp",
    contactWhatsappPlaceholder: "Contona: 6281234567890",
    contactEmailLabel: "Alamat Email",
    contactEmailPlaceholder: "Contona: ngaran@email.com",
    contactSaveBtn: "Simpen & Kirim",
    contactCancelBtn: "Batal",
    errContactInvalid: "Asupkeun nomer WhatsApp jeung email anu bener",
    errReminderMismatch: "Tanggal alarm pangeling kudu cocog jeung setelan waktu anu dipilih",

    alertIncoming: "Pangeling Prioritas",
    alertAnswer: "Pareuman Alarm",
    testReminderName: "Pangeling Uji Coba",
    testReminderDesc: "Ieu conto notifikasi pangeling."
  }

};

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'id';

function t(key){
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || (TRANSLATIONS.id && TRANSLATIONS.id[key])
    || key;
}

function getSavedLanguage(){
  return currentLang;
}

function getLocaleTag(){
  const map = { id: 'id-ID', en: 'en-US', ms: 'ms-MY', jv: 'id-ID', su: 'id-ID' };
  return map[currentLang] || 'id-ID';
}

function applyLanguage(lang){

  if(!TRANSLATIONS[lang]) lang = 'id';

  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  const langSelect = document.getElementById('languageSelect');
  if(langSelect) langSelect.value = lang;

  document.documentElement.lang = lang;

  // Refresh dynamic content that embeds translated strings
  if(typeof renderTasks === 'function' && typeof tasks !== 'undefined'){
    renderTasks();
  }

  if(typeof updateNotificationStatusUI === 'function'){
    updateNotificationStatusUI();
  }

  const addBtn = document.getElementById('addTaskBtn');
  if(addBtn){
    addBtn.innerText = (typeof editingTaskId !== 'undefined' && editingTaskId)
      ? t('btnUpdate')
      : t('btnAdd');
  }

}
