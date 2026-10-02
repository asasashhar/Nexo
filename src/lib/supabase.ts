import { createClient } from '@supabase/supabase-js';

// Provided Supabase credentials
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://tdkdirilyawlaujgtbpo.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_FnoTZUPeOf4yjmjPXF8ltg_5WuRdeY1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_PROJECT_REF = 'tdkdirilyawlaujgtbpo';
