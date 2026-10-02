import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SeoSettings, PortfolioProfile } from '../../types';
import {
  Save,
  Globe,
  Share2,
  Code,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Heart,
  Sliders,
  Check,
  Layout,
  Smile,
  Search,
  Edit3,
  Smartphone,
  Laptop,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface SeoModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const SeoModule: React.FC<SeoModuleProps> = ({ onShowToast }) => {
  const { seo, setSeo, profile, setProfile } = usePortfolio();

  // Navigation tab within SEO Module
  const [activeTab, setActiveTab] = useState<'all' | 'logo' | 'hero' | 'about' | 'seo'>('all');

  // Screen 1: Logo & Navbar Branding State
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || seo.logoUrl || '');
  const [logoHeight, setLogoHeight] = useState<number>(profile.logoHeight || seo.logoHeight || 38);
  const [showLogoText, setShowLogoText] = useState(profile.showLogoText !== false);
  const [showLogoHeart, setShowLogoHeart] = useState(profile.showLogoHeart !== false);
  const [name, setName] = useState(profile.name);
  const [brandSuffix, setBrandSuffix] = useState(profile.brandSuffix);
  const [roleSubtitle, setRoleSubtitle] = useState(profile.roleSubtitle);

  // Screen 2: Hero Section State
  const [greetingText, setGreetingText] = useState(profile.greetingText || "Hi, I'm");
  const [heroPitch, setHeroPitch] = useState(profile.heroPitch);

  // Screen 3: About Section State
  const [aboutTitle, setAboutTitle] = useState(profile.aboutTitle || 'About');
  const [aboutHighlightedWord, setAboutHighlightedWord] = useState(profile.aboutHighlightedWord || 'Me');
  const [aboutSubtitle, setAboutSubtitle] = useState(
    profile.aboutSubtitle || 'A little glimpse into who I am and what drives my craft.'
  );
  const [aboutBio, setAboutBio] = useState(profile.aboutBio);
  const [aboutPlantTip, setAboutPlantTip] = useState(
    profile.aboutPlantTip || 'Tip: Click the studio plant to give it some love!'
  );

  // Search Engine & Social Meta Tags State
  const [siteTitle, setSiteTitle] = useState(seo.siteTitle);
  const [metaDescription, setMetaDescription] = useState(seo.metaDescription);
  const [canonicalUrl, setCanonicalUrl] = useState(seo.canonicalUrl || 'https://ashhardesigns.com');
  const [ogImageUrl, setOgImageUrl] = useState(seo.ogImageUrl);
  const [faviconUrl, setFaviconUrl] = useState(seo.faviconUrl);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(seo.googleAnalyticsId);

  // Google Search Engine Preview Controls
  const [isEditingSnippet, setIsEditingSnippet] = useState(false);
  const [serpViewMode, setSerpViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Sync when profile/seo changes in context
  useEffect(() => {
    setLogoUrl(profile.logoUrl || seo.logoUrl || '');
    setLogoHeight(profile.logoHeight || seo.logoHeight || 38);
    setShowLogoText(profile.showLogoText !== false);
    setShowLogoHeart(profile.showLogoHeart !== false);
    setName(profile.name);
    setBrandSuffix(profile.brandSuffix);
    setRoleSubtitle(profile.roleSubtitle);
    setGreetingText(profile.greetingText || "Hi, I'm");
    setHeroPitch(profile.heroPitch);
    setAboutTitle(profile.aboutTitle || 'About');
    setAboutHighlightedWord(profile.aboutHighlightedWord || 'Me');
    setAboutSubtitle(profile.aboutSubtitle || 'A little glimpse into who I am and what drives my craft.');
    setAboutBio(profile.aboutBio);
    setAboutPlantTip(profile.aboutPlantTip || 'Tip: Click the studio plant to give it some love!');

    setSiteTitle(seo.siteTitle);
    setMetaDescription(seo.metaDescription);
    setCanonicalUrl(seo.canonicalUrl || 'https://ashhardesigns.com');
    setOgImageUrl(seo.ogImageUrl);
    setFaviconUrl(seo.faviconUrl);
    setGoogleAnalyticsId(seo.googleAnalyticsId);
  }, [profile, seo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: PortfolioProfile = {
      ...profile,
      name: name.trim(),
      brandSuffix: brandSuffix.trim(),
      roleSubtitle: roleSubtitle.trim(),
      logoUrl,
      logoHeight,
      showLogoText,
      showLogoHeart,
      greetingText: greetingText.trim(),
      heroPitch: heroPitch.trim(),
      aboutTitle: aboutTitle.trim(),
      aboutHighlightedWord: aboutHighlightedWord.trim(),
      aboutSubtitle: aboutSubtitle.trim(),
      aboutBio: aboutBio.trim(),
      aboutPlantTip: aboutPlantTip.trim(),
    };

    const updatedSeo: SeoSettings = {
      ...seo,
      siteTitle: siteTitle.trim(),
      metaDescription: metaDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
      ogImageUrl,
      faviconUrl,
      googleAnalyticsId: googleAnalyticsId.trim(),
      logoUrl,
      logoHeight,
      showLogoText,
      showLogoHeart,
      authorName: name.trim(),
      authorRole: roleSubtitle.trim(),
    };

    setProfile(updatedProfile);
    setSeo(updatedSeo);

    // Update document title, meta description, favicon, and canonical URL
    document.title = siteTitle.trim();
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', metaDescription.trim());

    if (canonicalUrl) {
      let canonicalLink: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.getElementsByTagName('head')[0].appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl.trim();
    }

    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }

    onShowToast(
      'Settings Saved',
      'Logo, Navbar branding, Hero text, About section & SEO meta tags updated successfully.'
    );
  };

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: roleSubtitle,
    url: 'https://ashhardesigns.com',
    description: metaDescription,
    image: ogImageUrl || logoUrl,
    sameAs: ['https://behance.net', 'https://linkedin.com', 'https://dribbble.com'],
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
            <span>SEO, Branding &amp; Site Meta Tags</span>
            <span className="bg-[#E8F7F2] text-[#37B294] text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Customizer
            </span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Customize your logo, navbar header, hero text, about section, and search engine metadata with instant live preview.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Category Sub-Tabs for Fast Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#F7FCFA] rounded-2xl border border-[#D8F2E9] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#1F2A37]'
          }`}
        >
          All Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'logo'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#1F2A37]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>1. Logo &amp; Navbar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'hero'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#1F2A37]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. Hero Headline</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#1F2A37]'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>3. About Section</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#1F2A37]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>4. Search Meta &amp; SEO</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Editors */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: LOGO & NAVBAR BRANDING (SCREENSHOT 1) */}
          {(activeTab === 'all' || activeTab === 'logo') && (
            <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F7F2] text-[#37B294] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2A37]">
                      Logo &amp; Navbar Header (Screenshot 1)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Upload your brand logo image and configure navbar wordmark text.
                    </p>
                  </div>
                </div>
              </div>

              {/* Logo Upload Button */}
              <ImageUploadField
                label="Custom Brand Logo Image"
                sublabel="(PNG, SVG, WebP, GIF)"
                value={logoUrl}
                onChange={setLogoUrl}
                helperText="Upload any logo image file from your device. Transparent PNG or SVG works best."
                aspectRatio="wide"
              />

              {/* Logo Display Options */}
              {logoUrl && (
                <div className="bg-[#F7FCFA] p-3.5 rounded-2xl border border-[#D8F2E9] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-[#1F2A37] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#4CC9A7]" />
                      <span>Logo Display Height: {logoHeight}px</span>
                    </label>
                    <input
                      type="range"
                      min={24}
                      max={64}
                      step={2}
                      value={logoHeight}
                      onChange={(e) => setLogoHeight(Number(e.target.value))}
                      className="w-full sm:w-44 accent-[#4CC9A7] cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-100 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={showLogoText}
                        onChange={(e) => setShowLogoText(e.target.checked)}
                        className="rounded text-[#4CC9A7] focus:ring-[#4CC9A7]"
                      />
                      <span>Show brand text next to logo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={showLogoHeart}
                        onChange={(e) => setShowLogoHeart(e.target.checked)}
                        className="rounded text-[#F2685F] focus:ring-[#F2685F]"
                      />
                      <span>Show heart doodle (♡)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Text Wordmark Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Brand Name / First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ashhar"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Shown in Caveat cursive font</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Role Subtitle (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={roleSubtitle}
                    onChange={(e) => setRoleSubtitle(e.target.value)}
                    placeholder="e.g. UI/UX DESIGNER"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Shown below name in small caps</p>
                </div>
              </div>

              {!logoUrl && (
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={showLogoHeart}
                      onChange={(e) => setShowLogoHeart(e.target.checked)}
                      className="rounded text-[#F2685F] focus:ring-[#F2685F]"
                    />
                    <span>Include coral heart icon (♡) in wordmark</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: HERO SECTION HEADLINE & PITCH (SCREENSHOT 2) */}
          {(activeTab === 'all' || activeTab === 'hero') && (
            <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F7F2] text-[#37B294] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2A37]">
                      Hero Section Headline &amp; Pitch (Screenshot 2)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Customize the primary headline, greeting callout, and introductory bio pitch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Greeting Callout (Cursive Teal)
                  </label>
                  <input
                    type="text"
                    value={greetingText}
                    onChange={(e) => setGreetingText(e.target.value)}
                    placeholder="Hi, I'm"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Appears with animated waving hand 👋</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Brand Suffix / Accent Word
                  </label>
                  <input
                    type="text"
                    value={brandSuffix}
                    onChange={(e) => setBrandSuffix(e.target.value)}
                    placeholder="Designs"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Teal colored second word in main H1</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Hero Pitch Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={heroPitch}
                  onChange={(e) => setHeroPitch(e.target.value)}
                  placeholder="I design intuitive, user-friendly digital experiences that are beautiful, functional and meaningful."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none leading-relaxed"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  The hero description displayed below the headline and role badge.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: ABOUT ME SECTION & BIO (SCREENSHOT 3) */}
          {(activeTab === 'all' || activeTab === 'about') && (
            <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F7F2] text-[#37B294] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2A37]">
                      About Me Section &amp; Plant Mascot (Screenshot 3)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Customize the section header, subtitle, about bio statement, and plant mascot tip.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="About"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Highlighted Word (Script Teal)
                  </label>
                  <input
                    type="text"
                    value={aboutHighlightedWord}
                    onChange={(e) => setAboutHighlightedWord(e.target.value)}
                    placeholder="Me"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  placeholder="A little glimpse into who I am and what drives my craft."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  About Me Full Bio Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={aboutBio}
                  onChange={(e) => setAboutBio(e.target.value)}
                  placeholder="I'm a passionate UI/UX designer who loves creating simple, intuitive and engaging experiences..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Studio Plant Mascot Helper Tip
                </label>
                <input
                  type="text"
                  value={aboutPlantTip}
                  onChange={(e) => setAboutPlantTip(e.target.value)}
                  placeholder="Tip: Click the studio plant to give it some love!"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 4: SEARCH ENGINE META TAGS & SEO */}
          {(activeTab === 'all' || activeTab === 'seo') && (
            <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F7F2] text-[#37B294] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2A37]">
                      Search Engine Indexing &amp; Social Meta Tags
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Configure title, description, favicon, and social card previews.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  HTML Page Title (&lt;title&gt;) *
                </label>
                <input
                  type="text"
                  required
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Meta Description * (Search engines)
                </label>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Canonical Website URL (Domain)
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://ashhardesigns.com"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  The primary domain link shown in Google search results and canonical links.
                </p>
              </div>

              {/* Favicon & OG Image Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Browser Favicon Icon"
                  sublabel="(Tab Icon)"
                  value={faviconUrl}
                  onChange={setFaviconUrl}
                  helperText="Upload .ico or .png favicon"
                  aspectRatio="square"
                />

                <ImageUploadField
                  label="OpenGraph Social Share Card"
                  sublabel="(LinkedIn / Twitter)"
                  value={ogImageUrl}
                  onChange={setOgImageUrl}
                  helperText="Upload 1200x630px social card image"
                  aspectRatio="wide"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Previews Matching Screenshots */}
        <div className="lg:col-span-5 space-y-6">
          {/* SCREENSHOT 1 LIVE PREVIEW: NAVBAR BRANDING */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#1F2A37] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#4CC9A7]" />
                <span>Live Preview: Navbar Brand (Screen 1)</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            <div className="p-4 bg-[#F7FCFA] rounded-2xl border border-[#D8F2E9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={name}
                    style={{ maxHeight: `${logoHeight}px` }}
                    className="w-auto max-w-[140px] object-contain"
                  />
                )}

                {(!logoUrl || showLogoText) && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-script text-2xl font-bold text-[#4CC9A7] leading-tight">
                        {name || 'Ashhar'}
                      </span>
                      {showLogoHeart && <span className="text-[#F2685F] text-base select-none">♡</span>}
                    </div>
                    <span className="text-[9px] tracking-widest uppercase font-semibold text-[#9CA3AF] -mt-1 font-sans">
                      {roleSubtitle || 'UI/UX DESIGNER'}
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
                <span>Home</span>
                <span>About</span>
                <span>Work</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400">
              Matches your site header. Changes reflect instantly when saved.
            </p>
          </div>

          {/* SCREENSHOT 2 LIVE PREVIEW: HERO SECTION */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#1F2A37] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4CC9A7]" />
                <span>Live Preview: Hero Headline (Screen 2)</span>
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
              <div className="inline-flex items-center gap-1.5">
                <span className="font-script text-xl text-[#4CC9A7] font-bold">
                  {greetingText || "Hi, I'm"}
                </span>
                <span className="text-lg">👋</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#1F2A37] font-sans leading-tight">
                <span>{name || 'Ashhar'}</span>{' '}
                <span className="text-[#4CC9A7]">{brandSuffix || 'Designs'}</span>
              </h1>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#F2685F]">{roleSubtitle}</span>
                <span className="text-[#F2685F] text-sm">♡</span>
              </div>

              <p className="text-xs text-[#6B7280] leading-relaxed pt-1">
                {heroPitch || 'I design intuitive, user-friendly digital experiences that are beautiful, functional and meaningful.'}
              </p>
            </div>
          </div>

          {/* SCREENSHOT 3 LIVE PREVIEW: ABOUT ME & PLANT MASCOT */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#1F2A37] flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-[#4CC9A7]" />
                <span>Live Preview: About Section (Screen 3)</span>
              </span>
            </div>

            <div className="p-4 bg-[#F7FCFA] rounded-2xl border border-[#D8F2E9] space-y-3">
              <div className="text-center">
                <h4 className="text-lg font-bold text-[#1F2A37]">
                  {aboutTitle || 'About'}{' '}
                  <span className="font-script text-[#4CC9A7] text-xl font-bold">
                    {aboutHighlightedWord || 'Me'}
                  </span>{' '}
                  <span className="text-[#F2685F] text-sm">♡</span>
                </h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{aboutSubtitle}</p>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#E8F7F2] flex items-center justify-center flex-shrink-0 text-xl">
                  🌱
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                    {aboutBio}
                  </p>
                  <p className="text-[10px] text-[#4CC9A7] font-semibold mt-1">
                    ✨ {aboutPlantTip}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GOOGLE SEARCH SNIPPET PREVIEW (FULLY EDITABLE) */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  G
                </div>
                <span className="text-xs font-bold text-[#1F2A37]">Google Search Engine Preview</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Desktop / Mobile view toggle */}
                <div className="bg-gray-100 p-0.5 rounded-lg flex items-center text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSerpViewMode('desktop')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                      serpViewMode === 'desktop'
                        ? 'bg-white text-gray-800 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Desktop Preview"
                  >
                    <Laptop className="w-3 h-3" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpViewMode('mobile')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                      serpViewMode === 'mobile'
                        ? 'bg-white text-gray-800 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Mobile</span>
                  </button>
                </div>

                {/* Edit Mode Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsEditingSnippet(!isEditingSnippet)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    isEditingSnippet
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-[#E8F7F2] text-[#37B294] hover:bg-[#d4f2e7]'
                  }`}
                >
                  {isEditingSnippet ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Done Editing</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* If In Edit Mode: Inline Snippet Editor with Length Trackers */}
            {isEditingSnippet && (
              <div className="p-3.5 bg-[#F7FCFA] rounded-2xl border border-[#D8F2E9] space-y-3 animate-in fade-in duration-150">
                {/* SEO Title Input */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <label className="font-bold text-[#1F2A37]">Google SEO Title</label>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        siteTitle.length > 60
                          ? 'text-amber-600'
                          : siteTitle.length < 30
                          ? 'text-gray-400'
                          : 'text-emerald-600'
                      }`}
                    >
                      {siteTitle.length} / 60 chars {siteTitle.length > 60 ? '(may truncate)' : ''}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="Enter SEO title..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none bg-white font-medium"
                  />
                  {/* Progress meter */}
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        siteTitle.length > 60
                          ? 'bg-amber-500'
                          : siteTitle.length >= 35
                          ? 'bg-emerald-500'
                          : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min(100, (siteTitle.length / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Canonical URL / Slug Input */}
                <div>
                  <label className="block font-bold text-[#1F2A37] text-[11px] mb-1">
                    Google Display URL / Permalink
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#4CC9A7]">
                    <span className="text-[11px] text-gray-400 pl-3 select-none">https://</span>
                    <input
                      type="text"
                      value={canonicalUrl.replace(/^https?:\/\//, '')}
                      onChange={(e) => setCanonicalUrl(`https://${e.target.value.replace(/^https?:\/\//, '')}`)}
                      placeholder="ashhardesigns.com"
                      className="w-full text-xs py-2 px-1 outline-none text-gray-700 font-mono"
                    />
                  </div>
                </div>

                {/* Meta Description Textarea */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <label className="font-bold text-[#1F2A37]">Google Meta Snippet Description</label>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        metaDescription.length > 160
                          ? 'text-amber-600'
                          : metaDescription.length < 90
                          ? 'text-gray-400'
                          : 'text-emerald-600'
                      }`}
                    >
                      {metaDescription.length} / 160 chars {metaDescription.length > 160 ? '(may truncate)' : ''}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter meta description snippet..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none bg-white resize-none leading-relaxed"
                  />
                  {/* Progress meter */}
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metaDescription.length > 160
                          ? 'bg-amber-500'
                          : metaDescription.length >= 110
                          ? 'bg-emerald-500'
                          : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min(100, (metaDescription.length / 160) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSiteTitle(`${name} — ${roleSubtitle} | Creative Portfolio`);
                      setMetaDescription(
                        `Explore the design portfolio of ${name}, ${roleSubtitle}. Discover mobile applications, web design systems, high-converting ad visuals, and interactive user experiences.`
                      );
                    }}
                    className="text-[11px] text-gray-500 hover:text-[#37B294] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Recommended Format</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingSnippet(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold cursor-pointer"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            )}

            {/* Realistic Google SERP Preview Box */}
            <div
              onClick={() => {
                if (!isEditingSnippet) setIsEditingSnippet(true);
              }}
              title="Click anywhere to edit Google snippet directly"
              className={`p-4 bg-white rounded-2xl border transition-all text-left group cursor-pointer ${
                serpViewMode === 'mobile'
                  ? 'max-w-[340px] mx-auto border-gray-300 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-xs'
              }`}
            >
              {/* Site Identity & URL Path */}
              <div className="flex items-center gap-2 mb-1.5">
                {/* Favicon Icon */}
                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="" className="w-full h-full object-cover" />
                  ) : logoUrl ? (
                    <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Globe className="w-3 h-3 text-blue-500" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 text-[11px] leading-tight truncate">
                  <span className="font-semibold text-[#202124] truncate">
                    {name} {brandSuffix || 'Designs'}
                  </span>
                  <span className="text-gray-400 hidden sm:inline">·</span>
                  <span className="text-[#4d5156] font-mono text-[10px] truncate">
                    {canonicalUrl.replace(/^https?:\/\//, '')}
                  </span>
                </div>

                {/* Edit hint pill */}
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Click to edit</span>
                </span>
              </div>

              {/* Blue Clickable Title */}
              <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] group-hover:underline leading-snug line-clamp-2 tracking-normal font-sans mb-1">
                {siteTitle || `${name} — ${roleSubtitle}`}
              </h3>

              {/* Snippet Description */}
              <p className="text-xs sm:text-[13px] text-[#4d5156] line-clamp-2 leading-relaxed font-sans">
                {metaDescription ||
                  'Portfolio of Ashhar, UI/UX Designer crafting intuitive, user-friendly digital experiences that are beautiful, functional, and meaningful.'}
              </p>
            </div>

            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <span>💡</span>
              <span>Click the preview or &quot;Edit Snippet&quot; button to customize how Google displays your website.</span>
            </p>
          </div>

          {/* JSON-LD Schema Snippet */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#4CC9A7]" />
              <span>Structured Data (JSON-LD)</span>
            </h4>
            <pre className="bg-[#F7FCFA] p-3 rounded-xl border border-gray-200 text-[10px] text-[#1F2A37] font-mono overflow-x-auto">
              {JSON.stringify(jsonLdSchema, null, 2)}
            </pre>
          </div>
        </div>
      </form>
    </div>
  );
};
