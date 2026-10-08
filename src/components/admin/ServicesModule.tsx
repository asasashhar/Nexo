import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ServiceItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  PenTool,
  Smartphone,
  Monitor,
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Palette,
  Megaphone,
  Box,
  Film,
  Sparkles,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  ListPlus,
  ExternalLink,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

interface ServicesModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({ onShowToast }) => {
  const { services, addService, updateService, deleteService } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [details, setDetails] = useState('');
  const [iconName, setIconName] = useState('Monitor');
  const [estimatedTimeline, setEstimatedTimeline] = useState('1-2 Weeks');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [published, setPublished] = useState(true);

  // Confirm delete dialog state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{ id: string; title: string } | null>(null);

  const availableIcons = [
    { name: 'Monitor', label: 'Web & Desktop', icon: Monitor },
    { name: 'Palette', label: 'Poster & Art', icon: Palette },
    { name: 'Megaphone', label: 'Ads & Campaigns', icon: Megaphone },
    { name: 'Box', label: 'Product & 3D', icon: Box },
    { name: 'Film', label: 'Video & Motion', icon: Film },
    { name: 'Smartphone', label: 'Mobile App', icon: Smartphone },
    { name: 'Sparkles', label: 'Brand & Identity', icon: Sparkles },
    { name: 'Globe', label: 'Global Platform', icon: Globe },
    { name: 'Layers', label: 'Design System', icon: Layers },
    { name: 'PenTool', label: 'Creative Direction', icon: PenTool },
    { name: 'Search', label: 'SEO & Research', icon: Search },
  ];

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setDesc('');
    setDetails('');
    setIconName('Monitor');
    setEstimatedTimeline('1-2 Weeks');
    setDeliverablesInput('Custom Responsive Web\nClean UI/UX Architecture\nSEO & Speed Optimizations');
    setPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDesc(srv.desc);
    setDetails(srv.details || '');
    setIconName(srv.iconName || 'Monitor');
    setEstimatedTimeline(srv.estimatedTimeline || '1-2 Weeks');

    const deliverablesText =
      srv.deliverablesList && srv.deliverablesList.length > 0
        ? srv.deliverablesList.join('\n')
        : srv.details || '';

    setDeliverablesInput(deliverablesText);
    setPublished(srv.published !== false);
    setModalOpen(true);
  };

  const parseDeliverables = (text: string): string[] => {
    return text
      .split(/[,\n•;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    const deliverablesList = parseDeliverables(deliverablesInput);

    if (editingService) {
      updateService({
        ...editingService,
        title: title.trim(),
        desc: desc.trim(),
        details: details.trim() || deliverablesList.join(', '),
        iconName,
        published,
        estimatedTimeline: estimatedTimeline.trim(),
        deliverablesList,
      });
      onShowToast('Service Updated', `Updated "${title.trim()}" successfully.`);
    } else {
      addService({
        id: `srv-${Date.now()}`,
        title: title.trim(),
        desc: desc.trim(),
        details: details.trim() || deliverablesList.join(', '),
        iconName,
        published,
        order: services.length + 1,
        estimatedTimeline: estimatedTimeline.trim(),
        deliverablesList,
      });
      onShowToast('Service Created', `Added "${title.trim()}" to studio capabilities.`);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, srvTitle: string) => {
    setServiceToDelete({ id, title: srvTitle });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    deleteService(serviceToDelete.id);
    onShowToast('Service Deleted', `Removed "${serviceToDelete.title}".`);
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const togglePublish = (srv: ServiceItem) => {
    updateService({ ...srv, published: !srv.published });
    onShowToast(
      srv.published ? 'Service Hidden' : 'Service Published',
      `"${srv.title}" is now ${srv.published ? 'hidden from' : 'live on'} public website.`
    );
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === services.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentList = [...services];
    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    // Update order indices
    currentList.forEach((item, idx) => {
      updateService({ ...item, order: idx + 1 });
    });

    onShowToast('Order Updated', 'Service display sequence saved.');
  };

  const renderIcon = (name: string) => {
    const found = availableIcons.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (found) {
      const Icon = found.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <PenTool className="w-5 h-5" />;
  };

  const activeCount = services.filter((s) => s.published).length;
  const draftCount = services.length - activeCount;

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>Studio Services &amp; Capabilities</span>
            <span className="text-xs bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold px-3 py-0.5 rounded-full font-mono">
              {activeCount} Live on Site · {draftCount} Draft
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your public offerings, sprint timelines, key deliverables, and practice pillars shown on the front page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="#services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 bg-[#0F1522] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Preview on Site</span>
          </a>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid (Dark theme, draggable/reorderable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv, idx) => {
          const deliverables =
            srv.deliverablesList && srv.deliverablesList.length > 0
              ? srv.deliverablesList
              : parseDeliverables(srv.details || '');

          return (
            <div
              key={srv.id}
              className={`bg-[#0F1522] rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                srv.published
                  ? 'border-slate-800 shadow-xl hover:border-slate-700'
                  : 'border-slate-800/50 opacity-60 bg-[#080B11]'
              }`}
            >
              <div>
                {/* Card Top: Icon, Order, and Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 flex items-center justify-center shadow-xs">
                      {renderIcon(srv.iconName)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-500 block">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {srv.estimatedTimeline ? `${srv.estimatedTimeline}` : 'Flexible Sprint'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up / Down Buttons */}
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, 'down')}
                      disabled={idx === services.length - 1}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Visibility toggle */}
                    <button
                      type="button"
                      onClick={() => togglePublish(srv)}
                      className="p-1.5 text-slate-400 hover:text-[#00E599] rounded-lg transition-colors cursor-pointer"
                      title={srv.published ? 'Hide on public site' : 'Show on public site'}
                    >
                      {srv.published ? (
                        <Eye className="w-4 h-4 text-[#00E599]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(srv.id, srv.title)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Service Title & Description */}
                <h3 className="text-base font-bold text-white mb-1.5 font-sans">{srv.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {srv.desc}
                </p>

                {/* Key Deliverables Chips */}
                {deliverables.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      Deliverables ({deliverables.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {deliverables.slice(0, 4).map((item, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#080B11] border border-slate-800 text-slate-300 truncate max-w-full"
                        >
                          • {item}
                        </span>
                      ))}
                      {deliverables.length > 4 && (
                        <span className="text-[10px] text-slate-500 py-0.5">
                          +{deliverables.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Status Badge */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold px-2.5 py-0.5 rounded-full ${
                    srv.published
                      ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {srv.published ? 'Live on Homepage' : 'Draft / Hidden'}
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Icon: {srv.iconName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Modal (Add & Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-700 text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-white mb-1 font-sans">
                {editingService ? 'Edit Service Capability' : 'Add New Studio Service'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure service title, card description, sprint timeline, and deliverables list shown on the public site.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Web Design, Poster Making, Video Ads"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sprint / Estimated Timeline
                  </label>
                  <input
                    type="text"
                    value={estimatedTimeline}
                    onChange={(e) => setEstimatedTimeline(e.target.value)}
                    placeholder="e.g. 1-2 Weeks, 3-5 Days, 2-4 Weeks"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Card Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Modern, responsive websites that represent your brand and convert visitors..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Key Deliverables Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Deliverables Bullet Points (One per line)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Shown directly on public service card
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Custom Responsive Web&#10;Clean UI/UX Architecture&#10;SEO & Speed Optimizations"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none leading-relaxed font-mono"
                />
              </div>

              {/* Icon Selection Visual Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableIcons.map((ic) => {
                    const Icon = ic.icon;
                    const isSelected = iconName.toLowerCase() === ic.name.toLowerCase();
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setIconName(ic.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#00E599]/15 border-[#00E599] text-[#00E599] shadow-xs'
                            : 'bg-[#080B11] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{ic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-[#080B11] border border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                  Live Card Preview on Public Site:
                </span>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 flex items-center justify-center flex-shrink-0">
                    {renderIcon(iconName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">{title || 'Service Title'}</h4>
                    <p className="text-[10px] font-mono text-slate-400 mb-1">
                      Sprint: {estimatedTimeline || '1-2 Weeks'}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {desc || 'Description will appear here on the card...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#080B11] border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Publish Live on Website</span>
                  <span className="text-[11px] text-slate-400">
                    When enabled, this service appears instantly in the public services section.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E599]" />
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {editingService ? 'Save Service Changes' : 'Create Live Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="Delete Service Capability"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This will remove it from the public services grid and database.`}
        confirmText="Yes, Delete Service"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
