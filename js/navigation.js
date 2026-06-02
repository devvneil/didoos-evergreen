/* ============================================================
   navigation.js — Page routing & back-button behaviour
   ============================================================ */

/**
 * Navigate to a page with a smooth transition.
 * @param {string} href - relative URL to navigate to
 */
function navigateTo(href) {
  window.location.href = href;
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
