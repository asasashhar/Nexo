import pg from 'pg';
import {
  INITIAL_PROFILE,
  INITIAL_SERVICES,
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_INFO_CHIPS,
  INITIAL_PROCESS_STEPS,
  INITIAL_TESTIMONIALS,
  INITIAL_SOCIAL_PROFILES,
  INITIAL_SEO,
  INITIAL_ADVANCED_SETTINGS,
  INITIAL_INQUIRIES,
  INITIAL_MEDIA,
} from '../src/data/initialData';

const { Client } = pg;
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Ashhar%401380@db.tdkdirilyawlaujgtbpo.supabase.co:5432/postgres';

async function seed() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected! Seeding initial data...');

  try {
    // 1. Profile
    console.log('Seeding profile...');
    await client.query(
      `INSERT INTO profile (
        id, name, surname, brand_suffix, greeting_text, role_subtitle, hero_pitch,
        experience_years, experience_label, cta_primary_text, cta_primary_link,
        cta_secondary_text, resume_file_name, resume_file_url, speech_bubble_text,
        hero_image_url, location, education, obsession, personal_interest, email,
        phone, about_bio, cta_headline, cta_highlighted_word, cta_subtext, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role_subtitle = EXCLUDED.role_subtitle,
        hero_pitch = EXCLUDED.hero_pitch,
        hero_image_url = EXCLUDED.hero_image_url,
        updated_at = NOW();`,
      [
        'default',
        INITIAL_PROFILE.name,
        INITIAL_PROFILE.surname || '',
        INITIAL_PROFILE.brandSuffix,
        INITIAL_PROFILE.greetingText,
        INITIAL_PROFILE.roleSubtitle,
        INITIAL_PROFILE.heroPitch,
        INITIAL_PROFILE.experienceYears,
        INITIAL_PROFILE.experienceLabel,
        INITIAL_PROFILE.ctaPrimaryText,
        INITIAL_PROFILE.ctaPrimaryLink,
        INITIAL_PROFILE.ctaSecondaryText,
        INITIAL_PROFILE.resumeFileName,
        INITIAL_PROFILE.resumeFileUrl,
        INITIAL_PROFILE.speechBubbleText,
        INITIAL_PROFILE.heroImageUrl,
        INITIAL_PROFILE.location,
        INITIAL_PROFILE.education,
        INITIAL_PROFILE.obsession,
        INITIAL_PROFILE.personalInterest,
        INITIAL_PROFILE.email,
        INITIAL_PROFILE.phone,
        INITIAL_PROFILE.aboutBio,
        INITIAL_PROFILE.ctaHeadline,
        INITIAL_PROFILE.ctaHighlightedWord,
        INITIAL_PROFILE.ctaSubtext,
      ]
    );

    // 2. Services
    console.log('Seeding services...');
    for (const s of INITIAL_SERVICES) {
      await client.query(
        `INSERT INTO services (
          id, title, description, details, icon_name, front_image, published, "order",
          estimated_timeline, deliverables_list, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          details = EXCLUDED.details,
          icon_name = EXCLUDED.icon_name,
          estimated_timeline = EXCLUDED.estimated_timeline,
          deliverables_list = EXCLUDED.deliverables_list;`,
        [
          s.id,
          s.title,
          s.desc,
          s.details || '',
          s.iconName,
          s.frontImage || '',
          s.published ?? true,
          s.order || 0,
          s.estimatedTimeline || '',
          s.deliverablesList || [],
        ]
      );
    }

    // 3. Categories
    console.log('Seeding categories...');
    for (const c of INITIAL_CATEGORIES) {
      await client.query(
        `INSERT INTO categories (id, name, slug, service_id, description, "order")
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          service_id = EXCLUDED.service_id,
          description = EXCLUDED.description,
          "order" = EXCLUDED."order";`,
        [c.id, c.name, c.slug, c.serviceId || 'service-1', c.description || '', c.order || 0]
      );
    }

    // 4. Projects
    console.log('Seeding projects...');
    for (const p of INITIAL_PROJECTS) {
      await client.query(
        `INSERT INTO projects (
          id, slug, title, service_id, category, work_type, ad_media_type, video_url,
          summary, overview, challenge, solution, results, deliverables, tools,
          year, client, role, cover_image, gallery, live_url, published, featured, "order", updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          service_id = EXCLUDED.service_id,
          category = EXCLUDED.category,
          work_type = EXCLUDED.work_type,
          ad_media_type = EXCLUDED.ad_media_type,
          video_url = EXCLUDED.video_url,
          summary = EXCLUDED.summary,
          overview = EXCLUDED.overview,
          challenge = EXCLUDED.challenge,
          solution = EXCLUDED.solution,
          results = EXCLUDED.results,
          deliverables = EXCLUDED.deliverables,
          tools = EXCLUDED.tools,
          cover_image = EXCLUDED.cover_image,
          published = EXCLUDED.published,
          featured = EXCLUDED.featured;`,
        [
          p.id,
          p.slug,
          p.title,
          p.serviceId || 'service-1',
          p.category,
          p.workType || 'mobile',
          p.adMediaType || 'image',
          p.videoUrl || '',
          p.summary,
          p.overview || p.summary,
          p.challenge || '',
          p.solution || '',
          p.results || [],
          p.deliverables || [],
          p.tools || [],
          p.year || '2024',
          p.client || 'Client',
          p.role || 'UI/UX Designer',
          p.coverImage || '',
          p.gallery || [],
          p.liveUrl || '',
          p.published ?? true,
          p.featured ?? false,
          p.order || 0,
        ]
      );
    }

    // 5. Info Chips
    console.log('Seeding info chips...');
    for (const chip of INITIAL_INFO_CHIPS) {
      await client.query(
        `INSERT INTO info_chips (id, icon, label, value, color, "order")
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (id) DO UPDATE SET
          label = EXCLUDED.label,
          value = EXCLUDED.value;`,
        [chip.id, chip.icon, chip.label, chip.value, chip.color || 'primary', chip.order || 0]
      );
    }

    // 6. Process Steps
    console.log('Seeding process steps...');
    for (const step of INITIAL_PROCESS_STEPS) {
      await client.query(
        `INSERT INTO process_steps (id, number, title, description, icon, ring_color, "order")
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description;`,
        [step.id, step.number, step.title, step.desc, step.icon, step.ringColor || 'teal', step.order || 0]
      );
    }

    // 7. Testimonials
    console.log('Seeding testimonials...');
    for (const t of INITIAL_TESTIMONIALS) {
      await client.query(
        `INSERT INTO testimonials (id, name, role, company, initials, avatar_bg, avatar_url, quote, rating, published, "order")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          quote = EXCLUDED.quote;`,
        [
          t.id,
          t.name,
          t.role,
          t.company,
          t.initials,
          t.avatarBg || '',
          t.avatarUrl || '',
          t.quote,
          t.rating || 5,
          t.published ?? true,
          t.order || 0,
        ]
      );
    }

    // 8. Social Profiles
    console.log('Seeding social profiles...');
    for (const soc of INITIAL_SOCIAL_PROFILES) {
      await client.query(
        `INSERT INTO social_profiles (id, platform, label, url, icon, enabled, "order")
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id) DO UPDATE SET
          platform = EXCLUDED.platform,
          url = EXCLUDED.url,
          label = EXCLUDED.label,
          enabled = EXCLUDED.enabled;`,
        [soc.id, soc.platform, soc.label, soc.url, soc.icon, soc.enabled ?? true, soc.order || 0]
      );
    }

    // 9. SEO Settings
    console.log('Seeding SEO settings...');
    await client.query(
      `INSERT INTO seo_settings (
        id, site_title, meta_description, og_image_url, favicon_url, google_analytics_id, author_name, author_role, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      ON CONFLICT (id) DO UPDATE SET
        site_title = EXCLUDED.site_title,
        meta_description = EXCLUDED.meta_description,
        og_image_url = EXCLUDED.og_image_url;`,
      [
        'default',
        INITIAL_SEO.siteTitle,
        INITIAL_SEO.metaDescription,
        INITIAL_SEO.ogImageUrl || '',
        INITIAL_SEO.faviconUrl || '/favicon.ico',
        INITIAL_SEO.googleAnalyticsId || '',
        INITIAL_SEO.authorName || 'Ashhar',
        INITIAL_SEO.authorRole || 'Lead UI/UX Designer',
      ]
    );

    // 10. Advanced Settings
    console.log('Seeding Advanced Settings...');
    await client.query(
      `INSERT INTO advanced_settings (
        id, admin_email, admin_name, maintenance_mode, maintenance_notice,
        two_factor_enabled, session_timeout_days, email_notifications,
        discord_webhook_url, slack_webhook_url, honeypot_strict, storage_used_mb, last_backup_date, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
      ON CONFLICT (id) DO UPDATE SET
        admin_email = EXCLUDED.admin_email,
        admin_name = EXCLUDED.admin_name;`,
      [
        'default',
        INITIAL_ADVANCED_SETTINGS.adminEmail || 'admin@ashhar.com',
        INITIAL_ADVANCED_SETTINGS.adminName || 'Ashhar',
        INITIAL_ADVANCED_SETTINGS.maintenanceMode ?? false,
        INITIAL_ADVANCED_SETTINGS.maintenanceNotice || '',
        INITIAL_ADVANCED_SETTINGS.twoFactorEnabled ?? false,
        INITIAL_ADVANCED_SETTINGS.sessionTimeoutDays || 7,
        INITIAL_ADVANCED_SETTINGS.emailNotifications ?? true,
        INITIAL_ADVANCED_SETTINGS.discordWebhookUrl || '',
        INITIAL_ADVANCED_SETTINGS.slackWebhookUrl || '',
        INITIAL_ADVANCED_SETTINGS.honeypotStrict ?? true,
        INITIAL_ADVANCED_SETTINGS.storageUsedMb || 24.6,
        INITIAL_ADVANCED_SETTINGS.lastBackupDate || 'Never',
      ]
    );

    // 11. Initial Inquiries / Messages
    console.log('Seeding messages...');
    for (const msg of INITIAL_INQUIRIES) {
      await client.query(
        `INSERT INTO messages (
          id, name, email, subject, service, budget, message, read, starred, archived, status,
          admin_notes, reply_history, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
        ON CONFLICT (id) DO NOTHING;`,
        [
          msg.id,
          msg.name,
          msg.email,
          msg.subject || '',
          msg.service,
          msg.budget || '',
          msg.message,
          msg.read ?? false,
          msg.starred ?? false,
          msg.archived ?? false,
          msg.status || 'new',
          JSON.stringify(msg.adminNotes || []),
          JSON.stringify(msg.replyHistory || []),
        ]
      );
    }

    // 12. Media
    console.log('Seeding media...');
    for (const m of INITIAL_MEDIA) {
      await client.query(
        `INSERT INTO media (id, name, url, size, type, usage_count, uploaded_at, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
        ON CONFLICT (id) DO NOTHING;`,
        [m.id, m.name, m.url, m.size, m.type, m.usageCount || 0, m.uploadedAt || '']
      );
    }

    console.log('✅ ALL TABLES IN SUPABASE SEEDED AND SYNCHRONIZED SUCCESSFULLY!');
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
