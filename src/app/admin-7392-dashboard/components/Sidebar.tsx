'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Percent, 
  LogOut,
  Home,
  Briefcase,
  Layers,
  Star,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Dashboard', href: '/admin-7392-dashboard', icon: LayoutDashboard, adminOnly: false },
  { name: 'Orders', href: '/admin-7392-dashboard/orders', icon: ShoppingBag, adminOnly: false },
  { name: 'Categories', href: '/admin-7392-dashboard/categories', icon: Layers, adminOnly: true },
  { name: 'Brands', href: '/admin-7392-dashboard/brands', icon: Tag, adminOnly: true },
  { name: 'Products', href: '/admin-7392-dashboard/products', icon: Package, adminOnly: true },
  { name: 'Reviews', href: '/admin-7392-dashboard/reviews', icon: Star, adminOnly: false },
  { name: 'Discounts', href: '/admin-7392-dashboard/discounts', icon: Percent, adminOnly: true },
  { name: 'Deals', href: '/admin-7392-dashboard/deals', icon: Briefcase, adminOnly: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function getRole() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (data) setRole(data.role);
      }
    }
    getRole();
  }, []);

  const isAdmin = role === 'admin';
  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className={cn(
      "w-64 bg-navy text-white flex flex-col h-screen shadow-xl",
      "fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
      // On mobile, slide in/out based on isOpen. On desktop, always show.
      !isOpen ? "-translate-x-full md:translate-x-0" : "translate-x-0"
    )}>
      {/* Header (Hidden on Mobile, handled by layout header) */}
      <div className="hidden md:flex p-6 border-b border-white/10 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-navy font-black text-xs">TPH</span>
          </div>
          Admin Panel
        </h1>
      </div>
      
      {/* Mobile Header (For when drawer is open) */}
      <div className="flex md:hidden p-4 border-b border-white/10 items-center justify-between mt-1">
        <h2 className="text-lg font-bold tracking-tight text-white/90">Navigation</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-gold text-navy shadow-lg font-bold" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                isActive ? "text-navy" : "text-white/40 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <Home size={20} className="text-white/40" />
          View Store
        </Link>
        <button 
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/admin-7392-dashboard/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
