import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package as PackageIcon, Clock, CheckCircle2, ShoppingCart, Calendar, Plus, Minus, Trash2, X, CreditCard, Wallet, Download } from 'lucide-react';
import { CartItem, Order, OrderStatus, UserProfile } from '../types';
import { downloadInvoice } from '../utils/invoiceUtils';

export const OrdersScreen = ({
  cartItems,
  setCartItems,
  orders,
  onAddOrder,
  onUpdateOrderStatus,
  user
}: {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  user: UserProfile;
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'processing' | 'out_for_delivery' | 'completed'>('cart');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = (itemId: string) => {
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setShowClearConfirm(false);
  };

  const handleFinalize = () => {
    if (!pickupDate) {
      setError('Please select a pickup date');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setShowPaymentStep(true);
  };

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: cartItems,
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      pickupDate,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      userContact: user.contact,
      userName: user.name,
      paymentMethod,
    };
    onAddOrder(newOrder);
    setCartItems([]);
    setActiveTab('processing');
    setPickupDate(new Date().toISOString().split('T')[0]);
    setShowPaymentStep(false);
  };

  const moveOrder = (id: string, newStatus: OrderStatus) => {
    onUpdateOrderStatus(id, newStatus);
  };

  const userOrders = orders
    .filter(o => o.userContact === user.contact)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const processingOrders = userOrders.filter(o => o.status === 'pending' || o.status === 'accepted' || o.status === 'confirmed' || o.status === 'processing' || o.status === 'ironing');
  const readyOrders = userOrders.filter(o => o.status === 'out_for_delivery');
  const completedOrders = userOrders.filter(o => o.status === 'completed');

  const amountDue = [...processingOrders, ...readyOrders].reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { label: 'Processing', value: processingOrders.length.toString() },
    { label: 'Amount Due', value: `₹${amountDue}` },
    { label: 'Ready', value: readyOrders.length.toString() },
    { label: 'Completed', value: completedOrders.length.toString() },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-ink">Orders</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="bg-surface p-4">
            <p className="text-[10px] text-ink-muted uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-medium text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Segmented Control */}
      <div className="flex bg-surface border border-line p-1.5 rounded-2xl overflow-x-auto hide-scrollbar gap-1">
        {(['cart', 'processing', 'out_for_delivery', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-ink text-surface shadow-md' 
                : 'text-ink-muted hover:text-ink hover:bg-bg-base'
            }`}
          >
            {tab.replace(/_/g, ' ')} {tab === 'cart' && cartItems.length > 0 && `(${cartItems.length})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'cart' && (
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center border border-line border-dashed rounded-2xl bg-surface/50">
                  <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center mb-4">
                    <ShoppingCart strokeWidth={1.5} className="w-8 h-8 text-ink-muted" />
                  </div>
                  <h3 className="text-base font-medium text-ink mb-1">Your cart is empty</h3>
                  <p className="text-sm text-ink-muted max-w-[200px]">Add some services to get started.</p>
                </div>
              ) : (
                <>
                  <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-line pb-3">
                      <h3 className="font-medium text-ink flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-accent" /> Selected Items
                      </h3>
                      <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Clear Cart
                      </button>
                    </div>
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-ink">{item.name}</p>
                            <p className="text-xs text-ink-muted">₹{item.price} per item</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-bg-base px-2 py-1 rounded-lg border border-line">
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-ink shadow-sm hover:text-accent transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-ink min-w-[1rem] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleAddItem(item.id)}
                                className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-ink shadow-sm hover:text-accent transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-sm font-medium text-ink min-w-[3rem] text-right">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-line pt-3 flex justify-between items-center">
                      <p className="text-sm font-medium text-ink">Total</p>
                      <p className="text-lg font-bold text-accent">
                        ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
                    <h3 className="font-medium text-ink flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" /> Pickup Details
                    </h3>
                    <div>
                      <label className="block text-xs font-medium text-ink-muted mb-2">Select Pickup Date</label>
                      <input 
                        type="date" 
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-bg-base border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <button 
                      onClick={handleFinalize}
                      className="w-full bg-ink text-surface font-medium py-3.5 rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/5"
                    >
                      Finalize Order
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab !== 'cart' && (
            <div className="space-y-4">
              {orders.filter(o => {
                if (activeTab === 'processing') return ['pending', 'accepted', 'confirmed', 'processing', 'ironing'].includes(o.status);
                return o.status === activeTab;
              }).length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center border border-line border-dashed rounded-2xl bg-surface/50">
                  <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center mb-4">
                    <PackageIcon strokeWidth={1.5} className="w-8 h-8 text-ink-muted" />
                  </div>
                  <h3 className="text-base font-medium text-ink mb-1">No {activeTab.replace(/_/g, ' ')} orders</h3>
                  <p className="text-sm text-ink-muted max-w-[200px]">Orders will appear here once they are {activeTab.replace(/_/g, ' ')}.</p>
                </div>
              ) : (
                orders.filter(o => {
                  if (activeTab === 'processing') return ['pending', 'accepted', 'confirmed', 'processing', 'ironing'].includes(o.status);
                  return o.status === activeTab;
                }).map(order => (
                  <div key={order.id} className="bg-surface border border-line rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start border-b border-line pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-ink">{order.id}</p>
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5">{order.date}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ['pending', 'accepted', 'confirmed', 'processing', 'ironing'].includes(order.status) ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        order.status === 'out_for_delivery' ? 'bg-green-50 text-green-600 border border-green-100' :
                        'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-ink-muted">{item.quantity}x {item.name}</span>
                          <span className="text-ink font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-line pt-3 flex justify-between items-center bg-bg-base -mx-5 -mb-5 px-5 py-4 rounded-b-2xl">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Pickup: {order.pickupDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted font-medium uppercase tracking-wider">
                          <Wallet className="w-3 h-3" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={async () => {
                            if (isDownloading === order.id) return;
                            setIsDownloading(order.id);
                            try {
                              await downloadInvoice(order, user);
                            } finally {
                              setIsDownloading(null);
                            }
                          }}
                          disabled={isDownloading === order.id}
                          className={`p-2 bg-surface border border-line rounded-lg text-ink hover:text-accent transition-colors shadow-sm ${isDownloading === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Download Invoice"
                        >
                          <Download className={`w-4 h-4 ${isDownloading === order.id ? 'animate-pulse' : ''}`} />
                        </button>
                        <p className="text-sm font-bold text-ink">Total: ₹{order.total}</p>
                      </div>
                    </div>
                    
                    {/* Action buttons removed as per user request */}
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Payment Selection Modal */}
      <AnimatePresence>
        {showPaymentStep && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-[360px] rounded-3xl p-6 shadow-2xl border border-line"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-ink">Payment Method</h3>
                <button onClick={() => setShowPaymentStep(false)} className="p-2 text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                <button 
                  onClick={() => setPaymentMethod('COD')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'COD' 
                      ? 'bg-accent/5 border-accent ring-1 ring-accent/20' 
                      : 'bg-bg-base border-line hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'COD' ? 'bg-accent text-surface' : 'bg-surface text-ink-muted'
                    }`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-ink">Cash on Delivery</p>
                      <p className="text-[10px] text-ink-muted uppercase tracking-wider">Pay after service</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-accent bg-accent' : 'border-line'
                  }`}>
                    {paymentMethod === 'COD' && <div className="w-2 h-2 bg-surface rounded-full" />}
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('Online')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    paymentMethod === 'Online' 
                      ? 'bg-accent/5 border-accent ring-1 ring-accent/20' 
                      : 'bg-bg-base border-line hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'Online' ? 'bg-accent text-surface' : 'bg-surface text-ink-muted'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-ink">Online Payment</p>
                      <p className="text-[10px] text-ink-muted uppercase tracking-wider">UPI, Cards, NetBanking</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Online' ? 'border-accent bg-accent' : 'border-line'
                  }`}>
                    {paymentMethod === 'Online' && <div className="w-2 h-2 bg-surface rounded-full" />}
                  </div>
                </button>
              </div>

              <div className="bg-bg-base p-4 rounded-2xl mb-6 flex justify-between items-center">
                <span className="text-sm text-ink-muted">Amount to Pay</span>
                <span className="text-lg font-bold text-accent">₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-ink text-surface py-4 rounded-2xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/10"
              >
                Confirm & Book Pickup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear Cart Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-[320px] rounded-3xl p-6 shadow-2xl border border-line"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-ink text-center mb-2">Clear Cart?</h3>
              <p className="text-sm text-ink-muted text-center mb-6">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-line text-sm font-medium text-ink hover:bg-bg-base transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-surface text-sm font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500 text-surface px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-red-400"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
