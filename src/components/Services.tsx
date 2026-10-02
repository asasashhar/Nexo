import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import {
  PenTool,
  Smartphone,
  Monitor,
  Layers,
  Search,
  Check,
  Image as ImageIcon,
  Sparkles,
  Film,
  ArrowRight,
  Clock,
  Briefcase,
  Play,
  ArrowUpRight,
} from 'lucide-react';

interface ServicesProps {
  onSelectServiceForInquiry?: (serviceName: string) => void;
  onSelectProject?: (project: Project) => void;
  onOpenServiceWorks?: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  onSelectServiceForInquiry,
  onSelectProject,
  onOpenServiceWorks,
}) => {
  const { services, projects } = usePortfolio();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const publishedServices = services
    .filter((s) => s.published)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" strokeWidth={1.8} />;
      case 'Monitor':
      case 'Layout':
        return <Monitor className="w-6 h-6" strokeWidth={1.8} />;
      case 'Layers':
        return <Layers className="w-6 h-6" strokeWidth={1.8} />;
      case 'Search':
        return <Search className="w-6 h-6" strokeWidth={1.8} />;
      case 'Image':
        return <ImageIcon className="w-6 h-6" strokeWidth={1.8} />;
      case 'Film':
        return <Film className="w-6 h-6" strokeWidth={1.8} />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" strokeWidth={1.8} />;
      default:
        return <PenTool className="w-6 h-6" strokeWidth={1.8} />;
    }
  };

  const activeService = publishedServices.find((s) => s.id === selectedServiceId);

  // Match projects either by serviceId OR category matching service title
  const relatedProjects = activeService
    ? projects.filter(
        (p) =>
          p.published &&
          (p.serviceId === activeService.id ||
            p.category.toLowerCase().includes(activeService.title.toLowerCase()) ||
            activeService.title.toLowerCase().includes(p.category.toLowerCase()))
      )
    : [];

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F7FCFA] relative overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="absolute top-10 right-0 w-[450px] h-[450px] bg-[#E8F7F2]/70 blob-bg -z-10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#FDECEA]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header: "Our Services ♡" */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D8F2E9] text-[#2D9A7A] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#4CC9A7] animate-pulse" />
            <span>End-to-End Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F2A37] tracking-tight">
            Our{' '}
            <span className="font-script text-[#4CC9A7] text-4xl sm:text-5xl md:text-6xl font-normal">
              Services
            </span>{' '}
            <span className="text-[#F2685F] text-2xl sm:text-3xl select-none inline-block animate-pulse">
              ♡
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-3 max-w-xl mx-auto leading-relaxed">
            From intuitive UI/UX and mobile apps to striking posters and high-conversion motion ads.
          </p>
        </div>

        {/* Elevated Services Cards Grid: 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedServices.map((service, index) => {
            const isSelected = selectedServiceId === service.id;
            const stepNum = (index + 1).toString().padStart(2, '0');

            return (
              <div
                key={service.id}
                onClick={() => {
                  if (onOpenServiceWorks) {
                    onOpenServiceWorks(service.id);
                  } else {
                    setSelectedServiceId(isSelected ? null : service.id);
                  }
                }}
                className={`group bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative overflow-hidden ${
                  isSelected
                    ? 'border-[#4CC9A7] ring-2 ring-[#4CC9A7]/40 shadow-xl -translate-y-2'
                    : 'border-[#E8F7F2] shadow-[0_8px_30px_rgba(76,201,167,0.06)] hover:-translate-y-2 hover:border-[#4CC9A7]/60 hover:shadow-[0_20px_40px_rgba(76,201,167,0.16)]'
                }`}
              >
                {/* Decorative Top-Right Corner Highlight */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E8F7F2]/80 to-transparent rounded-bl-3xl -z-0 pointer-events-none transition-transform group-hover:scale-125" />

                <div>
                  {/* Top Bar: Icon + Number Badge */}
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="w-13 h-13 rounded-2xl bg-[#E8F7F2] group-hover:bg-[#4CC9A7] text-[#4CC9A7] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_8px_20px_rgba(76,201,167,0.35)] group-hover:scale-105">
                      {getIcon(service.iconName)}
                    </div>

                    <span className="text-xs font-black text-[#9CA3AF] group-hover:text-[#4CC9A7] transition-colors tracking-widest font-mono">
                      /{stepNum}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1F2A37] group-hover:text-[#111615] transition-colors mb-2 leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 mb-4">
                    {service.desc}
                  </p>

                  {/* Deliverables mini tags */}
                  {service.deliverablesList && service.deliverablesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.deliverablesList.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-[#F7FCFA] text-[#2D9A7A] px-2 py-0.5 rounded-md border border-[#D8F2E9]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action link */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#4CC9A7] group-hover:text-[#37B294] transition-colors">
                  <span>Explore Scope</span>
                  <div className="w-7 h-7 rounded-full bg-[#E8F7F2] group-hover:bg-[#4CC9A7] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Service Detail + Related Works Section (when onOpenServiceWorks is not active) */}
        {activeService && !onOpenServiceWorks && (
          <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#4CC9A7]/40 shadow-xl animate-in fade-in duration-300">
            {/* Header of Active Service */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center flex-shrink-0">
                  {getIcon(activeService.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[#1F2A37]">{activeService.title}</h3>
                    <span className="bg-[#E8F7F2] text-[#37B294] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Service Scope
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">{activeService.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {onSelectServiceForInquiry && (
                  <button
                    onClick={() => onSelectServiceForInquiry(activeService.title)}
                    className="bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Request Proposal for {activeService.title} →
                  </button>
                )}
                <button
                  onClick={() => setSelectedServiceId(null)}
                  className="text-xs text-[#9CA3AF] hover:text-[#1F2A37] font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Service Details & Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Methodology &amp; Approach
                </h4>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  {activeService.details}
                </p>

                {activeService.estimatedTimeline && (
                  <div className="flex items-center gap-2 text-xs text-[#1F2A37] pt-2">
                    <Clock className="w-4 h-4 text-[#4CC9A7]" />
                    <span className="font-semibold">Typical Sprint Timeline:</span>
                    <span className="text-[#6B7280]">{activeService.estimatedTimeline}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 bg-[#F7FCFA] p-5 rounded-2xl border border-[#D8F2E9]">
                <h4 className="text-xs font-bold text-[#1F2A37] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <span>Key Deliverables</span>
                </h4>
                <div className="space-y-2">
                  {(activeService.deliverablesList || [
                    'High-Fidelity Figma Screens',
                    'Interactive Prototyping',
                    'Design System Tokens',
                    'Asset Handoff Package',
                  ]).map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#1F2A37]">
                      <Check className="w-3.5 h-3.5 text-[#4CC9A7] mt-0.5 flex-shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Works Related to this Service */}
            {relatedProjects.length > 0 && (
              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                      <span>Works Related to {activeService.title}</span>
                      <span className="text-xs font-semibold text-[#4CC9A7] bg-[#E8F7F2] px-2 py-0.5 rounded-full">
                        {relatedProjects.length} Projects
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject && onSelectProject(proj)}
                      className="group bg-[#F7FCFA] rounded-2xl overflow-hidden border border-[#E8F7F2] shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                    >
                      <div className="h-44 relative overflow-hidden bg-gray-100">
                        {proj.coverImage && (
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-[#4CC9A7] uppercase tracking-wider block mb-1">
                          {proj.category}
                        </span>
                        <h5 className="text-sm font-bold text-[#1F2A37] group-hover:text-[#4CC9A7] transition-colors">
                          {proj.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
