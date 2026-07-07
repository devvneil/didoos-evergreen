var scene = document.querySelector('.welcome-scene');
scene.addEventListener('click', function () { navigateTo('pages/wifi-connect.html'); });
scene.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') navigateTo('pages/wifi-connect.html');
});
