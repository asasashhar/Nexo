import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import {
  ArrowRight,
  Play,
  Image as ImageIcon,
  Film,
  Sparkles,
  Layers,
} from 'lucide-react';

interface WorkProps {
  onSelectProject: (project: Project) => void;
}

export const Work: React.FC<WorkProps> = ({ onSelectProject }) => {
  const { projects, categories } = usePortfolio();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [adMediaSubfilter, setAdMediaSubfilter] = useState<'all' | 'video' | 'image'>('all');

  const publishedProjects = projects.filter((p) => p.published);

  // Dynamic filter tabs based on categories
  const filterOptions = [
    { id: 'all', label: `All Projects (${publishedProjects.length})` },
    ...categories.map((c) => ({
      id: c.name.toLowerCase(),
      label: c.name,
    })),
  ];

  const filteredProjects = publishedProjects.filter((p) => {
    if (selectedFilter === 'all') return true;

    // Check category match
    const categoryMatches =
      p.category.toLowerCase().includes(selectedFilter) ||
      selectedFilter.includes(p.category.toLowerCase());

    if (!categoryMatches) return false;

    // If "Ads" filter is active, check subfilter
    if (selectedFilter.includes('ad') && p.workType === 'ad') {
      if (adMediaSubfilter === 'video') return p.adMediaType === 'video';
      if (adMediaSubfilter === 'image') return p.adMediaType === 'image';
    }

    return true;
  });

  return (
    <section id="work" className="py-24 md:py-32 bg-[#0B0F17] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#00E599]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#FF5A36]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00E599] mb-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00E599]" />
            <span>PORTFOLIO SHOWCASE</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00E599]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Selected Digital Work
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            From modern responsive websites and cinematic poster art to high-converting video ads and 3D product visualizers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col items-center gap-3 mb-14">
          <div className="flex flex-wrap justify-center p-1.5 bg-[#0F1522] rounded-3xl sm:rounded-full border border-slate-800 gap-1.5 shadow-xl">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedFilter(opt.id)}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === opt.id
                    ? 'bg-[#00E599] text-black shadow-[0_0_15px_rgba(0,229,153,0.35)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* If Ads filter is active, show video vs image toggle */}
          {selectedFilter.includes('ad') && (
            <div className="inline-flex items-center gap-2 text-xs bg-[#0F1522] px-4 py-2 rounded-full border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400">Ad Creative:</span>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  adMediaSubfilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Ads
              </button>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('video')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  adMediaSubfilter === 'video'
                    ? 'bg-[#FF5A36] text-white shadow-xs'
                    : 'text-[#FF5A36] hover:underline'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video Ads</span>
              </button>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('image')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  adMediaSubfilter === 'image'
                    ? 'bg-[#00E599] text-black font-bold shadow-xs'
                    : 'text-[#00E599] hover:underline'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image Ads</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#0F1522] rounded-3xl p-12 text-center border-2 border-dashed border-slate-800 max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center mx-auto mb-4 border border-[#00E599]/30">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Projects in this Filter</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Select &quot;All Projects&quot; or check back as new creations are uploaded from the Admin CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0F1522] rounded-3xl overflow-hidden border border-slate-800 hover:border-[#00E599]/40 shadow-xl hover:shadow-[0_15px_35px_rgba(0,229,153,0.12)] transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
              >
                {/* Specialized Mockup or Media Visualizer */}
                {project.workType === 'ad' && project.adMediaType === 'video' ? (
                  /* Video Ad Container with Play Overlay */
                  <div
                    onClick={() => onSelectProject(project)}
                    className="h-60 bg-black relative flex items-center justify-center overflow-hidden cursor-pointer group/video"
                  >
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/video:scale-105 transition-transform"
                      />
                    ) : project.videoUrl ? (
                      <video
                        src={project.videoUrl}
                        preload="metadata"
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/video:scale-105 transition-transform"
                      />
                    ) : null}

                    {/* Central Play Badge */}
                    <div className="w-14 h-14 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform z-10">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 z-10 border border-slate-700">
                      <Film className="w-3 h-3 text-[#FF5A36]" />
                      <span>Video Reel Ad</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-slate-300 text-[10px] font-mono px-2.5 py-0.5 rounded-md z-10 border border-slate-700">
                      9:16 Vertical
                    </div>
                  </div>
                ) : project.coverImage ? (
                  /* High-Res Artwork / Poster / Screen */
                  <div
                    onClick={() => onSelectProject(project)}
                    className="h-60 relative overflow-hidden bg-slate-900 group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  >
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1522] via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between gap-1.5 z-10">
                      <span className="bg-[#080B11]/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[#00E599] text-[10px] font-bold uppercase tracking-wider">
                        {project.workType === 'poster'
                          ? 'Poster Art'
                          : project.workType === 'product_poster'
                          ? 'Product Poster'
                          : project.workType === 'web'
                          ? 'Web Design'
                          : project.workType === 'ad'
                          ? 'Ad Creative'
                          : 'Case Study'}
                      </span>

                      {project.websiteImages && project.websiteImages.length > 1 && (
                        <span className="bg-[#080B11]/85 backdrop-blur-md text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-700">
                          <Layers className="w-3 h-3 text-[#00E599]" />
                          <span>{project.websiteImages.length} screens</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => onSelectProject(project)}
                    className="h-60 bg-gradient-to-tr from-[#0F1522] to-[#1A2337] p-5 flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-400">{project.title}</span>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#00E599] uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E599] transition-colors">
                      {project.title}
                    </h3>
                    {(project.summary || project.overview) && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-2">
                        {project.summary || project.overview}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="text-xs font-bold text-[#FF5A36] hover:text-[#FF7D5E] inline-flex items-center gap-1.5 transition-colors self-start cursor-pointer group/btn pt-3 border-t border-slate-800/80 w-full justify-between"
                  >
                    <span>
                      {project.workType === 'ad' && project.adMediaType === 'video'
                        ? 'Watch Reel & Breakdown'
                        : 'Explore Case Study'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
