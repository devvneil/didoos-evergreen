var params   = new URLSearchParams(window.location.search);
var dishId   = params.get('id');
var category = params.get('category') || 'mains';
var viewer   = document.getElementById('detailViewer');
var loading  = document.getElementById('mediaLoading');

viewer.addEventListener('load',  function () { loading.style.display = 'none'; });
viewer.addEventListener('error', function () { loading.style.display = 'none'; });

fetch('../assets/evergreen_menu.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var dish = null;
    Object.values(data[category] || {}).forEach(function (items) {
      items.forEach(function (item) { if (item.id === dishId) dish = item; });
    });
    if (!dish) return;

    var nameEl = document.getElementById('detailName');
    nameEl.textContent = dish.name;
    if (dish.name.split(' ').length > 11) nameEl.style.fontSize = '15px';
    document.getElementById('detailDescription').textContent = dish.description;
    document.getElementById('detailPrice').textContent       = '₹ ' + dish.price;

    var badge = document.getElementById('detailDietBadge');
    badge.className   = 'detail-diet-badge ' + getDietType(dish).replace('-', '');
    badge.textContent = getDietLabel(dish);

    var noSpice = ['desserts', 'drinks'];
    if (noSpice.indexOf(category) !== -1) {
      document.getElementById('spiceModes').closest('.pref-section').style.visibility = 'hidden';
    }

    var spiceMap = { mild: 'mild', medium: 'medium', hot: 'spicy', spicy: 'spicy' };
    var defaultSpice = spiceMap[(dish.spice_level || '').toLowerCase()] || 'medium';
    document.querySelectorAll('.pref-pill[data-spice]').forEach(function (btn) {
      if (btn.dataset.spice === defaultSpice) btn.classList.add('selected');
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pref-pill[data-spice]').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
    });

    document.querySelectorAll('.pref-pill[data-diet]').forEach(function (btn) {
      btn.addEventListener('click', function () { btn.classList.toggle('selected'); });
    });

    var saved = JSON.parse(localStorage.getItem('ev_cart') || '{}');
    var qty = (saved[dish.id] && saved[dish.id].quantity) || 1;
    var unitsEl = document.getElementById('stepperUnits');
    unitsEl.textContent = qty;

    document.getElementById('stepperAdd').addEventListener('click', function (e) {
      e.stopPropagation();
      qty += 1;
      unitsEl.textContent = qty;
    });
    document.getElementById('stepperReduce').addEventListener('click', function (e) {
      e.stopPropagation();
      if (qty > 1) { qty -= 1; unitsEl.textContent = qty; }
    });

    var returnUrl = 'main-indian.html?category=' + category;

    document.getElementById('detailBackBtn').addEventListener('click', function () {
      var cart = JSON.parse(localStorage.getItem('ev_cart') || '{}');
      cart[dish.id] = { dish: dish, quantity: qty };
      localStorage.setItem('ev_cart', JSON.stringify(cart));
      navigateBack(returnUrl);
    });

    document.getElementById('addToBasketBtn').addEventListener('click', function () {
      var cart = JSON.parse(localStorage.getItem('ev_cart') || '{}');
      cart[dish.id] = { dish: dish, quantity: qty };
      localStorage.setItem('ev_cart', JSON.stringify(cart));
      localStorage.setItem('ev_order', JSON.stringify(cart));
      localStorage.setItem('ev_return_category', category);
      navigateTo('checkout.html');
    });

    if (dish.glb) {
      viewer.setAttribute('src', '../' + dish.glb);
      if (dish.usdz) viewer.setAttribute('ios-src', '../' + dish.usdz);
    } else {
      viewer.style.display = 'none';
      loading.style.display = 'none';
      if (dish.image) {
        var mediaImg = document.getElementById('mediaImage');
        mediaImg.src = '../' + dish.image;
        mediaImg.alt = dish.name;
        mediaImg.style.display = 'block';
      }
    }
  });
