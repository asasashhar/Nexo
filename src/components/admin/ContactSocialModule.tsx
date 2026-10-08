import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SocialProfile } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  X,
  Share2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from 'lucide-react';

interface ContactSocialModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const ContactSocialModule: React.FC<ContactSocialModuleProps> = ({ onShowToast }) => {
  const {
    profile,
    setProfile,
    socialProfiles,
    addSocialProfile,
    updateSocialProfile,
    deleteSocialProfile,
    setSocialProfiles,
  } = usePortfolio();

  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);

  const [ctaHeadline, setCtaHeadline] = useState(profile.ctaHeadline);
  const [ctaHighlight, setCtaHighlight] = useState(profile.ctaHighlightedWord);
  const [ctaSubtext, setCtaSubtext] = useState(profile.ctaSubtext);

  // Modal / Form state for Adding or Editing Social Profile
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialProfile | null>(null);
  const [platform, setPlatform] = useState('');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('globe');
  const [enabled, setEnabled] = useState(true);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      email,
      phone,
      location,
      ctaHeadline,
      ctaHighlightedWord: ctaHighlight,
      ctaSubtext,
    });
    onShowToast('Contact Info Saved', 'Direct contact details & CTA banner updated.');
  };

  const handleOpenAddSocial = () => {
    setEditingSocial(null);
    setPlatform('Instagram');
    setLabel('ig');
    setUrl('https://instagram.com/nexo.creativestudio');
    setIcon('instagram');
    setEnabled(true);
    setModalOpen(true);
  };

  const handleOpenEditSocial = (soc: SocialProfile) => {
    setEditingSocial(soc);
    setPlatform(soc.platform);
    setLabel(soc.label);
    setUrl(soc.url);
    setIcon(soc.icon);
    setEnabled(soc.enabled);
    setModalOpen(true);
  };

  const handleSaveSocialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;

    if (editingSocial) {
      updateSocialProfile({
        ...editingSocial,
        platform: platform.trim(),
        label: label.trim() || platform.slice(0, 2).toLowerCase(),
        url: url.trim(),
        icon,
        enabled,
      });
      onShowToast('Profile Updated', `Updated ${platform} link.`);
    } else {
      const newProfile: SocialProfile = {
        id: `soc-${Date.now()}`,
        platform: platform.trim(),
        label: label.trim() || platform.slice(0, 2).toLowerCase(),
        url: url.trim(),
        icon,
        enabled,
        order: socialProfiles.length + 1,
      };
      addSocialProfile(newProfile);
      onShowToast('Profile Added', `Added ${platform} to social networks.`);
    }
    setModalOpen(false);
  };

  const handleToggleEnabled = (soc: SocialProfile) => {
    updateSocialProfile({
      ...soc,
      enabled: !soc.enabled,
    });
    onShowToast(
      soc.enabled ? 'Profile Hidden' : 'Profile Active',
      `${soc.platform} visibility updated.`
    );
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

  const handleDeleteSocial = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      title: `${name} link`,
    });
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSocialProfile(deleteConfirmation.id);
      onShowToast('Removed', `${deleteConfirmation.title} removed.`);
      if (editingSocial && editingSocial.id === deleteConfirmation.id) {
        setModalOpen(false);
        setEditingSocial(null);
      }
    } catch (e) {
      console.error('Delete social profile error:', e);
      onShowToast('Delete Error', 'Failed to delete social profile.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialProfiles.length) return;

    const list = [...socialProfiles];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // re-assign orders
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSocialProfiles(reordered);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">Contact &amp; Social Networks</h2>
          <p className="text-xs text-slate-400">
            Update studio contact details, footer CTA banner copy, and social media links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveContact}
          className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Contact & CTA Banner */}
        <div className="lg:col-span-6 space-y-6">
          {/* Direct Contact Information */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 font-sans">
              Direct Contact Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
                <Mail className="w-4 h-4 text-[#00E599] absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                  />
                  <Phone className="w-4 h-4 text-[#00E599] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Studio Location</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                  />
                  <MapPin className="w-4 h-4 text-[#00E599] absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner Copy */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 font-sans">
              CTA Banner Content (Above Footer)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={ctaHeadline}
                  onChange={(e) => setCtaHeadline(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accent Highlighted Word
                </label>
                <input
                  type="text"
                  value={ctaHighlight}
                  onChange={(e) => setCtaHighlight(e.target.value)}
                  placeholder="together!"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 focus:border-[#FF5A36] outline-none text-[#FF5A36] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sub-headline Text
              </label>
              <textarea
                rows={2}
                value={ctaSubtext}
                onChange={(e) => setCtaSubtext(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none resize-none focus:border-[#00E599] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Social Media Profiles Manager */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                  <Share2 className="w-4 h-4 text-[#00E599]" />
                  <span>Social Media Profiles &amp; Links</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Add, toggle, or edit any handles shown on Hero and Footer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSocial}
                className="inline-flex items-center gap-1 bg-[#00E599]/15 hover:bg-[#00E599] text-[#00E599] hover:text-black border border-[#00E599]/30 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Profile</span>
              </button>
            </div>

            {/* List of Social Profiles */}
            <div className="space-y-2.5">
              {socialProfiles.map((soc, idx) => (
                <div
                  key={soc.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    soc.enabled
                      ? 'bg-[#080B11] border-slate-800 hover:border-slate-700 shadow-xs'
                      : 'bg-[#080B11]/50 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle Avatar badge */}
                    <div className="w-9 h-9 rounded-full border border-[#00E599]/40 text-[#00E599] bg-[#00E599]/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {soc.label}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-sans">{soc.platform}</span>
                        {!soc.enabled && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.2 rounded-full font-medium">
                            Hidden
                          </span>
                        )}
                      </div>
                      <a
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-400 hover:text-[#00E599] flex items-center gap-1 truncate block max-w-[200px] sm:max-w-xs transition-colors"
                      >
                        <span className="truncate">{soc.url}</span>
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === socialProfiles.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(soc)}
                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                        soc.enabled
                          ? 'text-[#00E599] hover:bg-[#00E599]/10'
                          : 'text-slate-500 hover:bg-slate-800'
                      }`}
                      title={soc.enabled ? 'Disable / Hide' : 'Enable / Show'}
                    >
                      {soc.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditSocial(soc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSocial(soc.id, soc.platform)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 cursor-pointer"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview Pill Strip */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 font-mono">
                Live Public Preview:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialProfiles
                  .filter((s) => s.enabled)
                  .map((s) => (
                    <span
                      key={s.id}
                      className="w-8 h-8 rounded-full border border-slate-700 hover:border-[#00E599] text-slate-300 hover:text-[#00E599] bg-[#080B11] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      {s.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Social Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-700 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-sans">
                {editingSocial ? `Edit ${editingSocial.platform}` : 'Add Social Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocialModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    if (!editingSocial) {
                      setLabel(e.target.value.slice(0, 2).toLowerCase());
                    }
                  }}
                  placeholder="e.g. YouTube, TikTok, Threads, GitHub"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Circle Badge Label (2-3 chars) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. yt, ig, in, git"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Style</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none"
                  >
                    <option value="globe">Globe / Web</option>
                    <option value="behance">Behance</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="dribbble">Dribbble</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="youtube">YouTube</option>
                    <option value="threads">Threads</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Profile URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="enabledCheck"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded text-[#00E599] accent-[#00E599]"
                />
                <label htmlFor="enabledCheck" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Display profile actively on public site
                </label>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                {editingSocial ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation({
                        isOpen: true,
                        id: editingSocial.id,
                        title: `${editingSocial.platform} link`,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-900/60 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Link</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold shadow-md cursor-pointer"
                  >
                    {editingSocial ? 'Save Changes' : 'Add Profile'}
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
        title={`Remove ${deleteConfirmation.title}?`}
        message="This will remove this profile from your contact links and footer."
        confirmLabel="Remove Link"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
