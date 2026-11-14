'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  User as UserIcon,
  Calendar,
  ShoppingBag,
  Clock,
  Heart,
  Star,
  Bell,
  Receipt,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'reservations';

  const {
    currentUser,
    updateUserProfile,
    reservations,
    cancelReservation,
    orders,
    bills,
    restaurants,
    reviews,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    toggleSavedRestaurant,
    markCustomerArrived,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Edit profile form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const userReservations = reservations.filter((r) => r.userId === currentUser.id || true);
  const userOrders = orders.filter((o) => o.userId === currentUser.id || true);
  const userBills = bills;
  const savedRests = restaurants.filter((r) => currentUser.savedRestaurants.includes(r.id));
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);

  const tabs = [
    { key: 'reservations', label: 'My Reservations', count: userReservations.length, icon: Calendar },
    { key: 'pre-orders', label: 'My Pre-Orders', count: userOrders.length, icon: Clock },
    { key: 'orders', label: 'All Orders', count: userOrders.length, icon: ShoppingBag },
    { key: 'bills', label: 'Invoices & Bills', count: userBills.length, icon: Receipt },
    { key: 'saved', label: 'Saved Places', count: savedRests.length, icon: Heart },
    { key: 'reviews', label: 'My Reviews', count: userReviews.length, icon: Star },
    { key: 'notifications', label: 'Notifications', count: notifications.filter((n) => !n.read).length, icon: Bell },
    { key: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* USER PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-sage"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground">{currentUser.name}</h1>
              <span className="text-[10px] font-bold bg-sage text-primary px-2.5 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-primary">
              <span>{userReservations.length} Bookings</span>
              <span>•</span>
              <span>{userOrders.length} Pre-Orders</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/explore"
            className="flex-1 sm:flex-none text-center bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-subtle transition"
          >
            Find Restaurants
          </Link>
        </div>
      </div>

      {/* DASHBOARD TABS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT TAB MENU */}
        <div className="lg:col-span-3 space-y-1">
          <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-subtle space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-foreground/80 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-sage text-primary'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT TAB CONTENT */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB: MY RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg text-foreground">Table Reservations</h3>
                <span className="text-xs text-muted">{userReservations.length} Active & Past Bookings</span>
              </div>

              {userReservations.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-muted text-xs space-y-2 border border-gray-100">
                  <Calendar className="w-8 h-8 text-muted/40 mx-auto" />
                  <p>You haven&apos;t made any table reservations yet.</p>
                </div>
              ) : (
                userReservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-4 hover:shadow-card transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-accent">{res.id}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              res.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : res.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-foreground mt-1">{res.restaurantName}</h4>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-muted block text-[11px]">Deposit Credited</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(res.depositAmount)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-muted block text-[10px]">Table Assigned</span>
                        <span className="font-bold text-foreground">{res.tableNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Party Size</span>
                        <span className="font-bold text-foreground">{res.guestCount} Guests</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Date & Time</span>
                        <span className="font-bold text-foreground">{res.date} • {res.time}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Booked On</span>
                        <span className="font-medium text-foreground">{res.createdAt}</span>
                      </div>
                    </div>

                    {res.notes && (
                      <p className="text-xs text-muted bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <strong>Notes:</strong> {res.notes}
                      </p>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        {res.preOrderId ? (
                          <Link
                            href={`/track/${res.preOrderId}`}
                            className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Track Pre-Order</span>
                          </Link>
                        ) : res.status === 'confirmed' ? (
                          <Link
                            href={`/order/${res.restaurantId}?resId=${res.id}`}
                            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5 text-accent" />
                            <span>Pre-Order Food Now</span>
                          </Link>
                        ) : null}

                        <Link
                          href={`/restaurant/${res.restaurantId}`}
                          className="text-xs font-semibold text-muted hover:text-foreground px-3 py-2 rounded-xl border border-gray-200"
                        >
                          View Restaurant
                        </Link>
                      </div>

                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            if (confirm('Cancel this reservation? Your deposit of ₹' + res.depositAmount + ' will be refunded per policy.')) {
                              cancelReservation(res.id);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: MY PRE-ORDERS */}
          {activeTab === 'pre-orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-foreground">Pre-Arrival Orders</h3>
                  <p className="text-xs text-muted">Food scheduled to be ready when you arrive at your table.</p>
                </div>
              </div>

              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-4 hover:shadow-card transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent">{ord.id}</span>
                        <span className="text-[10px] font-bold bg-sage text-primary px-2.5 py-0.5 rounded-full">
                          Table {ord.tableNumber}
                        </span>
                        <span className="text-[10px] font-bold bg-accent-light text-accent px-2.5 py-0.5 rounded-full">
                          {ord.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-foreground mt-1">{ord.restaurantName}</h4>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-muted block text-[10px]">Arrival Time</span>
                      <span className="font-bold text-foreground">{ord.arrivalTime}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50 text-xs">
                    {ord.items.map((it) => (
                      <div key={it.menuItemId} className="py-2 flex justify-between">
                        <span className="font-medium text-foreground">
                          {it.quantity}× {it.name}
                        </span>
                        <span className="text-muted">{formatCurrency(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-sage/20 rounded-2xl p-3 flex justify-between text-xs font-bold border border-sage-dark/30">
                    <span className="text-emerald-800">Deposit Offset: -{formatCurrency(ord.depositDeducted)}</span>
                    <span className="text-primary">Net Payable: {formatCurrency(ord.finalPayable)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/track/${ord.id}`}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>Live Tracker</span>
                    </Link>

                    {ord.status !== 'Customer Arrived' && ord.status !== 'Served' && ord.status !== 'Completed' && (
                      <button
                        onClick={() => markCustomerArrived(ord.id)}
                        className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>I Have Arrived at Table {ord.tableNumber}</span>
                      </button>
                    )}

                    <Link
                      href={`/bill/${ord.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Bill</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ALL ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-foreground">Order History</h3>
              {userOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-muted text-[10px]">{ord.id}</span>
                    <h4 className="font-bold text-foreground text-sm">{ord.restaurantName}</h4>
                    <p className="text-muted">{ord.items.length} items • Table {ord.tableNumber} • {ord.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">{formatCurrency(ord.finalPayable)}</p>
                    <Link href={`/bill/${ord.id}`} className="text-accent font-bold hover:underline">
                      Invoice →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: INVOICES & BILLS */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-foreground">Digital Invoices & Deposit Receipts</h3>
              {userBills.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-card transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{b.billNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-foreground mt-1">{b.restaurantName}</h4>
                    <p className="text-xs text-muted">{b.date} • Table {b.tableNumber}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Deposit Adjusted: {formatCurrency(b.depositPaid)}
                    </p>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto">
                    <span className="text-muted text-[11px] block">Net Payable</span>
                    <span className="text-lg font-black text-primary">{formatCurrency(b.finalPayable)}</span>
                    <Link
                      href={`/bill/${b.id}`}
                      className="block mt-2 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl text-center shadow-subtle hover:bg-primary-hover transition"
                    >
                      Open Full Bill
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SAVED RESTAURANTS */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-foreground">Saved Restaurants</h3>
              {savedRests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-muted text-xs border border-gray-100">
                  <Heart className="w-8 h-8 text-muted/40 mx-auto mb-2" />
                  <p>You have not bookmarked any restaurants yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedRests.map((r) => (
                    <div key={r.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-subtle flex gap-4">
                      <img src={r.coverImage} alt={r.name} className="w-24 h-24 rounded-2xl object-cover" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{r.name}</h4>
                          <p className="text-xs text-muted line-clamp-1">{r.location.area}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <Link href={`/restaurant/${r.id}`} className="text-xs font-bold text-primary hover:underline">
                            Book Table →
                          </Link>
                          <button
                            onClick={() => toggleSavedRestaurant(r.id)}
                            className="text-xs text-red-500 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-foreground">My Reviews & Ratings</h3>
              {userReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">The Spice Pavilion</span>
                    <span className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">
                      {rev.rating} <Star className="w-3 h-3 fill-white" />
                    </span>
                  </div>
                  <p className="text-muted">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg text-foreground">Platform Notifications</h3>
                <button onClick={clearAllNotifications} className="text-xs font-bold text-muted hover:text-accent">
                  Clear All
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                      !n.read ? 'bg-sage/30 border-primary/20' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-primary">{n.title}</span>
                      <span className="text-[10px] text-muted">{n.timestamp}</span>
                    </div>
                    <p className="text-muted mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-6">
              <h3 className="font-black text-lg text-foreground">Personal Details</h3>

              {profileSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Profile details saved successfully!
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-subtle transition"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
