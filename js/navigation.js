/* ============================================================
   navigation.js — Page routing & back-button behaviour
   ============================================================ */

/**
 * Navigate to a page with a slide-left animation.
 * @param {string} href - relative URL to navigate to
 */
function navigateTo(href) {
  var shell = document.querySelector('.shell');
  shell.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
  shell.style.transform = 'translateX(-100%)';
  shell.style.opacity = '0';
  setTimeout(function () { window.location.href = href; }, 300);
}

/**
 * Go back to the previous page.
 * Falls back to the home page if there is no history.
 */
function goBack() {
  if (document.referrer && document.referrer !== window.location.href) {
    window.history.back();
  } else {
    navigateTo('../menu.html');
  }
}

/* ── Wire up back buttons ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const backButtons = document.querySelectorAll('.btn-back');
  backButtons.forEach(btn => {
    btn.addEventListener('click', goBack);
  });
});
