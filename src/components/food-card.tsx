'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Plus, Minus, Clock, Flame, Star } from 'lucide-react';

interface Props {
  item: MenuItem;
  reservationId?: string;
}

export const FoodCard: React.FC<Props> = ({ item, reservationId }) => {
  const { cart, addToCart, updateCartQuantity } = useStore();

  const cartEntry = cart.find((ci) => ci.menuItem.id === item.id);
  const quantity = cartEntry?.quantity || 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-subtle hover:shadow-card transition flex gap-4 relative overflow-hidden group">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* VEG / NON-VEG INDICATOR */}
            <span
              className={`w-4 h-4 rounded-sm border flex items-center justify-center p-0.5 ${
                item.isVeg ? 'border-green-600' : 'border-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-green-600' : 'bg-red-600'
                }`}
              />
            </span>

            {item.isBestseller && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-2.5 h-2.5 fill-amber-500" /> Bestseller
              </span>
            )}

            {item.isSpicy && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                <Flame className="w-2.5 h-2.5" /> Spicy
              </span>
            )}
          </div>

          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition line-clamp-1">
            {item.name}
          </h4>

          <p className="font-black text-sm text-primary mt-1">
            {formatCurrency(item.price)}
          </p>

          <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-2 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>{item.prepTimeMinutes}m cook time</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-emerald-700 font-medium">Pre-arrival eligible</span>
        </div>
      </div>

      {/* RIGHT IMAGE & ADD BUTTON */}
      <div className="relative w-28 h-28 flex-shrink-0 flex flex-col items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute -bottom-2">
          {quantity > 0 ? (
            <div className="flex items-center bg-white rounded-xl shadow-card border border-primary/20 px-2 py-1 text-xs">
              <button
                onClick={() => updateCartQuantity(item.id, quantity - 1)}
                className="p-1 text-muted hover:text-accent font-bold"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-extrabold text-primary px-2">{quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.id, quantity + 1)}
                className="p-1 text-muted hover:text-primary font-bold"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, reservationId)}
              className="bg-white hover:bg-sage/40 text-primary border border-gray-200 hover:border-primary font-bold text-xs px-4 py-1.5 rounded-xl shadow-card flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
