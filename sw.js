/* =========================================================================
   sw.js — Service Worker: يجعل النظام يعمل بلا اتصال إنترنت بعد أول تشغيل
   (يتوافق تماماً مع طبيعة النظام المعتمدة على LocalStorage بلا خادم)
   ========================================================================= */

const CACHE_VERSION = 'bbs-cache-v1';

const APP_SHELL = [
  './',
  './index.html',
  './dashboard.html',
  './students.html',
  './classes.html',
  './attendance.html',
  './period-attendance.html',
  './qr.html',
  './checkout.html',
  './late.html',
  './notifications.html',
  './reports.html',
  './analytics.html',
  './admin.html',
  './404.html',
  './manifest.json',
  './css/style.css',
  './js/admin.js',
  './js/analytics.js',
  './js/attendance.js',
  './js/auth.js',
  './js/checkout.js',
  './js/classes.js',
  './js/dashboard.js',
  './js/db.js',
  './js/exceptions.js',
  './js/i18n.js',
  './js/late.js',
  './js/layout.js',
  './js/notifications.js',
  './js/notify.js',
  './js/period-attendance.js',
  './js/portal-sync.js',
  './js/profile.js',
  './js/qr.js',
  './js/reports.js',
  './js/students.js',
  './js/ui.js',
  './js/utils.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* استراتيجية: الشبكة أولاً لملفات النظام نفسها (لأخذ آخر تحديث فور توفره)،
   مع الرجوع للنسخة المخزَّنة عند انعدام الاتصال — وأولوية الكاش لأي مورد
   خارجي (خطوط/مكتبات CDN) لأنها نادراً ما تتغيّر ولتسريع التحميل. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin){
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        }).catch(() => cached);
      })
    );
  }
});
