'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DiaryEntry {
  id: string;
  date: string;
  partnerName: string;
  food: string;
  activity: string;
  perkWon: string;
  vibe: string;
  note: string;
  image: string;
  rotation: string;
}

// Sample archival memories
const MOCK_ARCHIVE: DiaryEntry[] = [
  {
    id: '1',
    date: 'Aug 20, 2026',
    partnerName: 'Caius',
    food: 'Ramen 🍜',
    activity: 'Arcade Games 👾',
    perkWon: '👑 15-Min Massage',
    vibe: '🌟 10/10 Unforgettable',
    note: 'Caius lost all 3 arcade games, but the ramen made up for it! 💖',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop',
    rotation: '-rotate-2',
  },
  {
    id: '2',
    date: 'Jul 14, 2026',
    partnerName: 'Caius',
    food: 'Korean BBQ 🥩',
    activity: 'Late Cafe ☕',
    perkWon: '🍿 Unlimited Movie Snacks',
    vibe: '🍕 Food Coma Perfection',
    note: 'Ate way too much meat. Walked around the cafe until 1 AM chatting!',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=500&auto=format&fit=crop',
    rotation: 'rotate-1',
  },
  {
    id: '3',
    date: 'Jun 02, 2026',
    partnerName: 'Caius',
    food: 'Woodfired Pizza 🍕',
    activity: 'Strolling in Park 🌳',
    perkWon: '💀 Do 10 Pushups!',
    vibe: '🫠 Total Disaster (Still Love You)',
    note: 'It started pouring rain halfway through the park stroll! We got soaked 🌧️',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop',
    rotation: '-rotate-1',
  },
];

export default function ArchivePage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-8 font-sans text-gray-800">
      
      {/* HEADER DASHBOARD */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">📖</span>
              <h1 className="text-2xl font-bold text-pink-600">Couples' Memory Vault</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your ongoing collection of dates, photo Polaroids, and secret notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              + Create New Invite 💌
            </Link>
          </div>
        </div>

        {/* YEAR STATS BANNER */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center shadow-sm">
            <div className="text-xl md:text-2xl font-black text-pink-600">3</div>
            <div className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase">Dates Logged</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center shadow-sm">
            <div className="text-xl md:text-2xl font-black text-amber-500">🌟 10/10</div>
            <div className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase">Top Vibe</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center shadow-sm">
            <div className="text-xl md:text-2xl font-black text-purple-600">2 Perks</div>
            <div className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase">Unused Coupons</div>
          </div>
        </div>

        {/* POLAROID GALLERY FEED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {MOCK_ARCHIVE.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white p-4 rounded-sm shadow-xl border border-gray-200 transition duration-300 hover:scale-105 hover:z-20 relative ${entry.rotation}`}
            >
              {/* WASHI TAPE ACCENT */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-200/60 backdrop-blur-xs border-y border-amber-300/40 rotate-1 z-10 shadow-xs" />

              {/* POLAROID IMAGE FRAME */}
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden mb-3 border border-gray-100">
                <img
                  src={entry.image}
                  alt={entry.partnerName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {entry.date}
                </span>
              </div>

              {/* HANDWRITTEN DETAILS */}
              <div className="space-y-2 text-left font-serif">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-sm">{entry.partnerName}'s Date Night</h3>
                  <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-sans font-bold">
                    {entry.vibe.split(' ')[0]}
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-sans italic leading-relaxed">
                  "{entry.note}"
                </p>

                <div className="pt-2 border-t border-gray-100 text-[11px] font-sans text-gray-500 space-y-1">
                  <p><strong>Meal & Fun:</strong> {entry.food} • {entry.activity}</p>
                  <p className="text-amber-700 font-semibold"><strong>Unlocked Coupon:</strong> {entry.perkWon}</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 pt-2 flex gap-2 font-sans">
                <button
                  onClick={() => alert(`Saving Polaroid card for ${entry.date}...`)}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded shadow-xs transition"
                >
                  📸 Save PNG
                </button>
                <button
                  onClick={() => alert(`Share link generated for ${entry.date}!`)}
                  className="flex-1 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 text-[11px] font-bold rounded shadow-xs transition"
                >
                  📲 Share
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}