// importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('magicmirror').then(function(cache) {
     return cache.addAll([
       '/',
       '../index.html',
       '../css/mirror.css',
       '/css/setup.css',
       'skycons.js',
       'mirror.js',
       'setup.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
   
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
   });
// https://developers.google.com/web/fundamentals/codelabs/offline/