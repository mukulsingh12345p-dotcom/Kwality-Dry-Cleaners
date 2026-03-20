import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeScreen } from './components/HomeScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ReferScreen } from './components/ReferScreen';
import { AccountScreen } from './components/AccountScreen';
import { EntryScreen } from './components/EntryScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { LoginScreen } from './components/LoginScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile, UserStats, CartItem, Order, ServiceItem, AppNotification } from './types';
import { SERVICES as INITIAL_SERVICES } from './constants';
import { NotificationService } from './services/notificationService';
import { AnimatePresence, motion } from 'motion/react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string;
    providerInfo?: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let globalAppState: 'entry' | 'login' | 'register' | 'main' | 'admin' = 'entry';
let globalUser: UserProfile = {
  name: '',
  address: '',
  email: '',
  contact: ''
};

export default function App() {
  const [mockUsers, setMockUsers] = useState<any[]>([]);
  
  const [appState, setAppState] = useState<'entry' | 'login' | 'register' | 'main' | 'admin'>(() => {
    const saved = localStorage.getItem('kwality_appState');
    return (saved as any) || 'entry';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kwality_user');
    const u = saved ? JSON.parse(saved) : globalUser;
    if (u.contact === '9999999999' || u.contact === '8447433691' || u.contact === '1') {
      return globalUser;
    }
    return u;
  });
  const [loginError, setLoginError] = useState('');
  
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kwality_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Firestore Subscriptions
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setMockUsers(snapshot.docs.map(doc => doc.data()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => doc.data() as Order);
      fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(fetchedOrders);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const fetchedNotifs = snapshot.docs.map(doc => doc.data() as AppNotification);
      fetchedNotifs.sort((a, b) => {
        // Simple sort by ID since ID has Date.now()
        return b.id.localeCompare(a.id);
      });
      setNotifications(fetchedNotifs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notifications'));

    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedServices = snapshot.docs.map(doc => doc.data() as ServiceItem);
        setServices(fetchedServices);
      } else {
        // Initialize services if empty
        INITIAL_SERVICES.forEach(async (service) => {
          try {
            await setDoc(doc(db, 'services', service.id), service);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'services');
          }
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));

    return () => {
      unsubUsers();
      unsubOrders();
      unsubNotifs();
      unsubServices();
    };
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('kwality_appState', appState);
  }, [appState]);

  useEffect(() => {
    localStorage.setItem('kwality_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kwality_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Show browser notification when a new notification is added
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show if it's new and either a broadcast or for this specific user
      if (latest.isNew && (!latest.userContact || latest.userContact === user.contact)) {
        NotificationService.showNotification(latest.title, latest.message);
      }
    }
  }, [notifications, user.contact]);

  const handleLogin = async (contact: string, pass: string) => {
    if (contact === 'admin' && pass === 'admin123') {
      globalAppState = 'admin';
      setAppState('admin');
      setLoginError('');
      return;
    }

    try {
      const q = query(collection(db, 'users'), where('contact', '==', contact), where('password', '==', pass));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const foundUser = snapshot.docs[0].data();
        globalUser = foundUser.profile;
        setUser(foundUser.profile);
        globalAppState = 'main';
        setAppState('main');
        setLoginError('');
        
        // Add welcome notification if not already present for this user
        const hasWelcome = notifications.some(n => n.userContact === contact && n.title.includes('Welcome'));
        if (!hasWelcome) {
          const newNotif = {
            id: `welcome_${Date.now()}`,
            title: 'Welcome to Kwality',
            message: 'Thank you for choosing Kwality Dry Cleaners. We are excited to serve you!',
            time: 'Just now',
            type: 'info',
            isNew: true,
            userContact: contact
          };
          await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
        }
      } else {
        setLoginError('Invalid phone/email or password.');
      }
    } catch (error) {
      console.error("Login error", error);
      setLoginError('Error logging in. Please try again.');
    }
  };

  const handleRegistrationComplete = async (userData: any) => {
    const newUserProfile: UserProfile = {
      name: userData.name,
      contact: userData.phone,
      address: `${userData.buildingNo}, ${userData.landmark ? userData.landmark + ', ' : ''}${userData.location}`,
      email: userData.email || 'user@example.com'
    };
    
    try {
      await setDoc(doc(db, 'users', userData.phone), {
        contact: userData.phone,
        password: userData.password,
        profile: newUserProfile
      });

      globalUser = newUserProfile;
      setUser(newUserProfile);
      globalAppState = 'main';
      setAppState('main');

      const newNotif = {
        id: `welcome_${Date.now()}`,
        title: 'Welcome to Kwality',
        message: 'Thank you for registering with Kwality Dry Cleaners. We look forward to serving you.',
        time: 'Just now',
        type: 'info',
        isNew: true,
        userContact: userData.phone
      };
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  const handleLogout = () => {
    setAppState('entry');
    setActiveTab('home');
    localStorage.removeItem('kwality_appState');
    localStorage.removeItem('kwality_user');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.contact));
      setAppState('entry');
      setActiveTab('home');
      localStorage.removeItem('kwality_appState');
      localStorage.removeItem('kwality_user');
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    try {
      const oldContact = user.contact;
      setUser(updatedUser);
      
      if (oldContact !== updatedUser.contact) {
        // Create new document and delete old one if contact changed
        await setDoc(doc(db, 'users', updatedUser.contact), {
          profile: updatedUser,
          contact: updatedUser.contact,
          // We don't have the password here, ideally we'd fetch it or not store it in plain text
          // For this demo, we'll try to fetch the old user to keep the password
        });
        
        const oldUserDoc = await getDocs(query(collection(db, 'users'), where('contact', '==', oldContact)));
        if (!oldUserDoc.empty) {
            const oldData = oldUserDoc.docs[0].data();
            await setDoc(doc(db, 'users', updatedUser.contact), {
                ...oldData,
                profile: updatedUser,
                contact: updatedUser.contact
            });
            await deleteDoc(doc(db, 'users', oldContact));
        }

        const batch = writeBatch(db);
        
        const notifQuery = query(collection(db, 'notifications'), where('userContact', '==', oldContact));
        const notifSnapshot = await getDocs(notifQuery);
        notifSnapshot.docs.forEach(d => {
          batch.update(d.ref, { userContact: updatedUser.contact });
        });

        const orderQuery = query(collection(db, 'orders'), where('userContact', '==', oldContact));
        const orderSnapshot = await getDocs(orderQuery);
        orderSnapshot.docs.forEach(d => {
          batch.update(d.ref, { userContact: updatedUser.contact });
        });

        await batch.commit();
      } else {
        await updateDoc(doc(db, 'users', oldContact), {
          profile: updatedUser,
          contact: updatedUser.contact
        });
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleAddOrder = async (order: Order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (e) {
      console.error("Error adding order", e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      console.error("Error updating order", e);
    }
  };

  const handleAddNotification = async (notification: AppNotification) => {
    try {
      await setDoc(doc(db, 'notifications', notification.id), notification);
    } catch (e) {
      console.error("Error adding notification", e);
    }
  };

  const handleUpdateService = async (service: ServiceItem) => {
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (e) {
      console.error("Error updating service", e);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.error("Error deleting service", e);
    }
  };

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('kwality_activeTab') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('kwality_activeTab', activeTab);
  }, [activeTab]);
  const [initialCategory, setInitialCategory] = useState<string | null>(null);
  const [initialSubCategory, setInitialSubCategory] = useState<string | null>(null);

  const handleSelectCategory = (category: string, subCategory: string | null = null) => {
    setInitialCategory(category);
    setInitialSubCategory(subCategory);
    setActiveTab('services');
  };

  // Find the most relevant active order for the current user
  const userActiveOrders = orders.filter(o => o.userContact === user.contact && o.status !== 'cancelled');
  // Prefer orders that are not completed, otherwise show the latest completed one
  const trackedOrder = userActiveOrders.find(o => o.status !== 'completed') || userActiveOrders[0] || null;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen 
          onQuickPickup={() => handleSelectCategory('Dry Clean-Garments', null)} 
          onSelectCategory={handleSelectCategory} 
          userName={user.name} 
          trackedOrder={trackedOrder}
        />;
      case 'services':
        return <ServicesScreen 
          initialCategory={initialCategory} 
          initialSubCategory={initialSubCategory} 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onGoToCart={() => setActiveTab('orders')}
          services={services}
        />;
      case 'orders':
        return <OrdersScreen 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          orders={orders} 
          onAddOrder={handleAddOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          user={user}
        />;
      case 'refer':
        return <ReferScreen />;
      case 'account':
        return <AccountScreen 
          user={user} 
          onDeleteAccount={handleDeleteAccount} 
          onLogout={handleLogout} 
          onUpdateUser={handleUpdateUser}
        />;
      case 'notifications':
        return <NotificationsScreen 
          onBack={() => setActiveTab('home')} 
          notifications={notifications}
          userContact={user.contact}
        />;
      case 'pickup':
        return <ServicesScreen 
          initialCategory={initialCategory} 
          initialSubCategory={initialSubCategory} 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onGoToCart={() => setActiveTab('orders')}
          services={services}
        />; // Placeholder for quick pickup flow
      default:
        return <HomeScreen 
          onQuickPickup={() => handleSelectCategory('Dry Clean-Garments', null)} 
          onSelectCategory={handleSelectCategory} 
          userName={user.name} 
          trackedOrder={trackedOrder}
        />;
    }
  };

  const renderMainContent = () => {
    if (appState === 'admin') {
      return (
        <AdminDashboard 
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          services={services}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onLogout={handleLogout}
          onAddNotification={handleAddNotification}
        />
      );
    }
    if (appState === 'entry') {
      return <EntryScreen onRegister={() => setAppState('register')} onLogin={() => setAppState('login')} />;
    }
    if (appState === 'login') {
      return <LoginScreen onLogin={handleLogin} onBack={() => setAppState('entry')} error={loginError} />;
    }
    if (appState === 'register') {
      return (
        <RegistrationScreen 
          onComplete={handleRegistrationComplete} 
          onBack={() => setAppState('entry')}
          existingContacts={mockUsers.map(u => u.contact)}
        />
      );
    }
    return (
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        cartItems={cartItems}
        onGoToCart={() => setActiveTab('orders')}
      >
        {renderScreen()}
      </Layout>
    );
  };

  return (
    <motion.div 
      key="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {renderMainContent()}
    </motion.div>
  );
}

