/* =========================================
   NOTIFICATIONS.JS
   Pengiriman notifikasi via Email (EmailJS)
   dan ringkasan via WhatsApp.
   ========================================= */

function sendEmail(task, analysis){

  emailjs.send(
    CONFIG.EMAILJS_SERVICE_ID,
    CONFIG.EMAILJS_TEMPLATE_ID,
    {
      task_name: task.name,
      task_desc: task.desc,
      task_type: task.type,
      to_email: CONFIG.NOTIFY_EMAIL,

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

function sendWhatsAppSummary(){

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

  const wa =
    `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(wa, '_blank');

}
