/* =========================================
   PDF-EXPORT.JS
   Membuat laporan PDF (jsPDF + AutoTable)
   dan penjadwalan auto-export harian.
   ========================================= */

async function exportPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const BLUE = CONFIG.PDF_BRAND_COLOR;
  const YELLOW = CONFIG.PDF_ACCENT_COLOR;

  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 25; // ruang cadangan untuk footer di tiap halaman

  // HEADER
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text("LAPORAN DATA", 14, 14);
  doc.setFontSize(10);

  const plannerName =
    document.getElementById("plannerName").value || "Tanpa Nama";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(
    plannerName,
    14,
    23
  );

  // Garis aksen
  doc.setDrawColor(...YELLOW);

  doc.setLineWidth(1.5);

  doc.line(10, 32, 200, 32);

  // Informasi
  doc.setTextColor(...BLUE);

  doc.setFontSize(11);

  let periode = "-";

  if(selectedTimeType === "daily"){

    periode =
      document.getElementById("dailyInput")?.value || "-";

  }
  else if(selectedTimeType === "monthly"){

    periode =
      document.getElementById("monthlyInput")?.value || "-";

  }
  else{

    periode =
      document.getElementById("yearlyInput")?.value || "-";

  }

  const nomorSurat =
    `027/PP-RAD/V/${new Date().getFullYear()}`;

  doc.text(
    `Nomor Surat : ${nomorSurat}`,
    14,
    42
  );

  doc.text(
    `Tanggal Cetak : ${new Date().toLocaleDateString('id-ID')}`,
    14,
    50
  );

  doc.text(
    `Periode Planner : ${periode}`,
    14,
    58
  );

  doc.text(
    "Pembuat : Rizky Ahmed Darmawan",
    130,
    50
  );

  const importantCount =
    tasks.filter(t =>
      t.type === 'q1' ||
      t.type === 'q2'
    ).length;

  const urgentCount =
    tasks.filter(t =>
      t.type === 'q1' ||
      t.type === 'q3'
    ).length;

  const completedCount =
    tasks.filter(t => t.completed).length;

  // Ringkasan statistik ditampilkan horizontal dalam satu baris
  doc.autoTable({

    startY: 64,

    head: [[
      "Total Aktivitas",
      "Aktivitas Penting",
      "Aktivitas Mendesak",
      "Aktivitas Selesai"
    ]],

    body: [[
      String(tasks.length),
      String(importantCount),
      String(urgentCount),
      String(completedCount)
    ]],

    theme: 'grid',

    styles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 9,
      cellPadding: 5
    },

    headStyles: {
      fillColor: BLUE,
      textColor: [255, 255, 255],
      fontSize: 8.5
    },

    bodyStyles: {
      fontSize: 13,
      fontStyle: 'bold',
      textColor: BLUE
    },

    margin: { top: 20, left: 14, right: 14, bottom: bottomMargin }

  });

  const statsFinalY = doc.lastAutoTable.finalY;

  // Data tabel
  const sortedTasks = [...tasks].sort((a, b) => {

    const order = {
      q1: 1,
      q2: 2,
      q3: 3,
      q4: 4
    };

    return order[a.type] - order[b.type];

  });

  const data = sortedTasks.map((task, index) => [
    index + 1,
    task.name,
    task.desc || "-",
    formatTime(task),
    task.type.toUpperCase(),
    task.completed
      ? "Selesai"
      : "Belum"
  ]);

  doc.autoTable({

    startY: statsFinalY + 10,

    head: [[
      "No",
      "Aktivitas",
      "Deskripsi",
      "Waktu",
      "Kuadran",
      "Status"
    ]],

    body: data,

    theme: 'grid',

    headStyles: {
      fillColor: BLUE,
      textColor: [255, 255, 255],
      halign: 'center'
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak'
    },

    margin: { top: 20, left: 10, right: 10, bottom: bottomMargin },

    tableWidth: 'auto',

    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 55 },
      3: { cellWidth: 28 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 }
    },

    didParseCell: function(data){

      if(data.column.index === 5){

        const status = data.cell.raw;

        // STATUS BELUM
        if(status === "Belum"){

          data.cell.styles.textColor = [252, 193, 2];
          data.cell.styles.fontStyle = 'bold';

        }
        // STATUS SELESAI
        else if(status === "Selesai"){

          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = 'bold';

        }

      }

    }

  });

  let finalY = doc.lastAutoTable.finalY + 15;

  if(finalY > pageHeight - bottomMargin){
    doc.addPage();
    finalY = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.setTextColor(...BLUE);

  doc.text(
    "Analisis Prioritas",
    14,
    finalY
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);

  doc.setFontSize(10);

  const analysis = generateAnalysis();

  const analysisLines =
    doc.splitTextToSize(
      analysis,
      180
    );

  const lineHeight = 5;
  let analysisY = finalY + 10;

  analysisLines.forEach(line => {

    // pindah halaman otomatis jika baris berikutnya
    // akan melewati batas bawah halaman
    if(analysisY > pageHeight - bottomMargin){
      doc.addPage();
      analysisY = 20;
    }

    doc.text(line, 14, analysisY);
    analysisY += lineHeight;

  });

  // Nomor halaman & footer di setiap halaman
  const totalPages =
    doc.internal.getNumberOfPages();

  for(let i = 1; i <= totalPages; i++){

    doc.setPage(i);

    doc.setDrawColor(...YELLOW);
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 16, 200, pageHeight - 16);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.setFontSize(9);

    doc.text(
      "Dokumen dibuat otomatis oleh sistem RAD",
      14,
      pageHeight - 10
    );

    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      200,
      pageHeight - 10,
      { align: 'right' }
    );

  }

  doc.save("Laporan.pdf");

}

function scheduleAutoExportPDF(){

  const now = new Date();

  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  const msUntilMidnight =
    nextMidnight - now;

  setTimeout(() => {

    if(tasks.length > 0){
      exportPDF();
    }

    // ulangi setiap 24 jam setelah tengah malam pertama
    setInterval(() => {

      if(tasks.length > 0){
        exportPDF();
      }

    }, 24 * 60 * 60 * 1000);

  }, msUntilMidnight);

}
