import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://igaclokidpafmbjupird.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N0R4fLRHyXANuB_S8EV4XA_GtXVvCio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);