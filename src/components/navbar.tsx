'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CITIES } from '@/lib/utils';
import {
  UtensilsCrossed,
  MapPin,
  Search,
  ShoppingBag,
  Bell,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  ChefHat,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    currentUser,
    switchUserRole,
    selectedCity,
    setSelectedCity,
    cart,
    setIsCartOpen,
    notifications,
    markNotificationAsRead,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    setAuthMode,
    orders,
  } = useStore();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Active pre-order badge
  const activeOrder = orders.find(
    (o) => o.status !== 'Served' && o.status !== 'Completed' && o.status !== 'Cancelled'
  );

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'EXPLORE RESTAURANTS', href: '/explore' },
    { label: 'BOOK A TABLE', href: '/explore?tab=book' },
    { label: 'MY ORDERS', href: '/dashboard?tab=orders' },
    { label: 'MY BOOKINGS', href: '/dashboard?tab=reservations' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-primary flex items-center gap-1">
                EAZY<span className="text-accent">DINE</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium -mt-1 hidden sm:block">
                Skip the Wait. Enjoy the Taste.
              </span>
            </div>
          </Link>

          {/* DESKTOP MAIN NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-sage/60 font-bold'
                      : 'text-foreground/80 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* LOCATION SELECTOR */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-foreground hover:bg-gray-50 hover:border-primary/30 transition shadow-subtle"
              >
                <MapPin className="w-4 h-4 text-accent" />
                <span className="max-w-[80px] sm:max-w-none truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-muted" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted uppercase tracking-wider">
                    Select Your City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-sage/40 transition ${
                        selectedCity === city ? 'font-bold text-primary bg-sage/30' : 'text-foreground'
                      }`}
                    >
                      {city}
                      {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH ICON / BAR TOGGLE */}
            <div className="relative">
              {isSearchVisible ? (
                <div className="flex items-center bg-gray-100 rounded-xl px-2.5 py-1 border border-primary/30">
                  <Search className="w-4 h-4 text-muted mr-1.5" />
                  <input
                    type="text"
                    placeholder="Search restaurant or cuisine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-foreground focus:outline-none w-32 sm:w-48"
                    autoFocus
                  />
                  <button onClick={() => setIsSearchVisible(false)} className="text-muted hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchVisible(true)}
                  aria-label="Search"
                  className="p-2 rounded-xl text-foreground hover:text-primary hover:bg-gray-100 transition"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                aria-label="Notifications"
                className="p-2 rounded-xl text-foreground hover:text-primary hover:bg-gray-100 transition relative"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-float border border-gray-100 py-3 z-50 animate-in fade-in">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Live Updates</h4>
                    <span className="text-[11px] text-accent font-semibold">{unreadNotifs} New</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted text-center py-6">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-gray-50 transition ${
                            !n.read ? 'bg-sage/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-primary">{n.title}</span>
                            <span className="text-[10px] text-muted whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-muted mt-0.5 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CART BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-sage/50 hover:bg-sage border border-primary/20 text-primary px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-subtle"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Pre-Order Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-accent text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* LIVE PRE-ORDER TRACKING PILL (IF ACTIVE) */}
            {activeOrder && (
              <Link
                href={`/track/${activeOrder.id}`}
                className="hidden xl:flex items-center gap-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Pre-Order: {activeOrder.status}</span>
              </Link>
            )}

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-gray-200 hover:border-primary/30 transition shadow-subtle"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <ChevronDown className="w-3 h-3 text-muted mr-1" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-float border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-[11px] text-muted truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-sage text-primary uppercase">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-sage/40 hover:text-primary transition"
                    >
                      <UserIcon className="w-4 h-4 text-muted" />
                      <span>Customer Dashboard</span>
                    </Link>

                    <Link
                      href="/restaurant-admin"
                      onClick={() => {
                        switchUserRole('restaurant_owner');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-sage/40 hover:text-primary transition"
                    >
                      <ChefHat className="w-4 h-4 text-accent" />
                      <span>Restaurant Owner Portal</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => {
                        switchUserRole('admin');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-sage/40 hover:text-primary transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Super Admin Panel</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-muted hover:text-foreground hover:bg-gray-50 transition"
                    >
                      Sign In with another Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-sage/30 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <Link
              href="/restaurant-admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2 bg-sage text-primary font-bold text-xs rounded-xl"
            >
              Owner Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2 bg-primary text-white font-bold text-xs rounded-xl"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
