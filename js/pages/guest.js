var API_BASE = 'http://localhost:3000';

var dropdown    = document.getElementById('countryDropdown');
var countryValue = document.getElementById('countryValue');
var countryList  = document.getElementById('countryList');
var mobileInput  = document.querySelector('.mobile-number');

function setMaxLength(maxLength) {
  mobileInput.maxLength = maxLength;
  mobileInput.placeholder = 'Enter ' + maxLength + '-digit number';
}

fetch('../assets/countries.json')
  .then(function (res) { return res.json(); })
  .then(function (countries) {
    countries.forEach(function (country) {
      var li = document.createElement('li');
      li.textContent = country.code + '  ' + country.name;
      li.dataset.code = country.code;
      li.dataset.maxLength = country.maxLength;
      if (country.name === 'India') {
        li.classList.add('active');
        setMaxLength(country.maxLength);
      }
      li.addEventListener('click', function () {
        countryValue.textContent = country.code;
        countryList.querySelectorAll('li').forEach(function (el) { el.classList.remove('active'); });
        li.classList.add('active');
        dropdown.classList.remove('open');
        setMaxLength(country.maxLength);
        mobileInput.value = '';
        mobileInput.focus();
      });
      countryList.appendChild(li);
    });
  });

mobileInput.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '');
});

var emailInput = document.getElementById('emailInput');
var emailError = document.getElementById('emailError');
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener('input', function () {
  if (this.value.length === 0) {
    emailError.style.display = 'none';
    emailInput.classList.remove('input-error');
  } else if (!emailRegex.test(this.value)) {
    emailError.style.display = 'block';
    emailInput.classList.add('input-error');
  } else {
    emailError.style.display = 'none';
    emailInput.classList.remove('input-error');
  }
});

document.getElementById('countrySelected').addEventListener('click', function (e) {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', function () {
  dropdown.classList.remove('open');
});

document.getElementById('returningBtn').addEventListener('click', function () {
  navigateTo('returning-customer.html');
});

function submitGuest() {
  var name   = document.getElementById('nameInput').value.trim();
  var mobile = document.querySelector('.mobile-number').value.trim();
  var cc     = document.getElementById('countryValue').textContent.trim();
  var email  = document.getElementById('emailInput').value.trim();
  var btn    = document.getElementById('submitBtn');

  if (!name)   { document.getElementById('nameInput').focus(); return; }
  if (!mobile) { document.querySelector('.mobile-number').focus(); return; }

  var savedGuest = JSON.parse(localStorage.getItem('ev_guest') || 'null');
  if (savedGuest && savedGuest.mobile === mobile) {
    navigateTo('returning-customer.html');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Please wait…';

  var body = { full_name: name, mobile: mobile, country_code: cc };
  if (email) body.email = email;

  fetch(API_BASE + '/api/guest/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  })
    .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
    .then(function (r) {
      if (!r.ok) throw new Error(r.data.error || 'Registration failed');
      localStorage.setItem('ev_guest', JSON.stringify(r.data.guest));
      navigateTo('main-menu.html');
    })
    .catch(function (err) {
      btn.disabled = false;
      btn.textContent = 'Submit';
      alert(err.message || 'Could not connect to server. Please try again.');
    });
}
