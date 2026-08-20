'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type ThemeKey = 'cute' | 'pixel' | 'fantasy' | 'neon' | 'retro';

interface ThemeStyles {
  bg: string;
  cardBg: string;
  border: string;
  textTitle: string;
  textBody: string;
  primaryBtn: string;
  secondaryBtn: string;
  font: string;
  shadow: string;
  inputBg: string;
}

const THEMES: Record<ThemeKey, ThemeStyles> = {
  cute: {
    bg: 'bg-pink-100',
    cardBg: 'bg-white',
    border: 'border-pink-300 border-2',
    textTitle: 'text-pink-600 font-bold tracking-wide',
    textBody: 'text-gray-700 font-medium',
    primaryBtn: 'bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md transition',
    secondaryBtn: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-2 border-pink-300 font-bold rounded-xl',
    font: 'font-[family-name:var(--font-cute)]',
    shadow: 'shadow-xl rounded-3xl',
    inputBg: 'bg-pink-50/50 border-pink-200 text-pink-950 font-bold',
  },
  pixel: {
    bg: 'bg-purple-950',
    cardBg: 'bg-pink-950',
    border: 'border-4 border-pink-400',
    textTitle: 'text-yellow-300 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] text-lg leading-relaxed uppercase',
    textBody: 'text-pink-200 text-xs leading-loose',
    primaryBtn: 'bg-pink-500 hover:bg-pink-600 text-white uppercase border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs p-3',
    secondaryBtn: 'bg-indigo-900 hover:bg-indigo-800 text-yellow-300 border-2 border-pink-400 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    font: 'font-[family-name:var(--font-pixel)]',
    shadow: 'shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] rounded-none',
    inputBg: 'bg-black text-yellow-300 border-2 border-pink-400 font-[family-name:var(--font-pixel)] text-xs p-2',
  },
  fantasy: {
    bg: 'bg-slate-900',
    cardBg: 'bg-emerald-950',
    border: 'border-2 border-amber-400',
    textTitle: 'text-amber-300 tracking-wider font-bold uppercase',
    textBody: 'text-emerald-100 italic',
    primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-amber-50 border border-amber-300 font-bold shadow-lg tracking-widest uppercase',
    secondaryBtn: 'bg-emerald-900 hover:bg-emerald-800 text-amber-200 border border-amber-400/50 font-medium',
    font: 'font-[family-name:var(--font-fantasy)]',
    shadow: 'shadow-2xl shadow-emerald-900/50 rounded-xl',
    inputBg: 'bg-emerald-900/80 text-amber-200 border border-amber-400/60 font-[family-name:var(--font-fantasy)]',
  },
  neon: {
    bg: 'bg-black',
    cardBg: 'bg-gray-900',
    border: 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]',
    textTitle: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] uppercase tracking-widest font-black',
    textBody: 'text-fuchsia-300 font-semibold tracking-wide',
    primaryBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase shadow-[0_0_15px_rgba(217,70,239,0.8)] border border-fuchsia-300',
    secondaryBtn: 'bg-black hover:bg-gray-800 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    font: 'font-[family-name:var(--font-neon)]',
    shadow: 'rounded-lg',
    inputBg: 'bg-black text-cyan-300 border border-cyan-400 font-[family-name:var(--font-neon)]',
  },
  retro: {
    bg: 'bg-gradient-to-br from-amber-200 via-orange-100 to-amber-300',
    cardBg: 'bg-amber-50/90 backdrop-blur-xs',
    border: 'border-4 border-amber-900 shadow-[8px_8px_0px_0px_rgba(120,53,15,1)]',
    textTitle: 'text-amber-950 tracking-wide drop-shadow-[2px_2px_0px_rgba(251,191,36,1)] font-normal text-2xl',
    textBody: 'text-amber-950 font-bold',
    primaryBtn: 'bg-orange-600 hover:bg-orange-700 text-amber-50 border-2 border-amber-950 shadow-[4px_4px_0px_0px_rgba(120,53,15,1)] tracking-wider uppercase font-bold',
    secondaryBtn: 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-2 border-amber-900 font-bold shadow-[2px_2px_0px_0px_rgba(120,53,15,1)]',
    font: 'font-[family-name:var(--font-retro)]',
    shadow: 'rounded-2xl',
    inputBg: 'bg-amber-100/80 border-2 border-amber-900 text-amber-950 font-bold font-[family-name:var(--font-retro)]',
  },
};

const MASTER_FOOD_POOL = [
  'Sushi 🍣', 'Ramen 🍜', 'Woodfired Pizza 🍕', 'Creamy Pasta 🍝', 'Korean BBQ 🥩',
  'Tacos & Tex-Mex 🌮', 'Juicy Burgers 🍔', 'Dim Sum 🥢', 'Thai Street Food 🇹🇭', 'Hotpot Feast 🍲',
  'Tapas & Sangria 🍷', 'French Bistro 🥐', 'Indian Curry 🥘', 'Seafood Boil 🦞', 'Mediterranean Gyros 🥙',
];

const MASTER_ACTIVITY_POOL = [
  'Strolling in Park 🌳', 'Movie Night 🍿', 'Arcade Games 👾', 'Late Night Cafe ☕', 'Ice Skating ⛸️',
  'Board Game Cafe 🎲', 'Bowling Alley 🎳', 'Night Market Walk 🌙', 'Dessert & Boba Run 🧋', 'Karaoke Room 🎤',
];

export default function Home() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('retro');
  const [partnerName, setPartnerName] = useState('Caius');
  const [foodOptions, setFoodOptions] = useState<string[]>([]);
  const [activityOptions, setActivityOptions] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const getRandomSix = (array: string[]) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  useEffect(() => {
    setFoodOptions(getRandomSix(MASTER_FOOD_POOL));
    setActivityOptions(getRandomSix(MASTER_ACTIVITY_POOL));
  }, []);

  const createLiveRoom = async () => {
    setIsCreating(true);
    const { data, error } = await supabase
      .from('invite_rooms')
      .insert([
        {
          partner_name: partnerName,
          selected_theme: selectedTheme,
          food_options: foodOptions,
          activity_options: activityOptions,
        },
      ])
      .select()
      .single();

    if (data) {
      router.push(`/invite/${data.id}`);
    } else {
      console.error('Error creating live room:', error);
      setIsCreating(false);
    }
  };

  const theme = THEMES[selectedTheme];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center transition-all duration-300 relative ${theme.bg} ${theme.font}`}>
      <div className={`max-w-md w-full p-8 ${theme.cardBg} ${theme.border} ${theme.shadow} space-y-6 max-h-[90vh] overflow-y-auto`}>
        <div className="text-5xl animate-bounce">🎨</div>
        <h1 className={`text-xl ${theme.textTitle}`}>Create Your Date Invite</h1>

        <div className="space-y-4 text-left">
          <div>
            <label className={`block text-xs mb-2 ${theme.textBody}`}>Choose Aesthetic Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {(['cute', 'pixel', 'fantasy', 'neon', 'retro'] as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTheme(t)}
                  className={`p-2 text-[10px] uppercase rounded transition ${
                    selectedTheme === t ? 'bg-pink-500 text-white border-2 border-white scale-105' : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  {t === 'cute' && '🌸 Cute Pastel'}
                  {t === 'pixel' && '👾 8-Bit Pixel'}
                  {t === 'fantasy' && '📜 Fantasy'}
                  {t === 'neon' && '⚡ Cyber Neon'}
                  {t === 'retro' && '🕺 Groovy Retro'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-xs mb-1 ${theme.textBody}`}>Partner's Name</label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className={`w-full p-3 rounded-xl text-sm ${theme.inputBg}`}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs ${theme.textBody}`}>Food Choices (6 Selected)</label>
              <button
                type="button"
                onClick={() => setFoodOptions(getRandomSix(MASTER_FOOD_POOL))}
                className="text-[10px] bg-pink-200 text-pink-900 px-2 py-1 rounded font-bold transition"
              >
                🎲 Re-roll Foods
              </button>
            </div>
            {foodOptions.map((food, index) => (
              <input
                key={index}
                type="text"
                value={food}
                onChange={(e) => {
                  const newFoods = [...foodOptions];
                  newFoods[index] = e.target.value;
                  setFoodOptions(newFoods);
                }}
                className={`w-full p-2 mb-2 rounded-xl text-xs ${theme.inputBg}`}
              />
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs ${theme.textBody}`}>After Meal Activities (6 Selected)</label>
              <button
                type="button"
                onClick={() => setActivityOptions(getRandomSix(MASTER_ACTIVITY_POOL))}
                className="text-[10px] bg-pink-200 text-pink-900 px-2 py-1 rounded font-bold transition"
              >
                🎲 Re-roll Activities
              </button>
            </div>
            {activityOptions.map((act, index) => (
              <input
                key={index}
                type="text"
                value={act}
                onChange={(e) => {
                  const newActs = [...activityOptions];
                  newActs[index] = e.target.value;
                  setActivityOptions(newActs);
                }}
                className={`w-full p-2 mb-2 rounded-xl text-xs ${theme.inputBg}`}
              />
            ))}
          </div>

          <button
            onClick={createLiveRoom}
            disabled={isCreating}
            className={`w-full py-3 rounded-xl font-bold shadow-md transition ${theme.primaryBtn}`}
          >
            {isCreating ? 'Creating Live Room... 🚀' : 'Create Shareable Live Invite Link ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}