// Notification Service to handle browser notifications
export const NotificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  showNotification: (title: string, body: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const options = {
      body,
      icon: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=192&h=192&auto=format&fit=crop',
      badge: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=192&h=192&auto=format&fit=crop',
      vibrate: [100, 50, 100],
    };

    // Show local notification
    new Notification(title, options);
  }
};
