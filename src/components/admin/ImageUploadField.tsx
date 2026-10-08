import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, FolderOpen, Link as LinkIcon, Check } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { processImageFile } from '../../lib/imageUtils';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  sublabel?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  required?: boolean;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  sublabel,
  helperText = 'Supports PNG, JPG, WebP, GIF, SVG (up to 15MB)',
  aspectRatio = 'wide',
  required = false,
  className = '',
}) => {
  const { media, addMedia } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, SVG, GIF).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    try {
      const processed = await processImageFile(file);
      onChange(processed.dataUrl);

      // Register into Media Library so it's tracked
      addMedia({
        id: `media-${Date.now()}`,
        name: processed.name,
        url: processed.dataUrl,
        size: processed.sizeFormatted,
        type: processed.type,
        uploadedAt: new Date().toISOString().slice(0, 10),
        usageCount: 1,
      });
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process image. Try a smaller file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onChange(customUrl.trim());
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/7]'
      : 'min-h-[140px]';

  return (
    <div className={`space-y-2 text-white ${className}`}>
      {/* Label Bar */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-200">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          {sublabel && <span className="text-[11px] text-slate-400 ml-1.5">{sublabel}</span>}
        </div>

        <div className="flex items-center gap-3">
          {media.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMediaPicker(!showMediaPicker)}
              className="text-[11px] text-[#00E599] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Browse Media ({media.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide Link' : 'Paste Link'}</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Image Preview or Upload Button Zone */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#080B11] shadow-md group">
          <div className={`${aspectClass} w-full flex items-center justify-center p-2 bg-[#05070B]`}>
            <img
              src={value}
              alt="Preview"
              className="max-h-full max-w-full object-contain rounded-xl shadow-xs transition-transform group-hover:scale-[1.01]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).classList.add('opacity-40');
              }}
            />
          </div>

          {/* Quick Action Overlay Controls */}
          <div className="p-2.5 bg-[#0D121D] border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#00E599] font-medium truncate">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Visual asset selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00E599]/15 text-[#00E599] hover:bg-[#00E599]/25 font-semibold text-[11px] transition-colors cursor-pointer border border-[#00E599]/30"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Button Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-[#00E599] bg-[#00E599]/10 scale-[1.01]'
              : 'border-slate-700 bg-[#080B11] hover:border-[#00E599] hover:bg-[#0D121D]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 flex items-center justify-center shadow-xs">
            <Upload className={`w-6 h-6 ${isProcessing ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <p className="text-xs font-bold text-white">
              {isProcessing ? 'Processing image...' : 'Upload Image from Device'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Image File</span>
            </button>

            {media.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#00E599]" />
                <span>Pick Existing</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <p className="text-[11px] text-red-400 font-medium px-2">{uploadError}</p>
      )}

      {/* Optional Collapsible URL Input fallback */}
      {showUrlInput && (
        <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-1">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste external image link (https://...)"
            className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Apply
          </button>
        </form>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-700 max-h-[85vh] flex flex-col text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Select From Media Library</h4>
                <p className="text-[11px] text-slate-400">
                  Choose any image previously added to your portfolio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onChange(item.url);
                    setShowMediaPicker(false);
                  }}
                  className="group rounded-xl border border-slate-800 hover:border-[#00E599] overflow-hidden cursor-pointer p-1.5 bg-[#080B11] hover:shadow-md transition-all flex flex-col items-center"
                >
                  <div className="w-full h-24 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="max-h-full max-w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-200 truncate w-full text-center mt-1.5 px-1">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-slate-500">{item.size}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
