import React from 'react';
import { motion } from 'motion/react';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#F3F4F6] flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center leading-none"
      >
        <span className="font-black tracking-tighter text-5xl text-[#BE1E2D] flex items-start">
          KWALITY<span className="text-[0.4em] leading-none mt-2 ml-1">®</span>
        </span>
        <span className="font-bold tracking-tight text-lg text-black mt-1">DRY CLEANERS</span>
      </motion.div>
    </motion.div>
  );
};
