/* ── Cart state ─────────────────────────────────────────── */
var cart = JSON.parse(localStorage.getItem('ev_cart') || '{}');

function goToCheckout() {
  if (getTotalItems(cart) === 0) return;
  localStorage.setItem('ev_order', JSON.stringify(cart));
  localStorage.setItem('ev_return_category', category);
  navigateTo('checkout.html');
}

function updateBottomBar(dish) {
  var total = getTotalItems(cart);
  var badge = document.getElementById('dietBadge');
  badge.className = 'diet-types ' + getDietType(dish).replace('-', '');
  badge.textContent = getDietLabel(dish);
  badge.style.visibility = 'visible';
  document.getElementById('checkoutItems').textContent = total + (total === 1 ? ' Item' : ' Items');
  document.getElementById('bottomBar').style.display = 'flex';
}

/* ── Restore bottom bar if cart already has items ────────── */
(function () {
  var entries = Object.values(cart);
  if (!entries.length) return;
  updateBottomBar(entries[entries.length - 1].dish);
})();

/* ── Read ?category= from URL ────────────────────────────── */
var params    = new URLSearchParams(window.location.search);
var category  = (params.get('category') || 'breakfast').toLowerCase();

/* ── Render tabs ─────────────────────────────────────────── */
var tabBar    = document.getElementById('tabBar');
var scrollArea = document.getElementById('scrollArea');
var activeTab = 0;
var menuData  = null;
var tabs      = [];

function renderTabs() {
  tabBar.innerHTML = '';
  tabs.forEach(function (label, i) {
    var btn = document.createElement('button');
    btn.className = 'tab-pill' + (i === activeTab ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', function () {
      activeTab = i;
      renderTabs();
      renderDishes();
    });
    tabBar.appendChild(btn);
  });
}

/* ── Build a single food-item row ────────────────────────── */
function buildFoodItem(dish) {
  var row = document.createElement('div');
  row.className = 'food-item';

  var dot = document.createElement('span');
  dot.className = 'diet-dot ' + getDietType(dish).replace('-', '');
  row.appendChild(dot);

  var nameGroup = document.createElement('div');
  nameGroup.className = 'dish-name-group';

  var nameEl = document.createElement('span');
  nameEl.className = 'dish-name' + (dish.available ? '' : ' unavailable');
  nameEl.textContent = dish.name;
  nameGroup.appendChild(nameEl);

  if (!dish.available) {
    var badge = document.createElement('span');
    badge.className = 'sold-out-badge';
    badge.textContent = 'Sold Out';
    nameGroup.appendChild(badge);
  }
  row.appendChild(nameGroup);

  var priceGroup = document.createElement('div');
  priceGroup.className = 'dish-price-group';

  var priceEl = document.createElement('span');
  priceEl.className = 'dish-price' + (dish.available ? '' : ' unavailable');
  priceEl.textContent = '₹ ' + dish.price;
  priceGroup.appendChild(priceEl);

  var stepperBtn = document.createElement('button');
  stepperBtn.className = 'icon-stepper';
  stepperBtn.title = 'Add';
  stepperBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="#C8F56A" stroke-width="1.5" stroke-linecap="round"/></svg>';
  stepperBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (cart[dish.id]) {
      cart[dish.id].quantity += 1;
    } else {
      cart[dish.id] = { dish: dish, quantity: 1 };
    }
    localStorage.setItem('ev_cart', JSON.stringify(cart));
    updateBottomBar(dish);
  });
  if (!dish.available) {
    stepperBtn.disabled = true;
    stepperBtn.style.opacity = '0.25';
    stepperBtn.style.pointerEvents = 'none';
  }
  priceGroup.appendChild(stepperBtn);

  var editBtn = document.createElement('button');
  editBtn.className = 'icon-edit';
  editBtn.title = 'Edit / View';
  editBtn.innerHTML = '<img src="../assets/Menu Icons/edit-icon.svg" width="16" height="16" alt="edit" />';
  editBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var p = new URLSearchParams({ id: dish.id, category: category });
    navigateTo('detail-view.html?' + p.toString());
  });
  if (!dish.available) {
    editBtn.disabled = true;
    editBtn.style.opacity = '0.25';
    editBtn.style.pointerEvents = 'none';
  }
  priceGroup.appendChild(editBtn);

  row.appendChild(priceGroup);
  return row;
}

/* ── Render dishes for the active sub-tab ────────────────── */
function renderDishes() {
  scrollArea.innerHTML = '';
  if (!menuData) return;

  var subTabLabel = tabs[activeTab];
  var dishes = (menuData[category] && menuData[category][subTabLabel]) || [];

  var subHeader = document.createElement('div');
  subHeader.className = 'sub-header';
  subHeader.innerHTML =
    '<span class="sub-header-label">' + subTabLabel.toUpperCase() + '</span>' +
    '<span class="sub-header-line"></span>';
  scrollArea.appendChild(subHeader);

  dishes.forEach(function (dish) { scrollArea.appendChild(buildFoodItem(dish)); });
}

/* ── Search ──────────────────────────────────────────────── */
var searchInput = document.querySelector('.search-input');

function handleSearch() {
  var q = searchInput.value;
  if (q.trim() === '') {
    tabBar.style.display = '';
    renderTabs();
    renderDishes();
    return;
  }
  tabBar.style.display = 'none';
  scrollArea.innerHTML = '';
  if (!menuData) return;

  var subTabLabel = tabs[activeTab];
  var dishes = (menuData[category] && menuData[category][subTabLabel]) || [];
  var ql = q.trim().toLowerCase();
  var matches = dishes.filter(function (dish) {
    return dish.name.toLowerCase().includes(ql) ||
           (dish.description && dish.description.toLowerCase().includes(ql));
  });

  if (matches.length) {
    var subHeader = document.createElement('div');
    subHeader.className = 'sub-header';
    subHeader.innerHTML =
      '<span class="sub-header-label">' + subTabLabel.toUpperCase() + '</span>' +
      '<span class="sub-header-line"></span>';
    scrollArea.appendChild(subHeader);
    matches.forEach(function (dish) { scrollArea.appendChild(buildFoodItem(dish)); });
  } else {
    var empty = document.createElement('div');
    empty.style.cssText = 'padding:32px 16px;text-align:center;color:var(--ev-white-dim);font-family:var(--font-sans);font-size:14px;';
    empty.textContent = 'No dishes found for "' + q.trim() + '"';
    scrollArea.appendChild(empty);
  }
}

searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('search', handleSearch);

/* ── Fetch menu data and render ──────────────────────────── */
fetch('../assets/evergreen_menu.json')
  .then(function (res) { return res.json(); })
  .then(function (data) {
    menuData = data;
    tabs = Object.keys(menuData[category] || {});
    activeTab = 0;
    renderTabs();
    renderDishes();
  })
  .catch(function (err) { console.error('Failed to load evergreen_menu.json', err); });
