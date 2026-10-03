'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type PixelThemeKey = 'y2k_pink' | 'gameboy' | 'tamagotchi' | 'arcade' | 'cozy_cafe';

export default function HomePage() {
  const router = useRouter();

  const [inviterName, setInviterName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<PixelThemeKey>('y2k_pink');
  const [completedDates, setCompletedDates] = useState<any[]>([]);
  const [activeVaultRoomId, setActiveVaultRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // LOAD SAVED NAMES, COUPLE HISTORY & VAULT ROOM FROM LOCALSTORAGE AND SUPABASE
  useEffect(() => {
    const fetchHistoryAndVault = async () => {
      try {
        if (typeof window === 'undefined') return;

        // 1. Auto-fill saved names if previously stored
        const savedHost = localStorage.getItem('saved_inviter_name');
        const savedGuest = localStorage.getItem('saved_partner_name');
        if (savedHost) setInviterName(savedHost);
        if (savedGuest) setPartnerName(savedGuest);

        const storedIdsRaw = localStorage.getItem('my_date_room_ids');
        const storedIds: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];

        if (storedIds.length > 0) {
          // Set active vault ID to the most recently used room ID
          const latestRoomId = storedIds[storedIds.length - 1];
          setActiveVaultRoomId(latestRoomId);

          // Fetch all date rooms that belong to these stored IDs
          const { data: roomsData } = await supabase
            .from('invite_rooms')
            .select('*')
            .or(`room_id.in.(${storedIds.join(',')}),id.in.(${storedIds.join(',')})`)
            .order('created_at', { ascending: false });

          // Fetch logged diary entries from save_state_entries
          const { data: entriesData } = await supabase
            .from('save_state_entries')
            .select('*')
            .in('room_id', storedIds)
            .order('created_at', { ascending: false });

          const combinedList: any[] = [];

          if (entriesData && entriesData.length > 0) {
            entriesData.forEach((entry) => {
              combinedList.push({
                room_id: entry.room_id,
                title: entry.title || 'Date Night Memory',
                note: entry.note || '',
                image_url: entry.image_url || '',
                created_at: entry.created_at,
                is_logged_memory: true,
              });
            });
          }

          if (roomsData && roomsData.length > 0) {
            roomsData.forEach((room) => {
              if (!combinedList.some((item) => item.room_id === room.room_id)) {
                combinedList.push({
                  room_id: room.room_id,
                  inviter_name: room.inviter_name || room.host_name || 'William',
                  partner_name: room.partner_name || room.guest_name || 'Caius',
                  selected_food: room.selected_food,
                  selected_activity: room.selected_activity,
                  selected_date: room.selected_date,
                  created_at: room.created_at,
                  is_logged_memory: false,
                });
              }

              // Save & pre-fill names if not already set
              const host = room.inviter_name || room.host_name;
              const guest = room.partner_name || room.guest_name;
              if (host && !savedHost) {
                setInviterName(host);
                localStorage.setItem('saved_inviter_name', host);
              }
              if (guest && !savedGuest) {
                setPartnerName(guest);
                localStorage.setItem('saved_partner_name', guest);
              }
            });
          }

          setCompletedDates(combinedList);
        }
      } catch (err) {
        console.log('Error fetching couple history:', err);
      }
    };

    fetchHistoryAndVault();
  }, []);

  // CREATE A NEW DATE ROOM & REMEMBER NAMES PERMANENTLY
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviterName.trim() || !partnerName.trim()) {
      alert('Please fill in both your name and your partner’s name! 💕');
      return;
    }

    setLoading(true);
    const host = inviterName.trim();
    const guest = partnerName.trim();

    // Lock both names into localStorage permanently
    localStorage.setItem('saved_inviter_name', host);
    localStorage.setItem('saved_partner_name', guest);

    const newRoomId = `rm_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const newRoom = {
        room_id: newRoomId,
        host_name: host,
        inviter_name: host,
        guest_name: guest,
        partner_name: guest,
        selected_theme: selectedTheme,
        status: 'pending',
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('invite_rooms').insert([newRoom]);

      if (error) {
        console.log('Database insert fallback:', error.message);
      }

      // Save room ID locally so history persists
      const existingIdsRaw = localStorage.getItem('my_date_room_ids');
      let roomIds: string[] = existingIdsRaw ? JSON.parse(existingIdsRaw) : [];
      if (!roomIds.includes(newRoomId)) {
        roomIds.push(newRoomId);
        localStorage.setItem('my_date_room_ids', JSON.stringify(roomIds));
      }

      router.push(`/invite/${newRoomId}`);
    } catch (err) {
      router.push(`/invite/${newRoomId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVaultLink = () => {
    if (!activeVaultRoomId || typeof window === 'undefined') return;
    const vaultUrl = `${window.location.origin}/save-state?room=${activeVaultRoomId}`;
    navigator.clipboard.writeText(vaultUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-fuchsia-950 font-mono text-center relative selection:bg-pink-500 selection:text-white">
      
      {/* PERSISTENT VAULT TOP BAR */}
      {activeVaultRoomId && (
        <div className="fixed top-4 right-4 z-40 max-w-xs w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-black/80 border-2 border-yellow-300 p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] space-y-1.5 text-left">
            <div className="flex items-center justify-between text-[10px] font-black text-yellow-300 uppercase">
              <span>PERSISTENT VAULT</span>
              <span className="text-pink-400">#{activeVaultRoomId.slice(0, 8)}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleCopyVaultLink}
                className="py-1 px-2 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-[10px] rounded uppercase transition active:scale-95 cursor-pointer truncate"
              >
                {copiedLink ? 'Copied! ✨' : '📋 Copy Link'}
              </button>
              <button
                onClick={() => router.push(`/save-state?room=${activeVaultRoomId}`)}
                className="py-1 px-2 bg-pink-500 hover:bg-pink-600 text-white font-black text-[10px] rounded uppercase transition active:scale-95 cursor-pointer truncate"
              >
                📖 Open Vault
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-md w-full my-12">
        {/* LOGO & TITLE */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-pink-500 border-4 border-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            💖
          </div>
          <h1 className="text-2xl font-black text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
            Y2KISS DATE PLANNER
          </h1>
          <p className="text-pink-200 text-xs font-bold">
            {activeVaultRoomId
              ? 'Plan a new date night inside your shared couple room! 🍿'
              : 'Create a permanent couple vault & date planner link ✨'}
          </p>
        </div>

        {/* CREATE / INVITE FORM CARD */}
        <form
          onSubmit={handleCreateRoom}
          className="bg-pink-900/90 border-4 border-pink-400 shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] p-6 rounded-2xl text-left space-y-4"
        >
          <div>
            <label className="text-[11px] font-black text-yellow-300 uppercase block mb-1">
              YOUR NAME (HOST):
            </label>
            <input
              type="text"
              required
              value={inviterName}
              onChange={(e) => setInviterName(e.target.value)}
              placeholder="e.g. William"
              className="w-full bg-black text-yellow-300 border-2 border-pink-400 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-yellow-300"
            />
          </div>

          <div>
            <label className="text-[11px] font-black text-yellow-300 uppercase block mb-1">
              PARTNER'S NAME (GUEST):
            </label>
            <input
              type="text"
              required
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Caius"
              className="w-full bg-black text-yellow-300 border-2 border-pink-400 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-yellow-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl transition active:scale-95 cursor-pointer mt-2"
          >
            {loading
              ? '✨ GENERATING ROOM...'
              : activeVaultRoomId
              ? '💌 SEND NEW DATE INVITE (KEEPS MEMORIES)'
              : '💌 CREATE COUPLE VAULT & FIRST DATE INVITE'}
          </button>
        </form>

        {/* COUPLE DATE HISTORY LIST */}
        <div className="space-y-3 pt-2 text-left">
          <div className="flex items-center justify-between text-xs font-black text-yellow-300 uppercase px-1">
            <span>📜 COUPLE DATE HISTORY ({completedDates.length})</span>
            {activeVaultRoomId && (
              <button
                onClick={() => router.push(`/save-state?room=${activeVaultRoomId}`)}
                className="text-pink-300 hover:text-white underline text-[11px] cursor-pointer"
              >
                View Memory Diary 📖
              </button>
            )}
          </div>

          {completedDates.length === 0 ? (
            <div className="bg-black/60 border-2 border-dashed border-pink-400/60 p-6 rounded-2xl text-center space-y-2">
              <span className="text-3xl block">🥺</span>
              <p className="text-xs font-bold text-pink-200">
                You haven't initiated any completed dates yet!
              </p>
              <p className="text-[10px] text-pink-300/80 italic">
                Send your first invite link above! Once your partner accepts and picks their food & perk, your official date receipt will be saved right here 💕
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {completedDates.map((dateItem, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    router.push(
                      dateItem.is_logged_memory
                        ? `/save-state?room=${dateItem.room_id}`
                        : `/invite/${dateItem.room_id}`
                    )
                  }
                  className="bg-black/80 hover:bg-black border-2 border-pink-400 p-3 rounded-xl transition cursor-pointer space-y-1 shadow-md active:scale-98"
                >
                  <div className="flex items-center justify-between text-[11px] font-black text-yellow-300">
                    <span className="truncate max-w-[220px]">
                      {dateItem.is_logged_memory
                        ? `📸 ${dateItem.title?.toUpperCase()}`
                        : `🍱 MEMORY: ${(dateItem.inviter_name || 'WILLIAM').toUpperCase()} & ${(dateItem.partner_name || 'CAIUS').toUpperCase()}'S ${dateItem.selected_activity?.toUpperCase() || 'DATE'}`}
                    </span>
                    <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded font-bold">
                      {dateItem.selected_date || 'Logged'}
                    </span>
                  </div>

                  {dateItem.is_logged_memory ? (
                    <p className="text-[10px] text-pink-200 truncate italic">
                      {dateItem.note || 'Logged memory entry in Couple Vault 📖'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 text-[10px] text-pink-200 pt-0.5">
                      <div>
                        <span className="text-gray-400 block">FOOD:</span>
                        <span className="font-bold text-emerald-400 truncate block">
                          {dateItem.selected_food || 'Pizza 🍕'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">ACTIVITY:</span>
                        <span className="font-bold text-indigo-300 truncate block">
                          {dateItem.selected_activity || 'Movie Night 🍿'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] text-pink-400/80 italic pt-4">
          Sealed with a Kiss 💋 • Y2K Date Experience
        </p>
      </div>
    </div>
  );
}
