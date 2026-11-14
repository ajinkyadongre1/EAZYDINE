'use client';

import React, { useState, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { MenuItem, OrderStatus, RestaurantTable } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  Clock,
  Grid,
  MenuSquare,
  Users,
  Receipt,
  BarChart3,
  Settings,
  Plus,
  Check,
  X,
  Flame,
  ChefHat,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

function RestaurantAdminContent() {
  const {
    currentUser,
    restaurants,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    reservations,
    updateReservationStatus,
    orders,
    updateOrderStatus,
    markOrderServed,
    bills,
    generateBillForOrder,
    payBill,
    updateRestaurant,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'reservations'
    | 'incoming'
    | 'pre-orders'
    | 'tables'
    | 'menu'
    | 'customers'
    | 'billing'
    | 'analytics'
    | 'settings'
  >('overview');

  // Find the restaurant owned by user or default to Spice Pavilion (rest-1)
  const currentRestaurant =
    restaurants.find((r) => r.ownerId === currentUser.id) || restaurants[0];

  // Specific restaurant datasets
  const restReservations = reservations.filter((r) => r.restaurantId === currentRestaurant.id);
  const restOrders = orders.filter((o) => o.restaurantId === currentRestaurant.id);
  const restMenu = menuItems.filter((m) => m.restaurantId === currentRestaurant.id);
  const restBills = bills.filter((b) => b.restaurantId === currentRestaurant.id);

  // Metrics
  const todayRevenue = restBills.reduce((acc, b) => acc + (b.status === 'paid' ? b.finalPayable : 0), 0);
  const occupiedTables = currentRestaurant.tables.filter((t) => t.status === 'occupied').length;
  const activeOrdersCount = restOrders.filter((o) => o.status !== 'Served' && o.status !== 'Completed').length;
  const pendingPreOrders = restOrders.filter((o) => o.status === 'Order Placed' || o.status === 'Accepted').length;

  // New Menu Item Form State
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(350);
  const [newDishCategory, setNewDishCategory] = useState<any>('Starters');
  const [newDishPrepTime, setNewDishPrepTime] = useState(15);
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState(
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
  );

  // New Table Form State
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableType, setNewTableType] = useState<any>('Window View');

  // Handle adding new menu item
  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;
    addMenuItem({
      restaurantId: currentRestaurant.id,
      name: newDishName,
      price: Number(newDishPrice),
      category: newDishCategory,
      prepTimeMinutes: Number(newDishPrepTime),
      isVeg: newDishIsVeg,
      description: newDishDesc || 'Freshly prepared signature delicacy.',
      image: newDishImage,
      isAvailable: true,
      isBestseller: false,
    });
    setNewDishName('');
    setIsAddMenuOpen(false);
  };

  // Handle adding new table
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return;
    const newTable: RestaurantTable = {
      id: `tbl-${currentRestaurant.id}-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      tableNumber: newTableNumber.toUpperCase(),
      capacity: Number(newTableCapacity),
      type: newTableType,
      status: 'available',
    };
    updateRestaurant(currentRestaurant.id, {
      tables: [...currentRestaurant.tables, newTable],
    });
    setNewTableNumber('');
    setIsAddTableOpen(false);
  };

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'incoming', label: 'Kitchen Display (KDS)', icon: Flame, badge: activeOrdersCount },
    { key: 'reservations', label: 'Reservations', icon: Calendar, badge: restReservations.length },
    { key: 'pre-orders', label: 'Pre-Orders Queue', icon: Clock, badge: pendingPreOrders },
    { key: 'tables', label: 'Table Management', icon: Grid },
    { key: 'menu', label: 'Menu Management', icon: MenuSquare, badge: restMenu.length },
    { key: 'customers', label: 'Diners', icon: Users },
    { key: 'billing', label: 'Billing & POS', icon: Receipt },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'settings', label: 'Restaurant Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* 1. SIDEBAR */}
      <aside className="w-full lg:w-72 bg-primary-700 text-white flex-shrink-0 p-5 space-y-6 border-r border-primary-600">
        {/* RESTAURANT BRAND */}
        <div className="pb-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 flex-shrink-0">
            <img
              src={currentRestaurant.logoImage || currentRestaurant.coverImage}
              alt={currentRestaurant.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-100">
              Partner Portal
            </span>
            <h2 className="font-bold text-sm text-white truncate">{currentRestaurant.name}</h2>
            <p className="text-[11px] text-gray-300 truncate">{currentRestaurant.location.area}</p>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-accent text-white shadow-card'
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-accent' : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* QUICK LINK TO PUBLIC RESTAURANT PAGE */}
        <div className="pt-6 border-t border-white/10">
          <Link
            href={`/restaurant/${currentRestaurant.id}`}
            target="_blank"
            className="flex items-center justify-between text-xs text-gray-300 hover:text-white bg-white/5 p-3 rounded-xl transition"
          >
            <span>View Public Storefront</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              RESTAURANT SaaS SYSTEM
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              {navItems.find((n) => n.key === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>KDS Live & Polling</span>
            </span>
          </div>
        </div>

        {/* ===================== TAB: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-muted text-xs font-bold">
                  <span>Today&apos;s Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-foreground">{formatCurrency(todayRevenue)}</p>
                <span className="text-[11px] text-emerald-700 font-semibold">+18% vs yesterday</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-muted text-xs font-bold">
                  <span>Total Reservations</span>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-black text-foreground">{restReservations.length}</p>
                <span className="text-[11px] text-muted">For today&apos;s lunch & dinner</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-muted text-xs font-bold">
                  <span>Active Pre-Orders</span>
                  <Flame className="w-4 h-4 text-accent" />
                </div>
                <p className="text-2xl font-black text-accent">{activeOrdersCount}</p>
                <span className="text-[11px] text-accent font-semibold">{pendingPreOrders} pending kitchen prep</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-2">
                <div className="flex items-center justify-between text-muted text-xs font-bold">
                  <span>Tables Occupied</span>
                  <Grid className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-black text-foreground">
                  {occupiedTables} / {currentRestaurant.tables.length}
                </p>
                <span className="text-[11px] text-muted font-medium">Visual floor sync active</span>
              </div>
            </div>

            {/* LIVE KITCHEN QUEUE PREVIEW */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-foreground">Active Pre-Arrival Orders</h3>
                  <p className="text-xs text-muted">Diners arriving shortly with pre-scheduled food cooking.</p>
                </div>
                <button
                  onClick={() => setActiveTab('incoming')}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <span>Open Full KDS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {restOrders.length === 0 ? (
                <p className="text-xs text-muted py-6 text-center">No active orders right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restOrders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-accent">{ord.id}</span>
                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-md">
                              Table {ord.tableNumber}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-foreground mt-1">{ord.userName}</h4>
                        </div>
                        <span className="text-xs font-bold text-primary bg-sage px-2.5 py-1 rounded-xl">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-muted space-y-1">
                        <p>
                          Arrival: <strong className="text-foreground">{ord.arrivalTime}</strong>
                        </p>
                        <p className="line-clamp-1">
                          Items: {ord.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        {ord.status === 'Order Placed' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                            className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-xl"
                          >
                            Accept Order
                          </button>
                        )}
                        {ord.status === 'Accepted' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                            className="flex-1 bg-accent text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Cooking</span>
                          </button>
                        )}
                        {ord.status === 'Preparing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Ready to Serve')}
                            className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl"
                          >
                            Mark Ready to Serve
                          </button>
                        )}
                        {ord.status === 'Customer Arrived' && (
                          <button
                            onClick={() => markOrderServed(ord.id)}
                            className="flex-1 bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl"
                          >
                            Confirm Food Served
                          </button>
                        )}
                        {ord.status === 'Served' && (
                          <button
                            onClick={() => setActiveTab('billing')}
                            className="flex-1 bg-gray-900 text-white text-xs font-bold py-2 rounded-xl"
                          >
                            Generate Final Bill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB: KITCHEN DISPLAY SYSTEM (KDS) ===================== */}
        {activeTab === 'incoming' && (
          <div className="space-y-6">
            <div className="bg-sage/40 rounded-2xl p-4 border border-sage-dark/40 text-xs text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <span>
                  <strong>Kitchen Display System (KDS):</strong> Pre-orders are synchronized with customer arrival times and prep minutes.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {restOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-card flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* ORDER CARD HEADER */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-accent">{ord.id}</span>
                          <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-lg">
                            Table {ord.tableNumber}
                          </span>
                        </div>
                        <h4 className="font-black text-base text-foreground mt-1">{ord.userName}</h4>
                        <p className="text-xs text-muted">{ord.userPhone || 'Diner'}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted block uppercase">Arrival Time</span>
                        <span className="font-black text-sm text-foreground">{ord.arrivalTime}</span>
                      </div>
                    </div>

                    {/* DISHES LIST */}
                    <div className="pt-3 space-y-2">
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                        Dishes to Cook:
                      </span>
                      <div className="space-y-1.5 text-xs">
                        {ord.items.map((it) => (
                          <div
                            key={it.menuItemId}
                            className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between font-medium"
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${it.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              <strong className="text-primary font-bold">{it.quantity}×</strong> {it.name}
                            </span>
                            <span className="text-muted text-[11px]">{it.prepTimeMinutes}m cook</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* KITCHEN LIFECYCLE CONTROLS */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Status:</span>
                      <span className="font-black text-primary bg-sage px-2.5 py-0.5 rounded-md">
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {ord.status === 'Order Placed' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                            className="col-span-2 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-bold transition shadow-subtle"
                          >
                            Accept Pre-Order
                          </button>
                        </>
                      )}

                      {ord.status === 'Accepted' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                          className="col-span-2 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-xl text-xs font-bold transition shadow-subtle flex items-center justify-center gap-1.5"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Ready to Serve')}
                          className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-subtle flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Food Ready & Plated</span>
                        </button>
                      )}

                      {ord.status === 'Ready to Serve' && (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'Customer Arrived')}
                          className="col-span-2 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-subtle"
                        >
                          Customer Arrived at Table {ord.tableNumber}
                        </button>
                      )}

                      {ord.status === 'Customer Arrived' && (
                        <button
                          onClick={() => markOrderServed(ord.id)}
                          className="col-span-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-subtle flex items-center justify-center gap-1.5"
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                          <span>Confirm Food Served at Table</span>
                        </button>
                      )}

                      {ord.status === 'Served' && (
                        <Link
                          href={`/bill/${ord.id}`}
                          className="col-span-2 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold transition text-center shadow-subtle"
                        >
                          View Bill & Settlement
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: RESERVATIONS ===================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-muted uppercase tracking-wider font-bold text-[10px]">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Guests</th>
                    <th className="pb-3">Table</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Deposit</th>
                    <th className="pb-3">Pre-Order?</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {restReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-mono font-bold text-accent">{r.id}</td>
                      <td className="py-3.5 font-bold text-foreground">
                        {r.userName}
                        <span className="block text-[10px] text-muted font-normal">{r.userPhone}</span>
                      </td>
                      <td className="py-3.5">{r.guestCount} Guests</td>
                      <td className="py-3.5 font-bold text-primary">{r.tableNumber}</td>
                      <td className="py-3.5">{r.date} • {r.time}</td>
                      <td className="py-3.5 font-semibold text-emerald-700">{formatCurrency(r.depositAmount)}</td>
                      <td className="py-3.5">
                        {r.preOrderId ? (
                          <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                            Pre-Ordered
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted">Dine-in only</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            r.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'arrived'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        {r.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(r.id, 'arrived')}
                            className="bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                          >
                            Mark Seated
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB: PRE-ORDERS QUEUE ===================== */}
        {activeTab === 'pre-orders' && (
          <div className="space-y-4">
            <h3 className="font-black text-lg text-foreground">Pre-Arrival Orders Queue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-accent text-xs">{ord.id}</span>
                      <h4 className="font-bold text-foreground text-sm">{ord.userName} (Table {ord.tableNumber})</h4>
                      <p className="text-xs text-muted">Target Arrival: {ord.arrivalTime}</p>
                    </div>
                    <span className="font-bold text-xs text-primary bg-sage px-2 py-0.5 rounded-lg">
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs text-muted">
                    {ord.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-700">Deposit Offset: -{formatCurrency(ord.depositDeducted)}</span>
                    <button
                      onClick={() => setActiveTab('incoming')}
                      className="text-primary font-bold hover:underline"
                    >
                      Update KDS →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: TABLE MANAGEMENT ===================== */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-foreground">Restaurant Tables & Seating Floor</h3>
                <p className="text-xs text-muted">Manage table numbers, guest capacities, and live statuses.</p>
              </div>

              <button
                onClick={() => setIsAddTableOpen(true)}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Table</span>
              </button>
            </div>

            {/* TABLES GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentRestaurant.tables.map((t) => (
                <div
                  key={t.id}
                  className={`bg-white rounded-3xl p-5 border shadow-subtle flex flex-col justify-between h-36 ${
                    t.status === 'occupied'
                      ? 'border-accent/40 bg-accent-light/30'
                      : t.status === 'reserved'
                      ? 'border-primary/40 bg-sage/30'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base text-foreground">{t.tableNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200">
                      {t.capacity} Guests
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-primary block">{t.type}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'available'
                          ? 'text-emerald-700'
                          : t.status === 'reserved'
                          ? 'text-primary'
                          : 'text-accent'
                      }`}
                    >
                      ● {t.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex gap-1">
                    <button
                      onClick={() => {
                        const newStatus = t.status === 'available' ? 'occupied' : 'available';
                        updateRestaurant(currentRestaurant.id, {
                          tables: currentRestaurant.tables.map((tbl) =>
                            tbl.id === t.id ? { ...tbl, status: newStatus } : tbl
                          ),
                        });
                      }}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-[10px] font-bold py-1 rounded-lg text-foreground border border-gray-200"
                    >
                      Toggle {t.status === 'available' ? 'Occupy' : 'Free'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD TABLE MODAL */}
            {isAddTableOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-bold text-base text-foreground">Add New Dining Table</h3>
                  <form onSubmit={handleCreateTable} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Table Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. T-09"
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Guest Capacity</label>
                      <input
                        type="number"
                        min={1}
                        max={16}
                        required
                        value={newTableCapacity}
                        onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Seating Type</label>
                      <select
                        value={newTableType}
                        onChange={(e) => setNewTableType(e.target.value as any)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <option>Window View</option>
                        <option>Cozy Booth</option>
                        <option>Center Dining</option>
                        <option>Outdoor Terrace</option>
                        <option>VIP Lounge</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddTableOpen(false)}
                        className="flex-1 py-2 text-xs font-bold text-muted border rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-subtle"
                      >
                        Create Table
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: MENU MANAGEMENT ===================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-foreground">Menu Items & Pricing</h3>
                <p className="text-xs text-muted">Add, edit, or toggle availability for pre-orders.</p>
              </div>

              <button
                onClick={() => setIsAddMenuOpen(true)}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

            {/* MENU ITEMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restMenu.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-subtle flex gap-4 items-center"
                >
                  <img src={m.image} alt={m.name} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{m.name}</span>
                      <span className="font-black text-primary text-xs">{formatCurrency(m.price)}</span>
                    </div>
                    <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{m.category} • {m.prepTimeMinutes}m cook</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => toggleItemAvailability(m.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          m.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {m.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => deleteMenuItem(m.id)}
                        className="text-[10px] text-red-600 hover:underline ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD DISH MODAL */}
            {isAddMenuOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-bold text-base text-foreground">Add Menu Dish</h3>
                  <form onSubmit={handleCreateMenuItem} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Dish Name</label>
                      <input
                        type="text"
                        required
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        placeholder="e.g. Saffron Garlic Naan"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={newDishPrice}
                          onChange={(e) => setNewDishPrice(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1">Prep Time (mins)</label>
                        <input
                          type="number"
                          required
                          value={newDishPrepTime}
                          onChange={(e) => setNewDishPrepTime(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Category</label>
                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value as any)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <option>Starters</option>
                        <option>Main Course</option>
                        <option>Biryani</option>
                        <option>Pizza</option>
                        <option>Burgers</option>
                        <option>Chinese</option>
                        <option>Desserts</option>
                        <option>Beverages</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={newDishImage}
                        onChange={(e) => setNewDishImage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vegCheck"
                        checked={newDishIsVeg}
                        onChange={(e) => setNewDishIsVeg(e.target.checked)}
                      />
                      <label htmlFor="vegCheck" className="text-xs font-bold text-foreground">
                        Vegetarian Dish
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddMenuOpen(false)}
                        className="flex-1 py-2 text-xs font-bold text-muted border rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-subtle"
                      >
                        Save Dish
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: CUSTOMERS ===================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="font-black text-lg text-foreground">Recent Diners</h3>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-muted uppercase text-[10px] font-bold">
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Last Visit</th>
                    <th className="pb-3">Bookings</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-foreground">Aarav Sharma</td>
                    <td className="py-3 text-muted">aarav.sharma@example.com</td>
                    <td className="py-3">Today, 7:45 PM (Table T-03)</td>
                    <td className="py-3 font-bold">4 Bookings</td>
                    <td className="py-3"><span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">VIP Diner</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-foreground">Sneha Patel</td>
                    <td className="py-3 text-muted">sneha@example.com</td>
                    <td className="py-3">Today, 8:30 PM (Table T-05)</td>
                    <td className="py-3 font-bold">2 Bookings</td>
                    <td className="py-3"><span className="text-[10px] font-bold bg-sage text-primary px-2 py-0.5 rounded-md">Regular</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB: BILLING & POS ===================== */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-foreground">Billing & Table Settlement</h3>
                <p className="text-xs text-muted">Generate final bills with automatic deposit offsets.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restBills.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-4">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">{b.billNumber}</span>
                      <h4 className="font-bold text-base text-foreground mt-0.5">{b.customerName} (Table {b.tableNumber})</h4>
                      <p className="text-xs text-muted">{b.date}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-sage/20 rounded-2xl p-3 text-xs space-y-1 border border-sage-dark/30">
                    <div className="flex justify-between text-muted">
                      <span>Gross Total:</span>
                      <span className="text-foreground">{formatCurrency(b.grossTotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>Deposit Offset:</span>
                      <span>-{formatCurrency(b.depositPaid)}</span>
                    </div>
                    <div className="flex justify-between font-black text-primary text-sm pt-1 border-t border-gray-200">
                      <span>Net Payable:</span>
                      <span>{formatCurrency(b.finalPayable)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/bill/${b.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-foreground py-2.5 rounded-xl text-xs font-bold text-center transition"
                    >
                      View Invoice
                    </Link>
                    {b.status === 'unpaid' && (
                      <button
                        onClick={() => payBill(b.id, 'Cash at Counter')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: ANALYTICS ===================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="font-black text-lg text-foreground">Kitchen & Revenue Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-2">
                <span className="text-xs font-bold text-muted uppercase">Avg Table Turnaround</span>
                <p className="text-3xl font-black text-primary">38 Mins</p>
                <p className="text-[11px] text-emerald-700 font-semibold">42% faster via Pre-Arrival</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-2">
                <span className="text-xs font-bold text-muted uppercase">Pre-Order Adoption</span>
                <p className="text-3xl font-black text-accent">74%</p>
                <p className="text-[11px] text-muted">3 out of 4 diners order food early</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-2">
                <span className="text-xs font-bold text-muted uppercase">No-Show Rate</span>
                <p className="text-3xl font-black text-emerald-700">0.4%</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Reduced by ₹200 deposit policy</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: RESTAURANT SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-6 max-w-xl">
            <h3 className="font-black text-lg text-foreground">Restaurant Configuration</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  defaultValue={currentRestaurant.name}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Table Deposit per Booking (₹)</label>
                <input
                  type="number"
                  defaultValue={currentRestaurant.depositAmount}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Opening Hours</label>
                <input
                  type="text"
                  defaultValue={currentRestaurant.openingHours}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>
              <button
                onClick={() => alert('Settings updated successfully!')}
                className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-subtle hover:bg-primary-hover transition"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function RestaurantAdminPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading restaurant portal...</div>}>
      <RestaurantAdminContent />
    </Suspense>
  );
}
