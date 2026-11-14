import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { RoleBanner } from '@/components/role-banner';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { AuthModal } from '@/components/auth-modal';

export const metadata: Metadata = {
  title: 'EAZYDINE | Skip the Wait. Enjoy the Taste.',
  description: 'The next-generation dining platform. Reserve your table, pre-order your food, and have it ready right when you arrive.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <RoleBanner />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <AuthModal />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
