import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectWorkType } from '../types';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Monitor,
  Play,
  Send,
  Smartphone,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ServiceWorksPageProps {
  serviceId: string;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onStartProjectWithService: (serviceName: string) => void;
}

export const ServiceWorksPage: React.FC<ServiceWorksPageProps> = ({
  serviceId,
  onBack,
  onSelectProject,
  onStartProjectWithService,
}) => {
  const { services, projects } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<'all' | ProjectWorkType>('all');

  const currentService = services.find((s) => s.id === serviceId) || services[0];

  if (!currentService) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-4">Service not found.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#4CC9A7] text-white rounded-full text-xs font-bold cursor-pointer"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  // Filter projects belonging to this service
  const serviceProjects = projects.filter((p) => {
    if (!p.published) return false;
    const matchesServiceId = p.serviceId === currentService.id;
    const matchesCategory =
      p.category?.toLowerCase().includes(currentService.title.toLowerCase()) ||
      currentService.title?.toLowerCase().includes(p.category?.toLowerCase() || '');
    return matchesServiceId || matchesCategory;
  });

  const filteredProjects = selectedFilter === 'all'
    ? serviceProjects
    : serviceProjects.filter((p) => p.workType === selectedFilter);

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12 md:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E6DF]">
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4B5552] hover:text-[#4CC9A7] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Capabilities</span>
          </button>

          <span className="text-[11px] font-semibold text-[#8C9793] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#E8E6DF] shadow-2xs">
            Service Deep Dive
          </span>
        </div>

        {/* Hero Header for this Service */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6DF] shadow-soft-card mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#E8F7F2] to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F2] text-[#2D9A7A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F2685F]" />
                <span>Specialized Practice</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111615] tracking-tight">
                {currentService.title}
              </h1>

              <p className="text-base sm:text-lg text-[#4B5552] max-w-2xl leading-relaxed">
                {currentService.desc}
              </p>

              {currentService.details && (
                <div className="pt-2">
                  <h2 className="text-xs font-bold text-[#8C9793] uppercase tracking-wider mb-2">
                    Methodology &amp; Practice
                  </h2>
                  <p className="text-sm text-[#4B5552] leading-relaxed">
                    {currentService.details}
                  </p>
                </div>
              )}

              {/* Delivery Meta */}
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-[#111615]">
                {currentService.estimatedTimeline && (
                  <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3.5 py-1.5 rounded-full border border-[#E8E6DF]">
                    <Clock className="w-3.5 h-3.5 text-[#4CC9A7]" />
                    <span className="font-semibold">Sprint Timeline:</span>
                    <span className="text-[#4B5552]">{currentService.estimatedTimeline}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3.5 py-1.5 rounded-full border border-[#E8E6DF]">
                  <Briefcase className="w-3.5 h-3.5 text-[#3FB98B]" />
                  <span className="font-semibold">Available Capacity:</span>
                  <span className="text-[#3FB98B] font-bold">Open for Sprints</span>
                </div>
              </div>
            </div>

            {/* Right Card: Deliverables & CTA */}
            <div className="lg:col-span-4 bg-[#FAF9F5] rounded-2xl p-6 border border-[#E8E6DF] space-y-5">
              <h2 className="text-xs font-bold text-[#111615] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3FB98B]" />
                <span>Standard Deliverables</span>
              </h2>

              <div className="space-y-2.5">
                {(currentService.deliverablesList && currentService.deliverablesList.length > 0
                  ? currentService.deliverablesList
                  : [
                      'High-Fidelity Figma Systems',
                      'Tactile Clickable Prototype',
                      'Design Token Code Package',
                      'Multi-Screen Responsive Assets',
                    ]
                ).map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4B5552]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4CC9A7] mt-1.5 flex-shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => onStartProjectWithService(currentService.title)}
                  className="w-full bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-bold px-5 py-3 rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Request Proposal for {currentService.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase of Works Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111615] flex items-center gap-2">
              <span>Delivered Case Studies</span>
              <span className="text-xs font-semibold text-[#2D9A7A] bg-[#E8F7F2] px-2.5 py-0.5 rounded-full">
                {serviceProjects.length} Projects
              </span>
            </h2>
            <p className="text-xs text-[#8C9793] mt-0.5">
              Real client deployments and high-impact digital systems built under {currentService.title}.
            </p>
          </div>

          {/* WorkType Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'web', label: 'Web & SaaS' },
              { id: 'mobile', label: 'Mobile Apps' },
              { id: 'ad', label: 'Performance Ads' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-[#111615] text-white shadow-2xs'
                    : 'bg-white text-[#4B5552] border border-[#E8E6DF] hover:border-gray-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E6DF] space-y-4">
            <Layers className="w-12 h-12 text-[#8C9793] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#111615]">
              No case studies matching &quot;{selectedFilter}&quot; currently.
            </h3>
            <p className="text-xs text-[#8C9793] max-w-md mx-auto">
              We frequently take on private under-NDA engagements for {currentService.title}.
              Reach out directly to request our private deck.
            </p>
            <button
              type="button"
              onClick={() => onStartProjectWithService(currentService.title)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4CC9A7] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#37B294]"
            >
              <span>Inquire About {currentService.title}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
              >
                {/* Visual Cover Stage */}
                <div className="h-52 relative overflow-hidden bg-[#FAF9F5]">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E8F7F2] text-[#2D9A7A] font-bold text-sm">
                      {project.title}
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-white/95 backdrop-blur-xs text-[#111615] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                      {project.category}
                    </span>

                    {project.workType === 'ad' && project.adMediaType === 'video' && (
                      <span className="bg-[#F2685F] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>VIDEO</span>
                      </span>
                    )}
                  </div>

                  {project.websiteImages && project.websiteImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{project.websiteImages.length} screens</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C9793] mb-1.5 font-medium">
                      <span>{project.client || 'Client Project'}</span>
                      <span>{project.year || '2024'}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#111615] group-hover:text-[#4CC9A7] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#4B5552] line-clamp-2 mt-2 leading-relaxed">
                      {project.summary || project.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4CC9A7] group-hover:underline inline-flex items-center gap-1">
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    {project.tools && project.tools.length > 0 && (
                      <span className="text-[11px] text-[#8C9793] truncate max-w-[120px]">
                        {project.tools[0]}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
