// https://serviceworke.rs/strategy-cache-only_service-worker_doc.html
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
// http://stackoverflow.com/questions/33262385/service-worker-force-update-of-new-assets

var CACHE_NAME = 'cache-v6';
var urlsToCache = [
  './index.html',
  './static/css/main.67495830.css',
  './static/js/main.24dc9930.js'
];

// Set the callback for the install step
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('active', function (event) {
  // Perform active steps
  event.waitUntil(
    caches.keys().then(function(CACHE_NAME) {
      return Promise.all(CACHE_NAME.map(function(this_CACHE_NAME) {
        if (this_CACHE_NAME !== CACHE_NAME) {
          console.log('Removed cache');
          return caches.delete(this_CACHE_NAME);
        }
      }))
    })
  )
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Found in cache');
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            console.log('No response from fetch');
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have 2 stream.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
});