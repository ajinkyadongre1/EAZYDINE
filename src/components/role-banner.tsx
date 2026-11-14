'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { ChefHat, ShieldCheck, User as UserIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const RoleBanner: React.FC = () => {
  const { currentUser, switchUserRole } = useStore();

  return (
    <div className="bg-primary-700 text-white text-xs py-2 px-4 shadow-inner border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-accent-100 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            LIVE DEMO PERSONA
          </span>
          <span className="text-gray-200 hidden sm:inline">
            Active: <strong className="text-white font-medium">{currentUser.name}</strong> ({currentUser.role === 'customer' ? 'Diner' : currentUser.role === 'restaurant_owner' ? 'Spice Pavilion Owner' : 'Platform Admin'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-[11px] font-medium hidden md:inline">Switch Role:</span>

          <button
            onClick={() => switchUserRole('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              currentUser.role === 'customer'
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => switchUserRole('restaurant_owner')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              currentUser.role === 'restaurant_owner'
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Restaurant Owner</span>
          </button>

          <button
            onClick={() => switchUserRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              currentUser.role === 'admin'
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin</span>
          </button>

          {/* Quick links to active role portal */}
          {currentUser.role === 'restaurant_owner' && (
            <Link
              href="/restaurant-admin"
              className="ml-2 bg-white text-primary font-bold px-2 py-0.5 rounded text-[11px] hover:bg-gray-100 transition shadow"
            >
              Open Owner KDS →
            </Link>
          )}

          {currentUser.role === 'admin' && (
            <Link
              href="/admin"
              className="ml-2 bg-white text-primary font-bold px-2 py-0.5 rounded text-[11px] hover:bg-gray-100 transition shadow"
            >
              Open Admin Panel →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
