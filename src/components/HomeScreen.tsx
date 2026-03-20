import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shirt, Home, Footprints, Waves, Truck, Droplets, Wind, CheckCircle2, Sparkles, X, Package, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Order } from '../types';

const LiveOrderTracker = ({ order }: { order: Order | null }) => {
  if (!order) return null;

  const stages = [
    { id: 'received', label: 'Order Received', icon: Package, action: 'Order received and confirmed' },
    { id: 'washing', label: 'Washing', icon: Waves, action: 'Washing in progress...' },
    { id: 'ironing', label: 'Ironing', icon: Wind, action: 'Ironing and folding...' },
    { id: 'delivery', label: 'Out for Delivery', icon: Truck, action: 'Out for delivery...' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, action: 'Your order is completed!' },
  ];

  let currentStageIndex = 0;
  let progress = 0;

  switch (order.status) {
    case 'pending':
      currentStageIndex = 0; progress = 10; break;
    case 'accepted':
    case 'confirmed':
      currentStageIndex = 1; progress = 35; break;
    case 'processing':
      currentStageIndex = 1; progress = 45; break;
    case 'ironing':
      currentStageIndex = 2; progress = 65; break;
    case 'out_for_delivery':
      currentStageIndex = 3; progress = 85; break;
    case 'completed':
      currentStageIndex = 4; progress = 100; break;
    case 'cancelled':
      return null;
  }

  const CurrentIcon = stages[currentStageIndex].icon;
  const isCompleted = order.status === 'completed';

  return (
    <section className="bg-surface border border-line p-5 rounded-3xl shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink">
          Order Status
        </h3>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-medium text-ink-muted">#{order.id}</span>
          {isCompleted ? (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">Ready</span>
          ) : (
            <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <Loader2 className="w-3 h-3 animate-spin" /> In Progress
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-accent-light text-accent'}`}>
          <CurrentIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-ink mb-1">
            {stages[currentStageIndex].action}
          </p>
          <div className="h-2 w-full bg-bg-base rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-accent'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between relative mt-2">
        <div className="absolute top-2 left-4 right-4 h-0.5 bg-line -z-10" />
        {stages.map((stage, idx) => {
          const isPassed = idx < currentStageIndex || isCompleted;
          const isCurrent = idx === currentStageIndex && !isCompleted;
          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 w-14 sm:w-16 z-10">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isPassed ? 'bg-accent border-accent' : 
                isCurrent ? 'bg-surface border-accent' : 
                'bg-surface border-line'
              }`}>
                {isPassed && <CheckCircle2 className="w-2.5 h-2.5 text-surface" />}
              </div>
              <span className={`text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-center leading-tight ${
                isPassed || isCurrent ? 'text-ink' : 'text-ink-muted'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const HomeScreen = ({ 
  onQuickPickup,
  onSelectCategory,
  userName,
  trackedOrder
}: { 
  onQuickPickup: () => void,
  onSelectCategory: (category: string, subCategory: string | null) => void,
  userName: string,
  trackedOrder: Order | null
}) => {
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-6">
      {/* Greeting & Branding Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-surface border border-line p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-sans font-semibold text-3xl text-ink leading-tight tracking-tight">
              Good morning,<br />
              <span className="text-accent">{userName}.</span>
            </h2>
            <p className="text-ink-muted mt-2 text-sm leading-relaxed max-w-[240px]">
              Professional garment care at your doorstep.
            </p>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10" />
        </div>
      </section>

      {/* Quick Action */}
      <section>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onQuickPickup}
          className="w-full bg-ink text-surface py-4 rounded-2xl text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors shadow-lg shadow-ink/10"
        >
          Book New Service <ArrowRight className="w-4 h-4" />
        </motion.button>
      </section>

      {/* Live Order Tracker */}
      <LiveOrderTracker order={trackedOrder} />


      {/* Services Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
            Service Categories
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, idx) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <motion.div
                key={cat.id}
                layout
                className={`flex flex-col ${isExpanded ? 'col-span-2' : 'col-span-1'}`}
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (cat.subcategories) {
                      setExpandedCategory(isExpanded ? null : cat.id);
                    } else {
                      onSelectCategory(cat.name, null);
                    }
                  }}
                  className={`bg-surface border p-4 rounded-3xl flex flex-col items-center justify-center text-center group transition-all aspect-square w-full ${
                    isExpanded ? 'border-accent shadow-lg ring-2 ring-accent/20' : 'border-line hover:border-accent hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all mb-4 ${
                    isExpanded ? 'bg-accent text-surface scale-110' : 'bg-accent-light text-accent group-hover:bg-accent group-hover:text-surface'
                  }`}>
                    <CategoryIcon name={cat.icon} />
                  </div>
                  <div className={`px-5 py-2 rounded-full transition-all shadow-sm ${
                    isExpanded ? 'bg-accent text-surface' : 'bg-bg-base border border-line text-ink group-hover:border-accent group-hover:bg-surface'
                  }`}>
                    <span className="text-xs font-bold tracking-wide uppercase">{cat.name}</span>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {isExpanded && cat.subcategories && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectCategory(cat.name, null)}
                          className="bg-bg-base border border-line text-ink-muted hover:text-ink hover:border-accent text-xs font-medium py-2.5 px-3 rounded-xl text-center transition-colors"
                        >
                          All
                        </button>
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => onSelectCategory(cat.name, sub)}
                            className="bg-bg-base border border-line text-ink-muted hover:text-ink hover:border-accent text-xs font-medium py-2.5 px-3 rounded-xl text-center transition-colors"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>


      {/* Popup Modal */}
      <AnimatePresence>
        {showOrderPopup && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderPopup(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl p-6 shadow-2xl z-50"
            >
              <button 
                onClick={() => setShowOrderPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-bg-base rounded-full flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center text-accent mb-4">
                <Shirt className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-semibold text-ink mb-2">Put New Order</h3>
              <p className="text-sm text-ink-muted mb-6">
                Ready to schedule your next laundry pickup? Our staff is ready to collect your garments.
              </p>
              
              <button 
                onClick={() => {
                  setShowOrderPopup(false);
                  onQuickPickup();
                }}
                className="w-full bg-accent text-surface py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Confirm Pickup
              </button>
            </motion.div>
          </>
        )}

        {/* Order Summary Modal */}
        {showOrderSummary && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderSummary(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface rounded-3xl p-6 shadow-2xl z-50"
            >
              <button 
                onClick={() => setShowOrderSummary(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-bg-base rounded-full flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-light rounded-2xl flex items-center justify-center text-accent">
                  <Shirt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ink">Order Summary</h3>
                  <p className="text-sm text-accent font-medium uppercase tracking-wider">#8492</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-line">
                  <span className="text-ink-muted text-sm">Service</span>
                  <span className="text-ink font-medium">Wash & Iron</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-line">
                  <span className="text-ink-muted text-sm">Items</span>
                  <span className="text-ink font-medium">12 Garments</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-line">
                  <span className="text-ink-muted text-sm">Estimated Delivery</span>
                  <span className="text-ink font-medium">Tomorrow, 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-ink font-semibold">Total Amount</span>
                  <span className="text-accent font-bold text-lg">₹450</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowOrderSummary(false)}
                className="w-full bg-bg-base text-ink py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-line transition-colors"
              >
                Close Summary
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrackerStep = ({ icon: Icon, label, completed, active }: { icon: any, label: string, completed?: boolean, active?: boolean }) => {
  return (
    <div className="flex flex-col items-center gap-2 bg-surface">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
        completed ? 'bg-accent border-accent text-surface' : 
        active ? 'bg-surface border-accent text-accent' : 
        'bg-surface border-line text-ink-muted'
      }`}>
        <Icon strokeWidth={completed || active ? 2.5 : 2} className="w-3 h-3" />
      </div>
      <span className={`text-[9px] uppercase tracking-wider font-bold ${
        completed || active ? 'text-ink' : 'text-ink-muted'
      }`}>{label}</span>
    </div>
  );
};

const CategoryIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Shirt': return <Shirt strokeWidth={1.5} className="w-5 h-5" />;
    case 'Home': return <Home strokeWidth={1.5} className="w-5 h-5" />;
    case 'Footprints': return <Footprints strokeWidth={1.5} className="w-5 h-5" />;
    case 'Waves': return <Waves strokeWidth={1.5} className="w-5 h-5" />;
    default: return <Shirt strokeWidth={1.5} className="w-5 h-5" />;
  }
};
