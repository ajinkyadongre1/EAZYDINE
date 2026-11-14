'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DigitalBillModal } from '@/components/digital-bill-modal';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BillPage() {
  const params = useParams();
  const router = useRouter();
  const billIdOrOrderId = params?.id as string;
  const { bills, orders, generateBillForOrder } = useStore();

  let bill = bills.find((b) => b.id === billIdOrOrderId || b.orderId === billIdOrOrderId);

  // If bill not yet generated for order, generate it on the fly
  if (!bill) {
    const order = orders.find((o) => o.id === billIdOrOrderId);
    if (order) {
      bill = generateBillForOrder(order.id);
    } else {
      bill = bills[0];
    }
  }

  if (!bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Bill not found</h2>
        <Link
          href="/dashboard"
          className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard?tab=orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <DigitalBillModal bill={bill} />
    </div>
  );
}
