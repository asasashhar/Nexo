# Ashhar — UI/UX Designer Portfolio & Admin CMS

A production-grade personal portfolio website and full-featured Admin CMS built for **Ashhar**, a senior UI/UX Designer. Designed with pixel-level fidelity to the friendly mint + coral reference design language, featuring rounded cards, hand-drawn doodle accents, and responsive layout.

---

## 🎨 Design System & Color Tokens

- **Primary (Mint/Teal)**: `#4CC9A7` | **Dark**: `#37B294` | **Soft**: `#E8F7F2` | **Tint**: `#D8F2E9`
- **Accent (Coral)**: `#F2685F` | **Dark**: `#E0524A` | **Soft**: `#FDECEA`
- **Ink (Headings)**: `#1F2A37` | **Body Text**: `#6B7280` | **Muted**: `#9CA3AF`
- **Surface**: `#FFFFFF` | **Page Background**: `#F7FCFA`
- **Star Gold**: `#F5B301`
- **Color Ratio**: 60% neutral canvas/white tints, 30% teal structural accents, 10% high-intent coral CTAs and hearts.
- **Typography**: `Poppins` (Headings & Body), `Caveat` (Accent script for two-tone headings, "Hi, I'm", and brand wordmark).

---

## 🚀 Public Portfolio Sections

1. **Floating Sticky Navbar**: Rounded bar with backdrop blur on scroll, scroll-spy on navigation links, logo with pulsing coral heart, Admin CMS toggle, and teal *"Let's Talk"* button.
2. **Hero Section**:
   - Greeting: *"Hi, I'm 👋"* in Caveat teal.
   - Title: Two-tone *"Ashhar Designs"* in 64px bold, role *"UI/UX Designer ♡"* in coral.
   - Two CTAs: *"View My Work →"* (coral pill with coral glow) & *"Download Resume 📥"* (white rounded button).
   - Social circles: Behance, LinkedIn, Instagram, Dribbble.
   - Portrait: Smart young designer cutout on an organic mint blob with floating cards: *"⭐ 5+ Years of Experience"* & speech bubble *"I turn ideas into delightful user experiences ♡"*.
3. **About Me**:
   - Interactive smiling potted plant mascot (click to react with blush/water).
   - First-person bio statement.
   - 4 highlight info chips (*Bangalore, India*, *B.Des in Visual Communication*, *Obsessed with clean design*, *Coffee lover & K-drama addict*).
4. **What I Do (Services)**:
   - 5 cards with hover lift: *UI/UX Design*, *Mobile App Design*, *Web Design*, *Wireframing & Prototyping*, *User Research*.
   - Clickable scope inspection drawer with deliverables and quote request button.
5. **Selected Work**:
   - Project cards featuring simulated high-fidelity mockups (*FinTrack*, *Shopzy*, *Healthi*).
   - Segmented filter controls (*All Projects*, *Mobile Apps*, *Web Design*).
   - Carousel arrow navigation and responsive layout.
   - Dynamic Case Study Modal with Prev/Next switcher, problem statement, solution, measurable outcomes, deliverables, and *"Inquire Similar Project"*.
6. **My Design Process**:
   - 6 timeline phases (*01 Empathize*, *02 Define*, *03 Ideate*, *04 Design*, *05 Prototype*, *06 Test & Refine*).
   - Alternating teal and coral rings with connecting dashed line.
   - Clickable artifact inspection drawer.
7. **What Clients Say**:
   - Testimonial cards with quotation glyphs, gold star ratings, initials avatar, and he/his pronouns.
   - Active pagination indicators.
   - Interactive *"Leave a Client Endorsement"* modal.
8. **Contact Banner & Modal**:
   - Full-width mint container with cute mail/heart doodle illustration.
   - Headline: *"Let's create something amazing together! 💕"* with highlighted word selector.
   - Direct contacts (*hello@ashhar.com*, *+91 98765 43210*, *Bangalore, India*).
   - Working contact modal with **Honeypot anti-spam protection**, form validation, and inbox saving.
9. **Footer**:
   - Logo, Quick Links in two columns, social circles, dynamic year copyright, and circular teal scroll-to-top button.

---

## ⚡ Admin Panel Modules (Protected CMS)

Access the Admin Panel by clicking the **Admin** button in the top navigation bar or navigating to `/admin`.

### Default Credentials
- **Email**: `admin@ashhar.com`
- **Password**: `Ashhar@2024!`

### 13 Admin CMS Modules Included:
1. **Dashboard**: Stat counters (Projects, Reviews, Unread Inquiries, Weekly Traffic), daily visits bar chart, quick actions, and recent messages list.
2. **Hero Editor**: Edit first name, surname, brand suffix, greeting, role, pitch, experience years, CTA button labels/links, resume filename, speech bubble text, and portrait image URL with live blob staging.
3. **About Editor**: Update bio copy, studio mascot status, and full CRUD for the 4 informational chips (change icon, label, and value).
4. **Services**: Full CRUD for design services with icon selection and live/draft toggles.
5. **Projects**: Grid and table views with category and status filters. Comprehensive case study editor (title, slug, category, summary, overview, challenge, solution, results list, deliverables, tools, year, client, role, cover image, featured badge, live toggle).
6. **Design Process Steps**: Manage the 6 timeline steps, ring color (teal/coral), icon picker, and methodology details.
7. **Testimonials**: Manage client endorsements with star ratings, reviewer credentials, and publication status.
8. **Contact & Social**: Update direct email, phone, location, social profile links, and CTA banner headline with highlighted word styling.
9. **Messages Inbox**: View all contact submissions with unread/read badges, star toggles, search, delete, "Reply via email" mailto links, and **Export to CSV**.
10. **Media Library**: Asset grid with image URLs, file sizes, usage counts, URL copying, and asset deletion.
11. **Theme & Styling**: Live color pickers for primary mint, accent coral, ink, and backgrounds; font selectors for Poppins & Caveat; card border-radius slider; doodle toggles; and one-click reset to defaults.
12. **SEO & Social Meta**: Page title sync, meta description, OG share image, Google Analytics ID, and auto-generated JSON-LD Person schema.
13. **Settings & Backup**: Change password, maintenance mode toggle, **Export JSON snapshot**, and **Import JSON restoration**.

---

## 🛠️ Tech Stack & Database Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Motion
- **Database Engine**: Supabase Cloud PostgreSQL 17 (`tdkdirilyawlaujgtbpo.supabase.co`)
- **Client SDK**: `@supabase/supabase-js` v2 + PostgreSQL `pg`
- **Database Schema**: `supabase/schema.sql` with tables:
  - `profile`, `services`, `categories`, `projects`, `info_chips`, `process_steps`, `testimonials`, `social_profiles`, `messages`, `media`, `seo_settings`, `advanced_settings`
- **Row Level Security (RLS)**: Permissive public access policies for anon, authenticated, and service_role
- **Seed Script**: `npm run db:seed` (`scripts/seed-supabase.ts`)
- **Environment**: `.env.example` with Supabase project URL, publishable key, and PostgreSQL connection string.

---

## 📋 Verification Checklist

- [x] **Brand & Identity**: "Ashhar Designs" with male pronouns (he/his) and young male designer hero portrait.
- [x] **Color Discipline**: Soft mint canvas (`#F7FCFA`), primary teal (`#4CC9A7`), coral accent (`#F2685F`) for primary CTAs and hearts only.
- [x] **Typography**: Google Fonts `Poppins` and `Caveat` loaded and applied.
- [x] **Responsive Breakpoints**: Verified across mobile (360px), tablet (768px), and desktop (1024px, 1280px+).
- [x] **Working Handlers**: Every button, modal trigger, filter tab, and slider has an active, working event handler.
- [x] **Anti-Spam**: Honeypot protection implemented on contact inquiries.
- [x] **All 13 Admin Modules**: Built, functional, and connected with live in-place preview and JSON backup export/import.
