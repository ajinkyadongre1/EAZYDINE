'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { OrderTracker } from '@/components/order-tracker';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <p className="text-xs text-muted">No active order was found matching ID #{orderId}</p>
        <Link
          href="/dashboard?tab=orders"
          className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* TOP NAVIGATION BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard?tab=orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>Real-Time Kitchen Sync Active</span>
        </span>
      </div>

      {/* TRACKER COMPONENT */}
      <OrderTracker order={order} />
    </div>
  );
}
