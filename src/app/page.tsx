'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { RestaurantCard } from '@/components/restaurant-card';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Utensils,
  Award,
  Flame,
  ChevronRight,
  CheckCircle2,
  Percent,
  ChefHat,
  SlidersHorizontal,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { restaurants, selectedCity } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(searchTerm)}&cuisine=${encodeURIComponent(selectedCuisine)}`);
  };

  const foodCategories = [
    {
      name: 'Pizza',
      cuisine: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
      count: '24 Places',
    },
    {
      name: 'Burgers',
      cuisine: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      count: '18 Places',
    },
    {
      name: 'Indian',
      cuisine: 'North Indian',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      count: '42 Places',
    },
    {
      name: 'Chinese',
      cuisine: 'Chinese',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=400&q=80',
      count: '29 Places',
    },
    {
      name: 'South Indian',
      cuisine: 'South Indian',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80',
      count: '31 Places',
    },
    {
      name: 'Desserts',
      cuisine: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
      count: '22 Places',
    },
    {
      name: 'Beverages',
      cuisine: 'Beverages',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
      count: '19 Places',
    },
    {
      name: 'Fast Food',
      cuisine: 'American',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      count: '26 Places',
    },
  ];

  const trendingRestaurants = restaurants.filter((r) => r.trending);
  const topRatedRestaurants = restaurants.filter((r) => r.topRated);
  const recommendedRestaurants = restaurants.slice(0, 3);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage/50 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-light filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO TEXT */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage border border-sage-dark/40 text-primary text-xs font-bold shadow-subtle">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Next-Gen Dine-In Innovation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                Good Food. Great Tables.{' '}
                <span className="text-primary block mt-1">Zero Waiting.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                Discover premier restaurants, reserve your favourite table and have your food ready before you arrive. Skip the 30-minute kitchen wait forever.
              </p>

              {/* SEARCH BAR WIDGET */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2.5 sm:p-3 rounded-3xl shadow-card border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl"
              >
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-xs font-bold text-foreground truncate">{selectedCity}</span>
                </div>

                <div className="flex-[2] flex items-center gap-2 px-3 py-2">
                  <Search className="w-4 h-4 text-muted flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search restaurant, cuisine, or dish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs text-foreground bg-transparent focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* QUICK CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/explore"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-2xl font-bold text-xs shadow-card flex items-center gap-2 transition hover:scale-[1.02]"
                >
                  <span>Explore Restaurants</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/explore?tab=book"
                  className="bg-white hover:bg-sage/40 text-primary border border-gray-200 hover:border-primary/50 px-6 py-3.5 rounded-2xl font-bold text-xs shadow-subtle transition"
                >
                  Reserve a Table
                </Link>

                <div className="flex items-center gap-2 pl-2 text-xs text-muted font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Deposit Credited to Bill</span>
                </div>
              </div>
            </div>

            {/* RIGHT HERO PHOTO COLLAGE */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* MAIN IMAGE */}
                <div className="rounded-3xl overflow-hidden shadow-float border-4 border-white aspect-[4/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                    alt="Premium Restaurant Dining"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-black/40 px-2 py-0.5 rounded-md">
                      Featured Partner
                    </span>
                    <h3 className="text-lg font-bold mt-1">The Spice Pavilion</h3>
                    <p className="text-xs text-gray-200">Connaught Place • Table T-03 Ready</p>
                  </div>
                </div>

                {/* FLOATING PRE-ARRIVAL BADGE */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-float border border-gray-100 flex items-center gap-3.5 max-w-xs animate-float">
                  <div className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground">Zero Kitchen Wait</h4>
                    <p className="text-[11px] text-muted">Food served within 2 minutes of sitting down</p>
                  </div>
                </div>

                {/* FLOATING RATING BADGE */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-card border border-gray-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    4.9
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-foreground">50,000+ Diners</p>
                    <p className="text-[10px] text-muted">4.8★ Average Rating</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW EAZYDINE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sage/40 rounded-3xl p-8 lg:p-12 border border-sage-dark/40 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              REVOLUTIONARY DINING FLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              How EAZYDINE Works
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              From reservation to the final bite — seamless, timed perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Reserve Table',
                desc: 'Pick your favourite table by visual layout, date & time with instant confirmation.',
                icon: Calendar,
              },
              {
                step: '02',
                title: 'Pre-Order Food',
                desc: 'Order your starters, biryani, or pizzas before leaving your home or office.',
                icon: Utensils,
              },
              {
                step: '03',
                title: 'Smart Kitchen Prep',
                desc: 'The restaurant schedules prep so cooking finishes exactly when you arrive.',
                icon: ChefHat,
              },
              {
                step: '04',
                title: 'Zero-Wait Feast',
                desc: 'Walk in, check in at your table, and have hot food served right to you!',
                icon: Sparkles,
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-mono text-2xl font-black text-sage-dark">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-1">{s.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FOOD DISCOVERY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              EXPLORE BY CUISINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              What Are You Craving Today?
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {foodCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/explore?cuisine=${encodeURIComponent(cat.cuisine)}`}
              className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-subtle hover:shadow-card hover:border-primary/30 transition text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-muted">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST OFFERS & PROMOTIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-3xl p-6 shadow-card flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-white/20 text-accent-100 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                WELCOME OFFER
              </span>
              <h3 className="text-xl font-black leading-tight">100% Deposit Adjusted</h3>
              <p className="text-xs text-sage leading-relaxed">
                Your ₹200 table deposit is automatically deducted from your final food bill. No hidden fees.
              </p>
            </div>
            <Link
              href="/explore"
              className="mt-4 text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>Explore Eligible Tables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-accent to-accent-hover text-white rounded-3xl p-6 shadow-card flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                PRE-ORDER SPECIAL
              </span>
              <h3 className="text-xl font-black leading-tight">Complimentary Dessert</h3>
              <p className="text-xs text-orange-100 leading-relaxed">
                Pre-order any main course 45 mins before arrival and receive chef special desserts on the house!
              </p>
            </div>
            <Link
              href="/explore?tab=menu"
              className="mt-4 text-xs font-bold text-white hover:underline flex items-center gap-1"
            >
              <span>View Menus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-card flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-sage text-primary font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                FOR RESTAURANTS
              </span>
              <h3 className="text-xl font-black text-foreground leading-tight">Partner with EAZYDINE</h3>
              <p className="text-xs text-muted leading-relaxed">
                Turn your dining tables 40% faster by eliminating kitchen ordering latency. Join 500+ top restaurants.
              </p>
            </div>
            <Link
              href="/restaurant-admin"
              className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TRENDING RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              HOT IN {selectedCity.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              Trending Restaurants
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition"
          >
            <span>See All ({restaurants.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 6. TOP RATED RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              CRITICS & DINERS FAVORITE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              Top Rated Restaurants
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRatedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 7. RECOMMENDED FOR YOU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
              Recommended For You
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition"
          >
            <span>Explore More</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

    </div>
  );
}
