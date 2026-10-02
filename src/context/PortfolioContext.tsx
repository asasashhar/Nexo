import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioProfile,
  InfoChip,
  ServiceItem,
  Project,
  ProcessStep,
  Testimonial,
  SocialProfile,
  SeoSettings,
  InquiryMessage,
  AdminUser,
  MediaAsset,
  WorkCategory,
  AdvancedSettings,
  AuditLogItem,
  MessageNote,
  MessageReply,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_INFO_CHIPS,
  INITIAL_SERVICES,
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_PROCESS_STEPS,
  INITIAL_TESTIMONIALS,
  INITIAL_SOCIAL_PROFILES,
  INITIAL_SEO,
  INITIAL_INQUIRIES,
  INITIAL_ADVANCED_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { supabase, SUPABASE_PROJECT_REF } from '../lib/supabase';

interface DbStatus {
  connected: boolean;
  loading: boolean;
  projectRef: string;
  lastChecked: string;
  errorMessage?: string;
}

interface PortfolioContextType {
  profile: PortfolioProfile;
  setProfile: (p: PortfolioProfile) => void;
  infoChips: InfoChip[];
  setInfoChips: (chips: InfoChip[]) => void;
  services: ServiceItem[];
  setServices: (s: ServiceItem[]) => void;
  categories: WorkCategory[];
  setCategories: (cats: WorkCategory[]) => void;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  processSteps: ProcessStep[];
  setProcessSteps: (steps: ProcessStep[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
  socialProfiles: SocialProfile[];
  setSocialProfiles: (s: SocialProfile[]) => void;
  seo: SeoSettings;
  setSeo: (s: SeoSettings) => void;
  messages: InquiryMessage[];
  setMessages: (m: InquiryMessage[]) => void;
  media: MediaAsset[];
  setMedia: (m: MediaAsset[]) => void;
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (s: AdvancedSettings) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string) => void;

  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  visitsThisWeek: number;
  activeServiceId: string | null;
  setActiveServiceId: (id: string | null) => void;

  // Supabase Database Status & Sync
  dbStatus: DbStatus;
  refreshFromDatabase: () => Promise<boolean>;
  testDatabaseConnection: () => Promise<{ ok: boolean; message: string; latencyMs?: number }>;

  // Category CRUD
  addCategory: (cat: WorkCategory) => void;
  updateCategory: (cat: WorkCategory) => void;
  deleteCategory: (id: string) => Promise<boolean> | void;

  // Social Profile CRUD
  addSocialProfile: (soc: SocialProfile) => void;
  updateSocialProfile: (soc: SocialProfile) => void;
  deleteSocialProfile: (id: string) => Promise<boolean> | void;

  // Project CRUD
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => Promise<boolean> | void;

  // Service CRUD
  addService: (service: ServiceItem) => void;
  updateService: (service: ServiceItem) => void;
  deleteService: (id: string) => Promise<boolean> | void;

  // Process & Testimonials
  addTestimonial: (test: Testimonial) => void;
  updateTestimonial: (test: Testimonial) => void;
  deleteTestimonial: (id: string) => Promise<boolean> | void;

  addProcessStep: (step: ProcessStep) => void;
  updateProcessStep: (step: ProcessStep) => void;
  deleteProcessStep: (id: string) => Promise<boolean> | void;

  addInfoChip: (chip: InfoChip) => void;
  updateInfoChip: (chip: InfoChip) => void;
  deleteInfoChip: (id: string) => Promise<boolean> | void;

  // Advanced Message Operations
  addMessage: (
    msg: Omit<
      InquiryMessage,
      'id' | 'timestamp' | 'read' | 'starred' | 'status' | 'adminNotes' | 'replyHistory'
    >
  ) => Promise<void>;
  markMessageRead: (id: string) => void;
  toggleMessageStar: (id: string) => void;
  toggleArchiveMessage: (id: string) => void;
  updateMessageStatus: (id: string, status: InquiryMessage['status']) => void;
  addMessageNote: (id: string, noteText: string) => void;
  addMessageReply: (id: string, subject: string, body: string) => void;
  deleteMessage: (id: string) => Promise<boolean> | void;
  batchMarkRead: (ids: string[]) => void;
  batchDelete: (ids: string[]) => Promise<boolean> | void;

  // Media
  addMedia: (asset: MediaAsset) => void;
  deleteMedia: (id: string) => Promise<boolean> | void;

  // System
  resetAllDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_PREFIX = 'nexo_prod_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed saving to localStorage', e);
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<PortfolioProfile>(() =>
    loadFromStorage('profile', INITIAL_PROFILE)
  );
  const [infoChips, setInfoChipsState] = useState<InfoChip[]>(() =>
    loadFromStorage('infoChips', INITIAL_INFO_CHIPS)
  );
  const [services, setServicesState] = useState<ServiceItem[]>(() =>
    loadFromStorage('services', INITIAL_SERVICES)
  );
  const [categories, setCategoriesState] = useState<WorkCategory[]>(() =>
    loadFromStorage('categories', INITIAL_CATEGORIES)
  );
  const [projects, setProjectsState] = useState<Project[]>(() =>
    loadFromStorage('projects', INITIAL_PROJECTS)
  );
  const [processSteps, setProcessStepsState] = useState<ProcessStep[]>(() =>
    loadFromStorage('processSteps', INITIAL_PROCESS_STEPS)
  );
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(() =>
    loadFromStorage('testimonials', INITIAL_TESTIMONIALS)
  );
  const [socialProfiles, setSocialProfilesState] = useState<SocialProfile[]>(() =>
    loadFromStorage('socialProfiles', INITIAL_SOCIAL_PROFILES)
  );
  const [seo, setSeoState] = useState<SeoSettings>(() => loadFromStorage('seo', INITIAL_SEO));
  const [messages, setMessagesState] = useState<InquiryMessage[]>(() =>
    loadFromStorage('messages', INITIAL_INQUIRIES)
  );
  const [media, setMediaState] = useState<MediaAsset[]>(() =>
    loadFromStorage('media', INITIAL_MEDIA)
  );
  const [advancedSettings, setAdvancedSettingsState] = useState<AdvancedSettings>(() => {
    const loaded = loadFromStorage('advancedSettings', INITIAL_ADVANCED_SETTINGS);
    if (!loaded.adminEmail || loaded.adminEmail === 'admin@ashhar.com') {
      return {
        ...loaded,
        adminEmail: 'agesbdidgsgsd@gmail.com',
        adminPassword: loaded.adminPassword || 'qwerty@1380',
      };
    }
    return loaded;
  });
  const [auditLogs, setAuditLogsState] = useState<AuditLogItem[]>(() =>
    loadFromStorage('auditLogs', INITIAL_AUDIT_LOGS)
  );
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(() =>
    loadFromStorage('adminUser', null)
  );
  const [visitsThisWeek] = useState(1482);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    loading: true,
    projectRef: SUPABASE_PROJECT_REF,
    lastChecked: 'Initializing...',
  });

  // Fetch all initial data from Supabase
  const refreshFromDatabase = useCallback(async (): Promise<boolean> => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      const [
        profileRes,
        servicesRes,
        categoriesRes,
        projectsRes,
        infoChipsRes,
        processRes,
        testimonialsRes,
        socialRes,
        seoRes,
        messagesRes,
        mediaRes,
        advSettingsRes,
      ] = await Promise.all([
        supabase.from('profile').select('*').limit(1),
        supabase.from('services').select('*').order('order'),
        supabase.from('categories').select('*').order('order'),
        supabase.from('projects').select('*').order('order'),
        supabase.from('info_chips').select('*').order('order'),
        supabase.from('process_steps').select('*').order('order'),
        supabase.from('testimonials').select('*').order('order'),
        supabase.from('social_profiles').select('*').order('order'),
        supabase.from('seo_settings').select('*').limit(1),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('advanced_settings').select('*').limit(1),
      ]);

      let loadedSomething = false;

      // Profile
      if (profileRes.data && profileRes.data.length > 0) {
        const row = profileRes.data[0];
        const loadedProfile: PortfolioProfile = {
          name: row.name || 'Ashhar',
          surname: row.surname || '',
          brandSuffix: row.brand_suffix || 'Designs',
          greetingText: row.greeting_text || "Hi, I'm",
          roleSubtitle: row.role_subtitle || 'UI/UX Designer',
          heroPitch: row.hero_pitch || '',
          experienceYears: row.experience_years || '5+',
          experienceLabel: row.experience_label || 'Years of Experience',
          ctaPrimaryText: row.cta_primary_text || 'View My Work',
          ctaPrimaryLink: row.cta_primary_link || '#work',
          ctaSecondaryText: row.cta_secondary_text || 'Download Resume',
          resumeFileName: row.resume_file_name || 'Ashhar_UIUX_Designer_Resume.pdf',
          resumeFileUrl: row.resume_file_url || '/resume.pdf',
          speechBubbleText: row.speech_bubble_text || '',
          heroImageUrl: row.hero_image_url || '',
          location: row.location || 'Bangalore, India',
          education: row.education || '',
          obsession: row.obsession || '',
          personalInterest: row.personal_interest || '',
          email: row.email || 'hello@ashhar.com',
          phone: row.phone || '+91 98765 43210',
          aboutBio: row.about_bio || '',
          processTitle: row.process_title || INITIAL_PROFILE.processTitle || 'Our Design',
          processHighlightedWord: row.process_highlighted_word || INITIAL_PROFILE.processHighlightedWord || 'Process',
          processSubtitle: row.process_subtitle || INITIAL_PROFILE.processSubtitle || 'A clear and collaborative approach from idea to impact.',
          ctaHeadline: row.cta_headline || "Let's create something amazing",
          ctaHighlightedWord: row.cta_highlighted_word || 'together!',
          ctaSubtext: row.cta_subtext || '',
        };
        setProfileState(loadedProfile);
        saveToStorage('profile', loadedProfile);
        loadedSomething = true;
      }

      // Services
      if (servicesRes.data && servicesRes.data.length > 0) {
        const loadedServices: ServiceItem[] = servicesRes.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          desc: row.description,
          details: row.details,
          iconName: row.icon_name,
          frontImage: row.front_image,
          published: row.published,
          order: row.order,
          estimatedTimeline: row.estimated_timeline,
          deliverablesList: row.deliverables_list || [],
        }));
        setServicesState(loadedServices);
        saveToStorage('services', loadedServices);
        loadedSomething = true;
      }

      // Categories
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        const loadedCats: WorkCategory[] = categoriesRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          serviceId: row.service_id,
          description: row.description,
          order: row.order,
        }));
        setCategoriesState(loadedCats);
        saveToStorage('categories', loadedCats);
        loadedSomething = true;
      }

      // Projects
      if (projectsRes.data && projectsRes.data.length > 0) {
        const loadedProjects: Project[] = projectsRes.data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          serviceId: row.service_id,
          category: row.category,
          workType: row.work_type || 'mobile',
          adMediaType: row.ad_media_type || 'image',
          videoUrl: row.video_url,
          summary: row.summary,
          overview: row.overview,
          challenge: row.challenge,
          solution: row.solution,
          results: row.results || [],
          deliverables: row.deliverables || [],
          tools: row.tools || [],
          year: row.year,
          client: row.client,
          role: row.role,
          coverImage: row.cover_image,
          gallery: row.gallery || [],
          liveUrl: row.live_url,
          published: row.published,
          featured: row.featured,
          order: row.order,
        }));
        setProjectsState(loadedProjects);
        saveToStorage('projects', loadedProjects);
        loadedSomething = true;
      }

      // Info Chips
      if (infoChipsRes.data && infoChipsRes.data.length > 0) {
        const loadedChips: InfoChip[] = infoChipsRes.data.map((row: any) => ({
          id: row.id,
          icon: row.icon,
          label: row.label,
          value: row.value,
          color: row.color,
          order: row.order,
        }));
        setInfoChipsState(loadedChips);
        saveToStorage('infoChips', loadedChips);
      }

      // Process Steps
      if (processRes.data && processRes.data.length > 0) {
        const loadedSteps: ProcessStep[] = processRes.data.map((row: any) => ({
          id: row.id,
          number: row.number,
          title: row.title,
          desc: row.description,
          icon: row.icon,
          ringColor: row.ring_color,
          order: row.order,
        }));
        setProcessStepsState(loadedSteps);
        saveToStorage('processSteps', loadedSteps);
      }

      // Testimonials
      if (testimonialsRes.data && testimonialsRes.data.length > 0) {
        const loadedTestimonials: Testimonial[] = testimonialsRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          company: row.company,
          initials: row.initials,
          avatarBg: row.avatar_bg,
          avatarUrl: row.avatar_url,
          quote: row.quote,
          rating: row.rating,
          published: row.published,
          order: row.order,
        }));
        setTestimonialsState(loadedTestimonials);
        saveToStorage('testimonials', loadedTestimonials);
      }

      // Social Profiles
      if (socialRes.data && socialRes.data.length > 0) {
        const loadedSocial: SocialProfile[] = socialRes.data.map((row: any) => ({
          id: row.id,
          platform: row.platform,
          label: row.label,
          url: row.url,
          icon: row.icon,
          enabled: row.enabled,
          order: row.order,
        }));
        setSocialProfilesState(loadedSocial);
        saveToStorage('socialProfiles', loadedSocial);
      }

      // SEO
      if (seoRes.data && seoRes.data.length > 0) {
        const row = seoRes.data[0];
        const loadedSeo: SeoSettings = {
          siteTitle: row.site_title,
          metaDescription: row.meta_description,
          ogImageUrl: row.og_image_url,
          faviconUrl: row.favicon_url,
          googleAnalyticsId: row.google_analytics_id,
          authorName: row.author_name,
          authorRole: row.author_role,
        };
        setSeoState(loadedSeo);
        saveToStorage('seo', loadedSeo);
      }

      // Messages
      if (messagesRes.data && messagesRes.data.length > 0) {
        const loadedMsgs: InquiryMessage[] = messagesRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject,
          service: row.service,
          budget: row.budget,
          message: row.message,
          read: row.read,
          starred: row.starred,
          archived: row.archived,
          status: row.status || 'new',
          timestamp: row.created_at
            ? new Date(row.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'Recently',
          adminNotes: row.admin_notes || [],
          replyHistory: row.reply_history || [],
        }));
        setMessagesState(loadedMsgs);
        saveToStorage('messages', loadedMsgs);
      }

      // Media
      if (mediaRes.data && mediaRes.data.length > 0) {
        const loadedMedia: MediaAsset[] = mediaRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          url: row.url,
          size: row.size,
          type: row.type,
          usageCount: row.usage_count,
          uploadedAt: row.uploaded_at || 'Recently',
        }));
        setMediaState(loadedMedia);
        saveToStorage('media', loadedMedia);
      }

      // Advanced Settings
      if (advSettingsRes.data && advSettingsRes.data.length > 0) {
        const row = advSettingsRes.data[0];
        const loadedAdv: AdvancedSettings = {
          adminEmail: row.admin_email || 'agesbdidgsgsd@gmail.com',
          adminPassword: row.admin_password || 'qwerty@1380',
          adminName: row.admin_name || 'Admin',
          maintenanceMode: row.maintenance_mode,
          maintenanceNotice: row.maintenance_notice,
          twoFactorEnabled: row.two_factor_enabled,
          sessionTimeoutDays: row.session_timeout_days,
          emailNotifications: row.email_notifications,
          discordWebhookUrl: row.discord_webhook_url,
          slackWebhookUrl: row.slack_webhook_url,
          honeypotStrict: row.honeypot_strict,
          storageUsedMb: Number(row.storage_used_mb) || 24.6,
          lastBackupDate: row.last_backup_date,
        };
        setAdvancedSettingsState(loadedAdv);
        saveToStorage('advancedSettings', loadedAdv);
      }

      setDbStatus({
        connected: true,
        loading: false,
        projectRef: SUPABASE_PROJECT_REF,
        lastChecked: new Date().toLocaleTimeString(),
      });

      return true;
    } catch (err: any) {
      console.warn('Supabase initial fetch failed, using cached/local state:', err);
      setDbStatus({
        connected: false,
        loading: false,
        projectRef: SUPABASE_PROJECT_REF,
        lastChecked: new Date().toLocaleTimeString(),
        errorMessage: err?.message || 'Connection error',
      });
      return false;
    }
  }, []);

  // Run on mount
  useEffect(() => {
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  // Test live connection
  const testDatabaseConnection = async () => {
    const startTime = performance.now();
    try {
      const { data, error } = await supabase.from('profile').select('id, name').limit(1);
      const latencyMs = Math.round(performance.now() - startTime);
      if (error) {
        return { ok: false, message: error.message, latencyMs };
      }
      setDbStatus((prev) => ({
        ...prev,
        connected: true,
        lastChecked: new Date().toLocaleTimeString(),
      }));
      return {
        ok: true,
        message: `Connected successfully to Supabase (${SUPABASE_PROJECT_REF}.supabase.co)! Latency: ${latencyMs}ms`,
        latencyMs,
      };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Connection failed' };
    }
  };

  // Sync to storage & Supabase
  const setProfile = (p: PortfolioProfile) => {
    setProfileState(p);
    saveToStorage('profile', p);

    // Persist to Supabase
    supabase
      .from('profile')
      .upsert({
        id: 'default',
        name: p.name,
        surname: p.surname || '',
        brand_suffix: p.brandSuffix,
        greeting_text: p.greetingText,
        role_subtitle: p.roleSubtitle,
        hero_pitch: p.heroPitch,
        experience_years: p.experienceYears,
        experience_label: p.experienceLabel,
        cta_primary_text: p.ctaPrimaryText,
        cta_primary_link: p.ctaPrimaryLink,
        cta_secondary_text: p.ctaSecondaryText,
        resume_file_name: p.resumeFileName,
        resume_file_url: p.resumeFileUrl,
        speech_bubble_text: p.speechBubbleText,
        hero_image_url: p.heroImageUrl,
        location: p.location,
        education: p.education,
        obsession: p.obsession,
        personal_interest: p.personalInterest,
        email: p.email,
        phone: p.phone,
        about_bio: p.aboutBio,
        cta_headline: p.ctaHeadline,
        cta_highlighted_word: p.ctaHighlightedWord,
        cta_subtext: p.ctaSubtext,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Supabase profile update error:', error);
      });
  };

  const setInfoChips = (c: InfoChip[]) => {
    setInfoChipsState(c);
    saveToStorage('infoChips', c);
  };

  const setServices = (s: ServiceItem[]) => {
    setServicesState(s);
    saveToStorage('services', s);
  };

  const setCategories = (cats: WorkCategory[]) => {
    setCategoriesState(cats);
    saveToStorage('categories', cats);
  };

  const setProjects = (p: Project[]) => {
    setProjectsState(p);
    saveToStorage('projects', p);
  };

  const setProcessSteps = (ps: ProcessStep[]) => {
    setProcessStepsState(ps);
    saveToStorage('processSteps', ps);
  };

  const setTestimonials = (t: Testimonial[]) => {
    setTestimonialsState(t);
    saveToStorage('testimonials', t);
  };

  const setSocialProfiles = (s: SocialProfile[]) => {
    setSocialProfilesState(s);
    saveToStorage('socialProfiles', s);
  };

  const setSeo = (s: SeoSettings) => {
    setSeoState(s);
    saveToStorage('seo', s);

    supabase
      .from('seo_settings')
      .upsert({
        id: 'default',
        site_title: s.siteTitle,
        meta_description: s.metaDescription,
        og_image_url: s.ogImageUrl || '',
        favicon_url: s.faviconUrl || '/favicon.ico',
        google_analytics_id: s.googleAnalyticsId || '',
        author_name: s.authorName || 'Ashhar',
        author_role: s.authorRole || 'Lead UI/UX Designer',
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Supabase SEO update error:', error);
      });
  };

  const setMessages = (m: InquiryMessage[]) => {
    setMessagesState(m);
    saveToStorage('messages', m);
  };

  const setMedia = (med: MediaAsset[]) => {
    setMediaState(med);
    saveToStorage('media', med);
  };

  const setAdvancedSettings = (as: AdvancedSettings) => {
    setAdvancedSettingsState(as);
    saveToStorage('advancedSettings', as);

    // Keep active adminUser in sync if email or name changes
    setAdminUserState((prev) => {
      if (!prev) return null;
      const updatedUser: AdminUser = {
        ...prev,
        email: as.adminEmail,
        name: as.adminName || prev.name,
      };
      saveToStorage('adminUser', updatedUser);
      return updatedUser;
    });

    supabase
      .from('advanced_settings')
      .upsert({
        id: 'default',
        admin_email: as.adminEmail,
        admin_password: as.adminPassword || 'qwerty@1380',
        admin_name: as.adminName,
        maintenance_mode: as.maintenanceMode,
        maintenance_notice: as.maintenanceNotice,
        two_factor_enabled: as.twoFactorEnabled,
        session_timeout_days: as.sessionTimeoutDays,
        email_notifications: as.emailNotifications,
        discord_webhook_url: as.discordWebhookUrl || '',
        slack_webhook_url: as.slackWebhookUrl || '',
        honeypot_strict: as.honeypotStrict,
        storage_used_mb: as.storageUsedMb,
        last_backup_date: as.lastBackupDate,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Supabase settings update error:', error);
      });
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: 'Just now',
      user: adminUser?.name || 'Ashhar (Admin)',
    };
    const updated = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogsState(updated);
    saveToStorage('auditLogs', updated);
  };

  // Auth
  const loginAdmin = (inputEmail: string, inputPass: string): boolean => {
    const configuredEmail = (advancedSettings.adminEmail || 'agesbdidgsgsd@gmail.com').trim().toLowerCase();
    const configuredPass = advancedSettings.adminPassword || 'qwerty@1380';

    const enteredEmail = inputEmail.trim().toLowerCase();
    const enteredPass = inputPass;

    if (enteredEmail === configuredEmail && enteredPass === configuredPass) {
      const user: AdminUser = {
        id: 'admin-1',
        email: configuredEmail,
        name: advancedSettings.adminName || 'Admin',
        role: 'ADMIN',
      };
      setAdminUserState(user);
      saveToStorage('adminUser', user);
      addAuditLog('Admin Login', `Logged in via credential auth (${configuredEmail})`);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    addAuditLog('Admin Logout', `User signed out of CMS`);
    setAdminUserState(null);
    saveToStorage('adminUser', null);
  };

  // Categories CRUD
  const addCategory = (cat: WorkCategory) => {
    const updated = [...categories, cat];
    setCategories(updated);
    addAuditLog('Category Created', `Added category "${cat.name}"`);

    supabase
      .from('categories')
      .insert({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        service_id: cat.serviceId,
        description: cat.description || '',
        order: cat.order,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addCategory error:', error);
      });
  };

  const updateCategory = (cat: WorkCategory) => {
    const updated = categories.map((c) => (c.id === cat.id ? cat : c));
    setCategories(updated);
    addAuditLog('Category Updated', `Updated category "${cat.name}"`);

    supabase
      .from('categories')
      .update({
        name: cat.name,
        slug: cat.slug,
        service_id: cat.serviceId,
        description: cat.description || '',
        order: cat.order,
      })
      .eq('id', cat.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateCategory error:', error);
      });
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    let deletedName = '';
    setCategoriesState((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) deletedName = target.name;
      const updated = prev.filter((c) => c.id !== id);
      saveToStorage('categories', updated);
      return updated;
    });
    if (deletedName) addAuditLog('Category Deleted', `Removed category "${deletedName}"`);

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteCategory error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteCategory exception:', e);
      return false;
    }
  };

  // Social Profile CRUD
  const addSocialProfile = (soc: SocialProfile) => {
    const updated = [...socialProfiles, soc];
    setSocialProfiles(updated);
    addAuditLog('Social Profile Added', `Added ${soc.platform}`);

    supabase
      .from('social_profiles')
      .insert({
        id: soc.id,
        platform: soc.platform,
        label: soc.label,
        url: soc.url,
        icon: soc.icon,
        enabled: soc.enabled,
        order: soc.order,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addSocialProfile error:', error);
      });
  };

  const updateSocialProfile = (soc: SocialProfile) => {
    const updated = socialProfiles.map((s) => (s.id === soc.id ? soc : s));
    setSocialProfiles(updated);
    addAuditLog('Social Profile Updated', `Updated ${soc.platform}`);

    supabase
      .from('social_profiles')
      .update({
        platform: soc.platform,
        label: soc.label,
        url: soc.url,
        icon: soc.icon,
        enabled: soc.enabled,
        order: soc.order,
      })
      .eq('id', soc.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateSocialProfile error:', error);
      });
  };

  const deleteSocialProfile = async (id: string): Promise<boolean> => {
    let platform = '';
    setSocialProfilesState((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) platform = target.platform;
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage('socialProfiles', updated);
      return updated;
    });
    if (platform) addAuditLog('Social Profile Removed', `Removed ${platform}`);

    try {
      const { error } = await supabase.from('social_profiles').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteSocialProfile error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteSocialProfile exception:', e);
      return false;
    }
  };

  // Projects CRUD
  const addProject = (project: Project) => {
    const updated = [project, ...projects];
    setProjects(updated);
    addAuditLog('Project Created', `Added "${project.title}" (${project.category})`);

    supabase
      .from('projects')
      .insert({
        id: project.id,
        slug: project.slug,
        title: project.title,
        service_id: project.serviceId || null,
        category: project.category,
        work_type: project.workType || 'mobile',
        ad_media_type: project.adMediaType || null,
        video_url: project.videoUrl || null,
        summary: project.summary,
        overview: project.overview,
        challenge: project.challenge,
        solution: project.solution,
        results: project.results,
        deliverables: project.deliverables,
        tools: project.tools,
        year: project.year,
        client: project.client,
        role: project.role,
        cover_image: project.coverImage,
        gallery: project.gallery || [],
        live_url: project.liveUrl,
        published: project.published,
        featured: project.featured,
        order: project.order,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addProject error:', error);
      });
  };

  const updateProject = (project: Project) => {
    const updated = projects.map((p) => (p.id === project.id ? project : p));
    setProjects(updated);
    addAuditLog('Project Updated', `Updated "${project.title}"`);

    supabase
      .from('projects')
      .update({
        slug: project.slug,
        title: project.title,
        service_id: project.serviceId || null,
        category: project.category,
        work_type: project.workType || 'mobile',
        ad_media_type: project.adMediaType || null,
        video_url: project.videoUrl || null,
        summary: project.summary,
        overview: project.overview,
        challenge: project.challenge,
        solution: project.solution,
        results: project.results,
        deliverables: project.deliverables,
        tools: project.tools,
        year: project.year,
        client: project.client,
        role: project.role,
        cover_image: project.coverImage,
        gallery: project.gallery || [],
        live_url: project.liveUrl,
        published: project.published,
        featured: project.featured,
        order: project.order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateProject error:', error);
      });
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    let deletedTitle = '';
    setProjectsState((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) deletedTitle = target.title;
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage('projects', updated);
      return updated;
    });
    if (deletedTitle) addAuditLog('Project Deleted', `Deleted "${deletedTitle}"`);

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteProject exception:', e);
      return false;
    }
  };

  // Services CRUD
  const addService = (service: ServiceItem) => {
    const updated = [...services, service];
    setServices(updated);
    addAuditLog('Service Created', `Added service "${service.title}"`);

    supabase
      .from('services')
      .insert({
        id: service.id,
        title: service.title,
        description: service.desc,
        details: service.details || '',
        icon_name: service.iconName,
        front_image: service.frontImage || '',
        published: service.published ?? true,
        order: service.order || 0,
        estimated_timeline: service.estimatedTimeline || '',
        deliverables_list: service.deliverablesList || [],
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addService error:', error);
      });
  };

  const updateService = (service: ServiceItem) => {
    const updated = services.map((s) => (s.id === service.id ? service : s));
    setServices(updated);
    addAuditLog('Service Updated', `Updated service "${service.title}"`);

    supabase
      .from('services')
      .update({
        title: service.title,
        description: service.desc,
        details: service.details || '',
        icon_name: service.iconName,
        front_image: service.frontImage || '',
        published: service.published,
        order: service.order,
        estimated_timeline: service.estimatedTimeline || '',
        deliverables_list: service.deliverablesList || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', service.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateService error:', error);
      });
  };

  const deleteService = async (id: string): Promise<boolean> => {
    let deletedTitle = '';
    setServicesState((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) deletedTitle = target.title;
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage('services', updated);
      return updated;
    });
    if (deletedTitle) addAuditLog('Service Deleted', `Removed service "${deletedTitle}"`);

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteService error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteService exception:', e);
      return false;
    }
  };

  // Testimonials
  const addTestimonial = (test: Testimonial) => {
    const updated = [test, ...testimonials];
    setTestimonials(updated);
    addAuditLog('Testimonial Added', `Added endorsement from ${test.name}`);

    supabase
      .from('testimonials')
      .insert({
        id: test.id,
        name: test.name,
        role: test.role,
        company: test.company,
        initials: test.initials,
        avatar_bg: test.avatarBg || '',
        avatar_url: test.avatarUrl || '',
        quote: test.quote,
        rating: test.rating || 5,
        published: test.published ?? true,
        order: test.order || 0,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addTestimonial error:', error);
      });
  };

  const updateTestimonial = (test: Testimonial) => {
    const updated = testimonials.map((t) => (t.id === test.id ? test : t));
    setTestimonials(updated);

    supabase
      .from('testimonials')
      .update({
        name: test.name,
        role: test.role,
        company: test.company,
        initials: test.initials,
        avatar_bg: test.avatarBg || '',
        avatar_url: test.avatarUrl || '',
        quote: test.quote,
        rating: test.rating,
        published: test.published,
        order: test.order,
      })
      .eq('id', test.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateTestimonial error:', error);
      });
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    let deletedName = '';
    setTestimonialsState((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) deletedName = target.name;
      const updated = prev.filter((t) => t.id !== id);
      saveToStorage('testimonials', updated);
      return updated;
    });
    if (deletedName) addAuditLog('Testimonial Deleted', `Removed endorsement from ${deletedName}`);

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteTestimonial error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteTestimonial exception:', e);
      return false;
    }
  };

  // Process
  const addProcessStep = (step: ProcessStep) => {
    const updated = [...processSteps, step];
    setProcessSteps(updated);

    supabase
      .from('process_steps')
      .insert({
        id: step.id,
        number: step.number,
        title: step.title,
        description: step.desc,
        icon: step.icon,
        ring_color: step.ringColor,
        order: step.order,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addProcessStep error:', error);
      });
  };

  const updateProcessStep = (step: ProcessStep) => {
    const updated = processSteps.map((s) => (s.id === step.id ? step : s));
    setProcessSteps(updated);

    supabase
      .from('process_steps')
      .update({
        number: step.number,
        title: step.title,
        description: step.desc,
        icon: step.icon,
        ring_color: step.ringColor,
        order: step.order,
      })
      .eq('id', step.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateProcessStep error:', error);
      });
  };

  const deleteProcessStep = async (id: string): Promise<boolean> => {
    let deletedTitle = '';
    setProcessStepsState((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) deletedTitle = target.title;
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage('processSteps', updated);
      return updated;
    });
    if (deletedTitle) addAuditLog('Process Step Deleted', `Removed step "${deletedTitle}"`);

    try {
      const { error } = await supabase.from('process_steps').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProcessStep error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteProcessStep exception:', e);
      return false;
    }
  };

  // Info Chips
  const addInfoChip = (chip: InfoChip) => {
    const updated = [...infoChips, chip];
    setInfoChips(updated);

    supabase
      .from('info_chips')
      .insert({
        id: chip.id,
        icon: chip.icon,
        label: chip.label,
        value: chip.value,
        color: chip.color || 'primary',
        order: chip.order || 0,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addInfoChip error:', error);
      });
  };

  const updateInfoChip = (chip: InfoChip) => {
    const updated = infoChips.map((c) => (c.id === chip.id ? chip : c));
    setInfoChips(updated);

    supabase
      .from('info_chips')
      .update({
        icon: chip.icon,
        label: chip.label,
        value: chip.value,
        color: chip.color,
        order: chip.order,
      })
      .eq('id', chip.id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateInfoChip error:', error);
      });
  };

  const deleteInfoChip = async (id: string): Promise<boolean> => {
    setInfoChipsState((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToStorage('infoChips', updated);
      return updated;
    });

    try {
      const { error } = await supabase.from('info_chips').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteInfoChip error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteInfoChip exception:', e);
      return false;
    }
  };

  // Advanced Messages
  const addMessage = async (
    msgData: Omit<
      InquiryMessage,
      'id' | 'timestamp' | 'read' | 'starred' | 'status' | 'adminNotes' | 'replyHistory'
    >
  ) => {
    const msgId = `msg-${Date.now()}`;
    const newMsg: InquiryMessage = {
      ...msgData,
      id: msgId,
      timestamp: 'Just now',
      read: false,
      starred: false,
      status: 'new',
      adminNotes: [],
      replyHistory: [],
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    addAuditLog('New Client Inquiry', `Received inquiry from ${newMsg.name} (${newMsg.service})`);

    // Insert to Supabase directly
    try {
      const { error } = await supabase.from('messages').insert({
        id: msgId,
        name: newMsg.name,
        email: newMsg.email,
        subject: newMsg.subject || '',
        service: newMsg.service,
        budget: newMsg.budget || '',
        message: newMsg.message,
        read: false,
        starred: false,
        archived: false,
        status: 'new',
        admin_notes: [],
        reply_history: [],
      });
      if (error) {
        console.error('Supabase addMessage error:', error);
      }
    } catch (e) {
      console.error('Failed to insert message to Supabase:', e);
    }
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setMessages(updated);

    supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase markRead error:', error);
      });
  };

  const toggleMessageStar = (id: string) => {
    const target = messages.find((m) => m.id === id);
    const newStar = !target?.starred;
    const updated = messages.map((m) => (m.id === id ? { ...m, starred: newStar } : m));
    setMessages(updated);

    supabase
      .from('messages')
      .update({ starred: newStar })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase toggleStar error:', error);
      });
  };

  const toggleArchiveMessage = (id: string) => {
    const target = messages.find((m) => m.id === id);
    const newArchived = !target?.archived;
    const updated = messages.map((m) => (m.id === id ? { ...m, archived: newArchived } : m));
    setMessages(updated);

    supabase
      .from('messages')
      .update({ archived: newArchived })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase toggleArchive error:', error);
      });
  };

  const updateMessageStatus = (id: string, status: InquiryMessage['status']) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
    setMessages(updated);
    addAuditLog('Message Status Changed', `Marked message as ${status}`);

    supabase
      .from('messages')
      .update({ status })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase updateStatus error:', error);
      });
  };

  const addMessageNote = (id: string, noteText: string) => {
    const note: MessageNote = {
      id: `note-${Date.now()}`,
      author: adminUser?.name || 'Ashhar',
      text: noteText,
      createdAt: 'Just now',
    };
    const target = messages.find((m) => m.id === id);
    const newNotes = [note, ...(target?.adminNotes || [])];

    const updated = messages.map((m) => (m.id === id ? { ...m, adminNotes: newNotes } : m));
    setMessages(updated);
    addAuditLog('Admin Note Added', `Added note to message`);

    supabase
      .from('messages')
      .update({ admin_notes: newNotes })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase addNote error:', error);
      });
  };

  const addMessageReply = (id: string, subject: string, body: string) => {
    const reply: MessageReply = {
      id: `rep-${Date.now()}`,
      subject,
      body,
      sentAt: 'Just now',
    };
    const target = messages.find((m) => m.id === id);
    const newReplies = [reply, ...(target?.replyHistory || [])];

    const updated = messages.map((m) =>
      m.id === id
        ? {
            ...m,
            status: 'replied' as const,
            read: true,
            replyHistory: newReplies,
          }
        : m
    );
    setMessages(updated);
    addAuditLog('Inquiry Replied', `Sent reply to client inquiry`);

    supabase
      .from('messages')
      .update({ status: 'replied', read: true, reply_history: newReplies })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Supabase addReply error:', error);
      });
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    setMessagesState((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveToStorage('messages', updated);
      return updated;
    });
    addAuditLog('Message Deleted', `Removed inquiry from inbox`);

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteMessage error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteMessage exception:', e);
      return false;
    }
  };

  const batchMarkRead = (ids: string[]) => {
    const updated = messages.map((m) => (ids.includes(m.id) ? { ...m, read: true } : m));
    setMessages(updated);
    addAuditLog('Batch Mark Read', `Marked ${ids.length} messages as read`);

    supabase
      .from('messages')
      .update({ read: true })
      .in('id', ids)
      .then(({ error }) => {
        if (error) console.error('Supabase batchMarkRead error:', error);
      });
  };

  const batchDelete = async (ids: string[]): Promise<boolean> => {
    setMessagesState((prev) => {
      const updated = prev.filter((m) => !ids.includes(m.id));
      saveToStorage('messages', updated);
      return updated;
    });
    addAuditLog('Batch Delete', `Deleted ${ids.length} messages`);

    try {
      const { error } = await supabase.from('messages').delete().in('id', ids);
      if (error) {
        console.error('Supabase batchDelete error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase batchDelete exception:', e);
      return false;
    }
  };

  // Media
  const addMedia = (asset: MediaAsset) => {
    const updated = [asset, ...media];
    setMedia(updated);
    addAuditLog('Media Uploaded', `Added ${asset.name}`);

    supabase
      .from('media')
      .insert({
        id: asset.id,
        name: asset.name,
        url: asset.url,
        size: asset.size,
        type: asset.type,
        usage_count: asset.usageCount || 0,
        uploaded_at: asset.uploadedAt || 'Just now',
      })
      .then(({ error }) => {
        if (error) console.error('Supabase addMedia error:', error);
      });
  };

  const deleteMedia = async (id: string): Promise<boolean> => {
    setMediaState((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveToStorage('media', updated);
      return updated;
    });

    try {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteMedia error:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteMedia exception:', e);
      return false;
    }
  };

  // Reset & Backup
  const resetAllDefaults = () => {
    setProfile(INITIAL_PROFILE);
    setInfoChips(INITIAL_INFO_CHIPS);
    setServices(INITIAL_SERVICES);
    setCategories(INITIAL_CATEGORIES);
    setProjects(INITIAL_PROJECTS);
    setProcessSteps(INITIAL_PROCESS_STEPS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setSocialProfiles(INITIAL_SOCIAL_PROFILES);
    setSeo(INITIAL_SEO);
    setMessages(INITIAL_INQUIRIES);
    setMedia(INITIAL_MEDIA);
    setAdvancedSettings(INITIAL_ADVANCED_SETTINGS);
    addAuditLog('System Reset', 'Restored all content to default reference state');
  };

  const exportDataJson = (): string => {
    const payload = {
      profile,
      infoChips,
      services,
      categories,
      projects,
      processSteps,
      testimonials,
      socialProfiles,
      seo,
      messages,
      media,
      advancedSettings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (data.infoChips) setInfoChips(data.infoChips);
      if (data.services) setServices(data.services);
      if (data.categories) setCategories(data.categories);
      if (data.projects) setProjects(data.projects);
      if (data.processSteps) setProcessSteps(data.processSteps);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.socialProfiles) setSocialProfiles(data.socialProfiles);
      if (data.seo) setSeo(data.seo);
      if (data.messages) setMessages(data.messages);
      if (data.media) setMedia(data.media);
      if (data.advancedSettings) setAdvancedSettings(data.advancedSettings);
      addAuditLog('JSON Backup Restored', 'Imported portfolio database snapshot');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        setProfile,
        infoChips,
        setInfoChips,
        services,
        setServices,
        categories,
        setCategories,
        projects,
        setProjects,
        processSteps,
        setProcessSteps,
        testimonials,
        setTestimonials,
        socialProfiles,
        setSocialProfiles,
        seo,
        setSeo,
        messages,
        setMessages,
        media,
        setMedia,
        advancedSettings,
        setAdvancedSettings,
        auditLogs,
        addAuditLog,

        adminUser,
        isAdminLoggedIn: !!adminUser,
        loginAdmin,
        logoutAdmin,
        visitsThisWeek,
        activeServiceId,
        setActiveServiceId,

        dbStatus,
        refreshFromDatabase,
        testDatabaseConnection,

        addCategory,
        updateCategory,
        deleteCategory,

        addSocialProfile,
        updateSocialProfile,
        deleteSocialProfile,

        addProject,
        updateProject,
        deleteProject,

        addService,
        updateService,
        deleteService,

        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        addProcessStep,
        updateProcessStep,
        deleteProcessStep,

        addInfoChip,
        updateInfoChip,
        deleteInfoChip,

        addMessage,
        markMessageRead,
        toggleMessageStar,
        toggleArchiveMessage,
        updateMessageStatus,
        addMessageNote,
        addMessageReply,
        deleteMessage,
        batchMarkRead,
        batchDelete,

        addMedia,
        deleteMedia,

        resetAllDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
