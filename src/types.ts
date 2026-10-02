export type ProjectWorkType = 'mobile' | 'web' | 'poster' | 'product_poster' | 'ad';
export type AdMediaType = 'image' | 'video';

export interface WebsiteImage {
  id: string;
  url: string;
  title: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet' | 'full';
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  serviceId?: string; // Links directly to added service
  category: string; // e.g. "Mobile App Design", "Web Design", "Posters", "Product Poster", "Ads"
  workType: ProjectWorkType;
  adMediaType?: AdMediaType; // For 'ad': 'image' | 'video'
  videoUrl?: string; // Video ad source or embed
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  deliverables: string[];
  tools: string[];
  year: string;
  client: string;
  role: string;
  coverImage?: string;
  gallery?: string[];
  websiteImages?: WebsiteImage[];
  liveUrl?: string;
  published: boolean;
  featured: boolean;
  order: number;
}

export interface WorkCategory {
  id: string;
  name: string;
  slug: string;
  serviceId?: string;
  description?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
  published: boolean;
  order: number;
}

export interface MessageNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface MessageReply {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  service: string;
  budget?: string;
  message: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  archived?: boolean;
  status: 'new' | 'in_progress' | 'replied' | 'archived';
  adminNotes?: MessageNote[];
  replyHistory?: MessageReply[];
}

export interface InfoChip {
  id: string;
  icon: string;
  label: string;
  value: string;
  color?: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  details: string;
  iconName: string;
  frontImage?: string;
  published: boolean;
  order: number;
  estimatedTimeline?: string;
  deliverablesList?: string[];
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  desc: string;
  icon: string;
  ringColor: 'teal' | 'coral';
  order: number;
}

export interface SocialProfile {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string; // 'behance' | 'linkedin' | 'instagram' | 'dribbble' | 'github' | 'twitter' | 'youtube' | 'medium' | 'threads' | 'globe'
  enabled: boolean;
  order: number;
}

export interface PortfolioProfile {
  name: string;
  surname: string;
  brandSuffix: string;
  logoUrl?: string;
  logoHeight?: number;
  showLogoText?: boolean;
  showLogoHeart?: boolean;
  greetingText: string;
  roleSubtitle: string;
  heroPitch: string;
  experienceYears: string;
  experienceLabel: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  resumeFileName: string;
  resumeFileUrl: string;
  speechBubbleText: string;
  heroImageUrl: string;
  location: string;
  education: string;
  obsession: string;
  personalInterest: string;
  email: string;
  phone: string;
  aboutTitle?: string;
  aboutHighlightedWord?: string;
  aboutSubtitle?: string;
  aboutBio: string;
  aboutPlantTip?: string;
  processTitle?: string;
  processHighlightedWord?: string;
  processSubtitle?: string;
  ctaHeadline: string;
  ctaHighlightedWord: string;
  ctaSubtext: string;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  faviconUrl: string;
  googleAnalyticsId: string;
  authorName: string;
  authorRole: string;
  canonicalUrl?: string;
  logoUrl?: string;
  logoHeight?: number;
  showLogoText?: boolean;
  showLogoHeart?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
  avatarUrl?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
  usageCount: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface AdvancedSettings {
  adminEmail: string;
  adminPassword?: string;
  adminName: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  twoFactorEnabled: boolean;
  sessionTimeoutDays: number;
  emailNotifications: boolean;
  discordWebhookUrl: string;
  slackWebhookUrl: string;
  honeypotStrict: boolean;
  storageUsedMb: number;
  lastBackupDate: string;
}
