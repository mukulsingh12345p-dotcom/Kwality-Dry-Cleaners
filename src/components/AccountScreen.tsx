import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, User, Mail, Phone, MapPin, Package } from 'lucide-react';

export const AccountScreen = ({ 
  user, 
  onDeleteAccount, 
  onLogout,
  onUpdateUser
}: { 
  user: UserProfile, 
  onDeleteAccount: () => void, 
  onLogout: () => void,
  onUpdateUser: (updatedUser: UserProfile) => void
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-ink">Account</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-bg-base border border-line rounded-xl text-xs font-bold text-ink hover:text-accent transition-all shadow-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border border-line rounded-3xl p-6 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-serif text-ink">Edit Details</h3>
              <button onClick={handleCancel} className="p-2 text-ink-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <EditField 
                label="Full Name" 
                value={formData.name} 
                onChange={(val) => setFormData({ ...formData, name: val })} 
                icon={<User className="w-4 h-4" />}
              />
              <EditField 
                label="Email Address" 
                value={formData.email} 
                onChange={(val) => setFormData({ ...formData, email: val })} 
                icon={<Mail className="w-4 h-4" />}
              />
              <EditField 
                label="Phone Number" 
                value={formData.contact} 
                onChange={(val) => setFormData({ ...formData, contact: val })} 
                icon={<Phone className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="text-[10px] text-ink-muted uppercase tracking-wider ml-1">Address</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 text-ink-muted">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-bg-base border border-line rounded-2xl text-sm text-ink focus:outline-none focus:border-accent min-h-[100px] resize-none"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 rounded-2xl border border-line text-sm font-medium text-ink hover:bg-bg-base transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3.5 rounded-2xl bg-ink text-surface text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="px-5 py-4 border-b border-line bg-bg-base/50">
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Personal Details</h3>
            </div>
            <div className="divide-y divide-line">
              <ProfileRow label="Name" value={user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Contact" value={user.contact} />
              <ProfileRow label="Address" value={user.address} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="pt-4 space-y-3">
        <button 
          onClick={onDeleteAccount}
          className="w-full py-4 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Delete Account
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-4 border border-line text-ink rounded-xl text-sm font-medium hover:bg-bg-base transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

const EditField = ({ label, value, onChange, icon }: { label: string, value: string, onChange: (val: string) => void, icon: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] text-ink-muted uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center text-ink-muted">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3 bg-bg-base border border-line rounded-2xl text-sm text-ink focus:outline-none focus:border-accent"
      />
    </div>
  </div>
);

const ProfileRow = ({ label, value }: { label: string, value: string }) => (
  <div className="px-5 py-4">
    <p className="text-[10px] text-ink-muted uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-ink leading-relaxed">{value}</p>
  </div>
);
