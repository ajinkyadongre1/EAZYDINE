'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { RestaurantCard } from '@/components/restaurant-card';
import { CUISINES_LIST } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Utensils,
  DollarSign,
  Check,
  RotateCcw,
} from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCuisine = searchParams.get('cuisine') || 'All Cuisines';

  const { restaurants, selectedCity } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [onlyAvailableTables, setOnlyAvailableTables] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price-asc' | 'price-desc'>('popularity');

  // Filter and sort
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        // Name / description search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(query);
          const matchCuisine = r.cuisine.some((c) => c.toLowerCase().includes(query));
          const matchLocation = r.location.area.toLowerCase().includes(query);
          if (!matchName && !matchCuisine && !matchLocation) return false;
        }

        // Cuisine filter
        if (selectedCuisine && selectedCuisine !== 'All Cuisines') {
          const matchCuisine = r.cuisine.some((c) =>
            c.toLowerCase().includes(selectedCuisine.toLowerCase())
          );
          if (!matchCuisine) return false;
        }

        // Rating filter
        if (selectedRating !== null) {
          if (r.rating < selectedRating) return false;
        }

        // Price range
        if (selectedPriceRange !== null) {
          if (r.priceRange !== selectedPriceRange) return false;
        }

        // Available tables
        if (onlyAvailableTables) {
          const hasAvailable = r.tables.some((t) => t.status === 'available');
          if (!hasAvailable) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
        if (sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
        // popularity
        return b.reviewCount - a.reviewCount;
      });
  }, [
    restaurants,
    searchQuery,
    selectedCuisine,
    selectedRating,
    selectedPriceRange,
    onlyAvailableTables,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All Cuisines');
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setOnlyAvailableTables(false);
    setSortBy('popularity');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-wider">
          DISCOVER RESTAURANTS
        </span>
        <h1 className="text-3xl font-black text-foreground">
          Explore Restaurants in {selectedCity}
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Browse top-rated restaurants, reserve your preferred tables, and pre-order meals for zero wait times.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* SEARCH INPUT */}
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-primary">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by restaurant name, area, or dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none w-full"
            />
          </div>

          {/* CUISINE SELECTOR */}
          <div className="w-full md:w-56">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              {CUISINES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* SORT SELECTOR */}
          <div className="w-full md:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              <option value="popularity">Sort: Most Popular</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* PILL FILTERS: RATING, PRICE RANGE, TABLE AVAILABILITY */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-muted font-bold text-[11px] uppercase tracking-wider mr-1">
            Filters:
          </span>

          {/* RATING PILLS */}
          {[4.5, 4.0, 3.5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-semibold transition ${
                selectedRating === rating
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-gray-50 border-gray-200 hover:bg-white text-foreground'
              }`}
            >
              <span>{rating}+</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}

          {/* PRICE RANGE PILLS */}
          {(['₹', '₹₹', '₹₹₹', '₹₹₹₹'] as const).map((pr) => (
            <button
              key={pr}
              onClick={() => setSelectedPriceRange(selectedPriceRange === pr ? null : pr)}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition ${
                selectedPriceRange === pr
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-gray-50 border-gray-200 hover:bg-white text-foreground'
              }`}
            >
              {pr}
            </button>
          ))}

          {/* TABLE AVAILABILITY TOGGLE */}
          <button
            onClick={() => setOnlyAvailableTables(!onlyAvailableTables)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 font-semibold transition ${
              onlyAvailableTables
                ? 'bg-accent text-white border-accent shadow-sm'
                : 'bg-gray-50 border-gray-200 hover:bg-white text-foreground'
            }`}
          >
            <span>Available Tables Only</span>
          </button>

          {/* RESET BUTTON */}
          {(searchQuery ||
            selectedCuisine !== 'All Cuisines' ||
            selectedRating !== null ||
            selectedPriceRange !== null ||
            onlyAvailableTables) && (
            <button
              onClick={resetFilters}
              className="text-muted hover:text-accent font-semibold ml-auto flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Showing {filteredRestaurants.length} restaurants</span>
      </div>

      {/* RESTAURANT GRID */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-gray-100 shadow-subtle">
          <Utensils className="w-12 h-12 text-muted/40 mx-auto" />
          <h3 className="text-lg font-bold text-foreground">No restaurants match your filters</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your cuisine, search keywords, or rating filters to see more results.
          </p>
          <button
            onClick={resetFilters}
            className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-subtle hover:bg-primary-hover transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading restaurants...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
