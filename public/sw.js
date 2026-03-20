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
    icon: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=192&h=192&auto=format&fit=crop',
    badge: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=192&h=192&auto=format&fit=crop',
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
