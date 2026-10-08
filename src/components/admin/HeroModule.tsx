import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioProfile } from '../../types';
import {
  Save,
  Sparkles,
  RotateCcw,
  Check,
  Camera,
  Upload,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface HeroModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const HeroModule: React.FC<HeroModuleProps> = ({ onShowToast }) => {
  const { profile, setProfile, updateHeroImage } = usePortfolio();
  const [formData, setFormData] = useState<PortfolioProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroImageChange = (newUrl: string) => {
    setFormData((prev) => ({ ...prev, heroImageUrl: newUrl }));
    updateHeroImage(newUrl);
    onShowToast('Hero Visual Updated', 'New hero image saved and active on live website.');
  };

  const handleResetDefaultImage = () => {
    handleHeroImageChange('/nexo-studio-team.jpg');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setSavedSuccess(true);
    onShowToast('Hero Section Saved', 'Hero copy and visual assets saved successfully.');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">Hero Section Editor</h2>
          <p className="text-xs text-slate-400">
            Customize primary headline, hero visual image, tagline, and action links.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer active:scale-95"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved to Database!' : 'Save All Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form (Left 7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          {/* 1. HERO VISUAL IMAGE CARD (PROMINENT AT THE TOP) */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center border border-[#00E599]/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hero Section Visual</h3>
                  <p className="text-[11px] text-slate-400">
                    High-res square artwork displayed prominently in the hero section
                  </p>
                </div>
              </div>

              {formData.heroImageUrl && formData.heroImageUrl !== '/nexo-studio-team.jpg' && (
                <button
                  type="button"
                  onClick={handleResetDefaultImage}
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#FF5A36] transition-colors cursor-pointer"
                >
                  Reset to Studio Default
                </button>
              )}
            </div>

            <ImageUploadField
              label="Hero Team Photo / Visual"
              sublabel="(Displayed in square frame on homepage)"
              value={formData.heroImageUrl || ''}
              onChange={handleHeroImageChange}
              helperText="Upload any team photo, 3D character, or project visual (Square 1:1, up to 15MB)"
              aspectRatio="square"
            />
          </div>

          {/* 2. IDENTITY & TYPOGRAPHY */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Identity &amp; Main Headline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand Suffix (Optional)
                </label>
                <input
                  type="text"
                  name="brandSuffix"
                  value={formData.brandSuffix || ''}
                  onChange={handleChange}
                  placeholder="Designs"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Greeting Callout
                </label>
                <input
                  type="text"
                  name="greetingText"
                  value={formData.greetingText || "Creative Solutions For A Stronger Tomorrow"}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role Title (Accent)
                </label>
                <input
                  type="text"
                  name="roleSubtitle"
                  value={formData.roleSubtitle}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hero Pitch Description *
              </label>
              <textarea
                rows={3}
                required
                name="heroPitch"
                value={formData.heroPitch}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* 3. ACTION CTAS & FLOATING BUBBLE */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Action CTAs &amp; Status Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  name="ctaPrimaryText"
                  value={formData.ctaPrimaryText}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary CTA Target Link
                </label>
                <input
                  type="text"
                  name="ctaPrimaryLink"
                  value={formData.ctaPrimaryLink}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Floating Speech Bubble Copy
              </label>
              <input
                type="text"
                name="speechBubbleText"
                value={formData.speechBubbleText}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
              />
            </div>
          </div>
        </form>

        {/* Live Visual Preview (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
              <span>Live Visual Staging</span>
            </h3>

            {/* Exact Hero Visual Presentation Staging */}
            <div className="relative bg-[#080B11] rounded-2xl p-6 flex items-center justify-center min-h-[380px] overflow-hidden border border-slate-800">
              {/* Square Container Preview */}
              <div className="relative w-64 h-64 aspect-square rounded-3xl bg-[#0F1522] overflow-hidden z-10 flex items-center justify-center border-2 border-slate-700 shadow-2xl">
                <img
                  src={formData.heroImageUrl || '/nexo-studio-team.jpg'}
                  alt={formData.name}
                  className="w-full h-full object-cover object-center select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/nexo-studio-team.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/90 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Bottom Floating Bubble */}
              <div className="absolute bottom-3 inset-x-4 bg-[#080B11]/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-700 z-20 text-left">
                <p className="text-[11px] font-semibold text-white leading-snug">
                  {(formData.speechBubbleText || 'Turning bold visions into unforgettable digital experiences.')}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#00E599]/10 rounded-xl text-xs text-[#00E599] font-medium flex items-center gap-2 border border-[#00E599]/20">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Uploads and changes apply live across the site and persist to Supabase.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
