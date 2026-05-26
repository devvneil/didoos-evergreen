/* ============================================================
   menu.js — Menu page interactivity
   Dietary indicator highlight on item selection
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const menuItems  = document.querySelectorAll('.menu-item');
  const badgeVeg   = document.getElementById('badgeVeg');
  const badgeNonVeg = document.getElementById('badgeNonVeg');

  /**
   * Highlight the dietary badge that matches the clicked item type.
   * @param {'veg'|'nonveg'} type
   */
  function highlightBadge(type) {
    if (type === 'veg') {
      badgeVeg.classList.add('active');
      badgeNonVeg.classList.remove('active');
    } else {
      badgeNonVeg.classList.add('active');
      badgeVeg.classList.remove('active');
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

  /* ── Attach listeners ──────────────────────────────────── */
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      selectItem(item);
      highlightBadge(item.dataset.type);
    });
  });
});
