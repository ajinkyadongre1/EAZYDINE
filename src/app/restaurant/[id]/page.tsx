'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { FoodCard } from '@/components/food-card';
import { TablePicker } from '@/components/table-picker';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Share2,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  MessageSquare,
  Plus,
} from 'lucide-react';

function RestaurantDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const initialTab = (searchParams.get('tab') as 'overview' | 'menu' | 'book' | 'reviews') || 'overview';
  const initialTime = searchParams.get('time') || undefined;

  const {
    restaurants,
    menuItems,
    reviews,
    addReview,
    currentUser,
    toggleSavedRestaurant,
    reservations,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'book' | 'reviews'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-foreground">Restaurant Not Found</h2>
        <p className="text-xs text-muted">The restaurant you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => router.push('/explore')}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const isSaved = currentUser.savedRestaurants.includes(restaurant.id);
  const restaurantMenu = menuItems.filter((m) => m.restaurantId === restaurant.id);
  const restaurantReviews = reviews.filter((rev) => rev.restaurantId === restaurant.id);

  // Active reservation if any
  const userRes = reservations.find(
    (r) => r.restaurantId === restaurant.id && r.status === 'confirmed'
  );

  // Filtered menu
  const categories = ['All', ...Array.from(new Set(restaurantMenu.map((m) => m.category)))];
  const filteredMenu = restaurantMenu.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview({
      restaurantId: restaurant.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewComment('');
    setIsReviewModalOpen(false);
  };

  return (
    <div className="pb-24">
      {/* 1. HERO COVER BANNER */}
      <div className="relative h-72 sm:h-96 w-full">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-white">
          <button
            onClick={() => router.back()}
            className="bg-black/40 hover:bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavedRestaurant(restaurant.id)}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition"
              aria-label="Save Favorite"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Restaurant link copied to clipboard!');
              }}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HERO TITLE INFO */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-accent text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {restaurant.cuisine.slice(0, 3).join(' • ')}
            </span>
            <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {restaurant.priceRange} ({formatCurrency(restaurant.pricePerPerson)} for two)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{restaurant.name}</h1>
          <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-2xl">{restaurant.tagline}</p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>{restaurant.location.address}, {restaurant.location.city}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary-light" />
              <span>{restaurant.openingHours}</span>
            </span>
            <span className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
              <span className="text-[10px] text-emerald-100">({restaurant.reviewCount} ratings)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT "RESERVE & PRE-ORDER" CALL TO ACTION STRIP */}
      <div className="bg-primary-700 text-white py-3.5 px-4 shadow-subtle border-b border-primary-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-spin" />
            <span>
              <strong>Zero Kitchen Wait Guarantee:</strong> Reserve a table and pre-order your meals before reaching!
            </span>
          </div>

          <div className="flex items-center gap-2">
            {userRes ? (
              <button
                onClick={() => setActiveTab('menu')}
                className="bg-accent hover:bg-accent-hover text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Pre-Order for Table {userRes.tableNumber}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('book')}
                className="bg-accent hover:bg-accent-hover text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Reserve & Pre-Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 sm:space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'menu', label: `Menu (${restaurantMenu.length})` },
            { key: 'book', label: 'Book Table' },
            { key: 'reviews', label: `Reviews (${restaurantReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN BODY ACCORDING TO ACTIVE TAB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* DESCRIPTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-3">
                <h3 className="font-bold text-base text-foreground">About {restaurant.name}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {restaurant.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {restaurant.cuisine.map((c) => (
                    <span
                      key={c}
                      className="text-xs font-semibold bg-sage/60 text-primary px-3 py-1 rounded-xl"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* AMENITIES */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-4">
                <h3 className="font-bold text-base text-foreground">Dining Amenities & Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {restaurant.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50/80 border border-gray-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AVAILABLE TABLES PREVIEW */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-foreground">Table Seating Options</h3>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Reserve a Table</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {restaurant.tables.map((table) => (
                    <div
                      key={table.id}
                      className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 text-xs flex flex-col justify-between h-24"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-foreground">{table.tableNumber}</span>
                        <span className="text-[10px] font-bold text-muted bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          {table.capacity}P
                        </span>
                      </div>
                      <span className="font-semibold text-primary">{table.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: QUICK BOOKING CARD & CONTACT */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-4 sticky top-40">
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                    EAZYDINE Concierge
                  </span>
                  <h3 className="text-xl font-black text-foreground mt-0.5">Skip the Wait</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Tables fill quickly during peak hours. Lock in your seating and order food ahead.
                  </p>
                </div>

                <div className="bg-sage/40 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Table Deposit:</span>
                    <span className="font-bold text-foreground">{formatCurrency(restaurant.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Deposit Adjustment:</span>
                    <span className="font-bold text-emerald-700">100% Credited</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('book')}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl font-bold text-xs shadow-card flex items-center justify-center gap-2 transition"
                >
                  <span>Book a Table Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{restaurant.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* MENU FILTER BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-4 border border-gray-100 shadow-subtle">
              {/* CATEGORY TABS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
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

              {/* VEG ONLY TOGGLE */}
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

            {/* PRE-ORDER BANNER IF RESERVATION ACTIVE */}
            {userRes && (
              <div className="bg-sage/40 border border-primary/20 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>
                    Pre-ordering for Table <strong className="text-primary">{userRes.tableNumber}</strong> ({userRes.time} reservation)
                  </span>
                </div>
                <span className="font-bold text-primary">₹{userRes.depositAmount} Deposit Applied</span>
              </div>
            )}

            {/* FOOD ITEMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <FoodCard key={item.id} item={item} reservationId={userRes?.id} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOOK TABLE */}
        {activeTab === 'book' && (
          <TablePicker restaurant={restaurant} initialTime={initialTime} />
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-foreground">Verified Diner Reviews</h3>
                <p className="text-xs text-muted">Feedback from diners who reserved and pre-ordered at {restaurant.name}.</p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            </div>

            {/* REVIEW LIST */}
            <div className="space-y-4">
              {restaurantReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-subtle space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-foreground">{rev.userName}</h4>
                        <span className="text-[10px] text-muted">{rev.date} • Verified EAZYDINE Diner</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-lg text-xs">
                      <span>{rev.rating}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </div>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.dishesRecommended && rev.dishesRecommended.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold text-muted uppercase">Recommended:</span>
                      {rev.dishesRecommended.map((dish) => (
                        <span
                          key={dish}
                          className="text-[10px] font-semibold bg-sage/60 text-primary px-2 py-0.5 rounded-md"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* WRITE REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-black text-lg text-foreground">Rate & Review {restaurant.name}</h3>

            <div className="flex items-center gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      reviewRating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Your Experience</label>
              <textarea
                rows={4}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the pre-ordered food quality, serving speed, and table ambience?"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-muted hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReview}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-subtle"
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestaurantPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted">Loading restaurant details...</div>}>
      <RestaurantDetailContent />
    </Suspense>
  );
}
