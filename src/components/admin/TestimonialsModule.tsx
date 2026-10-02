import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Testimonial } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, X, Quote } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface TestimonialsModuleProps {
  onShowToast: (title: string, msg: string) => void;
  openCreateImmediately?: boolean;
}

export const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({
  onShowToast,
  openCreateImmediately = false,
}) => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();

  const [modalOpen, setModalOpen] = useState(openCreateImmediately);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [published, setPublished] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setCompany('');
    setQuote('');
    setAvatarUrl('');
    setRating(5);
    setPublished(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setCompany(item.company);
    setQuote(item.quote);
    setAvatarUrl(item.avatarUrl || '');
    setRating(item.rating);
    setPublished(item.published);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    if (editingItem) {
      updateTestimonial({
        ...editingItem,
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        initials: initials || 'CL',
        avatarUrl: avatarUrl.trim() || undefined,
        quote: quote.trim(),
        rating,
        published,
      });
      onShowToast('Review Updated', `Testimonial from "${name}" was updated.`);
    } else {
      addTestimonial({
        id: `test-${Date.now()}`,
        name: name.trim(),
        role: role.trim() || 'Client',
        company: company.trim() || 'Partner',
        initials: initials || 'CL',
        avatarBg: 'bg-emerald-100 text-teal-800',
        avatarUrl: avatarUrl.trim() || undefined,
        quote: quote.trim(),
        rating,
        published,
        order: testimonials.length + 1,
      });
      onShowToast('Review Created', `Testimonial from "${name}" was added.`);
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

  const handleDelete = (id: string, author: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      title: `Endorsement from "${author}"`,
    });
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTestimonial(deleteConfirmation.id);
      onShowToast('Review Deleted', `${deleteConfirmation.title} was removed.`);
      if (editingItem && editingItem.id === deleteConfirmation.id) {
        setModalOpen(false);
        setEditingItem(null);
      }
    } catch (e) {
      console.error('Delete testimonial error:', e);
      onShowToast('Delete Error', 'Failed to delete review.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const togglePublish = (item: Testimonial) => {
    updateTestimonial({ ...item, published: !item.published });
    onShowToast(
      item.published ? 'Review Hidden' : 'Review Published',
      `"${item.name}" review status updated.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37]">
            What Clients Say / Endorsements ({testimonials.length})
          </h2>
          <p className="text-xs text-[#6B7280]">
            Manage client quotes, star ratings, reviewer credentials, and publication status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              item.published
                ? 'border-[#E8F7F2] shadow-sm hover:shadow-md'
                : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <Quote className="w-6 h-6 text-[#F2685F]/30 absolute top-4 left-4" />

            <div className="pt-4 mb-4">
              <p className="text-xs text-[#6B7280] italic leading-relaxed line-clamp-3">
                "{item.quote}"
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${item.avatarBg} flex items-center justify-center font-bold text-xs`}
                >
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2A37]">{item.name}</h4>
                  <p className="text-[10px] text-[#9CA3AF]">
                    {item.role}, {item.company}
                  </p>
                  <div className="flex text-[#F5B301] text-[10px] mt-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => togglePublish(item)}
                  className="p-1.5 text-gray-400 hover:text-[#4CC9A7] rounded-lg transition-colors"
                  title={item.published ? 'Hide on site' : 'Show on site'}
                >
                  {item.published ? <Eye className="w-3.5 h-3.5 text-[#4CC9A7]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-[#1F2A37] rounded-lg transition-colors"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#D8F2E9]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#1F2A37] mb-1">
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Remember to use he/his pronouns when referring to Ashhar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Author Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VP of Product"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. FinTrack"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Rating Stars
                </label>
                <div className="flex gap-1 text-lg text-[#F5B301]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      {star <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Working with Ashhar was an absolute pleasure..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
                />
              </div>

              <ImageUploadField
                label="Reviewer Profile Photo / Avatar"
                sublabel="(Optional)"
                value={avatarUrl}
                onChange={setAvatarUrl}
                helperText="Upload client portrait photo (falls back to initials badge)"
                aspectRatio="square"
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-[#4CC9A7]"
                />
                <label htmlFor="pubCheck" className="text-xs text-[#1F2A37] font-medium cursor-pointer">
                  Publish live on public site
                </label>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation({
                        isOpen: true,
                        id: editingItem.id,
                        title: `Endorsement from "${editingItem.name}"`,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Review</span>
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
                    Save Review
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
        title={`Delete ${deleteConfirmation.title}?`}
        message="This will permanently delete this client testimonial and remove it from your portfolio."
        confirmLabel="Delete Review"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
