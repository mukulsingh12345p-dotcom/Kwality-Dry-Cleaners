import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, X, Search, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { CartItem, ServiceItem } from '../types';

export const ServicesScreen = ({ 
  initialCategory, 
  initialSubCategory,
  cartItems,
  setCartItems,
  onGoToCart,
  services
}: { 
  initialCategory?: string | null;
  initialSubCategory?: string | null;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onGoToCart: () => void;
  services: ServiceItem[];
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory || CATEGORIES[0].name); // Default to Garments
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(initialSubCategory || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const activeCategoryObj = CATEGORIES.find(c => c.name === activeCategory);

  const filteredServices = services.filter(s => {
    const matchesCategory = s.category === activeCategory;
    const matchesSubCategory = !activeSubCategory || s.subCategory === activeSubCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  const handleAddItemClick = (item: any) => {
    setSelectedItem(item);
    setQuantityToAdd(1);
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

  const handleConfirmAdd = () => {
    if (!selectedItem) return;
    
    setCartItems(prev => {
      const existing = prev.find(i => i.id === selectedItem.id);
      if (existing) {
        return prev.map(i => i.id === selectedItem.id ? { ...i, quantity: i.quantity + quantityToAdd } : i);
      }
      return [...prev, { id: selectedItem.id, name: selectedItem.name, price: selectedItem.price, quantity: quantityToAdd }];
    });
    
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-ink">Services</h2>
        <p className="text-sm text-ink-muted">Select items for your pickup.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" strokeWidth={2} />
        <input 
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-line rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-ink-muted/60"
        />
      </div>

      {/* Category Pills */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveSubCategory(null);
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-medium transition-all border ${
                activeCategory === cat.name 
                  ? 'bg-ink text-surface border-ink' 
                  : 'bg-surface text-ink-muted border-line hover:border-ink/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategory Pills */}
        {activeCategoryObj?.subcategories && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            <button
              onClick={() => setActiveSubCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                activeSubCategory === null
                  ? 'bg-accent text-surface border-accent'
                  : 'bg-surface text-ink-muted border-line hover:border-accent/50'
              }`}
            >
              All
            </button>
            {activeCategoryObj.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                  activeSubCategory === sub
                    ? 'bg-accent text-surface border-accent'
                    : 'bg-surface text-ink-muted border-line hover:border-accent/50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricelist */}
      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-line bg-bg-base/50 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Pricelist</h3>
          <span className="text-[10px] text-ink-muted uppercase tracking-wider">Per Item</span>
        </div>

        {filteredServices.length > 0 ? (
          <div className="divide-y divide-line">
            {filteredServices.map((item) => {
              const cartItem = cartItems.find(i => i.id === item.id);
              return (
                <motion.div
                  layout
                  key={item.id}
                  className="px-5 py-4 flex items-center justify-between group hover:bg-bg-base/30 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-medium text-ink">{item.name}</h4>
                    <p className="text-sm text-ink-muted mt-0.5">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {cartItem && (
                      <div className="flex items-center gap-2 bg-accent-light px-2 py-1 rounded-lg">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-accent hover:bg-accent hover:text-surface transition-colors shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-accent min-w-[1rem] text-center">
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => handleAddItemClick(item)}
                          className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-accent hover:bg-accent hover:text-surface transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {!cartItem && (
                      <button 
                        onClick={() => handleAddItemClick(item)}
                        className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-accent hover:text-surface hover:border-accent transition-colors"
                      >
                        <Plus strokeWidth={2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center px-4">
            <p className="text-sm text-ink-muted">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif text-ink">{selectedItem.name}</h3>
                    <p className="text-ink-muted mt-1">₹{selectedItem.price} per item</p>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-base text-ink-muted hover:text-ink transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-bg-base p-4 rounded-2xl">
                  <span className="text-sm font-medium text-ink">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-ink shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-ink">{quantityToAdd}</span>
                    <button 
                      onClick={() => setQuantityToAdd(quantityToAdd + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-ink shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleConfirmAdd}
                    className="w-full py-3.5 bg-ink text-surface rounded-xl font-medium hover:bg-ink/90 transition-colors"
                  >
                    Add {quantityToAdd} to Cart • ₹{selectedItem.price * quantityToAdd}
                  </button>
                  <button 
                    onClick={() => {
                      handleConfirmAdd();
                      onGoToCart();
                    }}
                    className="w-full py-3.5 bg-accent text-surface rounded-xl font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add & Go to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
