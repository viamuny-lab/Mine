const CACHE_NAME = 'my-app-cache-v1';

// 1. Install: Cache basic files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add('/'); // Cache the main page
    })
  );
});

// 2. Fetch: Serve from cache, then network (This fixes videos)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch from network AND save to cache
      return fetch(event.request).then((networkResponse) => {
        // Check for valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        // Clone the response to save in cache
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
