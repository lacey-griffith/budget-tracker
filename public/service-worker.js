const FILES_TO_CACHE = [
    '/',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './js/idb.js',
    './js/index.js'
]

const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;


//INSTALL service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('installing cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});


//ACTIVATE service worker
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keylist) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            cacheKeepList.push(CACHE_NAME);
            return Promise.all(
                keylist.map(function(key,i) {
                    if(cacheKeepList.indexOf(key) === -1){
                        console.log('deleting cache: ', + keylist[i])
                        return caches.delete(keylist[i])
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if(request){
                console.log('responding with cache: ' + e.request.url)
                return request
            } else {
                console.log('file not cached, fetching: ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})