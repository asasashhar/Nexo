import React, { useRef, useState } from 'react';
import { WebsiteImage } from '../../types';
import {
  Upload,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  FileText,
  Star,
  Eye,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { processImageFile } from '../../lib/imageUtils';
import { usePortfolio } from '../../context/PortfolioContext';

interface WebsiteImagesManagerProps {
  images: WebsiteImage[];
  onChange: (images: WebsiteImage[]) => void;
  onSetAsCover?: (url: string) => void;
  currentCoverUrl?: string;
}

export const WebsiteImagesManager: React.FC<WebsiteImagesManagerProps> = ({
  images,
  onChange,
  onSetAsCover,
  currentCoverUrl,
}) => {
  const { addMedia } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const handleFilesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const newItems: WebsiteImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const processed = await processImageFile(file);

        // Derive friendly title from filename: e.g. "homepage_hero.png" -> "Homepage Hero"
        const friendlyName = processed.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        // Guess device type based on filename or dimensions
        let device: WebsiteImage['deviceType'] = 'desktop';
        const lowerName = processed.name.toLowerCase();
        if (lowerName.includes('mobile') || lowerName.includes('phone') || processed.height > processed.width * 1.5) {
          device = 'mobile';
        } else if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
          device = 'tablet';
        } else if (lowerName.includes('full') || lowerName.includes('landing')) {
          device = 'full';
        }

        newItems.push({
          id: `web-img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          url: processed.dataUrl,
          title: friendlyName || `Website Screen ${images.length + newItems.length + 1}`,
          deviceType: device,
          caption: '',
        });

        // Register into media library
        addMedia({
          id: `media-${Date.now()}-${i}`,
          name: processed.name,
          url: processed.dataUrl,
          size: processed.sizeFormatted,
          type: processed.type,
          uploadedAt: new Date().toISOString().slice(0, 10),
          usageCount: 1,
        });
      } catch (err) {
        console.error('Failed to process image:', file.name, err);
      }
    }

    if (newItems.length > 0) {
      const updated = [...images, ...newItems];
      onChange(updated);

      // If project has no cover image yet, automatically set the first uploaded website image as cover!
      if (!currentCoverUrl && onSetAsCover && newItems[0]) {
        onSetAsCover(newItems[0].url);
      }
    }

    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteItem = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    onChange(updated);
  };

  const handleUpdateItem = (id: string, partial: Partial<WebsiteImage>) => {
    const updated = images.map((img) => (img.id === id ? { ...img, ...partial } : img));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const item = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = item;
    onChange(copy);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFilesSelect(e.dataTransfer.files);
  };

  const deviceIcons = {
    desktop: <Monitor className="w-3.5 h-3.5 text-[#00E599]" />,
    mobile: <Smartphone className="w-3.5 h-3.5 text-[#06B6D4]" />,
    tablet: <Tablet className="w-3.5 h-3.5 text-[#FFB800]" />,
    full: <FileText className="w-3.5 h-3.5 text-[#A855F7]" />,
  };

  return (
    <div className="space-y-3 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#0D121D] p-3.5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00E599]" />
            <h4 className="text-xs font-bold text-white font-sans">
              Website Screens &amp; Multi-Device Views ({images.length})
            </h4>
            <span className="bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
              Screens &amp; Mockups
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload multiple pages and responsive screens (Homepage, Features, Dashboard, Mobile View, etc.).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Hidden multi-file input */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFilesSelect(e.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Upload className={`w-3.5 h-3.5 ${isProcessing ? 'animate-bounce' : ''}`} />
            <span>{isProcessing ? 'Uploading...' : 'Upload Website Images'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
          isDragging
            ? 'border-[#00E599] bg-[#00E599]/10 scale-[1.01]'
            : 'border-slate-700 bg-[#080B11] hover:border-[#00E599] hover:bg-[#0D121D]'
        }`}
      >
        <div className="w-9 h-9 rounded-xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center border border-[#00E599]/30">
          <Plus className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-white">
            Click or drag &amp; drop to add different images of the website
          </p>
          <p className="text-[11px] text-slate-400">
            Select single or multiple screenshots (PNG, JPG, WebP)
          </p>
        </div>
      </div>

      {/* Uploaded Images List */}
      {images.length > 0 ? (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {images.map((item, index) => {
            const isCover = currentCoverUrl === item.url;

            return (
              <div
                key={item.id}
                className={`bg-[#0F1522] rounded-2xl p-3 border transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                  isCover ? 'border-[#00E599] ring-1 ring-[#00E599]/30 bg-[#0F1A28]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Reorder Up/Down */}
                <div className="hidden sm:flex flex-col items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:text-[#00E599] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 hover:text-[#00E599] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail Preview */}
                <div
                  onClick={() => setPreviewModalUrl(item.url)}
                  className="w-24 h-16 rounded-xl overflow-hidden bg-[#080B11] border border-slate-700 flex-shrink-0 relative group cursor-pointer"
                  title="Click to view full preview"
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-4 h-4 text-[#00E599]" />
                  </div>
                  {isCover && (
                    <div className="absolute top-1 left-1 bg-[#00E599] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Cover</span>
                    </div>
                  )}
                </div>

                {/* Inputs: Title, Device Type, Caption */}
                <div className="flex-1 w-full space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Screen Title */}
                    <div className="sm:col-span-8">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Screen Name / Section
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                        placeholder="e.g. Homepage Hero, Pricing Table, Dashboard"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#080B11] text-white outline-none focus:border-[#00E599]"
                      />
                    </div>

                    {/* Device Selector */}
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Device Type
                      </label>
                      <div className="relative">
                        <select
                          value={item.deviceType || 'desktop'}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              deviceType: e.target.value as WebsiteImage['deviceType'],
                            })
                          }
                          className="w-full text-xs pl-7 pr-2 py-1.5 rounded-lg border border-slate-700 bg-[#080B11] text-white outline-none focus:border-[#00E599]"
                        >
                          <option value="desktop">💻 Desktop</option>
                          <option value="mobile">📱 Mobile View</option>
                          <option value="tablet">📲 Tablet View</option>
                          <option value="full">📄 Full Page</option>
                        </select>
                        <div className="absolute left-2 top-2 pointer-events-none">
                          {deviceIcons[item.deviceType || 'desktop']}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <input
                      type="text"
                      value={item.caption || ''}
                      onChange={(e) => handleUpdateItem(item.id, { caption: e.target.value })}
                      placeholder="Optional caption or note (e.g. 'Checkout funnel with 1-click Apple Pay')"
                      className="w-full text-[11px] px-2.5 py-1 rounded-lg border border-slate-800 bg-[#080B11] text-slate-300 outline-none focus:border-[#00E599]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-1.5 self-end sm:self-center">
                  {onSetAsCover && (
                    <button
                      type="button"
                      onClick={() => onSetAsCover(item.url)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                        isCover
                          ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={isCover ? 'Currently set as primary cover' : 'Set as project cover image'}
                    >
                      <Star className={`w-3 h-3 ${isCover ? 'fill-[#00E599] text-[#00E599]' : ''}`} />
                      <span>{isCover ? 'Primary Cover' : 'Set as Cover'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Remove this website image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#080B11] border border-dashed border-slate-800 text-center text-xs text-slate-500">
          No website images added yet. Click &quot;Upload Website Images&quot; above to add desktop, mobile, and feature screenshots!
        </div>
      )}

      {/* Lightbox Modal for Full Preview */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#0F1522] rounded-3xl p-4 shadow-2xl border border-slate-700 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Website Screen Preview</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto flex-1 p-2 flex items-center justify-center">
              <img
                src={previewModalUrl}
                alt="Enlarged screen"
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
