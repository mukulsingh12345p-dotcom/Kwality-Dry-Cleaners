import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (contact: string, pass: string) => void;
  onBack: () => void;
  error: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack, error }) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(contact, password);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-ink-muted text-sm">Welcome back! Please log in.</p>
        </div>

        <div className="bg-surface rounded-3xl p-6 shadow-xl border border-line">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <button 
                type="button"
                onClick={onBack}
                className="p-2 -ml-2 text-ink hover:text-accent transition-colors rounded-full hover:bg-bg-base"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-serif text-ink">Log In</h2>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-ink-muted" />
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-muted" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3.5 bg-bg-base border border-line rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!contact || !password}
              className="w-full mt-8 bg-ink text-surface py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
