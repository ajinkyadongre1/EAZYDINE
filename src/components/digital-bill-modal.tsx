'use client';

import React, { useState } from 'react';
import { DigitalBill } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  Printer,
  Download,
  CheckCircle2,
  Receipt,
  QrCode,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { PaymentModal } from './payment-modal';

interface Props {
  bill: DigitalBill;
}

export const DigitalBillModal: React.FC<Props> = ({ bill }) => {
  const { payBill } = useStore();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentSuccess = (method: string) => {
    payBill(bill.id, method);
    setIsPaymentOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-float max-w-2xl mx-auto space-y-6">
      {/* INVOICE TOP BAR */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-sage px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Official Tax Invoice
            </span>
            {bill.status === 'paid' ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                PAYMENT PENDING
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-foreground mt-2">{bill.restaurantName}</h2>
          <p className="text-xs text-muted font-mono mt-0.5">GSTIN: {bill.restaurantGstin}</p>
        </div>

        <div className="text-right text-xs">
          <p className="font-mono font-bold text-foreground text-sm">{bill.billNumber}</p>
          <p className="text-muted mt-0.5">{bill.date}</p>
          <p className="text-primary font-bold mt-1">Table: {bill.tableNumber}</p>
        </div>
      </div>

      {/* CUSTOMER & BOOKING RECAP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/80 rounded-2xl p-4 text-xs">
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Diner Name</span>
          <span className="font-bold text-foreground">{bill.customerName}</span>
        </div>
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Booking ID</span>
          <span className="font-mono font-bold text-foreground">{bill.reservationId}</span>
        </div>
        <div>
          <span className="text-muted block text-[10px] uppercase font-bold">Order ID</span>
          <span className="font-mono font-bold text-foreground">{bill.orderId}</span>
        </div>
      </div>

      {/* ITEMIZED TABLE */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Itemized Breakdown</h4>
        <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="bg-gray-100/70 p-3 text-[11px] font-bold text-muted grid grid-cols-12 uppercase tracking-wider">
            <span className="col-span-6">Dish Name</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {bill.items.map((item) => (
            <div key={item.menuItemId} className="p-3 text-xs grid grid-cols-12 items-center">
              <span className="col-span-6 font-semibold text-foreground flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                {item.name}
              </span>
              <span className="col-span-2 text-center font-bold text-muted">{item.quantity}</span>
              <span className="col-span-2 text-right text-muted">{formatCurrency(item.price)}</span>
              <span className="col-span-2 text-right font-bold text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DEPOSIT ADJUSTMENT & CALCULATION - AS HIGHLIGHTED IN REQUIREMENT #9 */}
      <div className="bg-sage/20 border border-sage-dark/30 rounded-2xl p-5 space-y-2 text-xs">
        <div className="flex justify-between text-muted">
          <span>Food Subtotal</span>
          <span className="font-medium text-foreground">{formatCurrency(bill.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>GST (5% SGST + CGST)</span>
          <span className="font-medium text-foreground">{formatCurrency(bill.tax)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Service Charge</span>
          <span className="font-medium text-foreground">{formatCurrency(bill.serviceCharge)}</span>
        </div>
        <div className="flex justify-between text-muted font-bold pt-1 border-t border-gray-200">
          <span>Gross Bill Amount</span>
          <span className="text-foreground">{formatCurrency(bill.grossTotal)}</span>
        </div>

        {/* PROMINENT DEPOSIT DEDUCTION CARD */}
        <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl font-bold my-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Table Reservation Deposit Already Paid</span>
          </div>
          <span className="text-emerald-700">- {formatCurrency(bill.depositPaid)}</span>
        </div>

        {/* FINAL PAYABLE AMOUNT */}
        <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base font-black text-primary">
          <span>FINAL AMOUNT TO PAY:</span>
          <span className="text-xl text-accent">{formatCurrency(bill.finalPayable)}</span>
        </div>
      </div>

      {/* QR CODE & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl p-1.5 flex items-center justify-center">
            <QrCode className="w-full h-full text-primary" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-foreground block">UPI Instant Pay QR</span>
            <span className="text-[10px] text-muted">Scan to pay at table or pay digitally</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-foreground transition"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>

          {bill.status === 'unpaid' ? (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent-hover text-white py-3 px-6 rounded-xl font-bold text-xs shadow-card flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Final Bill ({formatCurrency(bill.finalPayable)})</span>
            </button>
          ) : (
            <div className="bg-emerald-600 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid in Full</span>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL INTEGRATION */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={bill.finalPayable}
        billNumber={bill.billNumber}
        restaurantName={bill.restaurantName}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
