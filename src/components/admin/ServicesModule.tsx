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
  const [iconName, setIconName] = useState('PenTool');
  const [published, setPublished] = useState(true);

  const availableIcons = ['PenTool', 'Smartphone', 'Monitor', 'Layers', 'Search'];

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setDesc('');
    setDetails('');
    setIconName('PenTool');
    setPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDesc(srv.desc);
    setDetails(srv.details);
    setIconName(srv.iconName);
    setPublished(srv.published);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    if (editingService) {
      updateService({
        ...editingService,
        title: title.trim(),
        desc: desc.trim(),
        details: details.trim() || desc.trim(),
        iconName,
        published,
      });
      onShowToast('Service Updated', `"${title}" was successfully updated.`);
    } else {
      addService({
        id: `service-${Date.now()}`,
        title: title.trim(),
        desc: desc.trim(),
        details: details.trim() || desc.trim(),
        iconName,
        published,
        order: services.length + 1,
      });
      onShowToast('Service Created', `"${title}" has been added to services.`);
    }
    setModalOpen(false);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      title: name,
    });
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteService(deleteConfirmation.id);
      onShowToast('Service Deleted', `"${deleteConfirmation.title}" was removed.`);
      if (editingService && editingService.id === deleteConfirmation.id) {
        setModalOpen(false);
        setEditingService(null);
      }
    } catch (e) {
      console.error('Delete service error:', e);
      onShowToast('Delete Error', 'Failed to delete service.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const togglePublish = (srv: ServiceItem) => {
    updateService({ ...srv, published: !srv.published });
    onShowToast(
      srv.published ? 'Service Hidden' : 'Service Published',
      `"${srv.title}" visibility updated.`
    );
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Search':
        return <Search className="w-5 h-5" />;
      default:
        return <PenTool className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37]">What I Do / Services ({services.length})</h2>
          <p className="text-xs text-[#6B7280]">
            Manage your design offerings, technical scopes, and deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
              srv.published
                ? 'border-[#E8F7F2] shadow-sm hover:shadow-md'
                : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center">
                  {renderIcon(srv.iconName)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePublish(srv)}
                    className="p-1.5 text-gray-400 hover:text-[#4CC9A7] rounded-lg transition-colors"
                    title={srv.published ? 'Hide on public site' : 'Show on public site'}
                  >
                    {srv.published ? <Eye className="w-4 h-4 text-[#4CC9A7]" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 text-gray-400 hover:text-[#1F2A37] rounded-lg transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#1F2A37] mb-1">{srv.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">{srv.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  srv.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {srv.published ? 'Live on site' : 'Draft / Hidden'}
              </span>
              <span className="text-[#9CA3AF]">Icon: {srv.iconName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-[#D8F2E9]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#1F2A37] mb-1">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Enter service title, scope summary, and choose an icon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design Systems & Tokens"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Short Description (Card Face) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Designing scalable and modular design tokens for cross-platform apps."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Expanded Scope Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Detailed breakdown shown when client clicks 'Explore scope'..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Select Icon
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1F2A37] font-medium">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded text-[#4CC9A7] focus:ring-[#4CC9A7]"
                    />
                    <span>Publish live on site</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                {editingService ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation({
                        isOpen: true,
                        id: editingService.id,
                        title: editingService.title,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Service</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold shadow-sm"
                  >
                    {editingService ? 'Save Service' : 'Create Service'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title={`Delete Service "${deleteConfirmation.title}"?`}
        message="This will permanently delete this service offering and remove it from your live portfolio."
        confirmLabel="Delete Service"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
