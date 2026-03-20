import React from 'react';
import { motion } from 'motion/react';

export const ReferScreen = () => {
  return (
    <div className="space-y-10 pb-10">
      <div className="space-y-4">
        <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">Referral Program</p>
        <h2 className="font-serif text-4xl text-ink leading-tight">
          Share the<br />experience.
        </h2>
        <p className="text-ink-muted text-sm leading-relaxed max-w-[280px]">
          Invite your network to <span className="text-[#BE1E2D] font-bold">Kwality<sup className="text-[0.6em] ml-0.5">®</sup></span> <span className="text-black font-bold">Dry Cleaners</span>. Give them free laundry weekends and earn exclusive rewards for yourself.
        </p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-medium text-ink border-b border-line pb-4">How it works</h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-bg-base flex items-center justify-center text-xs font-medium text-ink flex-shrink-0">1</div>
            <p className="text-sm text-ink-muted leading-relaxed">Share your unique referral link with friends, family, or colleagues.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-bg-base flex items-center justify-center text-xs font-medium text-ink flex-shrink-0">2</div>
            <p className="text-sm text-ink-muted leading-relaxed">They receive a premium welcome offer on their first booking.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-bg-base flex items-center justify-center text-xs font-medium text-ink flex-shrink-0">3</div>
            <p className="text-sm text-ink-muted leading-relaxed">You earn credits towards your next premium service.</p>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full bg-ink text-surface py-4 rounded-2xl text-sm font-medium tracking-wide hover:bg-ink/90 transition-colors"
      >
        Share Invite Link
      </motion.button>
    </div>
  );
};
