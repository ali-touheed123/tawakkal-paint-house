'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Minus, DoorOpen, Layout } from 'lucide-react';
import { PAINT_TYPES } from '@/types';

interface PaintCalculatorProps {
  compact?: boolean;
}

export function PaintCalculator({ compact = false }: PaintCalculatorProps) {
  const [paintType, setPaintType] = useState(PAINT_TYPES[0]);
  const [dimensionsMode, setDimensionsMode] = useState<'dimensions' | 'area'>('dimensions');
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(10);
  const [directArea, setDirectArea] = useState(500);
  const [coats, setCoats] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [numDoors, setNumDoors] = useState(0);
  const [numWindows, setNumWindows] = useState(0);

  const coverageRate = paintType.coverage;

  const calculation = useMemo(() => {
    let wallArea: number;

    if (dimensionsMode === 'dimensions') {
      wallArea = 2 * (length + width) * height;
    } else {
      wallArea = directArea;
    }

    const adjustmentArea = (numDoors * 21) + (numWindows * 15);
    const netArea = wallArea + adjustmentArea;

    const totalArea = netArea * coats * rooms;
    const amount = totalArea / coverageRate;
    const withWastage = Math.ceil(amount * 1.1 * 2) / 2;

    const drums = Math.floor(withWastage / 16);
    const remainderAfterDrums = withWastage - drums * 16;
    const gallons = Math.floor(remainderAfterDrums / 3.64);
    const quarters = Math.ceil((remainderAfterDrums - gallons * 3.64) / 0.91);

    let breakdown = '';
    if (drums > 0) breakdown += `${drums} Drum${drums > 1 ? 's' : ''} `;
    if (gallons > 0) breakdown += `${gallons} Gallon${gallons > 1 ? 's' : ''} `;
    if (quarters > 0) breakdown += `${quarters} Quarter${quarters > 1 ? 's' : ''}`;
    if (!breakdown) breakdown = '1 Quarter';

    return {
      litres: withWastage,
      totalArea,
      breakdown: breakdown.trim()
    };
  }, [dimensionsMode, length, width, height, directArea, coats, rooms, numDoors, numWindows, coverageRate]);

  const whatsappMessage = `Hi! The calculator says I need ${calculation.litres} litres of ${paintType.label} for ${calculation.totalArea} sq/ft. Please help me choose the right product.`;

  return (
    <div className={compact ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            How Much Paint Do You Need?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate the exact amount of paint required for your project.
          </p>
        </motion.div>
      )}

      <div className={compact ? "grid grid-cols-1 gap-6" : "grid lg:grid-cols-2 gap-12"}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`bg-white rounded-2xl shadow-lg ${compact ? 'p-4 border border-gray-100' : 'p-6 md:p-8'}`}
        >
          {/* Paint Type */}
          <div className={compact ? "mb-4" : "mb-8"}>
            <label className="block text-[10px] font-bold text-navy mb-2 uppercase tracking-widest opacity-60">Paint Type</label>
            <div className="flex flex-wrap gap-2">
              {PAINT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPaintType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paintType.id === type.id
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions Mode */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Calculation Mode</label>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setDimensionsMode('dimensions')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${dimensionsMode === 'dimensions'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Room Dimensions
              </button>
              <button
                onClick={() => setDimensionsMode('area')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${dimensionsMode === 'area'
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Direct sq/ft
              </button>
            </div>

            {dimensionsMode === 'dimensions' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={length || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={width || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height (ft)</label>
                  <input
                    type="number"
                    value={height || ''}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Total Wall Area (sq/ft)</label>
                <input
                  type="number"
                  value={directArea || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setDirectArea(Number(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                  min="1"
                />
              </div>
            )}
          </div>

          {/* Coats */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Number of Coats</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setCoats(num)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${coats === num
                    ? 'bg-gold text-navy'
                    : 'bg-gray-100 text-gray-600 hover:bg-gold-pale'
                    }`}
                >
                  {num} {num === 1 ? 'Coat' : 'Coats'}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-navy mb-3">Number of Rooms</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-semibold text-navy w-8 text-center">{rooms}</span>
              <button
                onClick={() => setRooms(rooms + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gold-pale transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Doors & Windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            {/* Doors */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-navy">
                <DoorOpen size={18} className="text-gold" />
                <label className="text-sm font-semibold">Add Doors</label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setNumDoors(Math.max(0, numDoors - 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${numDoors > 0 ? 'bg-white text-navy shadow-sm hover:bg-gold-pale hover:text-gold' : 'text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={`text-sm font-bold w-4 text-center ${numDoors > 0 ? 'text-navy' : 'text-gray-400'}`}>
                    {numDoors}
                  </span>
                  <button
                    onClick={() => {
                      setNumDoors(numDoors + 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gold-pale hover:text-gold transition-colors text-navy"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {numDoors > 0 && (
                  <span className="text-[10px] font-medium italic text-green-400">
                    +{numDoors * 21} sq/ft
                  </span>
                )}
              </div>
            </div>

            {/* Windows */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-navy">
                <Layout size={18} className="text-gold" />
                <label className="text-sm font-semibold">Add Windows</label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setNumWindows(Math.max(0, numWindows - 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${numWindows > 0 ? 'bg-white text-navy shadow-sm hover:bg-gold-pale hover:text-gold' : 'text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className={`text-sm font-bold w-4 text-center ${numWindows > 0 ? 'text-navy' : 'text-gray-400'}`}>
                    {numWindows}
                  </span>
                  <button
                    onClick={() => {
                      setNumWindows(numWindows + 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gold-pale hover:text-gold transition-colors text-navy"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {numWindows > 0 && (
                  <span className="text-[10px] font-medium italic text-green-400">
                    +{numWindows * 15} sq/ft
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`bg-navy rounded-2xl text-white ${compact ? 'p-6' : 'p-6 md:p-8'}`}
        >
          <h3 className={`font-heading font-bold text-gold text-center ${compact ? 'text-lg mb-4' : 'text-2xl mb-8'}`}>
            Your Paint Requirement
          </h3>

          <div className={`text-center ${compact ? 'mb-4' : 'mb-8'}`}>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Total Area</p>
            <p className={`${compact ? 'text-xl' : 'text-3xl'} font-bold`}>{calculation.totalArea.toLocaleString()} sq/ft</p>
          </div>

          <div className={`bg-white/10 rounded-2xl text-center ${compact ? 'p-6 mb-6' : 'p-8 mb-8'}`}>
            <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest mb-1">Paint Needed</p>
            <motion.p
              key={calculation.litres}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`font-heading font-bold text-gold ${compact ? 'text-4xl' : 'text-5xl md:text-6xl'}`}
            >
              {calculation.litres}
            </motion.p>
            <p className="text-gray-300 mt-1 text-xs">
              {paintType.id === 'putty' ? 'kg' : 'Litres'}
            </p>
          </div>

          <div className={`bg-gold/20 rounded-xl mb-6 ${compact ? 'p-4' : 'p-6 mb-8'}`}>
            <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest mb-1">Best Tin Combination</p>
            <p className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gold`}>{calculation.breakdown}</p>
          </div>

          <a
            href={`https://wa.me/923475658761?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-400 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle size={20} />
            Inquire on WhatsApp
          </a>

          <p className="text-gray-500 text-xs text-center mt-4">
            Results are estimates. Contact us for exact advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
