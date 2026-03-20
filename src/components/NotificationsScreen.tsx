import React from 'react';
import { Bell, ArrowLeft, Info, Gift, PackageCheck } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsScreenProps {
  onBack: () => void;
  notifications: AppNotification[];
  userContact: string;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack, notifications, userContact }) => {
  // Filter notifications: show if it's for everyone (no userContact) OR if it's for this specific user
  const filteredNotifications = notifications.filter(notif => 
    !notif.userContact || notif.userContact === userContact
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <PackageCheck className="w-5 h-5 text-accent" />;
      case 'offer': return <Gift className="w-5 h-5 text-emerald-600" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const renderBrandedText = (text: string) => {
    const parts = text.split(/(Kwality|Dry Cleaners)/gi);
    return parts.map((part, i) => {
      if (part.toLowerCase() === 'kwality') {
        return <span key={i} className="text-[#BE1E2D] font-bold">{part}<sup className="text-[0.6em] ml-0.5">®</sup></span>;
      }
      if (part.toLowerCase() === 'dry cleaners') {
        return <span key={i} className="text-black font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-ink hover:text-accent transition-colors rounded-full hover:bg-bg-base md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-3xl text-ink">Notifications</h2>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-2xl border ${notif.isNew ? 'bg-surface border-accent/30 shadow-sm' : 'bg-bg-base border-line'} flex gap-4`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.isNew ? 'bg-accent/10' : 'bg-surface border border-line'}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-sm ${notif.isNew ? 'font-semibold text-ink' : 'font-medium text-ink-muted'}`}>
                  {renderBrandedText(notif.title)}
                </h3>
                {notif.isNew && (
                  <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                )}
              </div>
              <p className="text-sm text-ink-muted leading-relaxed mb-2">
                {renderBrandedText(notif.message)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-ink-muted/70 font-medium">
                {notif.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
