import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, WebsiteImage } from '../types';
import {
  X,
  CheckCircle,
  Sparkles,
  Layers,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Play,
  Volume2,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Globe,
} from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onInquire: (projectTitle: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject,
  onInquire,
}) => {
  const { projects } = usePortfolio();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setActiveScreenIndex(0);
    setIsPlayingVideo(false);
    setIsZoomed(false);
  }, [project?.id]);

  if (!project) return null;

  const published = projects.filter((p) => p.published);
  const currentIndex = published.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0 ? published[currentIndex - 1] : published[published.length - 1];
  const nextProject =
    currentIndex < published.length - 1 ? published[currentIndex + 1] : published[0];

  // Consolidate website screens & mockups
  const websiteScreens: WebsiteImage[] =
    project.websiteImages && project.websiteImages.length > 0
      ? project.websiteImages
      : project.gallery && project.gallery.length > 0
      ? project.gallery.map((url, i) => ({
          id: `scr-${i}`,
          url,
          title: `Website Screen ${i + 1}`,
          deviceType: 'desktop' as const,
          caption: '',
        }))
      : project.coverImage
      ? [
          {
            id: 'cover',
            url: project.coverImage,
            title: project.title,
            deviceType: 'desktop' as const,
            caption: '',
          },
        ]
      : [];

  const currentScreen = websiteScreens[activeScreenIndex] || websiteScreens[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#D8F2E9] max-h-[92vh] overflow-y-auto">
        {/* Navigation & Close */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsPlayingVideo(false);
                onSelectProject(prevProject);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#4CC9A7] transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Previous Case Study"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => {
                setIsPlayingVideo(false);
                onSelectProject(nextProject);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#4CC9A7] transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Next Case Study"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#4CC9A7] hover:text-[#37B294] bg-[#E8F7F2] px-3 py-1 rounded-full transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#1F2A37] text-lg font-bold w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Showcase if Video Ad */}
        {project.workType === 'ad' && project.adMediaType === 'video' && (
          <div className="mb-6 rounded-2xl overflow-hidden bg-black relative border border-gray-800 shadow-md">
            {isPlayingVideo && project.videoUrl ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                className="w-full max-h-72 object-contain mx-auto"
              />
            ) : (
              <div
                onClick={() => setIsPlayingVideo(true)}
                className="relative h-64 flex items-center justify-center cursor-pointer group"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="w-16 h-16 rounded-full bg-[#F2685F] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 z-10">
                  <Film className="w-3.5 h-3.5 text-[#F2685F]" />
                  <span>Click to Play Kinetic Motion Ad (15s)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WEBSITE SHOWCASE & MULTI-SCREEN CAROUSEL */}
        {!(project.workType === 'ad' && project.adMediaType === 'video') && currentScreen && (
          <div className="mb-6 space-y-3">
            {/* Screen Tabs Selector if multiple website images */}
            {websiteScreens.length > 1 && (
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1 text-xs text-[#1F2A37] font-bold">
                  <Layers className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <span>Website Screens &amp; Views ({websiteScreens.length})</span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                  {websiteScreens.map((scr, idx) => {
                    const isActive = idx === activeScreenIndex;
                    return (
                      <button
                        key={scr.id}
                        type="button"
                        onClick={() => setActiveScreenIndex(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#4CC9A7] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {scr.deviceType === 'mobile' ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <Monitor className="w-3 h-3" />
                        )}
                        <span>{scr.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Browser / Device Mockup Window */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
              {/* Top Faux Browser Bar */}
              <div className="bg-[#F7FCFA] border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>

                <div className="flex-1 max-w-md mx-auto bg-white px-3 py-1 rounded-lg border border-gray-200 text-[11px] text-gray-500 font-mono flex items-center justify-center gap-1 truncate shadow-2xs">
                  <Globe className="w-3 h-3 text-[#4CC9A7]" />
                  <span className="truncate">
                    {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : `${project.slug}.design`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-[#1F2A37] transition-colors cursor-pointer"
                  title="Enlarge screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Viewport Screen */}
              <div
                onClick={() => setIsZoomed(true)}
                className="relative bg-slate-900 flex items-center justify-center max-h-[380px] overflow-hidden group cursor-zoom-in"
              >
                <img
                  src={currentScreen.url}
                  alt={currentScreen.title}
                  className="w-full h-auto max-h-[380px] object-contain transition-transform group-hover:scale-[1.01]"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to Zoom Screen</span>
                  </span>
                </div>

                {/* Arrow navigation inside image */}
                {websiteScreens.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveScreenIndex((prev) =>
                          prev > 0 ? prev - 1 : websiteScreens.length - 1
                        );
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveScreenIndex((prev) =>
                          prev < websiteScreens.length - 1 ? prev + 1 : 0
                        );
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption & Screen Name Info */}
              <div className="p-3 bg-[#F7FCFA] border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                    <span>{currentScreen.title}</span>
                    {currentScreen.deviceType && (
                      <span className="bg-[#E8F7F2] text-[#37B294] text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
                        {currentScreen.deviceType} view
                      </span>
                    )}
                  </h5>
                  {currentScreen.caption && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{currentScreen.caption}</p>
                  )}
                </div>

                {websiteScreens.length > 1 && (
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Screen {activeScreenIndex + 1} of {websiteScreens.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
          <span className="font-semibold text-[#4CC9A7] uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-[#9CA3AF] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {project.year}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-[#9CA3AF] flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> {project.client}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2A37] mb-2">{project.title}</h3>
        <p className="text-xs font-semibold text-[#6B7280] mb-4">
          Role: <span className="text-[#4CC9A7]">{project.role}</span>
        </p>

        {/* Overview */}
        {project.overview && (
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6 font-normal">
            {project.overview}
          </p>
        )}

        {/* Challenge & Solution Grid */}
        {(project.challenge || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {project.challenge && (
              <div className="bg-[#FDECEA]/60 rounded-2xl p-4 border border-[#F2685F]/20">
                <h4 className="text-xs font-bold text-[#F2685F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>The Problem &amp; Creative Goal</span>
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{project.challenge}</p>
              </div>
            )}

            {project.solution && (
              <div className="bg-[#E8F7F2]/60 rounded-2xl p-4 border border-[#4CC9A7]/20">
                <h4 className="text-xs font-bold text-[#37B294] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execution &amp; Solution</span>
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Measurable Results */}
        {project.results && project.results.length > 0 && (
          <div className="bg-[#F7FCFA] p-4 sm:p-5 rounded-2xl border border-[#D8F2E9] mb-6">
            <h4 className="text-xs font-bold text-[#1F2A37] uppercase tracking-wider mb-3">
              Measurable Outcomes &amp; Impact
            </h4>
            <div className="space-y-2">
              {project.results.map((res, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#1F2A37]">
                  <CheckCircle className="w-4 h-4 text-[#4CC9A7] flex-shrink-0 mt-0.5" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables & Stack */}
        <div className="space-y-3 mb-8">
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Key Deliverables
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map((del, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-[#1F2A37] text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {del}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.tools && project.tools.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                Design &amp; Production Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-[#E8F7F2] text-[#37B294] text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
          <div className="text-xs text-[#9CA3AF]">
            Viewing {currentIndex + 1} of {published.length} Works
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full border border-[#4CC9A7] text-xs font-semibold text-[#4CC9A7] hover:bg-[#E8F7F2] transition-colors flex items-center gap-1.5"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onInquire(project.title)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(242,104,95,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inquire Similar Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enlarged Lightbox Modal */}
      {isZoomed && currentScreen && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[92vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden flex flex-col cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-700">{currentScreen.title}</span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-2 flex items-center justify-center bg-gray-950 rounded-xl">
              <img
                src={currentScreen.url}
                alt={currentScreen.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
