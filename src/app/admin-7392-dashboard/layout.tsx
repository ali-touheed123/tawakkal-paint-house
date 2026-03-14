'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './components/Sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
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
        setAuthorized(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [pathname, router]);

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
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {!isLoginPage && <Sidebar />}
      
      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto", !isLoginPage ? "p-8" : "p-0")}>
        <div className={cn(!isLoginPage && "max-w-7xl mx-auto")}>
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
