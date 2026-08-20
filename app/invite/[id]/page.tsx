'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  polaroidBg: string;
  polaroidBorder: string;
  polaroidText: string;
  tapeBg: string;
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
    polaroidBg: 'bg-white',
    polaroidBorder: 'border-2 border-pink-200 shadow-xl',
    polaroidText: 'text-pink-800',
    tapeBg: 'bg-pink-200/80 border-y border-pink-300',
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
    inputBg: 'bg-black text-yellow-300 border-2 border-pink-400 text-xs p-2',
    polaroidBg: 'bg-pink-950',
    polaroidBorder: 'border-4 border-pink-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    polaroidText: 'text-yellow-300',
    tapeBg: 'bg-yellow-300/80 border-2 border-black',
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
    inputBg: 'bg-emerald-900/80 text-amber-200 border border-amber-400/60',
    polaroidBg: 'bg-emerald-950',
    polaroidBorder: 'border-2 border-amber-400 shadow-2xl',
    polaroidText: 'text-amber-300',
    tapeBg: 'bg-amber-400/60 border-y border-amber-300',
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
    inputBg: 'bg-black text-cyan-300 border border-cyan-400',
    polaroidBg: 'bg-gray-950',
    polaroidBorder: 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)]',
    polaroidText: 'text-cyan-400',
    tapeBg: 'bg-fuchsia-500/80 border-y border-fuchsia-300',
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
    inputBg: 'bg-amber-100/80 border-2 border-amber-900 text-amber-950 font-bold',
    polaroidBg: 'bg-amber-50',
    polaroidBorder: 'border-4 border-amber-900 shadow-[6px_6px_0px_0px_rgba(120,53,15,1)]',
    polaroidText: 'text-amber-950',
    tapeBg: 'bg-orange-300/80 border-y border-amber-900',
  },
};

const DEFAULT_FOODS = ['Sushi 🍣', 'Ramen 🍜', 'Pizza 🍕', 'Pasta 🍝', 'Korean BBQ 🥩', 'Tacos 🌮'];
const DEFAULT_ACTIVITIES = ['Movie Night 🍿', 'Arcade Games 👾', 'Bowling 🎳', 'Boba Run 🧋', 'Karaoke 🎤', 'Stargazing 🌌'];

const MASTER_SCRATCH_POOL = [
  { text: '👑 GRAND PRIZE: 15-Min Back Massage 💆‍♂️' },
  { text: '👑 GRAND PRIZE: Breakfast in Bed 🥞' },
  { text: '👑 GRAND PRIZE: Hand-Fed Dessert Bites 🍰' },
  { text: '👑 GRAND PRIZE: Plan Next Date Entirely 🗺️' },
  { text: '👑 GRAND PRIZE: Complete Chore Immunity 🧹' },
  { text: '🥤 Unlimited Boba / Coffee Pass 🧋' },
  { text: '🎬 Remote Control Master for Movie Night 📺' },
  { text: '🍿 Unlimited Movie Snacks Pass 🍫' },
  { text: '🛋️ VIP Couch Spot & Pillow Royalty 🛋️' },
  { text: '🍦 Late-Night Ice Cream Run Pass 🍨' },
  { text: '🎧 Dj Rights in the Car / Headphones 🎶' },
  { text: '🛌 30-Minute Extra Nap Pass 😴' },
  { text: '🍟 Free French Fries Theft Pass 🍟' },
  { text: '📸 Dedicated Personal Photographer 📷' },
  { text: '🧸 Endless Hugs & Warm Cuddles Pass 🫂' },
  { text: '🎁 Secret Surprise Treat Under $10 🛍️' },
  { text: '👗 Outfit Approval / Veto Power Pass 👗' },
  { text: '💀 PUNISHMENT: 10 Pushups on the Spot! 🏋️' },
  { text: '💀 PUNISHMENT: Sing Your Favorite Song Out Loud! 🎤' },
  { text: '💀 PUNISHMENT: Dramatic Cheesy Love Declaration 🎭' },
  { text: '💀 PUNISHMENT: Do a 30-Second Silly Dance 💃' },
  { text: '💀 PUNISHMENT: Let Partner Do Your Makeup / Hair 💄' },
  { text: '💀 PUNISHMENT: Pay for the Next Boba / Drink 💳' },
  { text: '💀 PUNISHMENT: Tell 3 Embarrassing Childhood Stories 🙈' },
  { text: '💀 PUNISHMENT: 1-Minute Foot Rub 🦶' },
  { text: '💀 PUNISHMENT: Speak in an Accent for 10 Mins 🗣️' },
  { text: '💀 PUNISHMENT: High-Pitch Voice Compliments 🐥' }
];

const FIFTY_POST_DATE_VIBES = [
  '✨ 10/10 Perfect Dream Date', '💖 Pure Romance & Butterflies', '🥰 Unstoppable Smiles & Laughs',
  '🔥 Electric Chemistry', '🌙 Deep Talk Under the Stars', '🛋️ Cozy & Ultra Comfort',
  '🥳 High Energy & Chaotic Fun', '🍕 Food Coma & Happy Tummies', '🍨 Sweet & Wholesome',
  '🎨 Creative & Inspiring', '🍷 Classy & Sophisticated', '🎮 Playful Rivalry & Gaming',
  '🚗 Spontaneous Late-Night Adventure', '🎶 Dancing & Song Singing', '🍿 Chill Movie Marathon Vibes',
  '☕ Peaceful Coffee & Heart-to-Heart', '📸 Picture-Perfect Memories Made', '🌿 Calm Nature Walk Harmony',
  '🧋 Boba Addiction Satisfied', '🤝 Unbreakable Teammate Connection', '🫠 Pure Melty Happiness',
  '😜 Goofy & Zero Filter Energy', '😴 So Tired But Worth It', '🎳 Unexpectedly Competitive',
  '🍣 Gourmet Feast Success', '🌧️ Moody Rainy Day Magic', '🎆 Unforgettable Core Memory',
  '🥱 Mildly Exhausting Fun', '💸 Worth Every Single Penny', '🤔 Awkward Silence Encountered',
  '🌧️ Unexpected Rain Ruined Hair', '🚗 Terrible Traffic Stress', '🍟 Food Was Cold / Bad',
  '💀 Awkward Conversation Drops', '😴 Partner Fell Asleep Mid-Movie', '📱 Too Much Phone Distraction',
  '💸 Overpriced & Overrated Spot', '🍿 Accidental Popcorn Spill', '🤒 Unexpected Stomach Ache',
  '👟 Blisters From Walking Too Far', '⏰ Way Too Late Getting Home', '🔊 Restaurant Was Too Loud',
  '😭 Sad Movie Crying Fit', '🤯 Total Chaos & Nothing Went to Plan', '🥶 Freezing Air Con Shock',
  '🏃 Had to Rush Everything', '😤 Playful Argument Escalate', '🤹 Lost Keys / Wallet Panic',
  '💥 Total Disastrous Funny Fail', '🤷 5/10 Average Vibe, Better Next Time'
];

export default function LiveInvitePage() {
  const params = useParams();
  const roomId = params.id as string;

  const [currentScreen, setCurrentScreen] = useState<'invite' | 'food' | 'activity' | 'datetime' | 'scratch' | 'postdate'>('invite');
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('pixel');
  const [partnerName, setPartnerName] = useState('My Love');

  const [foodOptions, setFoodOptions] = useState<string[]>(DEFAULT_FOODS);
  const [activityOptions, setActivityOptions] = useState<string[]>(DEFAULT_ACTIVITIES);

  const [selectedFood, setSelectedFood] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('19:00');

  const [postDateVibe, setPostDateVibe] = useState(FIFTY_POST_DATE_VIBES[0]);
  const [postDateComment, setPostDateComment] = useState('');
  const [polaroidImg, setPolaroidImg] = useState<string | null>(null);

  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ top: string; left: string } | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [slotDisplay, setSlotDisplay] = useState('🎰 SPINNING...');
  
  // PROPERLY RANDOMIZED 9-CARD PERK GRID
  const [scratchRewards, setScratchRewards] = useState<typeof MASTER_SCRATCH_POOL>([]);
  const [hasScratched, setHasScratched] = useState(false);
  const [scratchedIndex, setScratchedIndex] = useState<number | null>(null);
  const [showPerkModal, setShowPerkModal] = useState(false);

  // Randomize cards strictly once on component mount
  useEffect(() => {
    const shuffleArray = (arr: typeof MASTER_SCRATCH_POOL) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, 9);
    };
    setScratchRewards(shuffleArray(MASTER_SCRATCH_POOL));
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const { data } = await supabase
          .from('invite_rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (data) {
          setPartnerName(data.partner_name || 'My Love');
          setSelectedTheme((data.selected_theme as ThemeKey) || 'pixel');
          if (data.food_options?.length) setFoodOptions(data.food_options);
          if (data.activity_options?.length) setActivityOptions(data.activity_options);
        }
      } catch (err) {
        console.log('Using default room state');
      }
    };

    fetchRoom();

    try {
      const channel = supabase.channel(`room-${roomId}`, {
        config: { broadcast: { self: true }, presence: { key: roomId } },
      });

      channel
        .on('broadcast', { event: 'SCREEN_CHANGE' }, (payload) => {
          if (payload.screen) setCurrentScreen(payload.screen);
        })
        .on('broadcast', { event: 'FOOD_SELECTED' }, (payload) => {
          if (payload.food) setSelectedFood(payload.food);
          setCurrentScreen('activity');
        })
        .on('broadcast', { event: 'ACTIVITY_SELECTED' }, (payload) => {
          if (payload.activity) setSelectedActivity(payload.activity);
          setCurrentScreen('datetime');
        })
        .on('broadcast', { event: 'SPIN_SLOT' }, (payload) => {
          triggerSlotRoll(payload.type, payload.choice);
        })
        .on('broadcast', { event: 'DATETIME_SELECTED' }, (payload) => {
          if (payload.date) setSelectedDate(payload.date);
          if (payload.time) setSelectedTime(payload.time);
          setCurrentScreen('scratch');
        })
        .on('broadcast', { event: 'CARD_SCRATCHED' }, (payload) => {
          setScratchedIndex(payload.index);
          setHasScratched(true);
          setShowPerkModal(true);
        })
        .on('broadcast', { event: 'POST_DATE_UPDATE' }, (payload) => {
          if (payload.vibe) setPostDateVibe(payload.vibe);
          if (payload.comment) setPostDateComment(payload.comment);
          if (payload.image) setPolaroidImg(payload.image);
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          setPartnerConnected(Object.keys(state).length > 1);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.log('Realtime fallback active');
    }
  }, [roomId]);

  const broadcastEvent = (event: string, payload: any) => {
    try {
      supabase.channel(`room-${roomId}`).send({
        type: 'broadcast',
        event,
        ...payload,
      });
    } catch (e) {
      console.log('Broadcast skipped');
    }
  };

  const theme = THEMES[selectedTheme] || THEMES.pixel;
  const yesButtonSize = noCount * 18 + 16;
  const phrases = ["No", "Are you sure? 🥺", "Really sure??", "Think again! 💔", "Last chance!"];

  const triggerSlotRoll = (type: 'food' | 'activity', finalChoice: string) => {
    setIsSpinning(true);
    const pool = type === 'food' ? foodOptions : activityOptions;
    
    let counter = 0;
    const interval = setInterval(() => {
      setSlotDisplay(pool[Math.floor(Math.random() * pool.length)]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setSlotDisplay(finalChoice);
        setTimeout(() => {
          setIsSpinning(false);
          if (type === 'food') {
            setSelectedFood(finalChoice);
            setCurrentScreen('activity');
          } else {
            setSelectedActivity(finalChoice);
            setCurrentScreen('datetime');
          }
        }, 1000);
      }
    }, 100);
  };

  const spinSlotMachine = (type: 'food' | 'activity') => {
    const pool = type === 'food' ? foodOptions : activityOptions;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    broadcastEvent('SPIN_SLOT', { type, choice });
    triggerSlotRoll(type, choice);
  };

  const pickFood = (food: string) => {
    setSelectedFood(food);
    setCurrentScreen('activity');
    broadcastEvent('FOOD_SELECTED', { food });
  };

  const pickActivity = (activity: string) => {
    setSelectedActivity(activity);
    setCurrentScreen('datetime');
    broadcastEvent('ACTIVITY_SELECTED', { activity });
  };

  const submitDateTime = () => {
    if (!selectedDate) {
      alert('Please pick a date!');
      return;
    }
    setCurrentScreen('scratch');
    broadcastEvent('DATETIME_SELECTED', { date: selectedDate, time: selectedTime });
  };

  const revealCard = (index: number) => {
    if (hasScratched) return;
    setHasScratched(true);
    setScratchedIndex(index);
    setShowPerkModal(true);
    broadcastEvent('CARD_SCRATCHED', { index });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPolaroidImg(base64);
        broadcastEvent('POST_DATE_UPDATE', { image: base64, vibe: postDateVibe, comment: postDateComment });
      };
      reader.readAsDataURL(file);
    }
  };

  const syncPostDateLog = (vibe: string, comment: string) => {
    setPostDateVibe(vibe);
    setPostDateComment(comment);
    broadcastEvent('POST_DATE_UPDATE', { vibe, comment, image: polaroidImg });
  };

  const unlockedPerkText = scratchedIndex !== null && scratchRewards[scratchedIndex]
    ? scratchRewards[scratchedIndex].text
    : '🎫 VIP Date Perk Claimed!';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center transition-all duration-300 relative ${theme.bg} ${theme.font}`}>
      {/* PRESENCE BADGE */}
      <div className="fixed top-4 right-4 z-40 inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-gray-800 border border-gray-200 shadow-md">
        <span className={`w-2.5 h-2.5 rounded-full ${partnerConnected ? 'bg-green-500 animate-ping' : 'bg-gray-400'}`} />
        {partnerConnected ? 'Partner Connected Live! 🟢' : 'Waiting for Partner... ⏳'}
      </div>

      {/* SCREEN 1: INVITE */}
      {currentScreen === 'invite' && (
        <div className="space-y-6 max-w-md w-full">
          <div className="flex justify-center">
            <div className="w-44 h-48 rounded-2xl bg-gradient-to-br from-pink-300 via-rose-200 to-pink-400 flex flex-col items-center justify-center shadow-xl border-4 border-white animate-pulse">
              <span className="text-6xl animate-bounce">🐱</span>
              <span className="text-3xl mt-2 animate-ping">💖</span>
            </div>
          </div>

          <h1 className={`text-2xl ${theme.textTitle}`}>
            {partnerName}, will you go out on a date with me? ✨
          </h1>
          
          <div className="flex items-center justify-center gap-4 relative min-h-[100px]">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all z-10"
              style={{ fontSize: `${yesButtonSize}px`, padding: `${yesButtonSize / 2}px ${yesButtonSize}px` }}
              onClick={() => {
                setCurrentScreen('food');
                broadcastEvent('SCREEN_CHANGE', { screen: 'food' });
              }}
            >
              Yes 🥰
            </button>
            <button
              onClick={() => {
                const nextCount = noCount + 1;
                setNoCount(nextCount);
                if (nextCount >= 1) {
                  const x = Math.floor(Math.random() * 60) + 20;
                  const y = Math.floor(Math.random() * 60) + 20;
                  setNoButtonPos({ top: `${y}%`, left: `${x}%` });
                }
              }}
              onMouseEnter={() => {
                const nextCount = noCount + 1;
                setNoCount(nextCount);
                if (nextCount >= 1) {
                  const x = Math.floor(Math.random() * 60) + 20;
                  const y = Math.floor(Math.random() * 60) + 20;
                  setNoButtonPos({ top: `${y}%`, left: `${x}%` });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all"
              style={noButtonPos ? { position: 'fixed', top: noButtonPos.top, left: noButtonPos.left, zIndex: 20 } : {}}
            >
              {phrases[Math.min(noCount, phrases.length - 1)]}
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: FOOD */}
      {currentScreen === 'food' && (
        <div className={`space-y-6 max-w-md w-full p-6 ${theme.cardBg} ${theme.border} ${theme.shadow}`}>
          <div className="text-5xl">🍴</div>
          <h2 className={`text-xl ${theme.textTitle}`}>What should we eat, {partnerName}? 🍕</h2>

          {isSpinning ? (
            <div className="py-12 space-y-4 bg-black/10 rounded-2xl p-6 border-2 border-dashed border-pink-400">
              <div className="text-6xl animate-bounce">🎰</div>
              <div className="text-2xl font-black text-amber-300 animate-pulse bg-black p-3 rounded-xl border border-yellow-400">
                {slotDisplay}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {foodOptions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => pickFood(item)}
                    className={`p-3 rounded-xl text-xs font-semibold transition ${theme.secondaryBtn}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                onClick={() => spinSlotMachine('food')}
                className={`w-full py-3 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme.primaryBtn}`}
              >
                <span>🎰</span> Let Fate Decide (Spin Slot Machine)
              </button>
            </>
          )}
        </div>
      )}

      {/* SCREEN 3: ACTIVITY */}
      {currentScreen === 'activity' && (
        <div className={`space-y-6 max-w-md w-full p-6 ${theme.cardBg} ${theme.border} ${theme.shadow}`}>
          <div className="text-5xl">🎬</div>
          <h2 className={`text-xl ${theme.textTitle}`}>What are we doing after? ✨</h2>

          {isSpinning ? (
            <div className="py-12 space-y-4 bg-black/10 rounded-2xl p-6 border-2 border-dashed border-pink-400">
              <div className="text-6xl animate-bounce">🎰</div>
              <div className="text-2xl font-black text-amber-300 animate-pulse bg-black p-3 rounded-xl border border-yellow-400">
                {slotDisplay}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {activityOptions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => pickActivity(item)}
                    className={`p-3 rounded-xl text-xs font-semibold transition ${theme.secondaryBtn}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                onClick={() => spinSlotMachine('activity')}
                className={`w-full py-3 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 ${theme.primaryBtn}`}
              >
                <span>🎰</span> Let Fate Decide (Spin Slot Machine)
              </button>
            </>
          )}
        </div>
      )}

      {/* SCREEN 4: DATETIME */}
      {currentScreen === 'datetime' && (
        <div className={`space-y-6 max-w-md w-full p-6 ${theme.cardBg} ${theme.border} ${theme.shadow}`}>
          <div className="text-5xl">📅</div>
          <h2 className={`text-xl ${theme.textTitle}`}>When are you free? ✨</h2>
          <div className="space-y-4 text-left">
            <div>
              <label className={`block text-xs mb-1 ${theme.textBody}`}>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs ${theme.inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme.textBody}`}>Select Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full p-3 rounded-xl text-xs ${theme.inputBg}`}
              />
            </div>
            <button onClick={submitDateTime} className={`w-full py-3 rounded-xl font-bold transition mt-4 ${theme.primaryBtn}`}>
              Continue to Reward Lottery 🎁
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: 9-CARD LOTTERY WITH INDEPENDENTLY SHUFFLED CARDS */}
      {currentScreen === 'scratch' && (
        <div className={`space-y-6 max-w-md w-full p-6 ${theme.cardBg} ${theme.border} ${theme.shadow} relative`}>
          <div className="text-5xl">🎰</div>
          <h2 className={`text-xl ${theme.textTitle}`}>Pick 1 Date Perk Coupon! ✨</h2>

          {hasScratched && (
            <div className="bg-amber-300 border-2 border-yellow-600 p-4 rounded-xl text-gray-900 animate-bounce shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-wider block text-amber-900">🎉 UNLOCKED PERK REVEALED:</span>
              <span className="text-sm font-extrabold block mt-1">{unlockedPerkText}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {scratchRewards.map((reward, idx) => {
              const isRevealed = scratchedIndex === idx;
              return (
                <button
                  key={idx}
                  disabled={hasScratched}
                  onClick={() => revealCard(idx)}
                  className={`h-24 p-2 rounded-xl text-[10px] font-bold transition flex flex-col items-center justify-center text-center shadow-md ${
                    !isRevealed
                      ? 'bg-gradient-to-br from-amber-200 to-yellow-400 text-gray-900 border-2 border-yellow-500 hover:scale-105'
                      : 'bg-white text-gray-900 border-2 border-pink-500 scale-105 shadow-xl'
                  }`}
                >
                  {!isRevealed ? <span className="text-3xl">🎫</span> : <span>{reward.text}</span>}
                </button>
              );
            })}
          </div>

          {hasScratched && (
            <button
              onClick={() => {
                setCurrentScreen('postdate');
                broadcastEvent('SCREEN_CHANGE', { screen: 'postdate' });
              }}
              className={`w-full py-3 rounded-xl font-bold transition mt-2 ${theme.primaryBtn}`}
            >
              Lock In Date & Proceed to Post-Date Log 💖
            </button>
          )}

          {/* INSTANT POPUP MODAL */}
          {showPerkModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border-4 border-amber-400 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-6xl animate-bounce">🎁</div>
                <h3 className="text-lg font-black text-pink-600">PERK UNLOCKED! 🎉</h3>
                <div className="bg-amber-100 p-4 rounded-xl border border-amber-300">
                  <p className="font-extrabold text-amber-900 text-sm">{unlockedPerkText}</p>
                </div>
                <p className="text-xs text-gray-500 italic">This perk will be automatically attached to your Polaroid Date Memory Card!</p>
                <button
                  onClick={() => setShowPerkModal(false)}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-md transition"
                >
                  Awesome! 🥰
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 6: POST-DATE JOURNAL & POLAROID CARD */}
      {currentScreen === 'postdate' && (
        <div className="space-y-6 max-w-md w-full">
          <div className={`p-6 ${theme.polaroidBg} ${theme.polaroidBorder} relative transition-all duration-300 space-y-4 text-left shadow-2xl`}>
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 ${theme.tapeBg} rotate-[-2deg] shadow-xs z-10`} />

            <div className="text-center">
              <h2 className={`text-2xl font-black ${theme.polaroidText}`}>Date Memory Polaroid 📸</h2>
              <p className="text-[10px] text-gray-500 italic">Created for {partnerName}</p>
            </div>

            <div className="relative border-4 border-white shadow-md bg-pink-50 rounded-xl overflow-hidden min-h-[190px] flex flex-col items-center justify-center text-center">
              {polaroidImg ? (
                <img src={polaroidImg} alt="Date Snapshot" className="w-full h-52 object-cover" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center p-6 space-y-2 w-full h-full">
                  <span className="text-4xl animate-bounce">📸</span>
                  <span className="text-xs font-bold text-pink-700">Tap to Upload Date Photo Together!</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="bg-pink-100/50 p-3 rounded-xl border border-pink-200 space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1 border-pink-200">
                <span className="font-bold text-gray-500">FOOD:</span>
                <span className="font-bold text-pink-700">{selectedFood || 'Pizza 🍕'}</span>
              </div>
              <div className="flex justify-between border-b pb-1 border-pink-200">
                <span className="font-bold text-gray-500">ACTIVITY:</span>
                <span className="font-bold text-pink-700">{selectedActivity || 'Movie Night 🍿'}</span>
              </div>
              <div className="flex justify-between border-b pb-1 border-pink-200">
                <span className="font-bold text-gray-500">DATE & TIME:</span>
                <span className="font-bold text-pink-700">{selectedDate || 'Upcoming'} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b pb-1 border-pink-200">
                <span className="font-bold text-amber-600">UNLOCKED PERK:</span>
                <span className="font-bold text-amber-800">{unlockedPerkText}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-purple-600">POST-DATE VIBE:</span>
                <span className="font-bold text-purple-800">{postDateVibe}</span>
              </div>
            </div>

            {postDateComment && (
              <div className="bg-white p-3 rounded-xl border border-pink-200">
                <span className="font-bold text-gray-500 text-[10px] block mb-1">POST-DATE REVIEW / MEMORY 💌</span>
                <p className="italic text-gray-800 text-xs">{postDateComment}</p>
              </div>
            )}
          </div>

          <div className={`p-6 ${theme.cardBg} ${theme.border} ${theme.shadow} space-y-4 text-left`}>
            <h3 className={`text-sm font-bold ${theme.textTitle}`}>📝 Post-Date Journal Form</h3>

            <div>
              <label className={`block text-xs mb-1 ${theme.textBody}`}>Rate How the Date Went (50 Vibes)</label>
              <select
                value={postDateVibe}
                onChange={(e) => syncPostDateLog(e.target.value, postDateComment)}
                className={`w-full p-3 rounded-xl text-xs ${theme.inputBg}`}
              >
                {FIFTY_POST_DATE_VIBES.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs mb-1 ${theme.textBody}`}>Post-Date Review & Comments 💬</label>
              <textarea
                value={postDateComment}
                onChange={(e) => syncPostDateLog(postDateVibe, e.target.value)}
                placeholder="How was the food? What was your favorite moment?"
                rows={3}
                className={`w-full p-3 rounded-xl text-xs ${theme.inputBg}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}