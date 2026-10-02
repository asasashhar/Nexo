-- ==============================================================================
-- Supabase PostgreSQL Schema for Ashhar UI/UX Design Portfolio
-- Target: Supabase Cloud Database (PostgreSQL 17)
-- ==============================================================================

-- 1. Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL DEFAULT 'Ashhar',
  surname TEXT DEFAULT '',
  brand_suffix TEXT DEFAULT 'Designs',
  greeting_text TEXT DEFAULT 'Hi, I''m',
  role_subtitle TEXT NOT NULL DEFAULT 'UI/UX Designer',
  hero_pitch TEXT DEFAULT '',
  experience_years TEXT DEFAULT '5+',
  experience_label TEXT DEFAULT 'Years of Experience',
  cta_primary_text TEXT DEFAULT 'View My Work',
  cta_primary_link TEXT DEFAULT '#work',
  cta_secondary_text TEXT DEFAULT 'Download Resume',
  resume_file_name TEXT DEFAULT 'Ashhar_UIUX_Designer_Resume.pdf',
  resume_file_url TEXT DEFAULT '/resume.pdf',
  speech_bubble_text TEXT DEFAULT 'I turn ideas into delightful user experiences',
  hero_image_url TEXT DEFAULT '',
  location TEXT DEFAULT 'Bangalore, India',
  education TEXT DEFAULT 'B.Des in Visual Communication',
  obsession TEXT DEFAULT 'clean design',
  personal_interest TEXT DEFAULT 'Coffee lover & K-drama addict',
  email TEXT NOT NULL DEFAULT 'hello@ashhar.com',
  phone TEXT DEFAULT '+91 98765 43210',
  about_bio TEXT DEFAULT '',
  cta_headline TEXT DEFAULT 'Let''s create something amazing',
  cta_highlighted_word TEXT DEFAULT 'together!',
  cta_subtext TEXT DEFAULT 'Have a project in mind or just want to say hi? I''d love to hear from you.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT DEFAULT '',
  icon_name TEXT NOT NULL,
  front_image TEXT DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  estimated_timeline TEXT DEFAULT '',
  deliverables_list TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Work Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
  description TEXT DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table (Portfolio Works: Mobile, Web, Posters, Product Poster, Ads Video/Image)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  work_type TEXT NOT NULL DEFAULT 'mobile',
  ad_media_type TEXT,
  video_url TEXT,
  summary TEXT NOT NULL,
  overview TEXT DEFAULT '',
  challenge TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  results TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  year TEXT DEFAULT '2024',
  client TEXT DEFAULT 'Client',
  role TEXT DEFAULT 'Lead UI/UX Designer',
  cover_image TEXT DEFAULT '',
  gallery TEXT[] DEFAULT '{}',
  live_url TEXT DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Info Chips Table
CREATE TABLE IF NOT EXISTS public.info_chips (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  color TEXT DEFAULT 'primary',
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 6. Process Steps Table
CREATE TABLE IF NOT EXISTS public.process_steps (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  ring_color TEXT DEFAULT 'teal',
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  initials TEXT NOT NULL,
  avatar_bg TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Social Profiles Table
CREATE TABLE IF NOT EXISTS public.social_profiles (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'globe',
  enabled BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Messages / Client Inquiries Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  service TEXT NOT NULL,
  budget TEXT DEFAULT '',
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  starred BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  admin_notes JSONB DEFAULT '[]'::jsonb,
  reply_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Media Library Table
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  uploaded_at TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_title TEXT NOT NULL DEFAULT 'Ashhar | UI/UX Designer',
  meta_description TEXT NOT NULL DEFAULT 'Portfolio of Ashhar - Senior UI/UX Designer',
  og_image_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '/favicon.ico',
  google_analytics_id TEXT DEFAULT '',
  author_name TEXT DEFAULT 'Ashhar',
  author_role TEXT DEFAULT 'Lead UI/UX Designer',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Advanced Settings Table
CREATE TABLE IF NOT EXISTS public.advanced_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  admin_email TEXT NOT NULL DEFAULT 'admin@ashhar.com',
  admin_name TEXT NOT NULL DEFAULT 'Ashhar',
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_notice TEXT DEFAULT '',
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout_days INTEGER DEFAULT 7,
  email_notifications BOOLEAN DEFAULT true,
  discord_webhook_url TEXT DEFAULT '',
  slack_webhook_url TEXT DEFAULT '',
  honeypot_strict BOOLEAN DEFAULT true,
  storage_used_mb NUMERIC(8,2) DEFAULT 24.60,
  last_backup_date TEXT DEFAULT 'Never',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) & Permissions for Supabase Anon & Authenticated Roles
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'profile',
    'services',
    'categories',
    'projects',
    'info_chips',
    'process_steps',
    'testimonials',
    'social_profiles',
    'messages',
    'media',
    'seo_settings',
    'advanced_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('GRANT ALL ON TABLE public.%I TO anon, authenticated, service_role;', tbl);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public Access" ON public.%I;', tbl);
    EXECUTE format('CREATE POLICY "Public Access" ON public.%I FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;
