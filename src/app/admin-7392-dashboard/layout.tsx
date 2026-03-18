'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './components/Sidebar';
import { Menu, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      // Don't guard the login page itself
      if (pathname === '/admin-7392-dashboard/login') {
        setLoading(false);
        setAuthorized(true);
        return;
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin-7392-dashboard/login');
      } else {
        // Fetch role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        const userRole = userData?.role || 'customer';
        setRole(userRole);

        // Define Admin-only paths
        const adminOnlyPaths = [
          '/admin-7392-dashboard/categories',
          '/admin-7392-dashboard/products',
          '/admin-7392-dashboard/brands',
          '/admin-7392-dashboard/discounts',
          '/admin-7392-dashboard/deals',
          '/admin-7392-dashboard/login' // excluding login itself from the check below
        ];

        const isAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path));
        
        if (userRole === 'staff' && isAdminPath && pathname !== '/admin-7392-dashboard/login') {
          router.push('/admin-7392-dashboard/orders');
          return;
        }

        setAuthorized(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [pathname, router]);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!authorized && pathname !== '/admin-7392-dashboard/login') {
    return null; // Will redirect via useEffect
  }

  // Hide sidebar on login page
  const isLoginPage = pathname === '/admin-7392-dashboard/login';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
      
      {/* Mobile Top Header */}
      {!isLoginPage && (
        <header className="md:hidden bg-navy text-white flex items-center justify-between p-4 sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <span className="text-navy font-black text-xs">TPH</span>
            </div>
            <span className="font-bold tracking-tight">Admin Panel</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      )}

      {/* Sidebar Overlay (Mobile) & Fixed Sidebar (Desktop) */}
      {!isLoginPage && (
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden w-full relative", 
        !isLoginPage ? "p-4 md:p-8" : "p-0"
      )}>
        <div className={cn(!isLoginPage && "max-w-7xl mx-auto")}>
          {children}
        </div>
      </main>

      {/* Mobile Overlay Backdrop */}
      {!isLoginPage && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
