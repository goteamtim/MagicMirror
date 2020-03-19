self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('magicmirror').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/mirror.css',
        '/css/setup.css',
        '/js/skycons.js',
        '/js/mirror.js',
        '/js/setup.js'
      ]);
    })
  );
});


self.addEventListener('fetch', function (event) {

  event.respondWith(
    caches.open('magicmirror').then(function (cache) {

      return cache.match(event.request).then(function (response) {
        console.log('RESPONSE: ', response)
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(error => {
        console.log('offline' + error)
        // TODO 6 - Respond with custom offline page

      });
    })
  );
});
