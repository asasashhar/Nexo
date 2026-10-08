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
  Play,
  Send,
  Sparkles,
  ArrowRight,
  Film,
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#080B11] text-white">
        <p className="text-slate-400 mb-4">Service not found.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#00E599] text-black rounded-full text-xs font-bold cursor-pointer"
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

  const filteredProjects = serviceProjects.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.workType === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-300 py-12 md:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-[#00E599] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Capabilities</span>
          </button>

          <span className="text-[11px] font-mono font-bold text-[#00E599] uppercase tracking-wider bg-[#0F1522] px-3.5 py-1.5 rounded-full border border-slate-800">
            NEXO Practice Area
          </span>
        </div>

        {/* Hero Header for this Service */}
        <div className="bg-[#0F1522] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E599]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E599]/15 text-[#00E599] text-xs font-bold uppercase tracking-wider border border-[#00E599]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Specialized Studio Service</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-sans">
                {currentService.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {currentService.desc}
              </p>

              {currentService.details && (
                <div className="pt-2">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    Methodology &amp; Practice
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentService.details}
                  </p>
                </div>
              )}

              {/* Delivery Meta */}
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-white">
                {currentService.estimatedTimeline && (
                  <div className="flex items-center gap-1.5 bg-[#080B11] px-3.5 py-1.5 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#00E599]" />
                    <span className="font-semibold">Sprint Timeline:</span>
                    <span className="text-slate-400">{currentService.estimatedTimeline}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-[#080B11] px-3.5 py-1.5 rounded-full border border-slate-800">
                  <Briefcase className="w-3.5 h-3.5 text-[#00E599]" />
                  <span className="font-semibold">Status:</span>
                  <span className="text-[#00E599] font-bold">Open for New Sprints</span>
                </div>
              </div>
            </div>

            {/* Right Card: Deliverables & CTA */}
            <div className="lg:col-span-4 bg-[#080B11] rounded-2xl p-6 border border-slate-800 space-y-5">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
                <span>Deliverables Package</span>
              </h2>

              <ul className="space-y-2.5 text-xs text-slate-300">
                {(currentService.deliverablesList || [
                  'Production-Ready Source Files',
                  'Cross-Platform Optimization',
                  'Sprint Revisions & Polish',
                  'Developer & Commercial Handoff',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onStartProjectWithService(currentService.title)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#00E599] to-[#00B377] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] cursor-pointer"
              >
                <span>Request Project for {currentService.title}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Projects List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white font-sans">
              Selected {currentService.title} Case Studies
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-[#0F1522] rounded-3xl p-12 text-center border border-slate-800">
              <p className="text-sm font-semibold text-white">No published projects in this specific service yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                You can add case studies to this practice in your Admin CMS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="bg-[#0F1522] rounded-3xl overflow-hidden border border-slate-800 hover:border-[#00E599]/50 shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5 cursor-pointer"
                >
                  <div className="h-56 relative overflow-hidden bg-black">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                        {project.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1522] via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#00E599] font-bold block mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E599] transition-colors">
                        {project.title}
                      </h3>
                      {project.summary && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-[#FF5A36] mt-4">
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
