// Service Worker for Kwality Dry Cleaners
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push events (for real web push)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'New Notification', body: 'You have a new update from Kwality Dry Cleaners.' };
  
  const options = {
    body: data.body,
    icon: 'https://picsum.photos/seed/kwality/192/192',
    badge: 'https://picsum.photos/seed/kwality/192/192',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
