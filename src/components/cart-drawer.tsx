'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartRestaurantId,
    restaurants,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartServiceCharge,
    cartTotal,
    reservations,
    createOrder,
  } = useStore();

  const [arrivalTime, setArrivalTime] = useState('7:45 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const currentRestaurant = restaurants.find((r) => r.id === cartRestaurantId);
  const userReservations = reservations.filter(
    (r) => r.restaurantId === cartRestaurantId && r.status === 'confirmed'
  );
  const activeReservation = userReservations[0];

  const handleCheckout = () => {
    if (!cartRestaurantId || cart.length === 0) return;

    if (!activeReservation) {
      // Need a reservation first
      setIsCartOpen(false);
      router.push(`/restaurant/${cartRestaurantId}?tab=book`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        reservationId: activeReservation.id,
        restaurantId: cartRestaurantId,
        items: cart,
        arrivalTime: activeReservation.time || arrivalTime,
      });
      setIsSubmitting(false);
      setIsCartOpen(false);
      router.push(`/track/${order.id}`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKDROP */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* HEADER */}
          <div className="px-6 py-5 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-base">Pre-Order Cart</h3>
                <p className="text-xs text-sage truncate max-w-[200px]">
                  {currentRestaurant?.name || 'Your Dining Cart'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* RESERVATION CONTEXT BANNER */}
          {activeReservation ? (
            <div className="bg-sage/40 border-b border-sage-dark/30 px-6 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>
                  Linked to Table <strong className="text-primary">{activeReservation.tableNumber}</strong> ({activeReservation.time})
                </span>
              </div>
              <span className="font-semibold text-primary">₹{activeReservation.depositAmount} Deposit Paid</span>
            </div>
          ) : (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
              <span>Table reservation required for pre-ordering. You can book next!</span>
            </div>
          )}

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-sage/30 rounded-full flex items-center justify-center mx-auto text-primary">
                  <ShoppingBag className="w-8 h-8 text-primary/60" />
                </div>
                <h4 className="font-bold text-foreground text-sm">Your Pre-Order Cart is Empty</h4>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  Browse restaurant menus, select dishes and have them prepared just before you reach!
                </p>
              </div>
            ) : (
              cart.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20 transition shadow-subtle"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={menuItem.image}
                      alt={menuItem.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            menuItem.isVeg ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        />
                        <h4 className="font-semibold text-xs text-foreground line-clamp-1">{menuItem.name}</h4>
                      </div>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {formatCurrency(menuItem.price)}
                      </p>
                      <span className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {menuItem.prepTimeMinutes}m prep
                      </span>
                    </div>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-2 py-1 shadow-sm">
                    <button
                      onClick={() => updateCartQuantity(menuItem.id, quantity - 1)}
                      className="p-1 hover:text-accent transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(menuItem.id, quantity + 1)}
                      className="p-1 hover:text-primary transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && (
              <div className="bg-sage/20 border border-primary/20 rounded-2xl p-3.5 space-y-1.5 text-xs text-foreground">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>How Pre-Arrival Works:</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  The restaurant receives your order right now. Our smart kitchen timer schedules prep so your food is fresh out of the pan the minute you take your seat!
                </p>
              </div>
            )}
          </div>

          {/* FOOTER TOTALS & ACTION */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Food Subtotal</span>
                  <span className="font-medium text-foreground">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>GST (5%)</span>
                  <span className="font-medium text-foreground">{formatCurrency(cartTax)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Restaurant Service Charge</span>
                  <span className="font-medium text-foreground">{formatCurrency(cartServiceCharge)}</span>
                </div>

                {activeReservation && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span>Table Deposit Credit</span>
                    <span>- {formatCurrency(activeReservation.depositAmount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-primary">
                  <span>{activeReservation ? 'Estimated Final Bill' : 'Total Order Value'}</span>
                  <span>
                    {formatCurrency(
                      activeReservation ? Math.max(0, cartTotal - activeReservation.depositAmount) : cartTotal
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-2xl font-bold text-sm shadow-card flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? 'Confirming Pre-Order...'
                    : activeReservation
                    ? 'Confirm Pre-Arrival Order'
                    : 'Select Table & Pre-Order'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
