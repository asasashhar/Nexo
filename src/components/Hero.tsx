import React, { useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Users,
  Globe,
  Camera,
  Upload,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { processImageFile } from '../lib/imageUtils';

interface HeroProps {
  onStartProject?: () => void;
  onSeeProcess?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject }) => {
  const { profile, isAdminLoggedIn, updateHeroImage, media, addMedia } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setIsUploading(true);
    try {
      const processed = await processImageFile(file, 1600, 1600, 0.92);
      updateHeroImage(processed.dataUrl);

      // Add to media library so it is saved
      addMedia({
        id: `media-hero-${Date.now()}`,
        name: processed.name,
        url: processed.dataUrl,
        size: processed.sizeFormatted,
        type: processed.type,
        uploadedAt: new Date().toISOString().slice(0, 10),
        usageCount: 1,
      });

      setShowPickerModal(false);
      showNotification('Hero visual updated successfully!');
    } catch (e) {
      console.error('Failed to update hero image:', e);
      showNotification('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectMedia = (url: string) => {
    updateHeroImage(url);
    setShowPickerModal(false);
    showNotification('Hero image changed!');
  };

  const handleResetDefault = () => {
    updateHeroImage('/nexo-studio-team.jpg');
    setShowPickerModal(false);
    showNotification('Hero image reset to studio default!');
  };

  const imageMediaAssets = media.filter(
    (m) =>
      !m.type?.startsWith('video/') &&
      !m.url?.startsWith('data:video') &&
      !m.name?.match(/\.(mp4|webm|mov|ogg)$/i)
  );

  return (
    <section
      id="home"
      className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#080B11]"
    >
      {/* Ambient background glow mesh matching poster */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#00E599]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00E599]/30 to-transparent" />

      {/* Temporary Floating Toast for Image Change */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#0F1522] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#00E599]/40 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#00E599]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Direct Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Details (Left Column) - Directly Matching the NEXO Poster */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Kicker Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Creative Solutions For A Stronger Tomorrow</span>
            </div>

            {/* Poster Signature Main Headline: YOUR VISION OUR CREATION */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-black tracking-tight font-sans leading-[1.05] mb-5">
              <span className="text-white block">YOUR VISION</span>
              <span className="bg-gradient-to-r from-[#00E599] via-[#2DD4BF] to-[#FF5A36] bg-clip-text text-transparent block">
                OUR CREATION
              </span>
            </h1>

            {/* Official Agency Description from Poster */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              <strong className="text-white font-semibold">NEXO</strong> is a creative digital studio that turns your ideas into stunning websites, designs and marketing solutions — all in{' '}
              <span className="text-[#00E599] font-medium underline decoration-[#00E599]/40 underline-offset-4">
                one place
              </span>
              .
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              {/* Direct Website Pill matching Poster (nexo.vercel.app ->) */}
              <a
                href="#services"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] border border-[#00E599]/50 hover:border-[#00E599] text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,229,153,0.15)] hover:shadow-[0_0_25px_rgba(0,229,153,0.3)] group cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#00E599]" />
                <span className="font-mono text-[#00E599]">nexo.vercel.app</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>

              {/* Start Project CTA */}
              <button
                type="button"
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-2 bg-[#FF5A36] hover:bg-[#E04220] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 shadow-[0_8px_25px_rgba(255,90,54,0.35)] hover:shadow-[0_10px_30px_rgba(255,90,54,0.5)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Key Trust Highlights from Poster */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-8 h-8 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-white text-sm">Fast</span>
                  <span className="text-slate-400 text-[11px]">Delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-8 h-8 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-white text-sm">High</span>
                  <span className="text-slate-400 text-[11px]">Quality</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-8 h-8 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-white text-sm">Client</span>
                  <span className="text-slate-400 text-[11px]">Satisfaction</span>
                </div>
              </div>

              {/* Hand-drawn arrow note */}
              <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-script text-base italic ml-auto">
                <span>Your All-in-One Creative Partner ➔</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Presentation (Right Column) - Featuring Real Studio Team */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient neon backdrop ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00E599]/20 via-transparent to-[#FF5A36]/20 rounded-3xl blur-2xl transform scale-95" />

            {/* Glowing Studio Image Container */}
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-[#0F1522] overflow-hidden flex items-center justify-center border-2 border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group transition-all duration-300 hover:border-[#00E599]/50 hover:shadow-[0_20px_60px_rgba(0,229,153,0.2)]">
              <img
                src={profile.heroImageUrl || '/nexo-studio-team.jpg'}
                alt="NEXO Creative Studio Team"
                className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/nexo-studio-team.jpg';
                }}
              />

              {/* Gentle bottom gradient for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/90 via-transparent to-black/20 pointer-events-none" />

              {/* Floating top badge: Nexo Creative Studio */}
              <div className="absolute top-4 left-4 bg-[#080B11]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 flex items-center gap-2 z-20">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
                <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                  Creative Studio
                </span>
              </div>

              {/* Quick Change Hero Image Button (Accessible when admin logged in) */}
              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => setShowPickerModal(true)}
                  className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs shadow-lg flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all cursor-pointer z-30 group-hover:scale-105 border border-[#00E599]/40"
                  title="Change Hero Section Image"
                >
                  <Camera className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>Change Photo</span>
                </button>
              )}

              {/* Floating Bottom Card: Team Motto */}
              <div className="absolute bottom-4 inset-x-4 bg-[#080B11]/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 z-20 text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white tracking-wide">NEXO DIGITAL STUDIO</span>
                  <span className="text-[#00E599] font-mono">ONLINE</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  Turning bold visions into unforgettable digital experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK HERO IMAGE CHANGER MODAL */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-700 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#00E599]" />
                <h3 className="text-base font-bold text-white">Change Hero Visual</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPickerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              {/* Device Upload Action */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#00E599]/30 bg-[#080B11] text-center space-y-2">
                <p className="text-xs font-bold text-white">Upload image from your device</p>
                <p className="text-[11px] text-slate-400">Supports PNG, JPG, WebP (Square 1:1 recommended)</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                </button>
              </div>

              {/* Media Library Assets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Select from Media Library ({imageMediaAssets.length})</span>
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="text-[11px] font-normal text-slate-400 hover:text-[#00E599] underline cursor-pointer"
                  >
                    Reset to Studio Team Photo
                  </button>
                </div>

                {imageMediaAssets.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No images in library yet</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                    {imageMediaAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => handleSelectMedia(asset.url)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md relative group ${
                          profile.heroImageUrl === asset.url
                            ? 'border-[#00E599] ring-2 ring-[#00E599]/30'
                            : 'border-slate-800 hover:border-[#00E599]'
                        }`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                        {profile.heroImageUrl === asset.url && (
                          <div className="absolute inset-0 bg-[#00E599]/30 flex items-center justify-center">
                            <Check className="w-5 h-5 text-black bg-[#00E599] rounded-full p-0.5 shadow-md" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPickerModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
