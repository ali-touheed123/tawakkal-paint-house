'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/lib/hooks/useSettings';

export function WhatsAppFloat() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Hide WhatsApp button on admin dashboard
  if (pathname?.startsWith('/admin-7392-dashboard')) return null;
  return (
    <a
      href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-400 transition-all duration-300 animate-pulse-whatsapp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
