var cart = JSON.parse(localStorage.getItem('ev_order') || '{}');
var orderList = document.getElementById('orderList');

function clearCartAndGoBack() {
  var order = localStorage.getItem('ev_order');
  if (order) localStorage.setItem('ev_cart', order);
  else localStorage.removeItem('ev_cart');
  var cat = localStorage.getItem('ev_return_category') || 'breakfast';
  localStorage.removeItem('ev_return_category');
  navigateBack('main-indian.html?category=' + cat);
}

function placeOrder() {
  localStorage.removeItem('ev_cart');
  localStorage.removeItem('ev_order');
  localStorage.removeItem('ev_return_category');
  navigateTo('order-confirm.html');
}

function buildItem(entry) {
  var dish = entry.dish;
  var qty  = entry.quantity;

  var row = document.createElement('div');
  row.className = 'list-item';
  row.dataset.id = dish.id;
  row.innerHTML =
    '<div class="item-elements">' +
      '<div class="card-left">' +
        '<span class="co-dietary-indicator"><span class="diet-indic ' + getDietType(dish).replace('-', '') + '"></span></span>' +
        '<div class="dish-name-col"><span class="co-dish-name">' + dish.name + '</span></div>' +
      '</div>' +
      '<div class="unit">' +
        '<div class="co-stepper">' +
          '<button class="co-stepper-btn" aria-label="Reduce">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<span class="co-stepper-units">' + qty + '</span>' +
          '<button class="co-stepper-btn" aria-label="Add">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<button class="co-delete-btn" aria-label="Remove item">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2.5A.5.5 0 0 1 5.5 2h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l.8 9.2a.5.5 0 0 0 .5.8h7.4a.5.5 0 0 0 .5-.8L13 4" stroke="#FFFFFFA6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  return row;
}

var placeBtn = document.querySelector('.co-place-order-btn');

function updateEmptyState() {
  var isEmpty = Object.keys(cart).length === 0;
  if (isEmpty) {
    orderList.innerHTML =
      '<div class="co-empty-state">' +
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="24" cy="24" r="23" stroke="#C8F56A26" stroke-width="1.5"/>' +
          '<path d="M14 16h2.5l2.8 12h13.4l2.3-9H19" stroke="#C8F56A61" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="22" cy="33" r="1.5" fill="#C8F56A61"/>' +
          '<circle cx="31" cy="33" r="1.5" fill="#C8F56A61"/>' +
        '</svg>' +
        '<span class="co-empty-label">Your cart is empty</span>' +
        '<span class="co-empty-sub">Go back and add some dishes</span>' +
      '</div>';
    placeBtn.disabled = true;
    placeBtn.style.opacity = '0.35';
    placeBtn.style.pointerEvents = 'none';
  } else {
    placeBtn.disabled = false;
    placeBtn.style.opacity = '';
    placeBtn.style.pointerEvents = '';
  }
}

function renderCart() {
  orderList.innerHTML = '';
  Object.values(cart).forEach(function (entry) { orderList.appendChild(buildItem(entry)); });
  updateEmptyState();
}

renderCart();

orderList.addEventListener('click', function (e) {
  var item = e.target.closest('.list-item');
  if (!item) return;
  var id = item.dataset.id;

  if (e.target.closest('.co-delete-btn')) {
    delete cart[id];
    localStorage.setItem('ev_order', JSON.stringify(cart));
    item.remove();
    updateEmptyState();
    return;
  }

  var unitsEl = item.querySelector('.co-stepper-units');
  var qty = parseInt(unitsEl.textContent, 10);

  if (e.target.closest('.co-stepper-btn[aria-label="Reduce"]')) {
    if (qty > 1) { cart[id].quantity = qty - 1; unitsEl.textContent = qty - 1; }
    else { delete cart[id]; item.remove(); updateEmptyState(); }
    localStorage.setItem('ev_order', JSON.stringify(cart));
    return;
  }

  if (e.target.closest('.co-stepper-btn[aria-label="Add"]')) {
    cart[id].quantity = qty + 1;
    unitsEl.textContent = qty + 1;
    localStorage.setItem('ev_order', JSON.stringify(cart));
  }
});
