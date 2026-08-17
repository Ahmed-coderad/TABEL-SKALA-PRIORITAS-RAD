/* =========================================
   PDF-EXPORT.JS
   Membuat laporan PDF resmi (jsPDF + AutoTable)
   dengan nomor dokumen formal otomatis, palet
   warna identitas RAD, layout yang menyesuaikan
   data, dan penjadwalan auto-export harian.
   ========================================= */

const PDF_LAYOUT = {
  MARGIN: 14,
  BOTTOM_MARGIN: 25,
  CONTENT_TOP_AFTER_BREAK: 26 // ruang di bawah header tipis pada halaman lanjutan
};

/**
 * Menghasilkan nomor dokumen formal yang bertambah otomatis
 * setiap kali PDF diekspor, mengikuti kaidah penomoran surat
 * resmi Indonesia: Nomor Urut / Kode / Bulan Romawi / Tahun.
 * Penghitung disimpan per tahun sehingga otomatis kembali ke
 * 001 setiap pergantian tahun.
 */
function getNextDocumentNumber(){

  const ROMAN_MONTHS = [
    "I","II","III","IV","V","VI",
    "VII","VIII","IX","X","XI","XII"
  ];

  const now = new Date();
  const year = now.getFullYear();
  const romanMonth = ROMAN_MONTHS[now.getMonth()];

  const seqKey = `pdfDocSeq_${year}`;

  let seq = parseInt(localStorage.getItem(seqKey) || "0", 10);
  if(isNaN(seq)){
    seq = 0;
  }
  seq += 1;

  try{
    localStorage.setItem(seqKey, String(seq));
  }
  catch(e){
    // localStorage tidak tersedia; lanjutkan tanpa persistensi penomoran
  }

  const seqPadded = String(seq).padStart(3, "0");

  return `${seqPadded}/PP-RAD/${romanMonth}/${year}`;

}

/**
 * Mengatur tampilan tombol "Export PDF" selama proses
 * pembuatan dokumen berlangsung: menonaktifkan tombol,
 * menampilkan spinner, dan mengganti label sementara.
 */
function setExportButtonLoading(isLoading){

  const btn = document.getElementById("exportPdfBtn");
  if(!btn){
    return;
  }

  const label = btn.querySelector(".btn-label");

  if(isLoading){

    btn.dataset.originalLabel =
      btn.dataset.originalLabel || (label ? label.textContent : "");

    btn.disabled = true;
    btn.classList.add("is-exporting");
    btn.setAttribute("aria-busy", "true");

    if(label){
      label.textContent = t("btnExportingPdf");
    }

  }
  else{

    btn.disabled = false;
    btn.classList.remove("is-exporting");
    btn.removeAttribute("aria-busy");

    if(label){
      label.textContent = t("btnExportPdf");
    }

  }

}

/**
 * Menggambar bilah header tipis dan footer beraksen kuning
 * pada sebuah halaman tertentu, dipakai untuk menjaga
 * konsistensi tampilan pada setiap halaman lanjutan agar
 * dokumen tetap terlihat rapi dan formal.
 */
function drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW){

  const margin = PDF_LAYOUT.MARGIN;

  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageWidth, 14, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("LAPORAN PRIORITAS AKTIVITAS", margin, 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`No. ${docNumber}`, pageWidth - margin, 9, { align: 'right' });

}

function drawFooter(doc, pageWidth, pageHeight, pageIndex, totalPages, YELLOW){

  const margin = PDF_LAYOUT.MARGIN;

  doc.setDrawColor(...YELLOW);
  doc.setLineWidth(0.5);
  doc.line(margin - 4, pageHeight - 16, pageWidth - margin + 4, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.setFontSize(8.5);

  doc.text(
    "Dokumen dibuat otomatis oleh Sistem RAD Priority Planner dan sah tanpa tanda tangan basah.",
    margin,
    pageHeight - 10
  );

  doc.text(
    `Halaman ${pageIndex} dari ${totalPages}`,
    pageWidth - margin,
    pageHeight - 10,
    { align: 'right' }
  );

}

async function exportPDF(){

  if(!Array.isArray(tasks)){
    return;
  }

  setExportButtonLoading(true);

  try{

    const { jsPDF } = window.jspdf;

    const margin = PDF_LAYOUT.MARGIN;
    const bottomMargin = PDF_LAYOUT.BOTTOM_MARGIN;

    // Layout menyesuaikan otomatis: jika ada deskripsi aktivitas
    // yang panjang, dokumen dicetak dalam orientasi landscape
    // agar tabel tetap rapi dan tidak terlalu sempit.
    const hasLongDescriptions =
      tasks.some(t => (t.desc || "").length > 70) || tasks.length > 14;

    const orientation = hasLongDescriptions ? 'landscape' : 'portrait';

    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const BLUE = CONFIG.PDF_BRAND_COLOR;
    const YELLOW = CONFIG.PDF_ACCENT_COLOR;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    const docNumber = getNextDocumentNumber();

    const plannerName =
      (document.getElementById("plannerName").value || "").trim() || "Tanpa Nama";

    // ===== HEADER RESMI (halaman pertama) =====
    // Tinggi bilah header menyesuaikan otomatis jika nama
    // planner cukup panjang sehingga perlu lebih dari satu baris.
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    const plannerNameLines = doc.splitTextToSize(plannerName, contentWidth - 10);
    const bannerHeight = 26 + Math.max(0, plannerNameLines.length - 1) * 6;

    doc.setFillColor(...BLUE);
    doc.rect(0, 0, pageWidth, bannerHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LAPORAN PRIORITAS AKTIVITAS", margin, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`No. ${docNumber}`, pageWidth - margin, 13, { align: 'right' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    plannerNameLines.forEach((line, i) => {
      doc.text(line, margin, 21 + (i * 6));
    });

    // Garis aksen kuning sebagai pemisah header
    let cursorY = bannerHeight + 6;

    doc.setDrawColor(...YELLOW);
    doc.setLineWidth(1.5);
    doc.line(margin - 4, cursorY, pageWidth - margin + 4, cursorY);
    cursorY += 8;

    // ===== INFORMASI DOKUMEN =====
    let periode = "-";

    if(selectedTimeType === "daily"){
      periode = document.getElementById("dailyInput")?.value || "-";
    }
    else if(selectedTimeType === "monthly"){
      periode = document.getElementById("monthlyInput")?.value || "-";
    }
    else{
      periode = document.getElementById("yearlyInput")?.value || "-";
    }

    const currentUser =
      (typeof getCurrentUser === "function") ? getCurrentUser() : null;

    const preparedBy = currentUser?.username || "Sistem RAD";

    const rightColX = margin + (contentWidth / 2) + 6;

    doc.setTextColor(...BLUE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);

    doc.text(`Nomor Dokumen : ${docNumber}`, margin, cursorY);
    doc.text(`Dibuat oleh : ${preparedBy}`, rightColX, cursorY);
    cursorY += 7;

    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    doc.text(`Tanggal Cetak : ${tanggalCetak}`, margin, cursorY);
    doc.text(`Periode Planner : ${periode}`, rightColX, cursorY);
    cursorY += 10;

    // ===== RINGKASAN STATISTIK =====
    const importantCount =
      tasks.filter(t => t.type === 'q1' || t.type === 'q2').length;

    const urgentCount =
      tasks.filter(t => t.type === 'q1' || t.type === 'q3').length;

    const completedCount =
      tasks.filter(t => t.completed).length;

    doc.autoTable({

      startY: cursorY,

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
        cellPadding: 5,
        lineColor: [225, 231, 237],
        lineWidth: 0.2
      },

      headStyles: {
        fillColor: BLUE,
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold'
      },

      bodyStyles: {
        fontSize: 13,
        fontStyle: 'bold',
        textColor: BLUE
      },

      margin: {
        top: PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK,
        left: margin,
        right: margin,
        bottom: bottomMargin
      },

      didDrawPage: (data) => {
        if(data.pageNumber > 1){
          drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
        }
      }

    });

    let nextY = doc.lastAutoTable.finalY + 10;

    // Jika ruang tersisa di halaman terlalu sempit untuk memulai
    // tabel aktivitas dengan layak, pindah ke halaman baru terlebih
    // dahulu agar tidak ada baris yang terpotong tanggung.
    if(nextY > pageHeight - bottomMargin - 30){
      doc.addPage();
      drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
      nextY = PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK;
    }

    // ===== TABEL DATA AKTIVITAS =====
    const quadrantOrder = { q1: 1, q2: 2, q3: 3, q4: 4 };

    const sortedTasks = [...tasks].sort(
      (a, b) => quadrantOrder[a.type] - quadrantOrder[b.type]
    );

    const tableData = sortedTasks.length > 0
      ? sortedTasks.map((task, index) => [
          index + 1,
          task.name,
          task.desc || "-",
          formatTime(task),
          task.type.toUpperCase(),
          task.completed ? "Selesai" : "Belum"
        ])
      : [["-", "Belum ada aktivitas yang ditambahkan", "-", "-", "-", "-"]];

    // Lebar kolom "Aktivitas" dan "Deskripsi" dibiarkan menyesuaikan
    // secara otomatis mengikuti panjang konten yang sesungguhnya,
    // sementara kolom berisi data pendek & seragam diberi lebar tetap
    // agar tabel tetap presisi dan mudah dibaca.
    doc.autoTable({

      startY: nextY,

      head: [[
        "No",
        "Aktivitas",
        "Deskripsi",
        "Waktu",
        "Kuadran",
        "Status"
      ]],

      body: tableData,

      theme: 'grid',

      headStyles: {
        fillColor: BLUE,
        textColor: [255, 255, 255],
        halign: 'center',
        fontStyle: 'bold'
      },

      alternateRowStyles: {
        fillColor: [245, 248, 251]
      },

      styles: {
        fontSize: 8.5,
        cellPadding: 3.2,
        overflow: 'linebreak',
        lineColor: [225, 231, 237],
        lineWidth: 0.2,
        valign: 'middle'
      },

      margin: {
        top: PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK,
        left: margin,
        right: margin,
        bottom: bottomMargin
      },

      tableWidth: 'auto',

      columnStyles: {
        0: { cellWidth: 9, halign: 'center' },
        3: { cellWidth: 26, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' }
      },

      didParseCell: function(data){

        if(data.section !== 'body'){
          return;
        }

        if(data.column.index === 5){

          const status = data.cell.raw;

          if(status === "Belum"){
            data.cell.styles.textColor = [178, 130, 0];
            data.cell.styles.fontStyle = 'bold';
          }
          else if(status === "Selesai"){
            data.cell.styles.textColor = [22, 150, 78];
            data.cell.styles.fontStyle = 'bold';
          }

        }

        if(data.column.index === 4 && data.cell.raw !== "-"){
          data.cell.styles.fontStyle = 'bold';
        }

      },

      didDrawPage: (data) => {
        if(data.pageNumber > 1){
          drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
        }
      }

    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // Analisis butuh setidaknya ruang untuk judul + beberapa baris;
    // jika tidak cukup, mulai di halaman baru agar tidak terpotong.
    const analysis = generateAnalysis();
    const analysisLines = doc.splitTextToSize(analysis, contentWidth);
    const lineHeight = 5;
    const minSpaceNeeded = 10 + (Math.min(analysisLines.length, 4) * lineHeight);

    if(finalY + minSpaceNeeded > pageHeight - bottomMargin){
      doc.addPage();
      drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
      finalY = PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BLUE);
    doc.text("Analisis Prioritas", margin, finalY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40);
    doc.setFontSize(10);

    let analysisY = finalY + 10;

    analysisLines.forEach(line => {

      // Pindah halaman otomatis jika baris berikutnya akan
      // melewati batas bawah halaman, sehingga tidak ada teks
      // analisis yang terpotong di antara dua halaman.
      if(analysisY > pageHeight - bottomMargin){
        doc.addPage();
        drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
        analysisY = PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK;
      }

      doc.text(line, margin, analysisY);
      analysisY += lineHeight;

    });

    // ===== BLOK VALIDASI DOKUMEN =====
    // Blok ini menyatu dengan analisis dan hanya dipindah ke
    // halaman baru jika tidak cukup ruang, sehingga tidak
    // terpotong di tengah blok tanda tangan.
    const validationBlockHeight = 34;

    if(analysisY + validationBlockHeight > pageHeight - bottomMargin){
      doc.addPage();
      drawContinuationHeader(doc, pageWidth, docNumber, BLUE, YELLOW);
      analysisY = PDF_LAYOUT.CONTENT_TOP_AFTER_BREAK;
    }
    else{
      analysisY += 10;
    }

    const signX = pageWidth - margin - 60;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60);

    doc.text(tanggalCetak, signX, analysisY, { align: 'left' });
    doc.text("Dibuat oleh,", signX, analysisY + 6);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text(preparedBy, signX, analysisY + 24);

    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(signX, analysisY + 25, signX + 55, analysisY + 25);

    // ===== FOOTER & NOMOR HALAMAN DI SETIAP HALAMAN =====
    const totalPages = doc.internal.getNumberOfPages();

    for(let i = 1; i <= totalPages; i++){
      doc.setPage(i);
      drawFooter(doc, pageWidth, pageHeight, i, totalPages, YELLOW);
    }

    const safeFileName =
      plannerName.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "Planner";

    doc.save(`Laporan_${safeFileName}_${docNumber.replace(/\//g, "-")}.pdf`);

    showToast(t("msgPdfSuccess"));

  }
  catch(err){

    console.error("Gagal membuat PDF:", err);
    showToast(t("errPdfFailed"), "error");

  }
  finally{

    setExportButtonLoading(false);

  }

}

function scheduleAutoExportPDF(){

  const now = new Date();

  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  const msUntilMidnight = nextMidnight - now;

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
