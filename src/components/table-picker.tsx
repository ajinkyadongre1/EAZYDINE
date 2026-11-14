'use client';

import React, { useState } from 'react';
import { Restaurant, RestaurantTable } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  restaurant: Restaurant;
  initialTime?: string;
}

export const TablePicker: React.FC<Props> = ({ restaurant, initialTime }) => {
  const router = useRouter();
  const { createReservation, reservations } = useStore();

  const [date, setDate] = useState('Today');
  const [time, setTime] = useState(initialTime || restaurant.availableTimes[0] || '7:00 PM');
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedReservationId, setConfirmedReservationId] = useState<string | null>(null);

  // Filter tables: capacity >= guests and status === 'available'
  const tables = restaurant.tables || [];

  const handleBookTable = () => {
    if (!selectedTable) return;

    // Check double-booking prevention
    const alreadyBooked = reservations.some(
      (r) =>
        r.restaurantId === restaurant.id &&
        r.tableId === selectedTable.id &&
        r.date === date &&
        r.time === time &&
        r.status === 'confirmed'
    );

    if (alreadyBooked) {
      alert('This table has just been reserved by another guest for this slot. Please pick another table.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = createReservation({
        restaurantId: restaurant.id,
        tableId: selectedTable.id,
        guestCount: guests,
        date,
        time,
        depositAmount: restaurant.depositAmount,
        notes,
      });

      setConfirmedReservationId(res.id);
      setIsProcessing(false);
    }, 700);
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedReservationId) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-primary/20 shadow-float text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>

        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            RESERVATION CONFIRMED
          </span>
          <h3 className="text-2xl font-black text-foreground mt-1">
            Table {selectedTable?.tableNumber} Reserved!
          </h3>
          <p className="text-xs text-muted mt-1 font-mono">
            Booking ID: <strong className="text-foreground">{confirmedReservationId}</strong>
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-sage/40 rounded-2xl p-5 text-left text-xs space-y-2 border border-sage-dark/40">
          <div className="flex justify-between">
            <span className="text-muted">Restaurant:</span>
            <span className="font-bold text-foreground">{restaurant.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Date & Time:</span>
            <span className="font-bold text-foreground">{date} at {time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Party Size:</span>
            <span className="font-bold text-foreground">{guests} Guests ({selectedTable?.type})</span>
          </div>
          <div className="flex justify-between border-t border-sage-dark/40 pt-2 text-emerald-800 font-bold">
            <span>Deposit Paid (Credit toward food):</span>
            <span>{formatCurrency(restaurant.depositAmount)}</span>
          </div>
        </div>

        {/* EAZYDINE SPECIAL HIGHLIGHT: ORDER BEFORE YOU ARRIVE */}
        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-3xl shadow-card text-left space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-spin" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-accent-100">
              EAZYDINE SPECIAL FEATURE
            </span>
          </div>
          <h4 className="text-lg font-black leading-tight">
            Order Before You Arrive & Skip the Wait!
          </h4>
          <p className="text-xs text-sage leading-relaxed">
            Select your favorite dishes now. The chef will time the cooking so your meal arrives steaming hot at Table {selectedTable?.tableNumber} right as you sit down!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                router.push(`/order/${restaurant.id}?resId=${confirmedReservationId}`);
              }}
              className="flex-1 bg-accent hover:bg-accent-hover text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition hover:scale-[1.02]"
            >
              <span>Order Food Now (Pre-Arrival)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                router.push(`/dashboard?tab=reservations`);
              }}
              className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-bold text-xs transition"
            >
              View in Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-card space-y-8">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Guaranteed Seating & Zero Wait Times</span>
        </div>
        <h3 className="text-2xl font-black text-foreground mt-1">
          Reserve a Table at {restaurant.name}
        </h3>
        <p className="text-xs text-muted mt-1">
          Select your date, guest count, and your favorite table from the interactive floor layout.
        </p>
      </div>

      {/* STEP 1 & 2: DATE SELECTOR */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Step 1: Choose Date</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {['Today', 'Tomorrow', 'This Friday', 'This Saturday'].map((d) => (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={`py-3 px-4 rounded-2xl text-xs font-bold border transition ${
                date === d
                  ? 'border-primary bg-primary text-white shadow-card'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 text-foreground'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 3: GUESTS COUNT */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          <span>Step 2: Number of Guests</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
            <button
              key={num}
              onClick={() => {
                setGuests(num);
                // Clear selected table if capacity < num
                if (selectedTable && selectedTable.capacity < num) {
                  setSelectedTable(null);
                }
              }}
              className={`w-12 h-12 rounded-2xl text-xs font-bold border transition flex items-center justify-center ${
                guests === num
                  ? 'border-accent bg-accent text-white shadow-card'
                  : 'border-gray-200 bg-white hover:border-accent/40 text-foreground'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 4: TIME SLOT */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          <span>Step 3: Arrival Time</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {restaurant.availableTimes.map((slot) => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                time === slot
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-white text-foreground'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 5 & 6: INTERACTIVE TABLE SELECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Step 4: Select Your Table</span>
          </label>
          <span className="text-[11px] text-muted">
            Filtered for party of {guests}+
          </span>
        </div>

        {/* VISUAL FLOOR LAYOUT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {tables.map((table) => {
            const isFit = table.capacity >= guests;
            const isOccupied = table.status === 'occupied';
            const isSelected = selectedTable?.id === table.id;

            return (
              <button
                key={table.id}
                disabled={!isFit || isOccupied}
                onClick={() => setSelectedTable(table)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-28 relative ${
                  isSelected
                    ? 'border-2 border-primary bg-sage/60 shadow-card'
                    : isOccupied
                    ? 'border-gray-100 bg-gray-100/70 text-gray-400 cursor-not-allowed opacity-60'
                    : !isFit
                    ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {table.tableNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-100 text-muted">
                    {table.capacity} Seats
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-primary">{table.type}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {isOccupied ? 'Occupied' : isFit ? 'Available' : 'Too small'}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SPECIAL REQUESTS */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">
          Dining Notes / Special Requests (Optional)
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Anniversary celebration, high chair needed, quiet corner..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {/* STEP 7 & 8: DEPOSIT AND CONFIRMATION BREAKDOWN */}
      <div className="bg-sage/30 rounded-3xl p-5 border border-sage-dark/30 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Table Deposit (Refundable/Adjustable):</span>
          <span className="font-bold text-foreground">{formatCurrency(restaurant.depositAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>100% credited toward your food bill when dining.</span>
          </div>
        </div>

        <button
          onClick={handleBookTable}
          disabled={!selectedTable || isProcessing}
          className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold text-sm shadow-card flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isProcessing ? (
            <span>Securing Your Table...</span>
          ) : (
            <>
              <span>
                {selectedTable
                  ? `Pay ${formatCurrency(restaurant.depositAmount)} & Confirm Table ${selectedTable.tableNumber}`
                  : 'Select a Table Above to Proceed'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
