import React, { useState } from 'react';
import { X, Sparkles, Trash2, Mail, Check, RotateCcw } from 'lucide-react';
import { PortfolioProfile, InquiryMessage } from '../types';
import { ImageUploadField } from './admin/ImageUploadField';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PortfolioProfile;
  onUpdateProfile: (updated: PortfolioProfile) => void;
  onResetDefaults: () => void;
  inquiries: InquiryMessage[];
  onMarkInquiryRead: (id: string) => void;
  onDeleteInquiry: (id: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetDefaults,
  inquiries,
  onMarkInquiryRead,
  onDeleteInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'messages'>('hero');

  // Form local state
  const [formProfile, setFormProfile] = useState<PortfolioProfile>(profile);

  // Sync with prop changes
  React.useEffect(() => {
    setFormProfile(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile(formProfile);
    onClose();
  };

  const handleReset = () => {
    onResetDefaults();
  };

  const unreadCount = inquiries.filter((m) => !m.read).length;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300"
      aria-label="Portfolio In-Place Admin Editor"
    >
      {/* Admin Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#E8F7F2]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4CC9A7] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1F2A37]">Portfolio Admin</h3>
            <span className="text-[10px] text-[#37B294] font-medium block">
              Live In-Place Content Editor
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white text-[#9CA3AF] hover:text-[#1F2A37] flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-gray-200 text-xs font-semibold px-4 pt-2 gap-4 bg-gray-50">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'hero'
              ? 'border-b-2 border-[#4CC9A7] text-[#4CC9A7]'
              : 'text-[#9CA3AF] hover:text-[#1F2A37]'
          }`}
        >
          Hero & Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'about'
              ? 'border-b-2 border-[#4CC9A7] text-[#4CC9A7]'
              : 'text-[#9CA3AF] hover:text-[#1F2A37]'
          }`}
        >
          About & Contact
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`pb-2 transition-colors relative cursor-pointer ${
            activeTab === 'messages'
              ? 'border-b-2 border-[#4CC9A7] text-[#4CC9A7]'
              : 'text-[#9CA3AF] hover:text-[#1F2A37]'
          }`}
        >
          <span>Messages ({inquiries.length})</span>
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#F2685F] text-white rounded-full text-[9px]">
              {unreadCount} new
            </span>
          )}
        </button>
      </div>

      {/* Admin Form Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Tab 1: General Hero Content */}
        {activeTab === 'hero' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Display First Name</label>
              <input
                type="text"
                value={formProfile.name}
                onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">
                Brand Suffix (e.g. Designs)
              </label>
              <input
                type="text"
                value={formProfile.brandSuffix}
                onChange={(e) => setFormProfile({ ...formProfile, brandSuffix: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Role Subtitle</label>
              <input
                type="text"
                value={formProfile.roleSubtitle}
                onChange={(e) => setFormProfile({ ...formProfile, roleSubtitle: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">
                Years of Experience Badge
              </label>
              <input
                type="text"
                value={formProfile.experienceYears}
                onChange={(e) =>
                  setFormProfile({ ...formProfile, experienceYears: e.target.value })
                }
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Hero Pitch</label>
              <textarea
                rows={3}
                value={formProfile.heroPitch}
                onChange={(e) => setFormProfile({ ...formProfile, heroPitch: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none resize-none"
              />
            </div>

            <ImageUploadField
              label="Hero Portrait Photo"
              value={formProfile.heroImageUrl}
              onChange={(url) => setFormProfile({ ...formProfile, heroImageUrl: url })}
              helperText="Upload a portrait photo from your device"
              aspectRatio="portrait"
            />
          </div>
        )}

        {/* Tab 2: About Me Content */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Location City</label>
              <input
                type="text"
                value={formProfile.location}
                onChange={(e) => setFormProfile({ ...formProfile, location: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Contact Email</label>
              <input
                type="email"
                value={formProfile.email}
                onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Phone Number</label>
              <input
                type="text"
                value={formProfile.phone}
                onChange={(e) => setFormProfile({ ...formProfile, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">About Me Bio</label>
              <textarea
                rows={4}
                value={formProfile.aboutBio}
                onChange={(e) => setFormProfile({ ...formProfile, aboutBio: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2.5 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Degree</label>
                <input
                  type="text"
                  value={formProfile.education}
                  onChange={(e) => setFormProfile({ ...formProfile, education: e.target.value })}
                  className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Interests</label>
                <input
                  type="text"
                  value={formProfile.personalInterest}
                  onChange={(e) =>
                    setFormProfile({ ...formProfile, personalInterest: e.target.value })
                  }
                  className="w-full text-xs rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] p-2 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mock Inquiries Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {inquiries.length === 0 ? (
              <div className="text-center py-8 text-[#9CA3AF]">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No messages received yet.</p>
              </div>
            ) : (
              inquiries.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    msg.read
                      ? 'bg-[#F7FCFA] border-[#D8F2E9]'
                      : 'bg-white border-[#4CC9A7] shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#1F2A37] font-semibold">{msg.name}</strong>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-[#F2685F]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#4CC9A7] font-medium">{msg.email}</span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF]">{msg.timestamp}</span>
                  </div>

                  <p className="text-[#6B7280] text-xs my-2 leading-relaxed">{msg.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                    <span className="text-[#9CA3AF]">
                      Service: <strong className="text-[#1F2A37]">{msg.service}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      {!msg.read && (
                        <button
                          type="button"
                          onClick={() => onMarkInquiryRead(msg.id)}
                          className="px-2 py-1 bg-[#E8F7F2] text-[#37B294] rounded-md hover:bg-[#4CC9A7] hover:text-white transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3 inline mr-1" />
                          Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteInquiry(msg.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Admin Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#9CA3AF] hover:text-[#1F2A37] font-medium flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm cursor-pointer transition-all"
        >
          Save & Update Live
        </button>
      </div>
    </aside>
  );
};
