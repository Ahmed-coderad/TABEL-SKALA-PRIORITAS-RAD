/* =========================================
   SW.JS
   Service worker minimal. Tujuannya hanya
   membantu menampilkan notifikasi selagi tab
   ada di background (bukan sinkronisasi push
   dari server — itu butuh backend terpisah).
   ========================================= */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {

      if(clientsArr.length){
        clientsArr[0].focus();
      }
      else{
        self.clients.openWindow('./');
      }

    })
  );

});
