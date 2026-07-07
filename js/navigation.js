/* navigation.js — Page routing with slide animations */

function navigateTo(href) {
  var shell = document.querySelector('.shell');
  shell.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
  shell.style.transform = 'translateX(-100%)';
  shell.style.opacity = '0';
  setTimeout(function () { window.location.href = href; }, 300);
}

function navigateBack(href) {
  var shell = document.querySelector('.shell');
  shell.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
  shell.style.transform = 'translateX(100%)';
  shell.style.opacity = '0';
  setTimeout(function () { window.location.href = href; }, 300);
}
