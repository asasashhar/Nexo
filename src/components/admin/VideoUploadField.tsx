import React, { useRef, useState } from 'react';
import { Upload, X, Film, RefreshCw, FolderOpen, Play, Check, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { processVideoFile } from '../../lib/videoUtils';

interface VideoUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  sublabel?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  label,
  value,
  onChange,
  sublabel,
  helperText = 'Supports MP4, WebM, MOV, OGG (Recommended: 9:16 or 16:9, up to 50MB)',
  required = false,
  className = '',
}) => {
  const { media, addMedia } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i)) {
      setUploadError('Please select a valid video file (MP4, WebM, MOV, or OGG).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    try {
      const processed = await processVideoFile(file);
      onChange(processed.dataUrl);

      // Register into Media Library
      addMedia({
        id: `media-video-${Date.now()}`,
        name: processed.name,
        url: processed.dataUrl,
        size: processed.sizeFormatted,
        type: processed.type,
        uploadedAt: new Date().toISOString().slice(0, 10),
        usageCount: 1,
      });
    } catch (err: any) {
      console.error('Video upload failed:', err);
      setUploadError(err.message || 'Failed to process video. Please try another file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    handleFileSelect(e.dataTransfer.files);
  };

  const handleApplyFallbackUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (fallbackUrl.trim()) {
      onChange(fallbackUrl.trim());
      setFallbackUrl('');
      setShowUrlFallback(false);
    }
  };

  // Filter video media assets
  const videoMediaAssets = media.filter(
    (m) =>
      m.type?.startsWith('video/') ||
      m.name?.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i) ||
      m.url?.startsWith('data:video') ||
      m.url?.match(/\.(mp4|webm|mov|ogg)/i)
  );

  return (
    <div className={`space-y-2 text-white ${className}`}>
      {/* Label Bar */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-200">
            {label} {required && <span className="text-[#FF5A36]">*</span>}
          </label>
          {sublabel && <span className="text-[11px] text-slate-400 ml-1.5">{sublabel}</span>}
        </div>

        <div className="flex items-center gap-3">
          {videoMediaAssets.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMediaPicker(!showMediaPicker)}
              className="text-[11px] text-[#00E599] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Media Library ({videoMediaAssets.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowUrlFallback(!showUrlFallback)}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <span>{showUrlFallback ? 'Hide Link' : 'Paste Video URL'}</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,video/webm,video/quicktime,video/ogg,video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Main Container */}
      {value ? (
        /* Video Preview Card */
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black shadow-md group">
          <video
            src={value}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-72 object-contain mx-auto"
          />

          {/* Top Badges & Actions */}
          <div className="p-2.5 bg-[#0D121D] border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#00E599] font-medium truncate">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Video ad asset loaded</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00E599]/15 text-[#00E599] hover:bg-[#00E599]/25 font-semibold text-[11px] transition-colors cursor-pointer border border-[#00E599]/30"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Replace Video</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Box */
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
          {isProcessing ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#00E599] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-white">Processing video upload...</p>
              <p className="text-[11px] text-slate-400">Encoding preview and metadata...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 flex items-center justify-center shadow-xs">
                <Film className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Upload Video Ad file from your device
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>

              {/* Upload Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Video File</span>
                </button>

                {videoMediaAssets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Media Library ({videoMediaAssets.length})</span>
                  </button>
                )}
              </div>

              {/* Optional URL input fallback */}
              {showUrlFallback && (
                <form
                  onSubmit={handleApplyFallbackUrl}
                  className="mt-3 flex items-center gap-2 max-w-md w-full mx-auto"
                >
                  <input
                    type="url"
                    value={fallbackUrl}
                    onChange={(e) => setFallbackUrl(e.target.value)}
                    placeholder="https://.../video.mp4"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-700 text-xs outline-none focus:border-[#00E599] bg-[#0F1522] text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#00E599] text-black text-xs font-bold hover:bg-[#00B377] cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-800/60">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-700 max-h-[85vh] flex flex-col text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold text-white">
                  Select Video from Media Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1">
              {videoMediaAssets.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Film className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No video assets in library yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a video using the "Choose Video File" button above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videoMediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onChange(asset.url);
                        setShowMediaPicker(false);
                      }}
                      className="group border border-slate-800 hover:border-[#00E599] rounded-2xl p-3 cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between bg-[#080B11]"
                    >
                      <div className="h-32 bg-black rounded-xl overflow-hidden relative flex items-center justify-center mb-2">
                        <video
                          src={asset.url}
                          preload="metadata"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="w-9 h-9 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="truncate font-semibold text-white" title={asset.name}>
                          {asset.name}
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{asset.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
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
