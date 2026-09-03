/* Google Analytics 4; basic consent mode. */
(function () {
  'use strict';
  var id = 'G-SXT6D1Z6VG', key = 'sfb-analytics-consent-v1', loaded = false, choice = null;
  try {
    var saved = JSON.parse(localStorage.getItem(key));
    if (saved && Date.now() - saved.at < 15552000000 && ['granted', 'denied'].includes(saved.value)) choice = saved.value;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window['ga-disable-' + id] = choice !== 'granted';
  window.gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
  function start() {
    window['ga-disable-' + id] = false;
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals:false, allow_ad_personalization_signals:false, cookie_expires:15552000, page_location:location.origin + location.pathname});
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(tag);
  }
  function removeCookies() {
    document.cookie.split(';').forEach(function (item) {
      var name = item.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      var base = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure';
      document.cookie = base;
      document.cookie = base + '; domain=' + location.hostname;
      document.cookie = base + '; domain=.' + location.hostname;
    });
  }
  var panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.hidden = choice !== null;
  panel.innerHTML = '<div class="container consent-inner"><div><strong>Help us improve SaaS Fieldbook</strong><p>May we use Google Analytics cookies to understand visits, article engagement and link clicks? You can browse without them and change your choice anytime. <a href="/privacy/">Privacy information</a></p></div><div class="consent-actions"><button type="button" data-consent="granted">Accept analytics</button><button type="button" data-consent="denied">Reject analytics</button></div></div>';
  function setChoice(value) {
    choice = value;
    try { localStorage.setItem(key, JSON.stringify({value:value, at:Date.now()})); } catch (_) {}
    panel.hidden = true;
    if (value === 'granted') start();
    else {
      window['ga-disable-' + id] = true;
      window.gtag('consent', 'update', {analytics_storage:'denied'});
      removeCookies();
      if (loaded) location.reload();
    }
  }
  panel.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () { setChoice(button.getAttribute('data-consent')); });
  });
  document.body.appendChild(panel);
  var settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Analytics preferences';
  settings.addEventListener('click', function () {
    panel.hidden = false;
    panel.querySelector('button').focus();
  });
  (document.querySelector('.footer-links') || document.body).appendChild(settings);
  window.addEventListener('storage', function (event) { if (event.key === key) location.reload(); });
  if (choice === 'granted') start();
  else removeCookies();
}());
