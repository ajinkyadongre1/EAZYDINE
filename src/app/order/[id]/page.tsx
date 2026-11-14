'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { FoodCard } from '@/components/food-card';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  ShoppingBag,
  Info,
} from 'lucide-react';

function PreOrderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const restaurantId = params?.id as string;
  const resId = searchParams.get('resId');

  const {
    restaurants,
    menuItems,
    reservations,
    cart,
    cartSubtotal,
    cartTax,
    cartServiceCharge,
    cartTotal,
    createOrder,
    setIsCartOpen,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const reservation = reservations.find((r) => r.id === resId) || reservations[0];

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Restaurant not found</h2>
      </div>
    );
  }

  const restaurantMenu = menuItems.filter((m) => m.restaurantId === restaurant.id);
  const categories = ['All', ...Array.from(new Set(restaurantMenu.map((m) => m.category)))];

  const filteredMenu = restaurantMenu.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  const depositCredit = reservation?.depositPaid ? reservation.depositAmount : 0;
  const estimatedFinalTotal = Math.max(0, cartTotal - depositCredit);

  const handleConfirmPreOrder = () => {
    if (cart.length === 0) {
      alert('Please select at least one dish for your pre-order.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        reservationId: reservation ? reservation.id : 'N/A',
        restaurantId: restaurant.id,
        items: cart,
        arrivalTime: reservation ? reservation.time : '7:45 PM',
      });
      setIsSubmitting(false);
      router.push(`/track/${order.id}`);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-accent text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              PRE-ARRIVAL ORDERING
            </span>
            <span className="text-xs text-sage font-semibold">Zero-Wait Kitchen Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{restaurant.name} Menu</h1>
          <p className="text-xs sm:text-sm text-sage max-w-xl">
            Choose your dishes now. The chef will synchronize preparation with your arrival at Table{' '}
            <strong className="text-white font-bold">{reservation?.tableNumber || 'T-01'}</strong> so it is served steaming hot the minute you sit down!
          </p>
        </div>

        {/* RESERVATION SUMMARY PILL */}
        {reservation && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs space-y-1.5 self-start md:self-auto min-w-[220px]">
            <span className="text-[10px] text-accent-100 font-bold uppercase tracking-wider block">
              Linked Reservation
            </span>
            <p className="font-bold text-white text-sm">Table {reservation.tableNumber} • {reservation.guestCount} Guests</p>
            <p className="text-sage flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Arrival: {reservation.time} ({reservation.date})</span>
            </p>
            <p className="text-emerald-300 font-bold pt-1 border-t border-white/10">
              ₹{reservation.depositAmount} Deposit will be credited
            </p>
          </div>
        )}
      </div>

      {/* CATEGORY SELECTOR & FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-4 border border-gray-100 shadow-subtle">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-50 text-foreground hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition self-start sm:self-auto ${
            vegOnly
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-muted hover:border-gray-300'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
          <span>Veg Only</span>
        </button>
      </div>

      {/* DISHES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMenu.map((item) => (
          <FoodCard key={item.id} item={item} reservationId={reservation?.id} />
        ))}
      </div>

      {/* STICKY BOTTOM PRE-ORDER CONFIRMATION BAR */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-float p-4 sm:p-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sage flex items-center justify-center text-primary font-bold shadow-subtle">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-foreground text-sm">{cart.length} Dishes Selected</span>
                  <span className="text-muted font-bold">Total: {formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    -₹{depositCredit} Table Deposit Adjusted • Payable at Table:{' '}
                    <strong className="text-primary font-black">{formatCurrency(estimatedFinalTotal)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-foreground"
              >
                Review Items
              </button>

              <button
                onClick={handleConfirmPreOrder}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-card flex items-center justify-center gap-2 transition hover:scale-[1.02] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending to Kitchen...' : 'Confirm Pre-Arrival Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading pre-order menu...</div>}>
      <PreOrderContent />
    </Suspense>
  );
}
