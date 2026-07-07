var guest = JSON.parse(localStorage.getItem('ev_guest') || 'null');

var firstName = (guest && guest.full_name)
  ? guest.full_name.split(' ')[0]
  : 'Guest';

document.getElementById('rcName').textContent = firstName;

document.getElementById('continueBtn').addEventListener('click', function () {
  navigateTo('main-menu.html');
});

document.getElementById('notYouBtn').addEventListener('click', function () {
  localStorage.removeItem('ev_guest');
  localStorage.removeItem('ev_cart');
  navigateTo('guest-details.html');
});
