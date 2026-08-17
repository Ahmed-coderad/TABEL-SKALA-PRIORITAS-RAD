/* =========================================
   NOTIFICATIONS.JS
   Pengiriman notifikasi via Email (EmailJS)
   dan ringkasan via WhatsApp.
   ========================================= */

// toEmail: alamat tujuan. Jika tidak diisi, memakai CONFIG.NOTIFY_EMAIL
// (dipakai oleh notifikasi otomatis saat menambah aktivitas).
function sendEmail(task, analysis, toEmail){

  emailjs.send(
    CONFIG.EMAILJS_SERVICE_ID,
    CONFIG.EMAILJS_TEMPLATE_ID,
    {
      task_name: task.name,
      task_desc: task.desc,
      task_type: task.type,
      to_email: toEmail || CONFIG.NOTIFY_EMAIL,

      planner_name:
        document.getElementById("plannerName").value,

      analysis: analysis
    }
  )
  .then(() => {
    console.log("Email berhasil dikirim");
  })
  .catch((error) => {
    console.log("Email gagal:", error);
  });

}

// whatsappNumber: nomor tujuan (format internasional tanpa "+").
// Jika tidak diisi, memakai CONFIG.WHATSAPP_NUMBER.
function sendWhatsAppSummary(whatsappNumber){

  const plannerName =
    document.getElementById("plannerName").value ||
    "PRIORITY PLANNER";

  let message = `📌 ${plannerName}\n\n`;

  message += `Total Aktivitas: ${tasks.length}\n\n`;

  tasks.slice(0, 20).forEach((task, index) => {

    message +=
`${index + 1}. ${task.name}
📅 ${formatTime(task)}
📂 ${task.type}

`;

  });

  const analysis = generateAnalysis();

  message += `\n${analysis}`;

  const number = whatsappNumber || CONFIG.WHATSAPP_NUMBER;

  const wa =
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(wa, '_blank');

}
