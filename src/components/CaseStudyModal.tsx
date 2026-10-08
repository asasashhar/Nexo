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
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
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
            id: 'scr-cover',
            url: project.coverImage,
            title: project.title,
            deviceType: 'desktop' as const,
            caption: '',
          },
        ]
      : [];

  const currentScreen = websiteScreens[activeScreenIndex] || websiteScreens[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0F1522] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-700 max-h-[92vh] overflow-y-auto text-white">
        {/* Navigation & Close */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsPlayingVideo(false);
                onSelectProject(prevProject);
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#00E599] transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Previous Case Study"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => {
                setIsPlayingVideo(false);
                onSelectProject(nextProject);
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#00E599] transition-colors cursor-pointer flex items-center gap-1 text-xs"
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
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E599] hover:underline bg-[#00E599]/15 px-3 py-1 rounded-full transition-colors border border-[#00E599]/30"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Showcase if Video Ad */}
        {project.workType === 'ad' && project.adMediaType === 'video' && (
          <div className="mb-6 rounded-2xl overflow-hidden bg-black relative border border-slate-800 shadow-md">
            {isPlayingVideo && project.videoUrl ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                className="w-full max-h-80 object-contain mx-auto"
              />
            ) : (
              <div
                onClick={() => setIsPlayingVideo(true)}
                className="relative h-72 flex items-center justify-center cursor-pointer group"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="w-16 h-16 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform z-10">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 z-10 border border-slate-700">
                  <Film className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Click to Play Motion Reel Ad (15s)</span>
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
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1 text-xs text-slate-300 font-bold">
                  <Layers className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>Website Views ({websiteScreens.length})</span>
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
                            ? 'bg-[#00E599] text-black shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {scr.deviceType === 'mobile' ? (
                          <Smartphone className="w-3 h-3" />
                        ) : scr.deviceType === 'tablet' ? (
                          <Tablet className="w-3 h-3" />
                        ) : (
                          <Monitor className="w-3 h-3" />
                        )}
                        <span>{scr.title || `Screen ${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Screen Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-md group">
              <img
                src={currentScreen.url}
                alt={currentScreen.title}
                className={`w-full object-contain mx-auto transition-all ${
                  isZoomed ? 'max-h-[85vh] cursor-zoom-out' : 'max-h-80 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="bg-black/75 backdrop-blur-xs text-white p-1.5 rounded-lg hover:bg-black transition-colors"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Details */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#00E599] uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{project.year || '2024'}</span>
            {project.client && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">Client: {project.client}</span>
              </>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            {project.title}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {project.overview || project.summary}
          </p>
        </div>

        {/* Challenge & Solution */}
        {(project.challenge || project.solution) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {project.challenge && (
              <div className="bg-[#080B11] rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  The Problem &amp; Creative Goal
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{project.challenge}</p>
              </div>
            )}

            {project.solution && (
              <div className="bg-[#080B11] rounded-2xl p-4 border border-[#00E599]/30">
                <h4 className="text-xs font-bold text-[#00E599] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execution &amp; Solution</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Measurable Results */}
        {project.results && project.results.length > 0 && (
          <div className="bg-[#080B11] p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Measurable Outcomes &amp; Impact
            </h4>
            <div className="space-y-2">
              {project.results.map((res, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-[#00E599] flex-shrink-0 mt-0.5" />
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
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#00E599]" /> Key Deliverables
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map((del, i) => (
                  <span
                    key={i}
                    className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {del}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.tools && project.tools.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Production Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500">
            Viewing {currentIndex + 1} of {published.length} Works
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full border border-[#00E599] text-xs font-bold text-[#00E599] hover:bg-[#00E599]/10 transition-colors flex items-center gap-1.5"
              >
                <span>Visit Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onInquire(project.title)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Inquire Similar Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
