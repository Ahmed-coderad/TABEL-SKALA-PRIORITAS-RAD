/* =========================================
   CALENDAR-SYNC.JS
   "Sinkron ke kalender perangkat" via file
   .ics standar (dibaca semua aplikasi kalender:
   Google Calendar, Apple Calendar, Outlook,
   dll) plus tautan cepat Google Calendar.

   Tanggal/bulan/tahun task SELALU mengikuti
   jam & tanggal perangkat pengguna secara
   otomatis, karena input tanggal (flatpickr,
   <input type="month">, dst) dan alarm
   pengingat dibangun dari objek Date bawaan
   browser — bukan dari server manapun.

   BATASAN JUJUR: situs statis tidak bisa
   menulis langsung ke Google/Apple Calendar
   tanpa login OAuth + server backend. Ekspor
   .ics adalah cara standar & aman yang bisa
   dilakukan murni dari browser.
   ========================================= */

function pad2(n){ return String(n).padStart(2, "0"); }

function taskToDateRange(task){

  let start;

  if(task.reminderAt){
    start = new Date(task.reminderAt);
  }
  else if(task.timeType === 'daily'){
    start = new Date(`${task.timeValue}T09:00:00`);
  }
  else if(task.timeType === 'monthly'){
    start = new Date(`${task.timeValue}-01T09:00:00`);
  }
  else{
    start = new Date(`${task.timeValue}-01-01T09:00:00`);
  }

  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return { start, end };

}

function toICSDate(date){
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}` +
         `T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;
}

function escapeICS(text){
  return String(text || '').replace(/\n/g, '\\n').replace(/,/g, '\\,');
}

function taskToICSEvent(task){

  const { start, end } = taskToDateRange(task);

  return [
    'BEGIN:VEVENT',
    `UID:${task.id}@rad-priority-planner`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(task.name)}`,
    `DESCRIPTION:${escapeICS(task.desc)}`,
    'END:VEVENT'
  ].join('\r\n');

}

function downloadICS(filename, events){

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RAD Priority Planner//ID',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);

}

function exportTaskToCalendar(taskId){

  const task = tasks.find(tk => tk.id === taskId);
  if(!task) return;

  downloadICS(`${task.name}.ics`, [taskToICSEvent(task)]);

  showToast(t('msgCalendarExported'));

}

function exportAllToCalendar(){

  if(tasks.length === 0){
    showToast(t('errNoTasks'), 'error');
    return;
  }

  const events = tasks.map(taskToICSEvent);

  downloadICS('priority-planner-jadwal.ics', events);

  showToast(t('msgCalendarExportedAll'));

}
