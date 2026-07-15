const VERSION = 'yjs-0.15.0';
const ASSETS = [
  './',
  './index.html',
  './app.css',
  './manifest.webmanifest',
  './icon.svg',
  './icon-180.png',
  './js/app.js',
  './js/kits/audio-kit.js',
  './js/kits/geo-kit.js',
  './js/kits/graph-kit.js',
  './js/kits/tile-kit.js',
  './js/kits/quiz-kit.js',
  './js/kits/task-kit.js',
  './js/kits/proof-kit.js',
  './js/kits/explain-kit.js',
  './js/kits/optics-kit.js',
  './js/kits/lab-kit.js',
  './js/kits/calc-kit.js',
  './js/kits/report-kit.js',
  './js/modules/p1.js',
  './js/modules/p2.js',
  './js/modules/p3.js',
  './js/modules/g0.js',
  './js/modules/m13.js',
  './js/modules/m14.js',
  './js/modules/m15.js',
  './js/modules/m16.js',
  './js/modules/m17.js',
  './js/modules/m18.js',
  './js/modules/p5.js',
  './js/modules/p4.js',
  './js/modules/p6.js',
  './js/modules/p1s1.js',
  './js/modules/p1s2.js',
  './js/modules/p1s3.js',
  './js/modules/p1s4.js',
  './data/quiz-p1.js',
  './data/quiz-p2.js',
  './data/quiz-p3.js',
  './data/quiz-g0.js',
  './data/quiz-m13.js',
  './data/quiz-m14.js',
  './data/quiz-m15.js',
  './data/quiz-m16.js',
  './data/quiz-m17.js',
  './data/quiz-m18.js',
  './data/quiz-p5.js',
  './data/quiz-p4.js',
  './data/quiz-p6.js',
  './data/quiz-p1s.js'
];

self.addEventListener('install', e => {
  // cache:'reload' 绕过浏览器 HTTP 缓存——否则新版本缓存桶可能装进旧文件
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.all(ASSETS.map(u =>
        fetch(new Request(u, { cache: 'reload' })).then(res => {
          if (res.ok) return c.put(u, res);
        })
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
    )
  );
});
