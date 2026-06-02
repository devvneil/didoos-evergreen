/* ============================================================
   menu.js — Menu page interactivity
   Dietary indicator · Checkout counter · Item selection
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const menuItems     = document.querySelectorAll('.menu-item');
  const dietIndicator = document.getElementById('dietIndicator');
  const dietLabel     = document.getElementById('dietLabel');
  const checkoutCount = document.getElementById('checkoutCount');

  let cartTotal = 0;

  /**
   * Toggle the dietary indicator to match the selected item type.
   * @param {'veg'|'nonveg'} type
   */
  function updateDietIndicator(type) {
    if (type === 'veg') {
      dietIndicator.classList.remove('nonveg');
      dietLabel.textContent = 'Veg';
    } else {
      dietIndicator.classList.add('nonveg');
      dietLabel.textContent = 'Non-Veg';
    }
  }

  /**
   * Mark an item as selected, clearing any previous selection.
   * @param {HTMLElement} item
   */
  function selectItem(item) {
    menuItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
  }

  /* ── Attach item-row listeners ─────────────────────────── */
  menuItems.forEach(item => {
    item.addEventListener('click', e => {
      /* Prevent row-click when tapping the icon buttons */
      if (e.target.closest('.icon-btn')) return;
      selectItem(item);
      updateDietIndicator(item.dataset.type);
    });
  });

  /* ── Add-to-cart (stepper) buttons ─────────────────────── */
  document.querySelectorAll('.icon-btn[aria-label^="Add"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      cartTotal += 1;
      if (checkoutCount) checkoutCount.textContent = cartTotal;
    });
  });
});
