var viewer     = document.getElementById('ar-viewer');
var loading    = document.getElementById('arLoading');
var launchBtn  = document.getElementById('arLaunchBtn');
var statusText = document.getElementById('arStatusText');
var noSupport  = document.getElementById('arNoSupport');

var params   = new URLSearchParams(window.location.search);
var glb      = params.get('glb');
var usdz     = params.get('usdz');
var name     = params.get('name');
var category = params.get('category') || 'mains';

if (glb)  viewer.setAttribute('src', '../' + glb);
if (usdz) viewer.setAttribute('ios-src', '../' + usdz);
if (name) viewer.setAttribute('alt', name + ' — Didoo\'s Evergreen, in AR');

document.getElementById('doneBtn').addEventListener('click', function () {
  navigateTo('main-indian.html?category=' + encodeURIComponent(category));
});

viewer.addEventListener('load', function () {
  loading.classList.add('hidden');
  launchBtn.classList.remove('hidden');
});

viewer.addEventListener('error', function () {
  loading.classList.add('hidden');
  statusText.textContent = 'Model loading…  drop dish.glb in assets/models/';
});

viewer.addEventListener('ar-status', function (e) {
  if (e.detail.status === 'session-started') {
    statusText.textContent = 'Point at a flat surface';
  } else if (e.detail.status === 'object-placed') {
    statusText.textContent = 'Dish placed ✓  Move around to explore';
  } else if (e.detail.status === 'failed') {
    noSupport.classList.add('visible');
  }
});

viewer.addEventListener('model-visibility', function () {
  if (!viewer.canActivateAR) {
    noSupport.classList.add('visible');
    loading.classList.add('hidden');
  }
});
