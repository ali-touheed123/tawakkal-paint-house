'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Percent, 
  LogOut,
  Home,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Dashboard', href: '/admin-7392-dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin-7392-dashboard/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin-7392-dashboard/products', icon: Package },
  { name: 'Discounts', href: '/admin-7392-dashboard/discounts', icon: Percent },
  { name: 'Deals', href: '/admin-7392-dashboard/deals', icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy text-white flex flex-col sticky top-0 h-screen shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-navy font-black text-xs">TPH</span>
          </div>
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
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
