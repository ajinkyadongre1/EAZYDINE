# EAZYDINE 🍽️
> **"Skip the Wait. Enjoy the Taste."**

A next-generation restaurant platform combining food discovery (Zomato), food ordering & cart management (Swiggy), and table reservation systems into a unified, zero-wait **Pre-Arrival Dining Platform**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajinkyadongre1%2FEAZYDINE)

---

## 🌟 The Innovation: Pre-Arrival Dining Flow

In conventional dining, customers arrive at a restaurant and face a 25–40 minute delay while waiting for menus, placing orders, and kitchen preparation. 

**EAZYDINE solves this completely:**
1. **Diners reserve a table** and choose their exact seating (Window, Booth, Center, VIP).
2. **Pre-Order food** before traveling from home or the office.
3. **Smart Kitchen Synchronization** schedules cook times so dishes are ready the exact moment diners sit down.
4. **Table Check-In**: Diners click *"I Have Arrived at Table X"* upon sitting down; hot food is served within 2 minutes.
5. **Deposit Offset**: The reservation deposit (e.g. ₹200) is automatically credited on the digital final bill.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Homepage & Discovery:** Location selector, cuisine search, trending collections, and category cards.
- **Restaurant Explorer:** Multi-filter search (cuisine, rating 4.5+, price brackets ₹–₹₹₹₹, veg/non-veg, table availability).
- **Storefronts:** Overview, menus, visual table layout, and verified diner reviews.
- **8-Step Table Booking:** Visual floor map, guest selection, and database-level double-booking prevention.
- **Live 7-Stage Pre-Order Tracker:** Real-time updates (`Order Placed` → `Accepted` → `Scheduled` → `Preparing` → `Ready` → `Customer Arrived` → `Served`).
- **Digital Tax Invoices:** Automatic deposit deduction, printable receipts, and simulated Razorpay test payment modal (UPI, Cards, NetBanking).
- **Personal Dashboard:** Manage bookings, track pre-orders, view invoices, and toggle saved restaurants.

### 👨‍🍳 Restaurant Owner SaaS Portal (`/restaurant-admin`)
- **Live Kitchen Display System (KDS):** Manage cooking stages and synchronize dish prep with arrival times.
- **Table Floor Management:** Visual floor plan showing available, reserved, and occupied tables.
- **Menu Management:** Add dishes with images, edit pricing, cook times, and toggle in-stock/out-of-stock.
- **Billing & POS:** Review dining checks and settle final bills.
- **Analytics:** Turnaround metrics (42% faster) and no-show reductions.

### 🛡️ Super Admin Panel (`/admin`)
- **Platform GMV & Commission:** Real-time metrics and take-rate monitoring.
- **Partner Approvals:** Review and approve or reject new restaurant applications.
- **Deposit Escrow Management:** Transparent ledger tracking holding and settlement of reservation deposits.
- **Dispute Resolution:** Handle concierge support tickets and customer feedback.

### 🎭 Instant Demo Persona Switcher
A top banner enables instant switching between:
- 👤 **Customer** (*Aarav Sharma*)
- 👨‍🍳 **Restaurant Owner** (*Chef Rajesh Kapoor - The Spice Pavilion*)
- 🛡️ **Super Admin** (*Vikramaditya Roy*)

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom palette: `#FAF9F6`, `#245640`, `#F28C45`, `#E8F0E8`)
- **Icons:** Lucide React
- **State Management:** React Context + LocalStorage persistent state engine
- **Deployment:** Vercel (zero-config, plug-and-play)

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ajinkyadongre1/EAZYDINE.git
   cd EAZYDINE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deploying to Vercel

This repository is optimized for one-click deployment on [Vercel](https://vercel.com):

1. Push your changes to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `EAZYDINE` repository.
4. Select **Next.js** framework preset (detected automatically).
5. Click **"Deploy"**.

No environment variables are required for initial evaluation as the platform includes built-in realistic mock data and state persistence.

---

## 📄 License

MIT License. Built for modern food-tech innovation.
