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
    <div className={`space-y-2 ${className}`}>
      {/* Label Bar */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
          {label} {required && <span className="text-[#F2685F]">*</span>}
        </label>
        {sublabel && <span className="text-[11px] text-[#6B7280]">{sublabel}</span>}
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
        <div className="relative rounded-2xl overflow-hidden border border-[#D8F2E9] bg-black shadow-sm group">
          <video
            src={value}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-64 object-contain mx-auto"
          />

          {/* Top Badges & Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Film className="w-3 h-3 text-[#4CC9A7]" />
              <span>Video Ad Ready</span>
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="bg-black/75 hover:bg-black text-white p-2 rounded-xl backdrop-blur-xs transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-sm"
                title="Replace video"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Replace</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="bg-black/75 hover:bg-[#F2685F] text-white p-2 rounded-xl backdrop-blur-xs transition-colors cursor-pointer shadow-sm"
                title="Remove video"
              >
                <X className="w-3.5 h-3.5" />
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
          className={`relative rounded-2xl border-2 border-dashed transition-all p-6 text-center ${
            isDragging
              ? 'border-[#4CC9A7] bg-[#E8F7F2]/40 scale-[0.99]'
              : 'border-[#D8F2E9] hover:border-[#4CC9A7]/60 bg-[#F7FCFA]'
          }`}
        >
          {isProcessing ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#4CC9A7] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-[#1F2A37]">Processing video upload...</p>
              <p className="text-[11px] text-[#6B7280]">Encoding preview and metadata...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                <Film className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#1F2A37]">
                  Upload Video Ad file from your computer
                </p>
                <p className="text-[11px] text-[#6B7280] mt-1">{helperText}</p>
              </div>

              {/* Upload Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Video File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1F2A37] text-xs font-medium transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <span>Media Library ({videoMediaAssets.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlFallback(!showUrlFallback)}
                  className="text-[11px] text-[#6B7280] hover:text-[#1F2A37] underline px-2 py-1 cursor-pointer"
                >
                  {showUrlFallback ? 'Cancel link' : 'Or paste link'}
                </button>
              </div>

              {/* Optional URL input fallback if user specifically prefers external URL */}
              {showUrlFallback && (
                <form
                  onSubmit={handleApplyFallbackUrl}
                  className="mt-3 flex items-center gap-2 max-w-md mx-auto animate-in fade-in"
                >
                  <input
                    type="url"
                    value={fallbackUrl}
                    onChange={(e) => setFallbackUrl(e.target.value)}
                    placeholder="https://.../video.mp4"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-[#4CC9A7] bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#1F2A37] hover:bg-black text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#4CC9A7]" />
                <h3 className="text-base font-bold text-[#1F2A37]">
                  Select Video from Media Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1">
              {videoMediaAssets.length === 0 ? (
                <div className="text-center py-12 text-[#6B7280]">
                  <Film className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No video assets in library yet</p>
                  <p className="text-xs text-gray-400 mt-1">
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
                      className="group border border-gray-200 hover:border-[#4CC9A7] rounded-2xl p-3 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between bg-[#F7FCFA]"
                    >
                      <div className="h-32 bg-black rounded-xl overflow-hidden relative flex items-center justify-center mb-2">
                        <video
                          src={asset.url}
                          preload="metadata"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="w-9 h-9 rounded-full bg-[#4CC9A7] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="truncate font-semibold text-[#1F2A37]" title={asset.name}>
                          {asset.name}
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{asset.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
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
