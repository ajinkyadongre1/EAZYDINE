'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  MapPin,
  Sparkles,
  ArrowRight,
  Receipt,
  AlertCircle,
  Flame,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  order: Order;
}

const ORDER_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: 'Order Placed',
    label: 'Order Placed',
    description: 'Received by restaurant concierge & queued for kitchen scheduling.',
  },
  {
    status: 'Accepted',
    label: 'Accepted by Kitchen',
    description: 'Executive Chef reviewed your dishes and synchronized cook time.',
  },
  {
    status: 'Scheduled',
    label: 'Prep Scheduled',
    description: 'Ingredients prepped; cook fire timed to your estimated arrival.',
  },
  {
    status: 'Preparing',
    label: 'Cooking on Fire',
    description: 'Tandoor & woks fired up! Your meal is actively being cooked.',
  },
  {
    status: 'Ready to Serve',
    label: 'Plated & Ready',
    description: 'Food is kept warm in thermal cloches waiting for your arrival.',
  },
  {
    status: 'Customer Arrived',
    label: 'Customer Seated',
    description: 'Diner checked in at table. Waitstaff dispatched with food trays.',
  },
  {
    status: 'Served',
    label: 'Served at Table',
    description: 'Piping hot dishes served. Enjoy your zero-wait dining experience!',
  },
];

export const OrderTracker: React.FC<Props> = ({ order }) => {
  const router = useRouter();
  const { markCustomerArrived, bills, generateBillForOrder } = useStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      markCustomerArrived(order.id);
      setIsCheckingIn(false);
    }, 600);
  };

  const bill = bills.find((b) => b.orderId === order.id);

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-card space-y-8 max-w-4xl mx-auto">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              LIVE PRE-ARRIVAL TRACKER
            </span>
            <span className="text-xs text-muted font-mono">#{order.id}</span>
          </div>
          <h2 className="text-2xl font-black text-foreground mt-1">
            {order.restaurantName}
          </h2>
          <p className="text-xs text-muted flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>Designated Table: <strong className="text-primary font-bold">{order.tableNumber}</strong></span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Target Arrival: <strong className="text-foreground">{order.arrivalTime}</strong></span>
          </p>
        </div>

        {/* STATUS PILL */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Current Status</span>
          <span className="text-sm font-black text-primary bg-sage px-3 py-1 rounded-xl">
            {order.status}
          </span>
        </div>
      </div>

      {/* ARRIVAL CHECK-IN INTERACTION CARD */}
      {order.status !== 'Served' && order.status !== 'Completed' ? (
        <div className="bg-gradient-to-r from-primary-50 to-sage/50 border border-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent animate-spin" />
              Diner Arrival Verification
            </span>
            <h4 className="font-bold text-foreground text-sm sm:text-base">
              Have you reached Table {order.tableNumber}?
            </h4>
            <p className="text-xs text-muted max-w-md leading-relaxed">
              Click the check-in button below when seated. The staff will immediately bring your pre-cooked steaming dishes to Table {order.tableNumber}.
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={order.status === 'Customer Arrived' || isCheckingIn}
            className={`py-3.5 px-6 rounded-2xl font-bold text-xs shadow-card flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98] ${
              order.status === 'Customer Arrived'
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-accent hover:bg-accent-hover text-white'
            }`}
          >
            {isCheckingIn ? (
              <span>Notifying Staff...</span>
            ) : order.status === 'Customer Arrived' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Checked In! Staff On Way</span>
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-4 h-4" />
                <span>I Have Arrived at Table {order.tableNumber}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* CELEBRATION CARD FOR SERVED */
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">Food Served at Table {order.tableNumber}!</h4>
              <p className="text-xs text-emerald-700">Hope you enjoyed zero-wait dining. Your digital bill is ready.</p>
            </div>
          </div>

          <Link
            href={`/bill/${bill?.id || order.id}`}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-subtle flex items-center gap-2 transition"
          >
            <Receipt className="w-4 h-4" />
            <span>View Digital Bill & Pay</span>
          </Link>
        </div>
      )}

      {/* 7-STEP PROGRESS TIMELINE */}
      <div className="space-y-6 pt-2">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Live Kitchen & Serving Progression</span>
        </h4>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* STEP INDICATOR DOT */}
                <div
                  className={`absolute -left-6 sm:-left-8 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-subtle ${
                    isCompleted
                      ? 'bg-primary text-white ring-4 ring-sage'
                      : isCurrent
                      ? 'bg-accent text-white ring-4 ring-accent/20 animate-pulse'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="pt-0.5">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`text-xs sm:text-sm font-bold ${
                        isCurrent
                          ? 'text-accent'
                          : isCompleted
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h5>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ORDERED DISHES SUMMARY */}
      <div className="pt-6 border-t border-gray-100 space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Ordered Dishes ({order.items.length} items)
        </h4>

        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
          {order.items.map((item) => (
            <div key={item.menuItemId} className="p-4 bg-gray-50/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.isVeg ? 'bg-green-600' : 'bg-red-600'
                  }`}
                />
                <span className="font-bold text-foreground">{item.name}</span>
                <span className="text-muted">× {item.quantity}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" /> {item.prepTimeMinutes}m
                </span>
                <span className="font-bold text-foreground">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PRICING BREAKDOWN & DEPOSIT OFFSET */}
        <div className="bg-sage/20 rounded-2xl p-4 text-xs space-y-1.5 border border-sage-dark/30">
          <div className="flex justify-between text-muted">
            <span>Food Subtotal</span>
            <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Taxes (5% GST) & Service</span>
            <span className="font-medium text-foreground">{formatCurrency(order.tax + order.serviceCharge)}</span>
          </div>
          <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            <span>Table Deposit Offset</span>
            <span>- {formatCurrency(order.depositDeducted)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-primary">
            <span>Final Amount to Pay at Table</span>
            <span>{formatCurrency(order.finalPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
