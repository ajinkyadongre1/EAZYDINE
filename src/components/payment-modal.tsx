'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { X, ShieldCheck, CreditCard, Smartphone, Building, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  billNumber: string;
  restaurantName: string;
  onPaymentSuccess: (method: string) => void;
}

export const PaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  amount,
  billNumber,
  restaurantName,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(method === 'upi' ? 'UPI' : method === 'card' ? 'Credit Card' : 'NetBanking');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* TOP RAZORPAY TEST SANDBOX BANNER */}
        <div className="bg-primary text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">EAZYDINE Pay</span>
                <span className="text-[10px] uppercase font-bold bg-white/20 text-accent-100 px-2 py-0.5 rounded-full">
                  Sandbox Test Mode
                </span>
              </div>
              <p className="text-[11px] text-sage truncate max-w-[200px]">{restaurantName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">Payment Successful!</h3>
              <p className="text-xs text-muted mt-1">Transaction Ref: EZD-TXN-{Date.now().toString().slice(-6)}</p>
              <p className="text-base font-black text-primary mt-2">{formatCurrency(amount)}</p>
            </div>
            <p className="text-xs text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200 font-medium">
              Reservation deposit was automatically credited. Digital receipt generated.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* INVOICE RECAP */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between text-xs border border-gray-100">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Total Payable</span>
                <span className="text-lg font-black text-primary">{formatCurrency(amount)}</span>
              </div>
              <div className="text-right">
                <span className="text-muted block text-[10px] uppercase font-bold">Invoice Ref</span>
                <span className="font-mono text-foreground font-semibold">{billNumber}</span>
              </div>
            </div>

            {/* PAYMENT METHOD CHOOSER */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Select Test Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'upi'
                      ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-foreground text-xs'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'card'
                      ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-foreground text-xs'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    method === 'netbanking'
                      ? 'border-accent bg-accent/10 text-accent font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-foreground text-xs'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>
            </div>

            {/* INPUT DETAILS ACCORDING TO METHOD */}
            {method === 'upi' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted">Test UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-muted block">
                  Simulating instant UPI payment response.
                </span>
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted">Test Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="12/28"
                    placeholder="MM/YY"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                  <input
                    type="password"
                    defaultValue="•••"
                    placeholder="CVV"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-foreground"
                  />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted">Choose Bank</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] text-muted justify-center pt-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>256-bit Encrypted Test Sandbox Gateway</span>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-2xl font-bold text-sm shadow-card transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? 'Simulating Bank Authorization...' : `Authorize & Pay ${formatCurrency(amount)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
