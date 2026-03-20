import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart,
  CheckCircle2,
  Package as PackageIcon, 
  Users, 
  Menu, 
  Bell, 
  X, 
  Zap, 
  Droplets, 
  Clock,
  User,
  LogOut
} from 'lucide-react';
import { UserStats, UserProfile, CartItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  cartItems: CartItem[];
  onGoToCart: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, cartItems, onGoToCart }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'pickup', label: 'Pickup', icon: Zap },
    { id: 'account', label: 'Profile', icon: User },
  ];

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Droplets },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'refer', label: 'Refer', icon: Users },
    { id: 'account', label: 'My Account', icon: User },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-line z-50">
        <div className="p-6 border-b border-line flex flex-col items-start bg-bg-base/50">
          <div className="flex flex-col leading-none">
            <span className="font-black tracking-tighter text-3xl text-[#BE1E2D] flex items-start">
              KWALITY<span className="text-[0.4em] leading-none mt-1 ml-0.5">®</span>
            </span>
            <span className="font-bold tracking-tight text-sm text-black mt-0.5">DRY CLEANERS</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-accent-light text-accent font-medium' 
                    : 'text-ink hover:bg-bg-base'
                }`}
              >
                <item.icon strokeWidth={isActive ? 2 : 1.5} className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden absolute top-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-b border-line z-40 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-ink hover:text-accent transition-colors"
          >
            <Menu strokeWidth={1.5} className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center leading-none">
              <span className="font-black tracking-tighter text-xl text-[#BE1E2D] flex items-start">
                KWALITY<span className="text-[0.4em] leading-none mt-0.5 ml-0.5">®</span>
              </span>
              <span className="font-bold tracking-tight text-[10px] text-black mt-0.5">DRY CLEANERS</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('notifications')}
            className="p-2 -mr-2 text-ink hover:text-accent transition-colors relative"
          >
            <Bell strokeWidth={1.5} className="w-6 h-6" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-surface"></span>
          </button>
        </header>

        {/* Desktop Header (Optional, just for consistency) */}
        <header className="hidden md:flex absolute top-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-b border-line z-40 px-8 py-4 items-center justify-end">
          <button 
            onClick={() => setActiveTab('notifications')}
            className="p-2 text-ink hover:text-accent transition-colors relative"
          >
            <Bell strokeWidth={1.5} className="w-6 h-6" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-surface"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-20 md:pt-24 pb-24 md:pb-8 px-5 md:px-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-surface border-t border-line px-2 py-2 z-40 pb-safe">
          <div className="max-w-md mx-auto flex items-center justify-between">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 transition-all min-w-[64px] ${
                    isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <item.icon 
                    className="w-5 h-5" 
                    strokeWidth={isActive ? 2 : 1.5} 
                  />
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-surface z-50 flex flex-col shadow-2xl"
              >
                <div className="p-6 border-b border-line flex justify-between items-center bg-bg-base/50">
                  <div>
                    <div className="flex flex-col leading-none">
                      <span className="font-black tracking-tighter text-xl text-[#BE1E2D] flex items-start">
                        KWALITY<span className="text-[0.4em] leading-none mt-0.5 ml-0.5">®</span>
                      </span>
                      <span className="font-bold tracking-tight text-[10px] text-black mt-0.5">DRY CLEANERS</span>
                    </div>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-ink-muted hover:text-ink">
                    <X strokeWidth={1.5} className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                  {sidebarItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-accent-light text-accent font-medium' 
                            : 'text-ink hover:bg-bg-base'
                        }`}
                      >
                        <item.icon strokeWidth={isActive ? 2 : 1.5} className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                  
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Global Cart Bar Notification */}
        <AnimatePresence>
          {totalCartItems > 0 && activeTab !== 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-ink text-surface p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Items in cart</p>
                  <p className="text-xs text-surface/70">{totalCartItems} item{totalCartItems !== 1 ? 's' : ''} total</p>
                </div>
              </div>
              
              <button 
                onClick={onGoToCart}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-surface px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Go to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
