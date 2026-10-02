import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioProfile } from '../../types';
import { Save, Star, Upload, Sparkles, RotateCcw } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface HeroModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const HeroModule: React.FC<HeroModuleProps> = ({ onShowToast }) => {
  const { profile, setProfile } = usePortfolio();
  const [formData, setFormData] = useState<PortfolioProfile>(profile);

  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    onShowToast('Hero Updated', 'Hero section details and image preview saved successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37]">Hero Section Editor</h2>
          <p className="text-xs text-[#6B7280]">
            Customize primary branding, headline, bio pitch, action buttons, and portrait image.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form (Left 7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1F2A37] border-b border-gray-100 pb-2">
              Identity & Typography
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Surname (Optional)
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="e.g. Khan"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Brand Suffix
                </label>
                <input
                  type="text"
                  name="brandSuffix"
                  value={formData.brandSuffix}
                  onChange={handleChange}
                  placeholder="Designs"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Greeting Callout (Script font)
                </label>
                <input
                  type="text"
                  name="greetingText"
                  value={formData.greetingText}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Role Title (Coral Accent)
                </label>
                <input
                  type="text"
                  name="roleSubtitle"
                  value={formData.roleSubtitle}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Hero Pitch Description *
              </label>
              <textarea
                rows={3}
                required
                name="heroPitch"
                value={formData.heroPitch}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none resize-none"
              />
            </div>
          </div>

          {/* Action CTAs & Badges */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1F2A37] border-b border-gray-100 pb-2">
              Action CTAs & Floating Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  name="ctaPrimaryText"
                  value={formData.ctaPrimaryText}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Primary CTA Target Link
                </label>
                <input
                  type="text"
                  name="ctaPrimaryLink"
                  value={formData.ctaPrimaryLink}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  name="ctaSecondaryText"
                  value={formData.ctaSecondaryText}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Resume Filename
                </label>
                <input
                  type="text"
                  name="resumeFileName"
                  value={formData.resumeFileName}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Experience Number
                </label>
                <input
                  type="text"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Speech Bubble Copy
                </label>
                <input
                  type="text"
                  name="speechBubbleText"
                  value={formData.speechBubbleText}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
                />
              </div>
            </div>

            <ImageUploadField
              label="Hero Portrait Photo"
              sublabel="(Shown on hero section)"
              value={formData.heroImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, heroImageUrl: url }))}
              helperText="Upload a crisp portrait photo directly from your device"
              aspectRatio="portrait"
            />
          </div>
        </form>

        {/* Live Visual Preview (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm">
            <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4CC9A7]" />
              <span>Live Visual Staging</span>
            </h3>

            {/* Simulated Hero Portrait with Blob */}
            <div className="relative bg-[#F7FCFA] rounded-2xl p-6 flex items-center justify-center min-h-[360px] overflow-hidden border border-[#D8F2E9]">
              {/* Square Container Preview */}
              <div className="relative w-52 h-52 aspect-square rounded-2xl bg-[#111615] overflow-hidden z-10 flex items-center justify-center border-2 border-white shadow-lg">
                <img
                  src={formData.heroImageUrl || '/nexo-studio-team.jpg'}
                  alt={formData.name}
                  className="w-full h-full object-cover object-center select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/nexo-studio-team.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Left Floating Bubble */}
              <div className="absolute -bottom-2 left-2 max-w-[190px] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-md border border-[#E8F7F2] z-20">
                <p className="text-[10px] font-medium text-[#1F2A37] leading-tight">
                  {(formData.speechBubbleText || 'We turn ideas into delightful user experiences').replace(
                    /^I turn ideas/i,
                    'We turn ideas'
                  )}{' '}
                  <span className="text-[#F2685F]">♡</span>
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#E8F7F2]/60 rounded-xl text-xs text-[#37B294] font-medium flex items-center gap-2">
              <span>✓ Changes reflect instantly on the public website when saved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
