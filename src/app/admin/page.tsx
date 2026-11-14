'use client';

import React, { useState, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  HelpCircle,
  Search,
  Check,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

function AdminContent() {
  const {
    restaurants,
    toggleRestaurantApproval,
    reservations,
    orders,
    bills,
    currentUser,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'restaurants' | 'customers' | 'bookings' | 'orders' | 'financials' | 'complaints'
  >('overview');

  const [searchFilter, setSearchFilter] = useState('');

  // Platform metrics
  const totalGMV = bills.reduce((acc, b) => acc + b.grossTotal, 0);
  const totalDepositsCollected = reservations.reduce((acc, r) => acc + (r.depositPaid ? r.depositAmount : 0), 0);
  const platformCommission = Math.round(totalGMV * 0.12); // 12% take-rate

  const pendingApprovals = restaurants.filter((r) => !r.approved);
  const activeRestaurants = restaurants.filter((r) => r.approved !== false);

  const complaintsList = [
    {
      id: 'DISP-101',
      customer: 'Pooja Verma',
      restaurant: 'The Spice Pavilion',
      issue: 'Arrived 10 minutes late due to traffic, table was held graciously.',
      status: 'Resolved',
      date: 'Today, 2:15 PM',
    },
    {
      id: 'DISP-102',
      customer: 'Karan Johar',
      restaurant: 'Bella Tavola',
      issue: 'Requested deposit refund due to medical emergency.',
      status: 'Refund Processed',
      date: 'Yesterday',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ADMIN PLATFORM HEADER */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-accent">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-white/20 text-accent-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                EAZYDINE Headquarters
              </span>
              <span className="text-xs text-sage font-medium">Platform Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Global System Oversight</h1>
            <p className="text-xs text-sage mt-0.5">
              Live multi-city monitoring of diner reservations, kitchen pre-orders, and partner settlements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </span>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-muted uppercase">Platform GMV</span>
          <p className="text-2xl font-black text-foreground">{formatCurrency(totalGMV)}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+24.5% Monthly Growth</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-muted uppercase">Platform Commission</span>
          <p className="text-2xl font-black text-primary">{formatCurrency(platformCommission)}</p>
          <span className="text-[11px] text-muted">12% standard take-rate</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-muted uppercase">Partner Restaurants</span>
          <p className="text-2xl font-black text-foreground">{restaurants.length}</p>
          <span className="text-[11px] text-accent font-semibold">{pendingApprovals.length} pending approval</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-muted uppercase">Deposit Escrow Pool</span>
          <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalDepositsCollected)}</p>
          <span className="text-[11px] text-muted">100% held in escrow</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'overview', label: 'Platform Overview' },
          { key: 'restaurants', label: `Restaurants (${restaurants.length})` },
          { key: 'bookings', label: `Reservations (${reservations.length})` },
          { key: 'orders', label: `Kitchen Orders (${orders.length})` },
          { key: 'financials', label: 'Financials & Escrow' },
          { key: 'complaints', label: `Customer Support (${complaintsList.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap rounded-2xl transition ${
              activeTab === t.key
                ? 'bg-primary text-white shadow-subtle'
                : 'text-muted hover:text-foreground hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PENDING RESTAURANT APPROVALS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-foreground">Partner Onboarding Approvals</h3>
                <span className="text-xs font-bold text-accent">{pendingApprovals.length} Pending</span>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p>All restaurant partner applications have been reviewed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-foreground">{r.name}</h4>
                        <p className="text-muted">{r.location.city} • {r.cuisine.join(', ')}</p>
                      </div>
                      <button
                        onClick={() => toggleRestaurantApproval(r.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-subtle text-xs"
                      >
                        Approve Partner
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LIVE SYSTEM HIGHLIGHTS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-4">
              <h3 className="font-bold text-sm text-foreground">Pre-Arrival Feature Metrics</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sage/40 flex justify-between items-center">
                  <span className="font-semibold text-primary">Pre-Arrival Kitchen Scheduling</span>
                  <span className="font-black text-foreground">98.2% on-time</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-sage/40 flex justify-between items-center">
                  <span className="font-semibold text-primary">Table Deposit Settlement Accuracy</span>
                  <span className="font-black text-emerald-700">100.0% flawless</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-sage/40 flex justify-between items-center">
                  <span className="font-semibold text-primary">Customer Check-in Latency</span>
                  <span className="font-black text-foreground">&lt; 30 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESTAURANTS */}
      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle overflow-x-auto space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-base text-foreground">Registered Restaurant Partners</h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-muted uppercase text-[10px] font-bold">
                <th className="pb-3">Restaurant</th>
                <th className="pb-3">City / Area</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Tables</th>
                <th className="pb-3">Deposit</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 font-bold text-foreground">
                    <div className="flex items-center gap-2.5">
                      <img src={r.logoImage || r.coverImage} alt={r.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <span>{r.name}</span>
                        <span className="block text-[10px] text-muted font-normal">{r.cuisine.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">{r.location.area}, {r.location.city}</td>
                  <td className="py-3.5 font-bold text-emerald-700">{r.rating}★ ({r.reviewCount})</td>
                  <td className="py-3.5 font-medium">{r.tables.length} Tables</td>
                  <td className="py-3.5 font-bold text-primary">{formatCurrency(r.depositAmount)}</td>
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.approved !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.approved !== false ? 'Active Partner' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => toggleRestaurantApproval(r.id)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Toggle Approval
                    </button>
                    <Link
                      href={`/restaurant/${r.id}`}
                      target="_blank"
                      className="text-xs text-muted font-medium hover:text-foreground"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle overflow-x-auto space-y-4">
          <h3 className="font-black text-base text-foreground">All Platform Bookings</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-muted uppercase text-[10px] font-bold">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Diner</th>
                <th className="pb-3">Restaurant</th>
                <th className="pb-3">Table</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Deposit Paid</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-mono font-bold text-accent">{res.id}</td>
                  <td className="py-3 font-bold text-foreground">{res.userName}</td>
                  <td className="py-3">{res.restaurantName}</td>
                  <td className="py-3 font-bold text-primary">{res.tableNumber} ({res.guestCount}P)</td>
                  <td className="py-3">{res.date} • {res.time}</td>
                  <td className="py-3 font-bold text-emerald-700">{formatCurrency(res.depositAmount)}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-sage text-primary px-2 py-0.5 rounded-full uppercase">
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle overflow-x-auto space-y-4">
          <h3 className="font-black text-base text-foreground">Pre-Arrival Kitchen Orders</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-muted uppercase text-[10px] font-bold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Diner</th>
                <th className="pb-3">Restaurant</th>
                <th className="pb-3">Table</th>
                <th className="pb-3">Arrival Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-mono font-bold text-accent">{ord.id}</td>
                  <td className="py-3 font-bold text-foreground">{ord.userName}</td>
                  <td className="py-3">{ord.restaurantName}</td>
                  <td className="py-3 font-bold text-primary">{ord.tableNumber}</td>
                  <td className="py-3">{ord.arrivalTime}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold bg-accent-light text-accent px-2 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-foreground">{formatCurrency(ord.finalPayable)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: FINANCIALS */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-6">
          <h3 className="font-black text-base text-foreground">Deposit Escrow & Settlement Architecture</h3>
          <div className="bg-sage/40 rounded-2xl p-5 border border-sage-dark/40 text-xs space-y-2">
            <h4 className="font-bold text-primary">Transparent Deposit Escrow Policy:</h4>
            <p className="text-muted leading-relaxed">
              When a diner reserves a table, the ₹200 deposit is secured in the EAZYDINE Escrow Account. When the diner finishes their meal, the ₹200 is automatically deducted from the final digital invoice, and the net amount is settled directly with the restaurant partner with a 12% platform facilitation fee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              <span className="text-muted text-[10px] font-bold uppercase block">Total Escrow Balance</span>
              <span className="text-xl font-black text-primary">{formatCurrency(totalDepositsCollected)}</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              <span className="text-muted text-[10px] font-bold uppercase block">Settled to Partners</span>
              <span className="text-xl font-black text-emerald-700">{formatCurrency(totalGMV - platformCommission)}</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              <span className="text-muted text-[10px] font-bold uppercase block">Net Platform Revenue</span>
              <span className="text-xl font-black text-accent">{formatCurrency(platformCommission)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h3 className="font-black text-base text-foreground">Customer Concierge & Dispute Resolution</h3>
          <div className="space-y-3">
            {complaintsList.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-subtle flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent">{c.id}</span>
                    <span className="text-muted">{c.date}</span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm mt-1">{c.customer} • {c.restaurant}</h4>
                  <p className="text-muted mt-0.5">{c.issue}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-xl text-xs">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading admin portal...</div>}>
      <AdminContent />
    </Suspense>
  );
}
