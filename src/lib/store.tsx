'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Restaurant,
  MenuItem,
  Reservation,
  Order,
  OrderStatus,
  DigitalBill,
  CartItem,
  NotificationItem,
  Review,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  INITIAL_ORDERS,
  INITIAL_BILLS,
  INITIAL_REVIEWS,
} from './data';

interface StoreContextType {
  // Current user & role switching
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<User>) => void;
  toggleSavedRestaurant: (restaurantId: string) => void;

  // Restaurants
  restaurants: Restaurant[];
  addRestaurant: (newRest: Omit<Restaurant, 'id'>) => Restaurant;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  toggleRestaurantApproval: (id: string) => void;

  // Menus
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Reservations
  reservations: Reservation[];
  createReservation: (data: {
    restaurantId: string;
    tableId: string;
    guestCount: number;
    date: string;
    time: string;
    depositAmount: number;
    notes?: string;
  }) => Reservation;
  cancelReservation: (id: string) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  // Pre-Orders & Dine-In Orders
  orders: Order[];
  createOrder: (data: {
    reservationId: string;
    restaurantId: string;
    items: { menuItem: MenuItem; quantity: number }[];
    arrivalTime: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markCustomerArrived: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;

  // Cart
  cart: CartItem[];
  cartRestaurantId: string | null;
  cartReservationId: string | null;
  addToCart: (item: MenuItem, reservationId?: string) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartServiceCharge: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Digital Bills
  bills: DigitalBill[];
  generateBillForOrder: (orderId: string) => DigitalBill;
  payBill: (billId: string, paymentMethod: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // UI state
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'EAZYDINE_PLATFORM_STATE_V1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [bills, setBills] = useState<DigitalBill[]>(INITIAL_BILLS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'user-customer-1',
      title: 'Kitchen preparing your meal!',
      message: 'The Spice Pavilion has commenced cooking your Butter Chicken & Biryani for your 7:45 PM reservation.',
      timestamp: '10 mins ago',
      read: false,
      type: 'kitchen',
    },
    {
      id: 'notif-2',
      userId: 'user-customer-1',
      title: 'Reservation Confirmed',
      message: 'Table T-03 reserved at The Spice Pavilion for 4 guests. Deposit ₹200 credited.',
      timestamp: '2 hours ago',
      read: true,
      type: 'reservation',
    },
  ]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurantId, setCartRestaurantId] = useState<string | null>(null);
  const [cartReservationId, setCartReservationId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // UI
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.restaurants) setRestaurants(parsed.restaurants);
        if (parsed.menuItems) setMenuItems(parsed.menuItems);
        if (parsed.reservations) setReservations(parsed.reservations);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.bills) setBills(parsed.bills);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.cartRestaurantId) setCartRestaurantId(parsed.cartRestaurantId);
        if (parsed.cartReservationId) setCartReservationId(parsed.cartReservationId);
      }
    } catch (e) {
      console.warn('Could not parse stored state', e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      const stateToStore = {
        restaurants,
        menuItems,
        reservations,
        orders,
        bills,
        currentUser,
        cart,
        cartRestaurantId,
        cartReservationId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }, [restaurants, menuItems, reservations, orders, bills, currentUser, cart, cartRestaurantId, cartReservationId]);

  // Switch role between customer, restaurant owner, and admin
  const switchUserRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  const toggleSavedRestaurant = (restaurantId: string) => {
    setCurrentUser(prev => {
      const exists = prev.savedRestaurants.includes(restaurantId);
      return {
        ...prev,
        savedRestaurants: exists
          ? prev.savedRestaurants.filter(id => id !== restaurantId)
          : [...prev.savedRestaurants, restaurantId],
      };
    });
  };

  // Restaurant management
  const addRestaurant = (newRest: Omit<Restaurant, 'id'>): Restaurant => {
    const id = `rest-${Date.now()}`;
    const created: Restaurant = {
      ...newRest,
      id,
      rating: 5.0,
      reviewCount: 0,
      approved: false,
    };
    setRestaurants(prev => [created, ...prev]);
    return created;
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const toggleRestaurantApproval = (id: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  // Menu items
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: `menu-${Date.now()}` };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(m => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  // Reservations
  const createReservation = ({
    restaurantId,
    tableId,
    guestCount,
    date,
    time,
    depositAmount,
    notes,
  }: {
    restaurantId: string;
    tableId: string;
    guestCount: number;
    date: string;
    time: string;
    depositAmount: number;
    notes?: string;
  }): Reservation => {
    const targetRest = restaurants.find(r => r.id === restaurantId);
    const table = targetRest?.tables.find(t => t.id === tableId);
    const id = `EZD-RES-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReservation: Reservation = {
      id,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      restaurantId,
      restaurantName: targetRest?.name || 'Partner Restaurant',
      tableId,
      tableNumber: table?.tableNumber || 'T-01',
      guestCount,
      date,
      time,
      depositAmount,
      depositPaid: true,
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
      notes,
    };

    // Update table status to reserved
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id !== restaurantId) return r;
        return {
          ...r,
          tables: r.tables.map(t => (t.id === tableId ? { ...t, status: 'reserved' as const } : t)),
        };
      })
    );

    setReservations(prev => [newReservation, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        restaurantId,
        title: 'Reservation Confirmed!',
        message: `Table ${newReservation.tableNumber} booked at ${newReservation.restaurantName} for ${date} at ${time}. Deposit ₹${depositAmount} credited!`,
        timestamp: 'Just now',
        read: false,
        type: 'reservation',
      },
      ...prev,
    ]);

    return newReservation;
  };

  const cancelReservation = (id: string) => {
    setReservations(prev =>
      prev.map(res => {
        if (res.id !== id) return res;
        return { ...res, status: 'cancelled' as const };
      })
    );
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(res => (res.id === id ? { ...res, status } : res)));
  };

  // Cart logic
  const addToCart = (item: MenuItem, reservationId?: string) => {
    if (cartRestaurantId && cartRestaurantId !== item.restaurantId) {
      if (
        !window.confirm(
          'Your cart contains items from another restaurant. Discard existing cart and start a new order?'
        )
      ) {
        return;
      }
      setCart([{ menuItem: item, quantity: 1 }]);
      setCartRestaurantId(item.restaurantId);
      setCartReservationId(reservationId || null);
      setIsCartOpen(true);
      return;
    }

    setCartRestaurantId(item.restaurantId);
    if (reservationId) setCartReservationId(reservationId);

    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => {
      const updated = prev.filter(ci => ci.menuItem.id !== menuItemId);
      if (updated.length === 0) {
        setCartRestaurantId(null);
        setCartReservationId(null);
      }
      return updated;
    });
  };

  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prev =>
      prev.map(ci => (ci.menuItem.id === menuItemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurantId(null);
    setCartReservationId(null);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const cartTax = useMemo(() => {
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cartSubtotal]);

  const cartServiceCharge = useMemo(() => {
    return cartSubtotal > 0 ? 50 : 0;
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartTax + cartServiceCharge;
  }, [cartSubtotal, cartTax, cartServiceCharge]);

  // Pre-Orders & Orders
  const createOrder = ({
    reservationId,
    restaurantId,
    items,
    arrivalTime,
  }: {
    reservationId: string;
    restaurantId: string;
    items: { menuItem: MenuItem; quantity: number }[];
    arrivalTime: string;
  }): Order => {
    const reservation = reservations.find(r => r.id === reservationId);
    const restaurant = restaurants.find(r => r.id === restaurantId);

    const orderItems = items.map(ci => ({
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      price: ci.menuItem.price,
      quantity: ci.quantity,
      isVeg: ci.menuItem.isVeg,
      prepTimeMinutes: ci.menuItem.prepTimeMinutes,
    }));

    const maxPrepTime = Math.max(...orderItems.map(i => i.prepTimeMinutes), 20);
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const serviceCharge = 50;
    const total = subtotal + tax + serviceCharge;
    const depositDeducted = reservation?.depositPaid ? reservation.depositAmount : 0;
    const finalPayable = Math.max(0, total - depositDeducted);

    const orderId = `EZD-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      reservationId,
      restaurantId,
      restaurantName: restaurant?.name || 'EAZYDINE Partner',
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      tableNumber: reservation?.tableNumber || 'T-01',
      items: orderItems,
      subtotal,
      tax,
      serviceCharge,
      total,
      depositDeducted,
      finalPayable,
      status: 'Order Placed',
      orderType: 'pre-order',
      arrivalTime,
      estimatedPrepTimeMinutes: maxPrepTime,
      scheduledPrepTime: `Approx. 20 mins before ${arrivalTime}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'deposit_paid',
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update reservation with preOrderId
    setReservations(prev =>
      prev.map(res => (res.id === reservationId ? { ...res, preOrderId: orderId } : res))
    );

    // Clear cart
    clearCart();

    // Notify
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        restaurantId,
        title: 'Pre-Arrival Food Order Placed!',
        message: `Your pre-order ${orderId} has been sent to ${restaurant?.name}. The kitchen will prepare it fresh for your ${arrivalTime} arrival.`,
        timestamp: 'Just now',
        read: false,
        type: 'order',
      },
      ...prev,
    ]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return { ...ord, status };
      })
    );

    const order = orders.find(o => o.id === orderId);
    if (order) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: order.userId,
          restaurantId: order.restaurantId,
          title: `Order Status: ${status}`,
          message: `Your pre-order at ${order.restaurantName} is now: ${status}.`,
          timestamp: 'Just now',
          read: false,
          type: 'kitchen',
        },
        ...prev,
      ]);
    }
  };

  const markCustomerArrived = (orderId: string) => {
    updateOrderStatus(orderId, 'Customer Arrived');
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Also update reservation status
      setReservations(prev =>
        prev.map(res => (res.id === order.reservationId ? { ...res, status: 'arrived' as const } : res))
      );
    }
  };

  const markOrderServed = (orderId: string) => {
    updateOrderStatus(orderId, 'Served');
    // Generate digital bill automatically
    generateBillForOrder(orderId);
  };

  // Bills
  const generateBillForOrder = (orderId: string): DigitalBill => {
    const existing = bills.find(b => b.orderId === orderId);
    if (existing) return existing;

    const order = orders.find(o => o.id === orderId);
    const reservation = reservations.find(r => r.id === order?.reservationId);

    const billId = `BILL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBill: DigitalBill = {
      id: billId,
      billNumber: `EZD-INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId,
      reservationId: order?.reservationId || 'N/A',
      restaurantId: order?.restaurantId || 'rest-1',
      restaurantName: order?.restaurantName || 'EAZYDINE Partner',
      restaurantGstin: '07AAAAA0000A1Z5',
      date: new Date().toLocaleString(),
      customerName: order?.userName || currentUser.name,
      tableNumber: order?.tableNumber || reservation?.tableNumber || 'T-01',
      items: order?.items || [],
      subtotal: order?.subtotal || 0,
      tax: order?.tax || 0,
      serviceCharge: order?.serviceCharge || 50,
      grossTotal: order?.total || 0,
      depositPaid: order?.depositDeducted || reservation?.depositAmount || 0,
      finalPayable: order?.finalPayable || 0,
      status: 'unpaid',
    };

    setBills(prev => [newBill, ...prev]);
    return newBill;
  };

  const payBill = (billId: string, paymentMethod: string) => {
    setBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, status: 'paid' as const, paidAt: new Date().toLocaleString() } : b))
    );

    const bill = bills.find(b => b.id === billId);
    if (bill) {
      // Mark order completed
      updateOrderStatus(bill.orderId, 'Completed');
      // Mark reservation completed
      setReservations(prev =>
        prev.map(res => (res.id === bill.reservationId ? { ...res, status: 'completed' as const } : res))
      );
      // Free table
      setRestaurants(prev =>
        prev.map(r => {
          if (r.id !== bill.restaurantId) return r;
          return {
            ...r,
            tables: r.tables.map(t =>
              t.tableNumber === bill.tableNumber ? { ...t, status: 'available' as const } : t
            ),
          };
        })
      );
    }
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews(prev => [newRev, ...prev]);

    // Update restaurant rating
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id !== review.restaurantId) return r;
        const currentCount = r.reviewCount;
        const newRating = Number(((r.rating * currentCount + review.rating) / (currentCount + 1)).toFixed(1));
        return {
          ...r,
          rating: newRating,
          reviewCount: currentCount + 1,
        };
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        switchUserRole,
        updateUserProfile,
        toggleSavedRestaurant,
        restaurants,
        addRestaurant,
        updateRestaurant,
        toggleRestaurantApproval,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        reservations,
        createReservation,
        cancelReservation,
        updateReservationStatus,
        orders,
        createOrder,
        updateOrderStatus,
        markCustomerArrived,
        markOrderServed,
        cart,
        cartRestaurantId,
        cartReservationId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartServiceCharge,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        bills,
        generateBillForOrder,
        payBill,
        reviews,
        addReview,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        selectedCity,
        setSelectedCity,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
