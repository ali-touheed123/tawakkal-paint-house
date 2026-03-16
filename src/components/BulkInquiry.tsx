'use client';

import { motion } from 'framer-motion';
import { Building2, MessageSquare, PhoneCall, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function BulkInquiry() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="my-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-navy rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-gold/20 shadow-2xl shadow-navy/40"
      >
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
              <Building2 size={16} className="text-gold" />
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Project Supply Division</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1]">
              Bulk Supply for <span className="text-gold">Large Projects?</span>
            </h2>
            
            <p className="text-gray-400 text-lg max-w-lg font-medium leading-relaxed">
              We provide exclusive contractor pricing and end-to-end supply solutions for construction projects, apartments, and industrial sites across Karachi.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="https://wa.me/923475658761?text=Hi, I am interested in bulk project supply."
                target="_blank"
                className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-navy font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquare size={20} />
                Get a Bulk Quote
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="tel:+923475658761"
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all"
              >
                <PhoneCall size={18} />
                Call Project Manager
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Priority Delivery', desc: 'Direct to site' },
              { label: 'Original Seal', desc: 'Factory guaranteed' },
              { label: 'Project Support', desc: 'Technical guidance' },
              { label: 'Custom Shades', desc: 'Bulk matching' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-gold/30 transition-colors group"
              >
                <p className="text-gold font-bold text-lg mb-1">{feature.label}</p>
                <p className="text-gray-500 text-sm font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
