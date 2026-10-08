import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, WorkCategory, ProjectWorkType, AdMediaType, WebsiteImage } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ImageUploadField } from './ImageUploadField';
import { VideoUploadField } from './VideoUploadField';
import { WebsiteImagesManager } from './WebsiteImagesManager';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  X,
  Sparkles,
  Tag,
  Briefcase,
  Play,
  Film,
  Image as ImageIcon,
  Check,
  Smartphone,
  Monitor,
  ChevronRight,
  ChevronLeft,
  Layers,
  FileText,
  TrendingUp,
  Boxes,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface ProjectsModuleProps {
  onShowToast: (title: string, msg: string) => void;
  openCreateImmediately?: boolean;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  onShowToast,
  openCreateImmediately = false,
}) => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    services,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = usePortfolio();

  // Sub-tabs: 'projects' or 'categories'
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'categories'>('projects');

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterService, setFilterService] = useState('all');

  // Modal States
  const [projectModalOpen, setProjectModalOpen] = useState(openCreateImmediately);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Step / Tab: 1 = Identity & Format, 2 = Media & Screens, 3 = Case Study, 4 = Metrics & Preview
  const [activeFormTab, setActiveFormTab] = useState<number>(1);

  // Category Modal States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WorkCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catServiceId, setCatServiceId] = useState(services[0]?.id || '');
  const [catDescription, setCatDescription] = useState('');

  // Project Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [category, setCategory] = useState(categories[0]?.name || 'Web Design');
  const [workType, setWorkType] = useState<ProjectWorkType>('web');
  const [adMediaType, setAdMediaType] = useState<AdMediaType>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [overview, setOverview] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [resultsText, setResultsText] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');
  const [toolsText, setToolsText] = useState('Figma, Protopie');
  const [year, setYear] = useState('2024');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('Lead UI/UX Designer');
  const [coverImage, setCoverImage] = useState('');
  const [websiteImages, setWebsiteImages] = useState<WebsiteImage[]>([]);
  const [liveUrl, setLiveUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Tool chip presets
  const TOOL_PRESETS = [
    'Figma',
    'Cinema 4D',
    'After Effects',
    'Blender',
    'Three.js',
    'Spline',
    'React',
    'Tailwind CSS',
    'Protopie',
    'Illustrator',
    'Photoshop',
    'Midjourney',
  ];

  // Metric chip presets
  const METRIC_PRESETS = [
    '+140% Conversion Rate',
    '2.4M Video Ad Impressions',
    '4.9/5 User Satisfaction',
    '#1 Product of the Day (PH)',
    'Instant Checkout Sub-2s',
    '38% Organic Engagement Lift',
  ];

  // Deliverables chip presets
  const DELIVERABLE_PRESETS = [
    'Interactive Prototype',
    'Design System & Tokens',
    'Responsive Web Pages',
    'Motion Graphics & Video Ads',
    'High-Res Poster Graphics',
    '3D Product Visuals',
    'Production-Ready UI Code',
  ];

  // Handle adding tool preset
  const handleAddToolPreset = (t: string) => {
    const current = toolsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(t)) {
      current.push(t);
      setToolsText(current.join(', '));
    }
  };

  // Handle adding metric preset
  const handleAddMetricPreset = (m: string) => {
    const current = resultsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(m)) {
      current.push(m);
      setResultsText(current.join('\n'));
    }
  };

  // Handle adding deliverable preset
  const handleAddDeliverablePreset = (d: string) => {
    const current = deliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(d)) {
      current.push(d);
      setDeliverablesText(current.join('\n'));
    }
  };

  // Open Create Project Modal
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    const defaultService = services[0]?.id || '';
    setSelectedServiceId(defaultService);
    setCategory(categories[0]?.name || 'Web Design');
    setWorkType('web');
    setAdMediaType('image');
    setVideoUrl('');
    setSummary('');
    setOverview('');
    setChallenge('');
    setSolution('');
    setResultsText('+35% user engagement\nInstant transaction flow\n4.9/5 satisfaction rating');
    setDeliverablesText('Wireframes & Task Flows\nFigma Component Tokens\nInteractive Clickable Prototype');
    setToolsText('Figma, Protopie, FigJam');
    setYear('2024');
    setClient('');
    setRole('Lead UI/UX Designer');
    setCoverImage('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80');
    setWebsiteImages([]);
    setLiveUrl('');
    setPublished(true);
    setFeatured(false);
    setActiveFormTab(1);
    setProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setSelectedServiceId(p.serviceId || services[0]?.id || '');
    setCategory(p.category);
    setWorkType(p.workType || 'web');
    setAdMediaType(p.adMediaType || 'image');
    setVideoUrl(p.videoUrl || '');
    setSummary(p.summary);
    setOverview(p.overview);
    setChallenge(p.challenge);
    setSolution(p.solution);
    setResultsText(p.results.join('\n'));
    setDeliverablesText(p.deliverables.join('\n'));
    setToolsText(p.tools.join(', '));
    setYear(p.year);
    setClient(p.client);
    setRole(p.role);
    setCoverImage(p.coverImage || '');
    setWebsiteImages(
      p.websiteImages && p.websiteImages.length > 0
        ? p.websiteImages
        : p.gallery && p.gallery.length > 0
        ? p.gallery.map((url, i) => ({
            id: `web-img-${i}-${Date.now()}`,
            url,
            title: `Website Screen ${i + 1}`,
            deviceType: 'desktop',
          }))
        : []
    );
    setLiveUrl(p.liveUrl || '');
    setPublished(p.published);
    setFeatured(p.featured);
    setActiveFormTab(1);
    setProjectModalOpen(true);
  };

  // Submit Project Form
  const handleSubmitProject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setActiveFormTab(1);
      onShowToast('Missing Title', 'Please enter a project title.');
      return;
    }

    const parsedResults = resultsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedDeliverables = deliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedTools = toolsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingProject) {
      updateProject({
        ...editingProject,
        title: title.trim(),
        slug: generatedSlug,
        serviceId: selectedServiceId,
        category,
        workType,
        adMediaType: workType === 'ad' ? adMediaType : undefined,
        videoUrl: workType === 'ad' && adMediaType === 'video' ? videoUrl.trim() : undefined,
        summary: summary.trim() || editingProject.summary || '',
        overview: overview.trim() || editingProject.overview || '',
        challenge: challenge.trim() || editingProject.challenge || '',
        solution: solution.trim() || editingProject.solution || '',
        results: parsedResults.length ? parsedResults : editingProject.results || [],
        deliverables: parsedDeliverables.length ? parsedDeliverables : editingProject.deliverables || [],
        tools: parsedTools.length ? parsedTools : ['Figma'],
        year,
        client: client.trim() || 'Confidential Client',
        role,
        coverImage,
        gallery: websiteImages.map((img) => img.url),
        websiteImages,
        liveUrl,
        published,
        featured,
      });
      onShowToast('Project Updated', `"${title}" was saved.`);
    } else {
      addProject({
        id: `proj-${Date.now()}`,
        title: title.trim(),
        slug: generatedSlug,
        serviceId: selectedServiceId,
        category,
        workType,
        adMediaType: workType === 'ad' ? adMediaType : undefined,
        videoUrl: workType === 'ad' && adMediaType === 'video' ? videoUrl.trim() : undefined,
        summary: summary.trim() || `${title.trim()} for ${client.trim() || 'Client'}.`,
        overview: overview.trim() || `Comprehensive design execution for ${title.trim()}.`,
        challenge: challenge.trim(),
        solution: solution.trim(),
        results: parsedResults,
        deliverables: parsedDeliverables,
        tools: parsedTools.length ? parsedTools : ['Figma'],
        year,
        client: client.trim() || 'Client Venture',
        role,
        coverImage,
        gallery: websiteImages.map((img) => img.url),
        websiteImages,
        liveUrl,
        published,
        featured,
        order: projects.length + 1,
      });
      onShowToast('Project Published', `"${title}" has been added to your portfolio.`);
    }
    setProjectModalOpen(false);
  };

  // Keyboard shortcut for Cmd/Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (projectModalOpen && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmitProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectModalOpen, title, slug, selectedServiceId, category, workType, adMediaType, videoUrl, summary, overview, challenge, solution, resultsText, deliverablesText, toolsText, year, client, role, coverImage, websiteImages, liveUrl, published, featured]);

  // Category Management Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatServiceId(services[0]?.id || '');
    setCatDescription('');
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: WorkCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatServiceId(cat.serviceId || services[0]?.id || '');
    setCatDescription(cat.description || '');
    setCategoryModalOpen(true);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const generatedSlug =
      catSlug.trim() ||
      catName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: catName.trim(),
        slug: generatedSlug,
        serviceId: catServiceId,
        description: catDescription.trim(),
      });
      onShowToast('Category Updated', `Category tag "${catName}" updated.`);
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: catName.trim(),
        slug: generatedSlug,
        serviceId: catServiceId,
        description: catDescription.trim(),
        order: categories.length + 1,
      });
      onShowToast('Category Added', `Category tag "${catName}" created.`);
    }
    setCategoryModalOpen(false);
  };

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
    type: 'project' | 'category';
  }>({
    isOpen: false,
    id: '',
    title: '',
    type: 'project',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteConfirmation.type === 'project') {
        await deleteProject(deleteConfirmation.id);
        onShowToast('Project Deleted', `"${deleteConfirmation.title}" was removed successfully.`);
        if (editingProject && editingProject.id === deleteConfirmation.id) {
          setProjectModalOpen(false);
          setEditingProject(null);
        }
      } else {
        await deleteCategory(deleteConfirmation.id);
        onShowToast('Category Deleted', `${deleteConfirmation.title} was removed successfully.`);
      }
    } catch (e) {
      console.error('Delete failed:', e);
      onShowToast('Delete Error', 'An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      title: `Category Tag "${name}"`,
      type: 'category',
    });
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory !== 'all' && p.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }

    if (filterService !== 'all' && p.serviceId !== filterService) {
      return false;
    }

    return true;
  });

  const getServiceName = (serviceId?: string) => {
    if (!serviceId) return 'Unassigned Pillar';
    const found = services.find((s) => s.id === serviceId);
    return found ? found.title : 'Custom Service';
  };

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* TOP HEADER & SUB-TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white font-sans tracking-tight">
                  Portfolio Works &amp; Showcase
                </h2>
                <span className="text-xs bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold px-3 py-0.5 rounded-full font-mono">
                  {projects.length} Works · {categories.length} Categories
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage case studies, visual posters, multi-device mockup galleries, video ads, and client metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeSubTab === 'projects' ? (
            <button
              type="button"
              onClick={handleOpenAddProject}
              className="inline-flex items-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-black px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-black px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'projects'
              ? 'bg-[#00E599] text-black shadow-xs font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>All Portfolio Works ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'categories'
              ? 'bg-[#00E599] text-black shadow-xs font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Manage Category Tags ({categories.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: PROJECTS LIST */}
      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-[#0F1522] p-4 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search works by title, client..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] transition-all text-xs"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-700 outline-none bg-[#080B11] font-semibold text-slate-200 focus:border-[#00E599] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Service Filter */}
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-700 outline-none bg-[#080B11] font-semibold text-slate-200 focus:border-[#00E599] cursor-pointer"
              >
                <option value="all">All Service Pillars</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    Pillar: {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <span className="text-[11px] text-slate-400 mr-2">
                {filteredProjects.length} matching
              </span>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#00E599] text-black font-bold'
                    : 'text-slate-400 hover:text-white bg-[#080B11] border border-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#00E599] text-black font-bold'
                    : 'text-slate-400 hover:text-white bg-[#080B11] border border-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#0F1522] rounded-3xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all overflow-hidden flex flex-col group text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.5)]"
                >
                  {/* Thumbnail / Video Preview */}
                  <div className="h-48 bg-[#080B11] relative overflow-hidden flex items-center justify-center">
                    {p.workType === 'ad' && p.adMediaType === 'video' && p.videoUrl ? (
                      <div className="w-full h-full relative group/video flex items-center justify-center bg-black">
                        {p.coverImage && (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover opacity-60"
                          />
                        )}
                        <div className="absolute w-12 h-12 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="absolute bottom-2.5 left-2.5 bg-black/85 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-700 font-mono">
                          <Film className="w-3 h-3 text-[#FF5A36]" />
                          <span>Video Ad Creative</span>
                        </span>
                      </div>
                    ) : p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-slate-600 text-xs flex flex-col items-center gap-1">
                        <ImageIcon className="w-8 h-8 opacity-40 text-[#00E599]" />
                        <span>No cover artwork</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-[#080B11]/90 backdrop-blur-xs text-white border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs font-mono">
                        {p.category}
                      </span>
                      {p.workType === 'ad' && (
                        <span className="bg-[#FF5A36] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase font-mono">
                          {p.adMediaType === 'video' ? 'Video' : 'Static'}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {p.featured && (
                        <span className="w-7 h-7 rounded-full bg-[#FFB800] text-black flex items-center justify-center shadow-md" title="Featured Spotlight">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00E599] transition-colors line-clamp-1 font-sans">
                        {p.title}
                      </h3>

                      {/* Associated Service Tag */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#00E599]">
                        <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-semibold">{getServiceName(p.serviceId)}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {p.summary}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {p.client} · {p.year}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            updateProject({ ...p, published: !p.published });
                            onShowToast(
                              p.published ? 'Unpublished' : 'Published',
                              `"${p.title}" visibility toggled.`
                            );
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            p.published
                              ? 'text-[#00E599] hover:bg-[#00E599]/15'
                              : 'text-slate-500 hover:bg-slate-800'
                          }`}
                          title={p.published ? 'Live (Click to unpublish)' : 'Draft (Click to publish)'}
                        >
                          {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditProject(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              id: p.id,
                              title: p.title,
                              type: 'project',
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 cursor-pointer transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-[#0F1522] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-[#080B11] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Project Title</th>
                      <th className="py-3.5 px-4">Associated Service</th>
                      <th className="py-3.5 px-4">Category Tag</th>
                      <th className="py-3.5 px-4">Section / Type</th>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-[#080B11]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                          {p.coverImage && (
                            <img
                              src={p.coverImage}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                            />
                          )}
                          <span className="truncate max-w-[200px]">{p.title}</span>
                        </td>
                        <td className="py-3 px-4 text-[#00E599] font-semibold">
                          {getServiceName(p.serviceId)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-300 capitalize">
                            {p.workType === 'ad'
                              ? `Ad (${p.adMediaType})`
                              : p.workType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{p.client}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.published
                                ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {p.published ? 'Live' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProject(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteConfirmation({
                                  isOpen: true,
                                  id: p.id,
                                  title: p.title,
                                  type: 'project',
                                });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CATEGORY & TAG MANAGER */}
      {activeSubTab === 'categories' && (
        <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00E599]" />
                <span>Manage Work Category Tags</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Administer category tags used for filtering portfolio projects. Every category can be linked to an added service pillar.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const projectCount = projects.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-[#080B11] hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">slug: {cat.slug}</span>
                    </div>

                    <span className="bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {projectCount} {projectCount === 1 ? 'Work' : 'Works'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#00E599]" />
                      <span className="font-semibold text-slate-200">
                        Pillar: {getServiceName(cat.serviceId)}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🚀 ADD NEW PROJECT / EDIT PROJECT FORM MODAL (HIGH-END DESIGN) */}
      {/* ========================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0F1522] rounded-3xl max-w-5xl w-full border border-slate-700 text-white shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
            {/* MODAL TOP HEADER */}
            <div className="p-6 border-b border-slate-800 bg-[#080B11]/90 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white font-sans tracking-tight">
                      {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      published ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {published ? 'Live Ready' : 'Draft Mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure project identity, practice pillar, responsive device mockups, and case study narrative.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md">
                  Ctrl+Enter to save
                </span>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close form (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* STEP / TAB NAVIGATION BAR */}
            <div className="flex border-b border-slate-800 bg-[#0A0E17] px-6 py-2 overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-2 min-w-max">
                {[
                  { id: 1, label: '1. Identity & Format', icon: Briefcase },
                  { id: 2, label: '2. Media Showcase & Gallery', icon: Layers },
                  { id: 3, label: '3. Case Study Story', icon: FileText },
                  { id: 4, label: '4. Deliverables & Live Preview', icon: Sparkles },
                ].map((step) => {
                  const isActive = activeFormTab === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveFormTab(step.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#00E599] text-black shadow-[0_0_15px_rgba(0,229,153,0.3)] font-extrabold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <step.icon className="w-3.5 h-3.5" />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MODAL SCROLLABLE FORM BODY */}
            <form onSubmit={handleSubmitProject} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* TAB 1: IDENTITY & FORMAT */}
              {activeFormTab === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-white mb-1.5 flex items-center justify-between">
                        <span>Project Title *</span>
                        <span className="text-[10px] font-mono text-slate-500">{title.length} chars</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!editingProject) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                          }
                        }}
                        placeholder="e.g. Luminary Audio — Visual Identity & Motion"
                        className="w-full px-4 py-3 rounded-2xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] text-sm font-semibold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">
                        URL Slug Identifier
                      </label>
                      <div className="flex items-center bg-[#080B11] border border-slate-700 rounded-2xl px-3.5 py-3 focus-within:border-[#00E599] transition-all">
                        <span className="text-slate-500 font-mono text-xs select-none mr-1">/works/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="luminary-audio-identity"
                          className="w-full bg-transparent text-white outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Associated Service & Category */}
                  <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-white mb-1.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#00E599]" />
                          <span>Associated Service Pillar *</span>
                        </label>
                        <select
                          value={selectedServiceId}
                          onChange={(e) => setSelectedServiceId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-bold cursor-pointer"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Connects this work to public discipline showcase and service inquiries.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-white mb-1.5 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#00E599]" />
                          <span>Category Tag *</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-bold cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Work Format / Discipline Selection Cards */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <label className="block font-bold text-slate-200 mb-2.5">
                        Work Medium / Discipline Format *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {[
                          { id: 'web', label: 'Web Design', icon: Monitor, hint: 'Websites & Digital' },
                          { id: 'poster', label: 'Posters', icon: ImageIcon, hint: 'Editorial & Print' },
                          { id: 'ad', label: 'Ads Creation', icon: Film, hint: 'Social & Kinetic' },
                          { id: 'product_poster', label: 'Product Poster', icon: Sparkles, hint: '3D & Commercial' },
                          { id: 'mobile', label: 'Mobile App', icon: Smartphone, hint: 'iOS & Android UX' },
                        ].map((item) => {
                          const isSelected = workType === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setWorkType(item.id as ProjectWorkType)}
                              className={`p-3.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#00E599] text-black border-[#00E599] shadow-[0_0_15px_rgba(0,229,153,0.3)] ring-1 ring-[#00E599]'
                                  : 'bg-[#0F1522] text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                              }`}
                            >
                              <item.icon className="w-4 h-4" />
                              <span className="text-xs font-black">{item.label}</span>
                              <span className={`text-[9px] ${isSelected ? 'text-black/70' : 'text-slate-500'}`}>
                                {item.hint}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* If Ads: Video vs Static Toggle */}
                    {workType === 'ad' && (
                      <div className="p-4 bg-[#0F1522] rounded-2xl border border-amber-500/40 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-2">
                            <Film className="w-4 h-4 text-[#FF5A36]" />
                            <span>Ad Media Format (Video or High-Res Image) *</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setAdMediaType('video')}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                                adMediaType === 'video'
                                  ? 'bg-[#FF5A36] text-white shadow-xs'
                                  : 'bg-[#080B11] text-slate-400 border border-slate-700 hover:text-white'
                              }`}
                            >
                              🎬 Video Ad
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdMediaType('image')}
                              className={`px-3.5 py-1.5 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                                adMediaType === 'image'
                                  ? 'bg-[#00E599] text-black shadow-xs'
                                  : 'bg-[#080B11] text-slate-400 border border-slate-700 hover:text-white'
                              }`}
                            >
                              🖼️ Image Ad
                            </button>
                          </div>
                        </div>

                        {adMediaType === 'video' && (
                          <VideoUploadField
                            label="Video Ad Creative Asset"
                            sublabel="(MP4, WebM, MOV upload from device or media library)"
                            required
                            value={videoUrl}
                            onChange={setVideoUrl}
                            helperText="Upload video file directly or pick from your Studio Media Library"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA SHOWCASE & GALLERY */}
              {activeFormTab === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Hero Cover Image */}
                  <div className="bg-[#080B11] p-5 rounded-2xl border border-slate-800 space-y-4">
                    <ImageUploadField
                      label="Primary Project Cover Artwork"
                      sublabel="(Featured on homepage cards, banner hero, and poster showcase)"
                      required
                      value={coverImage}
                      onChange={setCoverImage}
                      helperText="Upload any high-res rendering or select from Studio Media Library"
                      aspectRatio="wide"
                    />

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-[#00E599]" />
                        <span>Live Demo / Behance Case Study URL</span>
                      </label>
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://behance.net/gallery/... or https://luminary.design"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Website Screens & Multi-Device Manager */}
                  <div className="bg-[#080B11] p-5 rounded-2xl border border-slate-800">
                    <WebsiteImagesManager
                      images={websiteImages}
                      onChange={setWebsiteImages}
                      onSetAsCover={(url) => setCoverImage(url)}
                      currentCoverUrl={coverImage}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CASE STUDY STORY */}
              {activeFormTab === 3 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Client & Meta */}
                  <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          placeholder="e.g. Luminary Audio"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Launch Year</label>
                        <input
                          type="text"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2024"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Designer Role</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Lead UI/UX Designer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary & Overview */}
                  <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Short Pitch / Teaser Summary
                      </label>
                      <textarea
                        rows={2}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief 1-2 sentence overview shown on project card teaser..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Full Case Study Background &amp; Overview
                      </label>
                      <textarea
                        rows={3}
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}
                        placeholder="In-depth background on the client's mission, market position, and project goals..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">The Challenge</label>
                        <textarea
                          rows={3}
                          value={challenge}
                          onChange={(e) => setChallenge(e.target.value)}
                          placeholder="What obstacles, brand friction, or market hurdles did the client face?"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">The Design Solution</label>
                        <textarea
                          rows={3}
                          value={solution}
                          onChange={(e) => setSolution(e.target.value)}
                          placeholder="How did NEXO engineer the creative solution to overcome it?"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Design Tools & Software Presets */}
                  <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-3">
                    <label className="block font-bold text-white mb-1">
                      Design Tools &amp; Stack (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={toolsText}
                      onChange={(e) => setToolsText(e.target.value)}
                      placeholder="Figma, Cinema 4D, After Effects, Spline"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                    />

                    {/* Quick tool presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-mono mr-1">Quick Add:</span>
                      {TOOL_PRESETS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleAddToolPreset(t)}
                          className="px-2.5 py-1 rounded-lg bg-[#0F1522] hover:bg-[#00E599]/20 hover:text-[#00E599] border border-slate-700 text-[10px] font-bold text-slate-300 transition-colors cursor-pointer"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: METRICS, DELIVERABLES & LIVE CARD PREVIEW */}
              {activeFormTab === 4 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Results & Deliverables */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Metrics */}
                    <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-3">
                      <label className="block font-bold text-white flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#00E599]" />
                          <span>Key Results &amp; Metrics (One per line)</span>
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={resultsText}
                        onChange={(e) => setResultsText(e.target.value)}
                        placeholder="+35% conversion rate&#10;Instant checkout flow&#10;4.9/5 satisfaction"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-mono text-[11px] resize-none"
                      />
                      <div className="flex flex-wrap gap-1">
                        {METRIC_PRESETS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => handleAddMetricPreset(m)}
                            className="px-2 py-0.5 rounded-md bg-[#0F1522] hover:bg-[#00E599]/15 hover:text-[#00E599] border border-slate-700 text-[9px] font-bold text-slate-400 transition-colors cursor-pointer"
                          >
                            + {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-3">
                      <label className="block font-bold text-white flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Boxes className="w-3.5 h-3.5 text-[#06B6D4]" />
                          <span>Deliverables Provided (One per line)</span>
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={deliverablesText}
                        onChange={(e) => setDeliverablesText(e.target.value)}
                        placeholder="Interactive Prototype&#10;Figma Design Tokens&#10;Production Ready Assets"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-mono text-[11px] resize-none"
                      />
                      <div className="flex flex-wrap gap-1">
                        {DELIVERABLE_PRESETS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleAddDeliverablePreset(d)}
                            className="px-2 py-0.5 rounded-md bg-[#0F1522] hover:bg-[#06B6D4]/15 hover:text-[#06B6D4] border border-slate-700 text-[9px] font-bold text-slate-400 transition-colors cursor-pointer"
                          >
                            + {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visibility Toggles */}
                  <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-[#080B11] border border-slate-800">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-white text-xs">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599] w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-[#00E599]" />
                        <span>Publish to live portfolio showcase</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-white text-xs">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-[#FFB800] focus:ring-[#FFB800] w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-[#FFB800]" />
                        <span>Feature in homepage spotlight banner</span>
                      </span>
                    </label>
                  </div>

                  {/* REAL-TIME CARD LIVE PREVIEW */}
                  <div className="p-5 rounded-2xl bg-[#080B11] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#00E599]" />
                        <span>Interactive Real-Time Card Preview</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Exact appearance on live portfolio
                      </span>
                    </div>

                    <div className="max-w-md mx-auto pt-2">
                      <div className="bg-[#0F1522] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-white group">
                        <div className="h-44 bg-[#080B11] relative overflow-hidden flex items-center justify-center">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={title || 'Project preview'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="text-slate-600 text-xs flex flex-col items-center gap-1">
                              <ImageIcon className="w-8 h-8 opacity-40 text-[#00E599]" />
                              <span>No cover artwork yet</span>
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="bg-[#080B11]/90 backdrop-blur-xs text-white border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                              {category || 'Category'}
                            </span>
                            {workType === 'ad' && (
                              <span className="bg-[#FF5A36] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase font-mono">
                                {adMediaType === 'video' ? 'Video Ad' : 'Image Ad'}
                              </span>
                            )}
                          </div>

                          {featured && (
                            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FFB800] text-black flex items-center justify-center shadow-md">
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-2">
                          <h4 className="text-base font-bold text-white font-sans truncate">
                            {title || 'Untitled Portfolio Project'}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-[#00E599] font-semibold">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{getServiceName(selectedServiceId)}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {summary || 'Project overview and case study highlights will appear here...'}
                          </p>

                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>{client || 'Client Venture'} · {year || '2024'}</span>
                            <span className="text-[#00E599] font-bold flex items-center gap-1">
                              <span>Explore</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 bg-[#0F1522]">
                <div className="flex items-center gap-2">
                  {activeFormTab > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveFormTab((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2.5 rounded-full border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>
                  )}

                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmation({
                          isOpen: true,
                          id: editingProject.id,
                          title: editingProject.title,
                          type: 'project',
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-red-900/60 text-xs font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {activeFormTab < 4 ? (
                    <button
                      type="button"
                      onClick={() => setActiveFormTab((prev) => Math.min(4, prev + 1))}
                      className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-black shadow-[0_0_20px_rgba(0,229,153,0.4)] cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProject ? 'Save Changes' : 'Create Live Project'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00E599]" />
                <span>{editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category Tag'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Category Tag Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  placeholder="e.g. Posters, Product Poster, Ads, 3D Motion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="posters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Associated Service Pillar
                </label>
                <select
                  value={catServiceId}
                  onChange={(e) => setCatServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] font-bold cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tag Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Short description of works in this tag..."
                  className="w-full p-3 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none resize-none focus:border-[#00E599]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-700 font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title={`Delete ${deleteConfirmation.title}?`}
        message={
          deleteConfirmation.type === 'project'
            ? 'This action will permanently delete this project from your portfolio showcase and database.'
            : 'This will remove the category tag. Existing projects under this tag will remain safe.'
        }
        confirmLabel="Delete Permanently"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
