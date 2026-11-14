import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTimeAgo(timestamp: string): string {
  return timestamp;
}

export function calculateEstimatedReadyTime(arrivalTime: string, prepMinutes: number): string {
  return `Target: ${arrivalTime} (Cooking starts ~${prepMinutes}m prior)`;
}

export const CITIES = [
  'New Delhi',
  'Bengaluru',
  'Mumbai',
  'Gurugram',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
];

export const CUISINES_LIST = [
  'All Cuisines',
  'North Indian',
  'Mughlai',
  'Italian',
  'Pizza',
  'Biryani',
  'Pan-Asian',
  'Chinese',
  'Burgers',
  'South Indian',
  'Continental',
  'Desserts',
];
