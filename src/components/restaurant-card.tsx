'use client';

import React from 'react';
import Link from 'next/link';
import { Restaurant } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Star, MapPin, Clock, Heart, Users, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Props {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const { currentUser, toggleSavedRestaurant } = useStore();
  const isSaved = currentUser.savedRestaurants.includes(restaurant.id);

  return (
    <div className="group bg-card rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* IMAGE CONTAINER */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* SAVE FAVORITE BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSavedRestaurant(restaurant.id);
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 hover:text-red-500 transition shadow-sm"
          aria-label="Save Restaurant"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* FEATURED / TRENDING BADGES */}
        <div className="absolute top-3.5 left-3.5 flex gap-1.5">
          {restaurant.trending && (
            <span className="bg-accent text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Trending
            </span>
          )}
          {restaurant.topRated && (
            <span className="bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Top Rated
            </span>
          )}
        </div>

        {/* BOTTOM IMAGE BAR: RATING & CUISINE */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <span className="text-xs font-semibold text-gray-200">
              {restaurant.cuisine.slice(0, 2).join(' • ')}
            </span>
            <div className="text-xs text-gray-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-accent" />
              <span>{restaurant.location.area}, {restaurant.location.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-lg text-xs shadow-sm">
            <span>{restaurant.rating}</span>
            <Star className="w-3 h-3 fill-white text-white" />
          </div>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="text-xs font-semibold text-muted">
              {formatCurrency(restaurant.pricePerPerson)}/person
            </span>
          </div>

          <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
            {restaurant.tagline}
          </p>

          {/* AVAILABLE TIMESLOTS */}
          <div className="mt-3.5 pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-muted flex items-center gap-1 mb-2">
              <Clock className="w-3 h-3 text-primary" />
              Available Tables Today:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.availableTimes.slice(0, 4).map((slot) => (
                <Link
                  key={slot}
                  href={`/restaurant/${restaurant.id}?tab=book&time=${encodeURIComponent(slot)}`}
                  className="text-[11px] font-medium bg-sage/60 hover:bg-sage text-primary px-2.5 py-1 rounded-lg transition"
                >
                  {slot}
                </Link>
              ))}
              {restaurant.availableTimes.length > 4 && (
                <span className="text-[11px] text-muted self-center font-medium pl-1">
                  +{restaurant.availableTimes.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2.5">
          <Link
            href={`/restaurant/${restaurant.id}?tab=menu`}
            className="w-full text-center py-2.5 px-3 rounded-xl border border-gray-200 hover:border-primary/40 hover:bg-gray-50 text-xs font-bold text-foreground transition"
          >
            View Menu
          </Link>
          <Link
            href={`/restaurant/${restaurant.id}?tab=book`}
            className="w-full text-center py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-subtle transition flex items-center justify-center gap-1"
          >
            <span>Book Table</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
