'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="flex-1 sm:flex-none border border-navy/20 hover:border-navy text-navy py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
            <Printer size={15} />
            Print Rate Card
        </button>
    );
}
