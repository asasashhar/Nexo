import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const nextSlide = () => {
    if (carouselIndex < filteredProjects.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    } else {
      setCarouselIndex(0);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    } else {
      setCarouselIndex(filteredProjects.length - 1);
    }
  };

  return (
    <section id="work" className="py-20 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Two-tone with Caveat teal and tiny coral heart */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2A37]">
            Selected <span className="font-script text-[#4CC9A7] text-4xl sm:text-5xl">Work</span>{' '}
            <span className="text-[#F2685F] text-2xl select-none inline-block animate-pulse">♡</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2">
            Showcase spanning Mobile Apps, Web Design, Posters, Product Posters, and Video &amp; Image Ads.
          </p>
        </div>

        {/* Filter Bar with Mobile App, Web, Posters, Product Poster, Ads */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex flex-wrap justify-center p-1.5 bg-[#F7FCFA] rounded-3xl sm:rounded-full border border-[#D8F2E9] shadow-inner gap-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedFilter(opt.id);
                  setCarouselIndex(0);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === opt.id
                    ? 'bg-[#4CC9A7] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2A37]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* If Ads filter is active, show video vs image toggle */}
          {selectedFilter.includes('ad') && (
            <div className="inline-flex items-center gap-2 text-xs bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800">Ads Media Type:</span>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('all')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                  adMediaSubfilter === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-800 hover:underline'
                }`}
              >
                All Ads
              </button>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('video')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                  adMediaSubfilter === 'video'
                    ? 'bg-[#F2685F] text-white'
                    : 'text-[#F2685F] hover:underline'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Video Ads</span>
              </button>
              <button
                type="button"
                onClick={() => setAdMediaSubfilter('image')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                  adMediaSubfilter === 'image'
                    ? 'bg-[#4CC9A7] text-white'
                    : 'text-[#37B294] hover:underline'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image Ads</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Cards Grid / Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#F7FCFA] rounded-3xl p-12 text-center border-2 border-dashed border-[#D8F2E9] max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2A37] mb-2">No Projects Published Yet</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-md mx-auto">
              Your selected case studies and client projects will appear here once added in the Admin CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#F7FCFA] rounded-3xl overflow-hidden border border-[#E8F7F2] shadow-[0_10px_30px_-5px_rgba(76,201,167,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
              {/* Specialized Mockup or Media Visualizer */}
              {project.workType === 'ad' && project.adMediaType === 'video' ? (
                /* Video Ad Container with Play Overlay */
                <div
                  onClick={() => onSelectProject(project)}
                  className="h-56 bg-slate-900 relative flex items-center justify-center overflow-hidden cursor-pointer group/video"
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
                  <div className="w-14 h-14 rounded-full bg-[#F2685F] text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform z-10">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                    <Film className="w-3 h-3 text-[#F2685F]" />
                    <span>15s Video Ad</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-md z-10">
                    9:16 Vertical Reel
                  </div>
                </div>
              ) : project.id === 'fintrack' ? (
                /* Simulated FinTrack Phones */
                <div className="h-56 bg-gradient-to-tr from-emerald-100 via-teal-50 to-[#E8F7F2] p-5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-3 transform rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-28 h-44 bg-white rounded-2xl shadow-xl border-2 border-emerald-300 p-2 flex flex-col justify-between">
                      <div className="h-2 w-10 bg-emerald-100 rounded-full mx-auto" />
                      <div className="space-y-1.5 my-auto">
                        <div className="text-[8px] font-bold text-teal-800">Total Balance</div>
                        <div className="text-xs font-extrabold text-teal-900">$14,250.00</div>
                        <div className="h-12 bg-emerald-50 rounded-lg p-1">
                          <div className="h-full flex items-end gap-1 justify-between px-1">
                            <div className="w-1.5 bg-emerald-400 h-4 rounded-sm" />
                            <div className="w-1.5 bg-emerald-500 h-7 rounded-sm" />
                            <div className="w-1.5 bg-emerald-300 h-5 rounded-sm" />
                            <div className="w-1.5 bg-emerald-600 h-9 rounded-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-emerald-100 rounded-md" />
                    </div>

                    <div className="w-28 h-44 bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-2 flex flex-col justify-between">
                      <div className="h-2 w-10 bg-teal-100 rounded-full mx-auto" />
                      <div className="space-y-1 my-auto">
                        <div className="h-3 w-3/4 bg-teal-100 rounded" />
                        <div className="h-2 w-1/2 bg-teal-50 rounded" />
                        <div className="h-8 bg-teal-50 rounded-lg" />
                        <div className="h-8 bg-teal-50 rounded-lg" />
                      </div>
                      <div className="h-2.5 w-12 bg-[#4CC9A7] rounded-full mx-auto" />
                    </div>
                  </div>
                </div>
              ) : project.id === 'shopzy' ? (
                /* Simulated Shopzy Browser */
                <div className="h-56 bg-gradient-to-tr from-amber-50 via-orange-50 to-[#E8F7F2] p-5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="w-64 h-40 bg-white rounded-xl shadow-xl border border-orange-200 p-2 flex flex-col group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1 mb-2">
                      <div className="text-[9px] font-bold text-[#1F2A37] tracking-wider">
                        SHOPZY.
                      </div>
                      <div className="flex gap-1">
                        <div className="w-5 h-1 bg-gray-200 rounded-full" />
                        <div className="w-5 h-1 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-1">
                      <div className="w-2/5 bg-amber-100 rounded-lg flex items-center justify-center text-[10px] text-amber-800 font-semibold p-1 text-center leading-tight">
                        Summer Collection
                      </div>
                      <div className="w-3/5 grid grid-cols-2 gap-1.5">
                        <div className="bg-gray-100 rounded-md" />
                        <div className="bg-gray-100 rounded-md" />
                        <div className="bg-gray-100 rounded-md" />
                        <div className="bg-gray-100 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : project.id === 'healthi' ? (
                /* Simulated Healthi Dark/Light Phones */
                <div className="h-56 bg-gradient-to-tr from-purple-100 via-indigo-50 to-[#E8F7F2] p-5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-2 transform rotate-[4deg] group-hover:rotate-0 transition-transform duration-300">
                    <div className="w-24 h-40 bg-indigo-950 text-white rounded-2xl shadow-xl p-2 flex flex-col justify-between border border-indigo-800">
                      <div className="h-1.5 w-8 bg-indigo-400 rounded-full mx-auto" />
                      <div className="space-y-1 text-center my-auto">
                        <div className="text-[8px] text-indigo-300">Daily Steps</div>
                        <div className="text-xs font-bold text-white">8,452</div>
                        <div className="w-10 h-10 rounded-full border-4 border-[#4CC9A7] border-t-transparent mx-auto flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-teal-300" />
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-indigo-800 rounded" />
                    </div>

                    <div className="w-24 h-40 bg-white rounded-2xl shadow-xl border border-purple-200 p-2 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-purple-200 rounded-full mx-auto" />
                      <div className="space-y-1.5 my-auto">
                        <div className="h-6 bg-purple-50 rounded-md p-1 text-[8px] text-purple-700 font-semibold flex items-center">
                          Sleep: 7h 45m
                        </div>
                        <div className="h-6 bg-teal-50 rounded-md p-1 text-[8px] text-teal-700 font-semibold flex items-center">
                          Water: 2.4 L
                        </div>
                      </div>
                      <div className="h-2 w-10 bg-[#F2685F] rounded-full mx-auto" />
                    </div>
                  </div>
                </div>
              ) : project.coverImage ? (
                /* Poster or Product Poster or Image Ad cover visual */
                <div className="h-56 relative overflow-hidden bg-gray-100 group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {project.workType === 'poster' && (
                        <span className="bg-black/60 px-2 py-0.5 rounded-full">Art Poster</span>
                      )}
                      {project.workType === 'product_poster' && (
                        <span className="bg-[#4CC9A7] px-2 py-0.5 rounded-full">Hardware Focus</span>
                      )}
                      {project.workType === 'ad' && project.adMediaType === 'image' && (
                        <span className="bg-[#F2685F] px-2 py-0.5 rounded-full">Static Ad Campaign</span>
                      )}
                      {project.workType === 'web' && (
                        <span className="bg-[#37B294] px-2 py-0.5 rounded-full">Web Design</span>
                      )}
                      {project.workType === 'mobile' && (
                        <span className="bg-teal-600 px-2 py-0.5 rounded-full">Mobile App</span>
                      )}
                    </div>

                    {project.websiteImages && project.websiteImages.length > 1 && (
                      <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Layers className="w-3 h-3 text-[#4CC9A7]" />
                        <span>{project.websiteImages.length} screens</span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Fallback */
                <div className="h-56 bg-gradient-to-tr from-teal-50 via-emerald-50 to-[#E8F7F2] p-5 flex items-center justify-center">
                  <div className="w-56 h-36 bg-white rounded-2xl shadow-lg border border-teal-200 p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4CC9A7]" />
                      <div className="h-2 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="text-sm font-bold text-[#1F2A37]">{project.title}</div>
                    <div className="h-2 w-full bg-teal-100 rounded" />
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#4CC9A7] block">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {project.websiteImages && project.websiteImages.length > 1 && (
                        <span className="text-[10px] font-semibold text-[#37B294] bg-[#E8F7F2] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{project.websiteImages.length} screens</span>
                        </span>
                      )}
                      {project.workType === 'ad' && (
                        <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          {project.adMediaType === 'video' ? 'Video Ad' : 'Image Ad'}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1F2A37] mb-1.5">{project.title}</h3>
                  {(project.summary || project.overview) && (
                    <p className="text-xs text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
                      {project.summary || project.overview}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="text-xs font-semibold text-[#F2685F] hover:text-[#E0524A] inline-flex items-center gap-1.5 transition-colors self-start cursor-pointer group/btn"
                >
                  <span>
                    {project.workType === 'ad' && project.adMediaType === 'video'
                      ? 'Watch Reel & Case Study'
                      : 'View Case Study'}
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
