export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  savedRestaurants: string[]; // Restaurant IDs
}

export type PriceCategory = '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: string;
  capacity: number;
  type: 'Window View' | 'Cozy Booth' | 'Center Dining' | 'Outdoor Terrace' | 'VIP Lounge';
  status: 'available' | 'reserved' | 'occupied';
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  logoImage: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  pricePerPerson: number;
  priceRange: PriceCategory;
  location: {
    address: string;
    city: string;
    area: string;
  };
  openingHours: string;
  phone: string;
  email: string;
  featured: boolean;
  trending: boolean;
  topRated: boolean;
  depositAmount: number; // Deposit per booking/person
  availableTimes: string[];
  amenities: string[];
  tables: RestaurantTable[];
  ownerId?: string;
  approved?: boolean;
}

export type MenuCategory = 
  | 'Starters'
  | 'Main Course'
  | 'Biryani'
  | 'Pizza'
  | 'Burgers'
  | 'Chinese'
  | 'Desserts'
  | 'Beverages';

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  isVeg: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
  prepTimeMinutes: number;
  image: string;
  isAvailable: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: string;
  guestCount: number;
  date: string;
  time: string;
  depositAmount: number;
  depositPaid: boolean;
  status: 'confirmed' | 'arrived' | 'completed' | 'cancelled';
  preOrderId?: string;
  createdAt: string;
  notes?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  prepTimeMinutes: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Accepted'
  | 'Scheduled'
  | 'Preparing'
  | 'Ready to Serve'
  | 'Customer Arrived'
  | 'Served'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  reservationId: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userName: string;
  userPhone?: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number; // 5% GST
  serviceCharge: number;
  total: number;
  depositDeducted: number;
  finalPayable: number;
  status: OrderStatus;
  orderType: 'pre-order' | 'dine-in';
  arrivalTime: string;
  estimatedPrepTimeMinutes: number;
  scheduledPrepTime: string; // e.g. "7:10 PM"
  createdAt: string;
  paymentStatus: 'deposit_paid' | 'fully_paid' | 'pending_arrival';
  paymentMethod?: string;
}

export interface DigitalBill {
  id: string;
  billNumber: string;
  orderId: string;
  reservationId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantGstin: string;
  date: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  grossTotal: number;
  depositPaid: number;
  finalPayable: number;
  status: 'paid' | 'unpaid';
  paidAt?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  dishesRecommended?: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  restaurantId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reservation' | 'order' | 'kitchen' | 'billing';
}
