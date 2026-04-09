'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { ValuePromotion } from './ValuePromotion';

interface HomeHeroProps {
  settings: any;
}

export function HomeHero({ settings }: HomeHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <Image
          src={settings?.banners?.[0] || '/home-hero.jpeg'}
          alt="Hero Background"
          fill
          priority
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          sizes="100vw"
          quality={40}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gold text-xs font-bold uppercase tracking-widest">Karachi's #1 Paint House</span>
            </div>
            
            <h1 className="font-heading text-5xl xs:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1] mb-6 tracking-tighter">
              Paint Your <br />
              <span className="text-gold italic">Dream Space.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
              Karachi&apos;s most trusted destination for premium paints. 
              <span className="text-white font-bold"> Shop directly for wholesale rates</span> or enjoy <span className="text-gold font-bold">Free Professional Application.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#categories"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-black hover:bg-gold-light transition-all active:scale-95 text-base shadow-[0_10px_30px_rgba(184,134,11,0.3)]"
              >
                Start Shopping <ArrowRight size={20} />
              </Link>
              <Link
                href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=Hi! I need help with paint.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95 text-base"
              >
                <MessageCircle size={20} className="text-green-500" /> Free Advice
              </Link>
            </div>

            <ValuePromotion />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-gold rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
