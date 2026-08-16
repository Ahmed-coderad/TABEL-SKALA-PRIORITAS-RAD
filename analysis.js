/* =========================================
   ANALYSIS.JS
   Menghasilkan ringkasan & rekomendasi
   berdasarkan distribusi tugas di 4 kuadran.
   ========================================= */

function generateAnalysis(){

  const q1 = tasks.filter(t => t.type === 'q1').length;
  const q2 = tasks.filter(t => t.type === 'q2').length;
  const q3 = tasks.filter(t => t.type === 'q3').length;
  const q4 = tasks.filter(t => t.type === 'q4').length;

  const total = tasks.length;

  let dominant = '';
  let recommendation = '';

  const max = Math.max(q1, q2, q3, q4);

  if(max === q1){

    dominant = 'Kuadran 1 (Penting & Mendesak)';

    recommendation =
      'Kurangi aktivitas mendesak dengan membuat perencanaan lebih awal.';

  }
  else if(max === q2){

    dominant = 'Kuadran 2 (Penting Tidak Mendesak)';

    recommendation =
      'Sangat baik. Fokus pengembangan diri dan perencanaan jangka panjang sudah optimal.';

  }
  else if(max === q3){

    dominant = 'Kuadran 3 (Tidak Penting Tapi Mendesak)';

    recommendation =
      'Kurangi distraksi dan aktivitas yang mengganggu fokus utama.';

  }
  else{

    dominant = 'Kuadran 4 (Tidak Penting & Tidak Mendesak)';

    recommendation =
      'Mulailah meningkatkan aktivitas produktif dan mengurangi kegiatan tidak penting.';

  }

  return `

Total Aktivitas: ${total}

Aktivitas Dominan:
${dominant}

Detail:
Q1 (Penting dan Mendesak)                : ${q1}
Q2 (Penting tapi Tidak Mendesak)        : ${q2}
Q3 (Tidak Penting tapi Mendesak)        : ${q3}
Q4 (Tidak Penting dan Tidak Mendesak)    : ${q4}

Rekomendasi:
${recommendation}

Sistem RAD berhasil menganalisis pola prioritas.
`;

}
