import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ServiceItem } from '../types';
import {
  Globe,
  Palette,
  Megaphone,
  Box,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  Lightbulb,
  Monitor,
  Smartphone,
  Layers,
  Search,
  PenTool,
  Film,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Send,
  Target,
  Award,
  Rocket,
  TrendingUp,
  Heart,
  Compass,
} from 'lucide-react';

interface ServicesProps {
  onSelectServiceForInquiry?: (serviceName: string) => void;
  onSelectProject?: (project: Project) => void;
  onOpenServiceWorks?: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  onSelectServiceForInquiry,
  onOpenServiceWorks,
}) => {
  const { services, whyChooseItems, profile, isAdminLoggedIn } = usePortfolio();

  // Helper to map icon name to Lucide Icon component
  const getServiceIcon = (iconName?: string, title: string = '') => {
    const lowerTitle = title.toLowerCase();
    const lowerIcon = (iconName || '').toLowerCase();

    if (lowerIcon === 'globe' || lowerTitle.includes('globe') || lowerTitle.includes('web'))
      return Globe;
    if (lowerIcon === 'palette' || lowerTitle.includes('poster') || lowerTitle.includes('art'))
      return Palette;
    if (lowerIcon === 'megaphone' || lowerTitle.includes('ad') || lowerTitle.includes('campaign'))
      return Megaphone;
    if (lowerIcon === 'box' || lowerTitle.includes('product') || lowerTitle.includes('3d'))
      return Box;
    if (lowerIcon === 'film' || lowerTitle.includes('video') || lowerTitle.includes('motion'))
      return Film;
    if (lowerIcon === 'monitor') return Monitor;
    if (lowerIcon === 'smartphone' || lowerTitle.includes('mobile') || lowerTitle.includes('app'))
      return Smartphone;
    if (lowerIcon === 'layers' || lowerTitle.includes('system')) return Layers;
    if (lowerIcon === 'search' || lowerTitle.includes('seo') || lowerTitle.includes('research'))
      return Search;
    if (lowerIcon === 'camera' || lowerTitle.includes('photo')) return Camera;
    if (lowerIcon === 'sparkles' || lowerTitle.includes('brand')) return Sparkles;
    if (lowerIcon === 'image') return ImageIcon;
    return PenTool;
  };

  // Helper to get vibrant thematic accent color for each service
  const getServiceColor = (title: string, index: number) => {
    const lower = title.toLowerCase();
    if (lower.includes('web')) return { accent: '#00E599', glow: 'rgba(0, 229, 153, 0.15)' };
    if (lower.includes('poster') && !lower.includes('product'))
      return { accent: '#FF5A36', glow: 'rgba(255, 90, 54, 0.15)' };
    if (lower.includes('ad') || lower.includes('video') || lower.includes('motion'))
      return { accent: '#06B6D4', glow: 'rgba(6, 182, 212, 0.15)' };
    if (lower.includes('product') || lower.includes('3d'))
      return { accent: '#A855F7', glow: 'rgba(168, 85, 247, 0.15)' };
    if (lower.includes('mobile') || lower.includes('app'))
      return { accent: '#3B82F6', glow: 'rgba(59, 130, 246, 0.15)' };
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('system'))
      return { accent: '#10B981', glow: 'rgba(16, 185, 129, 0.15)' };

    // Fallback thematic cycle
    const palette = [
      { accent: '#00E599', glow: 'rgba(0, 229, 153, 0.15)' },
      { accent: '#FF5A36', glow: 'rgba(255, 90, 54, 0.15)' },
      { accent: '#06B6D4', glow: 'rgba(6, 182, 212, 0.15)' },
      { accent: '#A855F7', glow: 'rgba(168, 85, 247, 0.15)' },
      { accent: '#FFB800', glow: 'rgba(255, 184, 0, 0.15)' },
      { accent: '#EC4899', glow: 'rgba(236, 72, 153, 0.15)' },
    ];
    return palette[index % palette.length];
  };

  // Get active published services that the admin has added/edited in admin panel
  const activeServices = services
    .filter((s) => s.published !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Fallback defaults if no services added
  const defaultServices: ServiceItem[] = [
    {
      id: 'srv-web',
      title: 'Web Design',
      desc: 'Modern, responsive and user-friendly websites that represent your brand perfectly.',
      details: 'Custom Responsive Web, Clean UI/UX Architecture, SEO & Speed Optimizations',
      iconName: 'Monitor',
      published: true,
      order: 1,
      estimatedTimeline: '2-3 Weeks',
      deliverablesList: ['Custom Responsive Web', 'Clean UI/UX Architecture', 'SEO & Speed Optimizations'],
    },
    {
      id: 'srv-poster',
      title: 'Poster Making',
      desc: 'Eye-catching posters for events, campaigns, schools and businesses.',
      details: 'High-Res Print CMYK, Digital Campaign Art, Custom Typography & Vectors',
      iconName: 'Palette',
      published: true,
      order: 2,
      estimatedTimeline: '3-7 Days',
      deliverablesList: ['High-Res Print CMYK', 'Digital Campaign Art', 'Custom Typography & Vectors'],
    },
    {
      id: 'srv-ads',
      title: 'Ads Creation',
      desc: 'Engaging social media ads and digital campaigns that get results.',
      details: '9:16 Vertical Video Reels, Multi-Platform Ad Units, Dynamic Kinetic Motion',
      iconName: 'Megaphone',
      published: true,
      order: 3,
      estimatedTimeline: '1-2 Weeks',
      deliverablesList: ['9:16 Vertical Video Reels', 'Multi-Platform Ad Units', 'Dynamic Kinetic Motion'],
    },
    {
      id: 'srv-prod',
      title: 'Product Poster',
      desc: 'Showcase your products with clean, attractive and professional designs.',
      details: 'Studio 3D Renders, Hardware Spec Callouts, Commercial Key Visuals',
      iconName: 'Box',
      published: true,
      order: 4,
      estimatedTimeline: '1-2 Weeks',
      deliverablesList: ['Studio 3D Renders', 'Hardware Spec Callouts', 'Commercial Key Visuals'],
    },
  ];

  // The displayed services: ALWAYS use the real admin-added services if available!
  const displayedServices = activeServices.length > 0 ? activeServices : defaultServices;

  // Extract deliverables array from deliverablesList or comma-separated details
  const getDeliverables = (service: ServiceItem): string[] => {
    if (service.deliverablesList && service.deliverablesList.length > 0) {
      return service.deliverablesList;
    }
    if (service.details) {
      const split = service.details
        .split(/[,\n•;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (split.length > 0) return split;
    }
    return ['Creative Direction', 'End-to-End Execution', 'High-Res Deliverables'];
  };

  // Helper to map Why Choose icon names
  const getWhyChooseIcon = (iconName: string = '') => {
    const lower = iconName.toLowerCase();
    if (lower.includes('light') || lower.includes('idea') || lower.includes('mind')) return Lightbulb;
    if (lower.includes('zap') || lower.includes('fast') || lower.includes('bolt') || lower.includes('speed')) return Zap;
    if (lower.includes('shield') || lower.includes('quality') || lower.includes('secure')) return ShieldCheck;
    if (lower.includes('user') || lower.includes('client') || lower.includes('team')) return Users;
    if (lower.includes('target') || lower.includes('goal')) return Target;
    if (lower.includes('award') || lower.includes('trophy')) return Award;
    if (lower.includes('sparkle') || lower.includes('magic')) return Sparkles;
    if (lower.includes('clock') || lower.includes('time')) return Clock;
    if (lower.includes('rocket') || lower.includes('launch')) return Rocket;
    if (lower.includes('trend') || lower.includes('growth')) return TrendingUp;
    if (lower.includes('heart') || lower.includes('love')) return Heart;
    if (lower.includes('palette') || lower.includes('color') || lower.includes('art')) return Palette;
    if (lower.includes('compass')) return Compass;
    return Sparkles;
  };

  // Why Choose NEXO Matrix from PortfolioContext (Admin editable)
  const activeWhyChoose = whyChooseItems && whyChooseItems.length > 0 ? whyChooseItems : [
    {
      id: 'why-1',
      title: 'Creative Mindset',
      desc: 'Fresh ideas for unique results.',
      iconName: 'Lightbulb',
      color: '#00E599',
      order: 1,
    },
    {
      id: 'why-2',
      title: 'Fast Delivery',
      desc: 'On time, every time.',
      iconName: 'Zap',
      color: '#FF5A36',
      order: 2,
    },
    {
      id: 'why-3',
      title: 'Quality Designs',
      desc: 'Pixel perfect and professional.',
      iconName: 'ShieldCheck',
      color: '#06B6D4',
      order: 3,
    },
    {
      id: 'why-4',
      title: 'Client Focus',
      desc: 'Your success is our priority.',
      iconName: 'Users',
      color: '#A855F7',
      order: 4,
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-[#080B11] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#00E599]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Matching Poster "— OUR SERVICES —" */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00E599] mb-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00E599]" />
            <span>OUR SERVICES</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00E599]" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-sans">
            Crafted for Impact. Built to Scale.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Everything your brand needs to command attention, outshine competitors, and drive measurable growth across digital platforms.
          </p>

          {isAdminLoggedIn && (
            <div className="mt-4 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
                <span>Live Admin Dynamic Services Active ({displayedServices.length} Disciplines Live)</span>
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Services Grid (Showing the real services added by the admin!) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            displayedServices.length % 3 === 0
              ? 'lg:grid-cols-3'
              : displayedServices.length === 4
              ? 'lg:grid-cols-4'
              : 'lg:grid-cols-3 xl:grid-cols-4'
          } gap-6`}
        >
          {displayedServices.map((service, idx) => {
            const Icon = getServiceIcon(service.iconName, service.title);
            const { accent, glow } = getServiceColor(service.title, idx);
            const deliverables = getDeliverables(service);

            return (
              <div
                key={service.id}
                onClick={() => {
                  if (onOpenServiceWorks) {
                    onOpenServiceWorks(service.id);
                  } else if (onSelectServiceForInquiry) {
                    onSelectServiceForInquiry(service.title);
                  }
                }}
                className="group bg-[#0F1522] rounded-3xl p-6 sm:p-7 border border-slate-800 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-slate-700"
                style={{
                  boxShadow: `0 10px 30px -10px ${glow}`,
                }}
              >
                {/* Decorative background glow on hover */}
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: accent }}
                />

                <div>
                  {/* Top Icon Badge + Index */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        backgroundColor: `${accent}20`,
                        color: accent,
                        border: `1px solid ${accent}40`,
                      }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-white transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Sprint Badge */}
                  <h3 className="text-xl font-black text-white tracking-wide font-sans mb-1.5 uppercase group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 mb-3 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{service.estimatedTimeline ? `Sprint: ${service.estimatedTimeline}` : 'NEXO Discipline'}</span>
                  </p>

                  {/* Real Description added by Admin */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3">
                    {service.desc}
                  </p>

                  {/* Real Deliverables added by Admin */}
                  {deliverables.length > 0 && (
                    <div className="space-y-1.5 mb-6">
                      {deliverables.slice(0, 4).map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Link */}
                <div
                  className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold transition-all duration-300"
                  style={{ color: accent }}
                >
                  <span className="group-hover:underline">Explore Portfolio Works</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                    style={{
                      backgroundColor: `${accent}25`,
                      color: accent,
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WHY CHOOSE NEXO? (Directly from Poster & editable by Admin) */}
        <div id="why-us" className="mt-24 pt-16 border-t border-slate-800/80">
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E599] mb-2 font-mono">
              {profile.whyChooseBadge || 'WHY CHOOSE NEXO?'}
            </h3>
            <p className="text-2xl sm:text-3xl font-black text-white font-sans">
              {profile.whyChooseTitle || 'Precision Engineering Meets Artistic Excellence'}
            </p>
            {profile.whyChooseSubtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
                {profile.whyChooseSubtitle}
              </p>
            )}
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              activeWhyChoose.length === 3
                ? 'lg:grid-cols-3'
                : activeWhyChoose.length >= 4
                ? 'lg:grid-cols-4'
                : 'lg:grid-cols-2'
            } gap-6`}
          >
            {activeWhyChoose.map((item, idx) => {
              const Icon = getWhyChooseIcon(item.iconName);
              const color = item.color || '#00E599';

              return (
                <div
                  key={item.id || idx}
                  className="bg-[#0F1522] rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${color}20`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-sans mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
