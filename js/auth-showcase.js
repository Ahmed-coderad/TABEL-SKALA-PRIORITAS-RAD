/* =========================================
   AUTH-SHOWCASE.JS
   Mengatur animasi bergilir pada panel showcase
   di layar "Masuk ke Akun": memperkenalkan fungsi
   utama aplikasi secara visual (dengan ikon, judul
   singkat, dan deskripsi) sebelum pengguna login,
   sehingga pengguna baru dari berbagai kalangan bisa
   langsung paham kegunaan aplikasi ini.
   ========================================= */

function initAuthShowcase(){

  const carousel = document.getElementById('authFeatureCarousel');
  if(!carousel){
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.auth-feature'));
  const dots = Array.from(document.querySelectorAll('#authFeatureDots .auth-dot'));

  if(slides.length === 0){
    return;
  }

  const AUTO_DELAY_MS = 4200;

  let activeIndex = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
  let timerId = null;

  function goTo(index){

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === activeIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
    });

  }

  function restartAutoplay(){

    if(timerId){
      clearInterval(timerId);
    }

    timerId = setInterval(() => {
      goTo(activeIndex + 1);
    }, AUTO_DELAY_MS);

  }

  dots.forEach(dot => {

    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.goto, 10));
      restartAutoplay();
    });

  });

  goTo(activeIndex);
  restartAutoplay();

}

// Skrip dimuat setelah markup layar autentikasi ada di DOM,
// jadi bisa langsung dijalankan tanpa menunggu DOMContentLoaded.
initAuthShowcase();
