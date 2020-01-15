// https://codelabs.developers.google.com/codelabs/migrate-to-progressive-web-apps/index.html?index=..%2F..index#0

// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
            .catch(function (error) {
                console.log(error);
            })
    );

    event.waitUntil(update(event.request));
});

self.addEventListener('install', function (e) {
    self.skipWaiting();

    e.waitUntil(
        caches.open('topomapper-cache').then(function (cache) {
            return cache.addAll([
                './',
                './sw_loader.js',
                './sw.js',
                './manifest.json',
                './index.html',
                './js/main.js',
                './datafiles/atsi.json',
                './datafiles/business.json',
                './datafiles/euexpl.json',
                './datafiles/monarchy.json',
                './datafiles/pol.json',
                './datafiles/religious.json',
                './datafiles/war.json',
                'https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.js',
                './js/mapbox_prefs.js',
                'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js',
                'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.2.0/mapbox-gl-geocoder.min.js',
                'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.2.0/mapbox-gl-geocoder.css',
                'https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css',
                'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css',
                './css/main.css',
                './img/apple-touch-icon.png',
                './img/nopic.png'
            ]);
        })
    );
});

function update(request) {
    return caches.open('topomapper-cache').then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}