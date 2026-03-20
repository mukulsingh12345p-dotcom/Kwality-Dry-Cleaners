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
      icon: 'https://picsum.photos/seed/kwality/192/192',
      badge: 'https://picsum.photos/seed/kwality/192/192',
      vibrate: [100, 50, 100],
    };

    // Show local notification
    new Notification(title, options);
  }
};
