'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UtensilsCrossed, Sparkles, ChefHat, User as UserIcon, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleRoleLogin = (role: 'customer' | 'restaurant_owner' | 'admin') => {
    switchUserRole(role);
    if (role === 'customer') router.push('/dashboard');
    else if (role === 'restaurant_owner') router.push('/restaurant-admin');
    else router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-card border border-gray-100 overflow-hidden">
        {/* TOP BRAND HEADER */}
        <div className="bg-primary text-white p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white mx-auto shadow-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            EAZY<span className="text-accent">DINE</span>
          </h2>
          <p className="text-xs text-sage">
            Skip the Wait. Enjoy the Taste.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* INSTANT ONE-CLICK TEST LOGINS */}
          <div className="bg-sage/40 rounded-2xl p-4 border border-sage-dark/40 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Quick Test Demonstration Logins</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleLogin('customer')}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-primary text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <UserIcon className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold text-foreground">Customer</span>
                <span className="text-[9px] text-muted">Aarav</span>
              </button>

              <button
                onClick={() => handleRoleLogin('restaurant_owner')}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-accent text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <ChefHat className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold text-foreground">Restaurant</span>
                <span className="text-[9px] text-muted">Spice Pav.</span>
              </button>

              <button
                onClick={() => handleRoleLogin('admin')}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-primary text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold text-foreground">Admin</span>
                <span className="text-[9px] text-muted">Super Admin</span>
              </button>
            </div>
          </div>

          <div className="relative text-center">
            <span className="text-[11px] text-muted bg-white px-2 relative z-10 font-medium">
              or enter account details
            </span>
            <div className="absolute inset-0 top-1/2 border-t border-gray-100" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRoleLogin('customer');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl font-bold text-xs shadow-card flex items-center justify-center gap-2 transition hover:scale-[1.01]"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-muted">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-bold hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
