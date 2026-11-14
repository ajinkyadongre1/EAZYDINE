'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Sparkles, ChefHat, User as UserIcon, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    switchUserRole,
    currentUser,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurant_owner'>('customer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(role);
    setIsAuthModalOpen(false);
  };

  const handleQuickDemo = (roleChoice: 'customer' | 'restaurant_owner' | 'admin') => {
    switchUserRole(roleChoice);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-primary text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </span>
          <h3 className="text-xl font-black mt-1">
            {authMode === 'login' ? 'Sign in to EAZYDINE' : 'Join the Zero-Wait Dining Revolution'}
          </h3>
          <p className="text-xs text-sage mt-1">
            Skip the Wait. Enjoy the Taste.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* 1-CLICK QUICK DEMO ACCOUNTS */}
          <div className="bg-sage/40 rounded-2xl p-4 border border-sage-dark/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Instant Demo One-Click Login</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <UserIcon className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-foreground">Customer</span>
                <span className="text-[9px] text-muted">Aarav</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('restaurant_owner')}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-accent text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <ChefHat className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-bold text-foreground">Owner</span>
                <span className="text-[9px] text-muted">Spice Pav.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary text-center transition flex flex-col items-center gap-1 shadow-subtle"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-foreground">Admin</span>
                <span className="text-[9px] text-muted">Platform</span>
              </button>
            </div>
          </div>

          <div className="relative text-center">
            <span className="text-[11px] text-muted bg-white px-2 relative z-10 font-medium">
              or enter your credentials
            </span>
            <div className="absolute inset-0 top-1/2 border-t border-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
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
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
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
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs shadow-card flex items-center justify-center gap-2 transition"
            >
              <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-muted pt-1">
            {authMode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-accent font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-accent font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
