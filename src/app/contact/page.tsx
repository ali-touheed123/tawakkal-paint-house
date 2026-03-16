'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, Send } from 'lucide-react';
import { useSettings } from '@/lib/hooks/useSettings';
import { ReviewForm } from '@/components/ReviewForm';
import Link from 'next/link';

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to an API.
    // For now, we can smartly redirect this to WhatsApp!
    const text = `Hi, I'm ${formData.name}. ${formData.message}`;
    const whatsappUrl = `https://wa.me/${settings?.contact?.whatsapp || '923475658761'}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-navy text-white pt-[100px] md:pt-[120px] pb-24 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl xs:text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Get In <span className="text-gold">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Whether you are looking for product recommendations, need help with an order, or want to discuss a large industrial project, our team is here to assist you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* Left Column - Contact Info & Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10"
          >
            
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Call Us</h3>
                  <a href={`tel:${settings?.contact?.phone || '0347-5658761'}`} className="text-gray-400 hover:text-white transition-colors block">
                    {settings?.contact?.phone || '0347-5658761'}
                  </a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#25D366]/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366] mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">WhatsApp</h3>
                  <a href={`https://wa.me/${settings?.contact?.whatsapp || '923475658761'}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors block">
                    {settings?.contact?.whatsapp || '0347-5658761'}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 p-5 xs:p-8 rounded-3xl">
              <h3 className="text-xl xs:text-2xl font-heading font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm text-gray-400 px-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm text-gray-400 px-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm text-gray-400 px-1">Your Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gold text-navy font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                  <span>Chat on WhatsApp</span>
                  <Send size={18} />
                </button>
              </form>
            </div>

          </motion.div>

          {/* Right Column - Map & Location */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-2 flex-grow flex flex-col min-h-[400px]">
              {/* Map Visual / Link Area */}
              <div className="relative w-full h-[350px] md:h-auto rounded-2xl overflow-hidden bg-navy-light flex items-center justify-center flex-grow group">
                {/* Decorative Map Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10"></div>
                
                <div className="relative z-20 text-center p-6">
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <MapPin className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Visit Our Store</h3>
                  <p className="text-gray-400 mb-8 max-w-xs mx-auto">Get precise directions to our flagship location in Karachi.</p>
                  
                  <Link 
                    href="https://maps.app.goo.gl/yeUVP3qL9Qmsj2vm8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-navy font-bold px-8 py-4 rounded-full hover:bg-gold hover:text-navy transition-all duration-300 hover:shadow-lg shadow-black/50"
                  >
                    <MapPin size={18} />
                    Open in Google Maps
                  </Link>
                </div>
              </div>
              
              {/* Written Address */}
              <div className="p-6 md:p-8 flex items-start gap-4 mt-auto">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Tawakkal Paint House</h4>
                  <p className="text-gray-400 leading-relaxed">
                    VWCC+4RG, Hawks Bay Rd, Mauripur, <br/>
                    Kemari Town, Keamari, Karachi, 75750, Pakistan
                  </p>
                  <p className="text-gold text-sm font-medium mt-3 flex items-center gap-2">
                    <Clock size={14} /> Open Mon-Sat, 9AM to 8PM
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Review Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Been to our shop?</h2>
            <p className="text-gray-400">Share your experience with the world. We value your feedback!</p>
          </div>
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
