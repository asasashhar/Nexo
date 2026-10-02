import React, { useState } from 'react';
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
  const [category, setCategory] = useState(categories[0]?.name || 'Mobile App Design');
  const [workType, setWorkType] = useState<ProjectWorkType>('mobile');
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

  // Open Create Project Modal
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    const defaultService = services[0]?.id || '';
    setSelectedServiceId(defaultService);
    setCategory(categories[0]?.name || 'Mobile App Design');
    setWorkType('mobile');
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
    setProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setSelectedServiceId(p.serviceId || services[0]?.id || '');
    setCategory(p.category);
    setWorkType(p.workType || 'mobile');
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
    setProjectModalOpen(true);
  };

  // Submit Project Form
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
        summary: editingProject.summary || '',
        overview: editingProject.overview || '',
        challenge: editingProject.challenge || '',
        solution: editingProject.solution || '',
        results: editingProject.results || [],
        deliverables: editingProject.deliverables || [],
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
        summary: '',
        overview: '',
        challenge: '',
        solution: '',
        results: [],
        deliverables: [],
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
    if (!serviceId) return 'Unassigned Service';
    const found = services.find((s) => s.id === serviceId);
    return found ? found.title : 'Custom Service';
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
            <span>Portfolio Works &amp; Categories</span>
            <span className="text-xs bg-[#E8F7F2] text-[#37B294] font-bold px-2.5 py-0.5 rounded-full">
              {projects.length} Works · {categories.length} Categories
            </span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Manage portfolio projects linked to services, custom category tags, posters, and video/image ads.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeSubTab === 'projects' ? (
            <button
              type="button"
              onClick={handleOpenAddProject}
              className="inline-flex items-center gap-1.5 bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category Tag</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'projects'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-[#6B7280] hover:text-[#1F2A37] hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>All Portfolio Works ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'categories'
              ? 'bg-[#4CC9A7] text-white shadow-xs'
              : 'text-[#6B7280] hover:text-[#1F2A37] hover:bg-gray-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Manage Category Tags ({categories.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: PROJECTS LIST */}
      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8F7F2] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search works by title, client..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 outline-none bg-white font-medium text-[#1F2A37]"
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
                className="px-3 py-1.5 rounded-xl border border-gray-200 outline-none bg-white font-medium text-[#1F2A37]"
              >
                <option value="all">All Services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    Service: {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#4CC9A7] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#4CC9A7] text-white' : 'text-gray-400 hover:text-gray-600'
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
                  className="bg-white rounded-3xl border border-[#E8F7F2] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail / Video Preview */}
                  <div className="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {p.workType === 'ad' && p.adMediaType === 'video' && p.videoUrl ? (
                      <div className="w-full h-full relative group/video flex items-center justify-center bg-black">
                        {p.coverImage && (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover opacity-60"
                          />
                        )}
                        <div className="absolute w-12 h-12 rounded-full bg-[#F2685F] text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Film className="w-3 h-3 text-[#F2685F]" />
                          <span>Video Ad (15s)</span>
                        </span>
                      </div>
                    ) : p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-gray-300 text-xs flex flex-col items-center gap-1">
                        <ImageIcon className="w-8 h-8" />
                        <span>No cover image</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-white/90 backdrop-blur-xs text-[#1F2A37] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {p.category}
                      </span>
                      {p.workType === 'ad' && (
                        <span className="bg-[#F2685F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase">
                          {p.adMediaType === 'video' ? 'Video Ad' : 'Image Ad'}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {p.featured && (
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-[#1F2A37] group-hover:text-[#4CC9A7] transition-colors line-clamp-1">
                        {p.title}
                      </h3>

                      {/* Associated Service Tag */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#37B294]">
                        <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-semibold">{getServiceName(p.serviceId)}</span>
                      </div>

                      <p className="text-xs text-[#6B7280] line-clamp-2 mt-2 leading-relaxed">
                        {p.summary}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF] text-[11px]">
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
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            p.published
                              ? 'text-[#4CC9A7] hover:bg-[#E8F7F2]'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={p.published ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                        >
                          {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditProject(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#4CC9A7] hover:bg-[#E8F7F2] cursor-pointer"
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
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-[#E8F7F2] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1F2A37]">
                  <thead className="bg-[#F7FCFA] border-b border-gray-100 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Project Title</th>
                      <th className="py-3 px-4">Associated Service</th>
                      <th className="py-3 px-4">Category Tag</th>
                      <th className="py-3 px-4">Section / Type</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7FCFA] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#1F2A37] flex items-center gap-2">
                          {p.coverImage && (
                            <img
                              src={p.coverImage}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <span>{p.title}</span>
                        </td>
                        <td className="py-3 px-4 text-[#37B294] font-semibold">
                          {getServiceName(p.serviceId)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#E8F7F2] text-[#37B294] font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-700 capitalize">
                            {p.workType === 'ad'
                              ? `Ad (${p.adMediaType})`
                              : p.workType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#6B7280]">{p.client}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.published
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
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
                              className="p-1.5 rounded-lg text-gray-500 hover:text-[#4CC9A7] hover:bg-[#E8F7F2] cursor-pointer"
                              title="Edit"
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
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete"
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
        <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1F2A37] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#4CC9A7]" />
                <span>Manage Work Category Tags</span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                Administer category tags used for filtering portfolio projects. Every category can be linked to an added service.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="inline-flex items-center gap-1 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const projectCount = projects.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#F7FCFA] hover:border-[#4CC9A7]/50 hover:bg-white transition-all space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#1F2A37] block">{cat.name}</span>
                      <span className="text-[11px] text-[#9CA3AF] font-mono">slug: {cat.slug}</span>
                    </div>

                    <span className="bg-[#E8F7F2] text-[#37B294] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {projectCount} {projectCount === 1 ? 'Work' : 'Works'}
                    </span>
                  </div>

                  <div className="text-xs text-[#6B7280] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#4CC9A7]" />
                      <span className="font-semibold text-[#1F2A37]">
                        Service: {getServiceName(cat.serviceId)}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-[#6B7280] line-clamp-2">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#4CC9A7] hover:bg-[#E8F7F2] cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
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

      {/* CREATE / EDIT PROJECT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#D8F2E9] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#1F2A37]">
                  {editingProject ? `Edit "${editingProject.title}"` : 'Create New Portfolio Project'}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Configure project details, select from added services, and specify ad format (video or image).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">Project Title *</label>
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
                    placeholder="e.g. Pulse Energy – 15s Kinetic Motion Video Ad"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="pulse-energy-video-ad"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                </div>
              </div>

              {/* Requirement 2: The works should be from one of the added services! */}
              <div className="p-4 rounded-2xl bg-[#E8F7F2]/40 border border-[#4CC9A7]/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#1F2A37] mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#37B294]" />
                      <span>Associated Service (From Added Services) *</span>
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none bg-white font-semibold text-[#1F2A37]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[#6B7280] mt-1 block">
                      This project will display under this service's scope and detail view.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1F2A37] mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#4CC9A7]" />
                      <span>Category Tag *</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none bg-white font-semibold text-[#1F2A37]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Requirement 7: Work Sections: Mobile App, Web Design, Posters, Product Poster, Ads (Video & Image) */}
                <div className="pt-2 border-t border-gray-200/60">
                  <label className="block font-bold text-[#1F2A37] mb-1.5">
                    Work Section Format &amp; Medium *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'mobile', label: 'Mobile App', icon: Smartphone },
                      { id: 'web', label: 'Web Design', icon: Monitor },
                      { id: 'poster', label: 'Posters', icon: ImageIcon },
                      { id: 'product_poster', label: 'Product Poster', icon: Sparkles },
                      { id: 'ad', label: 'Ads', icon: Film },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWorkType(item.id as ProjectWorkType)}
                        className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          workType === item.id
                            ? 'bg-[#4CC9A7] text-white border-[#4CC9A7] shadow-xs'
                            : 'bg-white text-[#1F2A37] border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-[11px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* If 'ad' is selected: Ads can be Video or Image */}
                {workType === 'ad' && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-[#F2685F]" />
                        <span>Ad Media Type (Video or Image) *</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setAdMediaType('video')}
                          className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer ${
                            adMediaType === 'video'
                              ? 'bg-[#F2685F] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          🎬 Video Ad
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdMediaType('image')}
                          className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer ${
                            adMediaType === 'image'
                              ? 'bg-[#4CC9A7] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          🖼️ Image Ad
                        </button>
                      </div>
                    </div>

                    {adMediaType === 'video' && (
                      <VideoUploadField
                        label="Video Ad Creative"
                        sublabel="(MP4, WebM, MOV upload from device or media library)"
                        required
                        value={videoUrl}
                        onChange={setVideoUrl}
                        helperText="Upload any video ad file directly from your computer or choose from Media Library"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Cover Image & Live URL */}
              <div className="bg-[#F7FCFA] p-4 rounded-2xl border border-[#D8F2E9] space-y-3">
                <ImageUploadField
                  label="Project Primary Cover Image"
                  sublabel="(Shown on project card & header)"
                  required
                  value={coverImage}
                  onChange={setCoverImage}
                  helperText="Upload any artwork or website screenshot directly from your device"
                  aspectRatio="wide"
                />

                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">
                    Live Demo / Behance URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://behance.net/gallery/... or live website link"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Different Images of the Website (Screenshots & Mockups) */}
              <WebsiteImagesManager
                images={websiteImages}
                onChange={setWebsiteImages}
                onSetAsCover={(url) => setCoverImage(url)}
                currentCoverUrl={coverImage}
              />

              {/* Client, Year, Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">Client Name</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Luminary Audio"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2A37] mb-1">Designer Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Lead UI/UX Designer"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                </div>
              </div>

              {/* Tools */}
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">
                  Design Tools (comma separated)
                </label>
                <input
                  type="text"
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  placeholder="Figma, Protopie, Cinema 4D, After Effects"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1F2A37]">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-[#4CC9A7] focus:ring-[#4CC9A7]"
                  />
                  <span>Publish to live portfolio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1F2A37]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Feature on homepage spotlight</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                {editingProject ? (
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8F2E9]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#1F2A37]">
                {editingCategory ? `Edit Category Tag: ${editingCategory.name}` : 'Add New Category Tag'}
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="posters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">
                  Associated Service
                </label>
                <select
                  value={catServiceId}
                  onChange={(e) => setCatServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">
                  Tag Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Short description of works in this tag..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none resize-none focus:border-[#4CC9A7]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 font-semibold text-[#1F2A37] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#4CC9A7] hover:bg-[#37B294] text-white font-semibold shadow-xs"
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
