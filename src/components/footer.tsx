'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-700 text-white pt-16 pb-10 border-t border-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BRAND & NEWSLETTER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                EAZY<span className="text-accent">DINE</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              The next-generation dining ecosystem. Reserve premier tables, pre-order your meals, and experience zero wait times with piping hot food served the moment you arrive.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-accent mb-4">Discover</h4>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li><Link href="/explore" className="hover:text-white transition">Explore Restaurants</Link></li>
                <li><Link href="/explore?cuisine=Indian" className="hover:text-white transition">Royal Indian & Mughlai</Link></li>
                <li><Link href="/explore?cuisine=Italian" className="hover:text-white transition">Wood-Fired Pizzas</Link></li>
                <li><Link href="/explore?cuisine=Pan-Asian" className="hover:text-white transition">Pan-Asian & Dim Sum</Link></li>
                <li><Link href="/explore?tab=book" className="hover:text-white transition">Instant Table Booking</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-accent mb-4">For Restaurants</h4>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li><Link href="/restaurant-admin" className="hover:text-white transition">Partner With Us</Link></li>
                <li><Link href="/restaurant-admin" className="hover:text-white transition">Kitchen Display System (KDS)</Link></li>
                <li><Link href="/restaurant-admin" className="hover:text-white transition">Table Management</Link></li>
                <li><Link href="/restaurant-admin" className="hover:text-white transition">Restaurant Owner Login</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">Platform Governance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-accent mb-4">Support & Legal</h4>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li><span className="hover:text-white cursor-pointer transition">How EAZYDINE Works</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Deposit Refund Policy</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Frequently Asked Questions</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Terms & Conditions</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTACT & COPYRIGHT */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent" />
              +91 11 4000 8888 (24x7 Concierge)
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent" />
              support@eazydine.com
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Connaught Place, New Delhi, India
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>© 2026 EAZYDINE Technologies Pvt Ltd. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
