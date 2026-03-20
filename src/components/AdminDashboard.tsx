import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  DollarSign, 
  ShoppingBag, 
  Plus, 
  Edit2, 
  Trash2,
  CheckCircle2,
  Clock,
  Shirt,
  X,
  Bell,
  Send,
  Download,
  FileText,
  Wallet
} from 'lucide-react';
import { Order, ServiceItem, AppNotification, UserProfile } from '../types';
import { downloadInvoice } from '../utils/invoiceUtils';

interface AdminDashboardProps {
  onLogout: () => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  services: ServiceItem[];
  onUpdateService: (service: ServiceItem) => void;
  onDeleteService: (id: string) => void;
  onAddNotification: (notification: AppNotification) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  orders,
  onUpdateOrderStatus,
  services,
  onUpdateService,
  onDeleteService,
  onAddNotification
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'services' | 'notifications'>('overview');
  const [stagedStatuses, setStagedStatuses] = useState<Record<string, Order['status']>>({});
  
  // Service Edit State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownloadInvoice = async (order: Order) => {
    if (isDownloading === order.id) return;
    setIsDownloading(order.id);
    try {
      // Mock user profile for admin download since we only have basic info in the order
      const mockUser: UserProfile = {
        name: order.userName || 'Customer',
        contact: order.userContact,
        address: 'Address on file', // In a real app, we'd fetch this or have it in the order
        email: ''
      };
      await downloadInvoice(order, mockUser);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    onUpdateOrderStatus(orderId, newStatus);
    
    // Send notification to the specific user
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const statusText = newStatus.replace(/_/g, ' ').toUpperCase();
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: `Order ${statusText}`,
        message: `Your order ${orderId} has been updated to ${statusText}.`,
        time: 'Just now',
        type: 'order',
        isNew: true,
        userContact: order.userContact
      };
      onAddNotification(newNotif);
    }
  };

  const calculateDailySales = () => {
    // Mock calculation for today
    return orders
      .filter(o => o.status === 'completed')
      .reduce((total, order) => total + order.total, 0);
  };

  const handleSaveService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newService: ServiceItem = {
      id: editingService?.id || `service_${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      subCategory: formData.get('subCategory') as string,
      price: Number(formData.get('price')),
    };

    onUpdateService(newService);
    setEditingService(null);
    setIsAddingService(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      onDeleteService(id);
    }
  };


  const handleSendBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const message = formData.get('message') as string;
    const type = formData.get('type') as 'offer' | 'info';

    const newNotif: AppNotification = {
      id: `broadcast_${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      isNew: true,
      // No userContact means it's a broadcast
    };

    onAddNotification(newNotif);
    e.currentTarget.reset();
    alert('Broadcast notification sent to all users!');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-ink">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-line shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-ink-muted">Daily Sales</h3>
          </div>
          <p className="text-2xl font-semibold text-ink">₹{calculateDailySales()}</p>
        </div>
        
        <div className="bg-surface p-5 rounded-2xl border border-line shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center text-ink">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-ink-muted">Active Orders</h3>
          </div>
          <p className="text-2xl font-semibold text-ink">
            {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
          </p>
        </div>
      </div>

      <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-red-600">Reset Application Data</h3>
          <p className="text-xs text-red-400">Clear all orders, users, and carts to start fresh.</p>
        </div>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to clear ALL data? This will reset the app.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="bg-surface p-5 rounded-2xl border border-line shadow-sm">
        <h3 className="text-lg font-medium text-ink mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-bg-base rounded-xl">
              <div>
                <p className="font-medium text-ink">{order.userName || 'Unknown'}</p>
                <p className="text-[10px] text-ink font-bold">{order.userContact}</p>
                <p className="text-[10px] text-ink-muted uppercase tracking-wider">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-ink">₹{order.total}</p>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-ink">Manage Orders</h2>
      <div className="space-y-4">
        {orders.map(order => {
          const stagedStatus = stagedStatuses[order.id];
          const hasStagedChange = stagedStatus && stagedStatus !== order.status;

          return (
          <div key={order.id} className="bg-surface p-5 rounded-2xl border border-line shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-ink">{order.id}</h3>
                  <span className="text-[10px] bg-bg-base px-2 py-0.5 rounded border border-line text-ink-muted font-bold uppercase tracking-wider">
                    {order.paymentMethod || 'COD'}
                  </span>
                </div>
                <p className="text-xs text-ink mt-0.5">
                  <span className="font-bold">Customer: {order.userName || 'Unknown'}</span>
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  <span className="font-medium">Phone: {order.userContact}</span> • {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-ink">₹{order.total}</p>
                  <p className="text-xs text-ink-muted">{order.items.length} items</p>
                </div>
                <button 
                  onClick={() => handleDownloadInvoice(order)}
                  disabled={isDownloading === order.id}
                  className={`p-2 bg-bg-base border border-line rounded-lg text-ink-muted hover:text-accent transition-colors shadow-sm ${isDownloading === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Download Invoice"
                >
                  <FileText className={`w-4 h-4 ${isDownloading === order.id ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
            
            <div>
              {order.status === 'pending' && (
                <div className="mb-4">
                  <button
                    onClick={() => handleStatusChange(order.id, 'accepted')}
                    className="w-full bg-accent text-surface py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Accept Order
                  </button>
                </div>
              )}
              <p className="text-sm font-medium text-ink mb-2">Update Status:</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'accepted', 'confirmed', 'processing', 'ironing', 'out_for_delivery', 'completed', 'cancelled'].map((status) => {
                  const isCurrent = order.status === status;
                  const isStaged = stagedStatus === status;

                  return (
                  <button
                    key={status}
                    onClick={() => {
                      if (isCurrent) {
                        setStagedStatuses(prev => {
                          const next = { ...prev };
                          delete next[order.id];
                          return next;
                        });
                      } else {
                        setStagedStatuses(prev => ({ ...prev, [order.id]: status as Order['status'] }));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      isStaged
                        ? 'bg-accent text-surface border-accent ring-2 ring-accent/30'
                        : isCurrent && !hasStagedChange
                        ? 'bg-accent text-surface border-accent'
                        : isCurrent && hasStagedChange
                        ? 'bg-surface text-ink border-line opacity-50'
                        : 'bg-surface text-ink-muted border-line hover:border-accent/50'
                    }`}
                  >
                    {status.replace(/_/g, ' ').toUpperCase()}
                  </button>
                )})}
              </div>

              {hasStagedChange && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-accent/5 rounded-xl border border-accent/20">
                  <span className="text-sm text-ink flex-1 leading-tight">
                    Change status to <strong className="text-accent break-words">{stagedStatus.replace(/_/g, ' ').toUpperCase()}</strong>?
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setStagedStatuses(prev => {
                          const next = { ...prev };
                          delete next[order.id];
                          return next;
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(order.id, stagedStatus);
                        setStagedStatuses(prev => {
                          const next = { ...prev };
                          delete next[order.id];
                          return next;
                        });
                      }}
                      className="px-4 py-1.5 bg-accent text-surface text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors shadow-sm"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-ink">Manage Services</h2>
        <button 
          onClick={() => setIsAddingService(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-surface rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>
      
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between p-4 bg-surface border border-line rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center text-ink-muted">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-ink">{service.name}</h3>
                <p className="text-xs text-ink-muted">{service.category} • {service.subCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-ink">₹{service.price}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingService(service)}
                  className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-ink-muted hover:text-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteService(service.id)}
                  className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-ink-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-ink">Broadcast Notifications</h2>
      <div className="bg-surface p-6 rounded-2xl border border-line shadow-sm">
        <h3 className="text-lg font-medium text-ink mb-4">Send New Announcement</h3>
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1 uppercase tracking-wider">Title</label>
            <input 
              name="title" 
              placeholder="e.g., New Package Launched!" 
              required 
              className="w-full bg-bg-base border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1 uppercase tracking-wider">Message</label>
            <textarea 
              name="message" 
              placeholder="Enter the notification content..." 
              required 
              rows={3}
              className="w-full bg-bg-base border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1 uppercase tracking-wider">Type</label>
            <select 
              name="type" 
              required 
              className="w-full bg-bg-base border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
            >
              <option value="info">General Info</option>
              <option value="offer">Special Offer / Scheme</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-accent text-surface rounded-xl font-medium hover:bg-accent/90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send to All Users
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-surface border-r border-line p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-black tracking-tighter text-2xl text-[#BE1E2D] flex items-start">
              KWALITY<span className="text-[0.4em] leading-none mt-0.5 ml-0.5">®</span>
            </span>
            <span className="font-bold tracking-tight text-[10px] text-black mt-0.5">DRY CLEANERS</span>
          </div>
          <div className="h-8 w-px bg-line mx-1" />
          <div>
            <h1 className="font-serif text-lg text-ink leading-none">Admin</h1>
            <p className="text-[10px] text-ink-muted mt-1 uppercase tracking-widest">Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'services', icon: Shirt, label: 'Services' },
            { id: 'notifications', icon: Bell, label: 'Broadcast' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-ink text-surface'
                  : 'text-ink-muted hover:bg-bg-base hover:text-ink'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'notifications' && renderNotifications()}
        </div>
      </div>

      {/* Service Modal */}
      {(isAddingService || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h3 className="text-xl font-serif text-ink">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button 
                onClick={() => {
                  setEditingService(null);
                  setIsAddingService(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-base text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Name</label>
                <input 
                  name="name" 
                  defaultValue={editingService?.name} 
                  required 
                  className="w-full bg-bg-base border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Category</label>
                  <input 
                    name="category" 
                    defaultValue={editingService?.category} 
                    required 
                    className="w-full bg-bg-base border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">Sub-Category</label>
                  <input 
                    name="subCategory" 
                    defaultValue={editingService?.subCategory} 
                    required 
                    className="w-full bg-bg-base border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Price (₹)</label>
                <input 
                  name="price" 
                  type="number" 
                  defaultValue={editingService?.price} 
                  required 
                  className="w-full bg-bg-base border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent" 
                />
              </div>
              <button type="submit" className="w-full py-3 bg-ink text-surface rounded-xl font-medium hover:bg-ink/90 transition-colors mt-4">
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
