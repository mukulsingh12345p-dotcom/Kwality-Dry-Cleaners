import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ClothesRack = () => {
  const items = [
    { color: '#FF6B6B', type: 'tshirt', delay: 0 },
    { color: '#4D96FF', type: 'shirt', delay: 0.2 },
    { color: '#6BCB77', type: 'tshirt', delay: 0.4 },
    { color: '#FFD93D', type: 'shirt', delay: 0.1 },
    { color: '#9B59B6', type: 'tshirt', delay: 0.3 },
  ];

  return (
    <div className="relative w-full max-w-[280px] h-48 flex items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* Rack Frame */}
        <line x1="20" y1="110" x2="180" y2="110" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="110" x2="40" y2="20" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        <line x1="160" y1="110" x2="160" y2="20" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="20" x2="170" y2="20" stroke="#4A5568" strokeWidth="4" strokeLinecap="round" />
        
        {/* Clothes */}
        {items.map((item, i) => {
          const x = 45 + i * 27;
          return (
            <motion.g
              key={i}
              initial={{ rotate: -1.5 }}
              animate={{ rotate: 1.5 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1.5 + i * 0.2,
                ease: "easeInOut",
                delay: item.delay
              }}
              style={{ transformOrigin: `${x}px 20px` }}
            >
              {/* Hanger Hook */}
              <path d={`M ${x} 20 Q ${x} 12 ${x+4} 12`} fill="none" stroke="#718096" strokeWidth="1.5" />
              {/* Hanger Body */}
              <path d={`M ${x-12} 32 L ${x} 22 L ${x+12} 32`} fill="none" stroke="#718096" strokeWidth="1.5" />
              
              {/* Clothing Item */}
              {item.type === 'tshirt' ? (
                <g>
                  {/* T-Shirt Body */}
                  <path d={`M ${x-14} 32 L ${x+14} 32 L ${x+14} 75 L ${x-14} 75 Z`} fill={item.color} />
                  {/* T-Shirt Sleeves */}
                  <path d={`M ${x-14} 32 L ${x-22} 45 L ${x-16} 48 L ${x-14} 40`} fill={item.color} />
                  <path d={`M ${x+14} 32 L ${x+22} 45 L ${x+16} 48 L ${x+14} 40`} fill={item.color} />
                </g>
              ) : (
                <g>
                  {/* Shirt Body */}
                  <path d={`M ${x-14} 32 L ${x+14} 32 L ${x+16} 85 L ${x-16} 85 Z`} fill={item.color} />
                  {/* Shirt Sleeves (Longer) */}
                  <path d={`M ${x-14} 32 L ${x-24} 60 L ${x-18} 63 L ${x-14} 45`} fill={item.color} />
                  <path d={`M ${x+14} 32 L ${x+24} 60 L ${x+18} 63 L ${x+14} 45`} fill={item.color} />
                  {/* Shirt Buttons Line */}
                  <line x1={x} y1="38" x2={x} y2="85" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                </g>
              )}
              {/* Neckline */}
              <path d={`M ${x-5} 32 Q ${x} 36 ${x+5} 32`} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

let hasSeenSplash = false;

export const EntryScreen = ({ onRegister, onLogin }: { onRegister: () => void, onLogin: () => void }) => {
  const [step, setStep] = useState<'splash' | 'welcome'>(hasSeenSplash ? 'welcome' : 'splash');

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        hasSeenSplash = true;
        setStep('welcome');
      }, 1000); // 1 second splash screen
      return () => clearTimeout(timer);
    }
  }, [step]);

  const Logo = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
    <div className={`flex flex-col items-center justify-center font-black tracking-tighter leading-none ${size === 'large' ? 'text-5xl' : 'text-3xl'}`}>
      <span className="text-[#BE1E2D] flex items-start">
        KWALITY<span className={`${size === 'large' ? 'text-[0.4em] mt-2 ml-1' : 'text-[0.4em] mt-1 ml-0.5'}`}>®</span>
      </span>
      <span className={`text-black ${size === 'large' ? 'text-2xl' : 'text-xl'} tracking-normal mt-1`}>DRY CLEANERS</span>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-[#F3F4F6] flex justify-center">
      <AnimatePresence>
        {step === 'splash' && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-[#F3F4F6] z-50"
          >
            <Logo size="large" />
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full min-h-screen flex flex-col items-center bg-white"
          >
            {/* Background Gradient Top */}
            <div className="absolute top-0 left-0 right-0 h-[65vh] bg-gradient-to-b from-[#E5E7EB] via-[#F3F4F6] to-white pointer-events-none" />
            
            <div className="relative z-10 flex flex-col min-h-screen w-full max-w-md px-6 pt-12 pb-10">
              {/* Logo Top */}
              <div className="mb-4 shrink-0">
                <Logo size="small" />
              </div>

              {/* Illustration Area */}
              <div className="flex-1 flex items-center justify-center min-h-[140px] mt-2 mb-8">
                <ClothesRack />
              </div>

              {/* Text Content */}
              <div className="text-center mb-8 shrink-0">
                <h1 className="text-xl md:text-2xl font-bold text-[#111111] leading-tight">
                  Laundry, done for you.<br />Anytime, anywhere
                </h1>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 w-full shrink-0">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={onRegister}
                  className="w-full bg-[#111111] text-white font-semibold py-3.5 rounded-2xl text-[15px] transition-colors hover:bg-black shadow-lg shadow-black/10"
                >
                  Get Started
                </motion.button>
              </div>

              {/* Login Link */}
              <div className="mt-5 text-center shrink-0">
                <p className="text-sm text-[#888888]">
                  Already have an account?{' '}
                  <button onClick={onLogin} className="text-[#111111] font-semibold hover:underline">
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
