import React, { useRef, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MediaAsset } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Image as ImageIcon,
  Film,
  Plus,
  Link as LinkIcon,
  Play,
  X,
  ExternalLink,
} from 'lucide-react';
import { processImageFile } from '../../lib/imageUtils';
import { processVideoFile } from '../../lib/videoUtils';

interface MediaModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const MediaModule: React.FC<MediaModuleProps> = ({ onShowToast }) => {
  const { media, addMedia, deleteMedia } = usePortfolio();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos'>('all');

  // Manual URL modal/form toggle
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Modal for Image/Video
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

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

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMedia(deleteConfirmation.id);
      onShowToast('Deleted', `"${deleteConfirmation.title}" was removed.`);
    } catch (e) {
      console.error('Delete media error:', e);
      onShowToast('Delete Error', 'Failed to delete asset.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    let imageCount = 0;
    let videoCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo =
        file.type.startsWith('video/') ||
        file.name.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i);
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) continue;

      try {
        if (isVideo) {
          const processed = await processVideoFile(file);
          addMedia({
            id: `media-video-${Date.now()}-${i}`,
            name: processed.name,
            url: processed.dataUrl,
            size: processed.sizeFormatted,
            type: processed.type,
            uploadedAt: new Date().toISOString().slice(0, 10),
            usageCount: 1,
          });
          videoCount++;
        } else {
          const processed = await processImageFile(file);
          addMedia({
            id: `media-image-${Date.now()}-${i}`,
            name: processed.name,
            url: processed.dataUrl,
            size: processed.sizeFormatted,
            type: processed.type,
            uploadedAt: new Date().toISOString().slice(0, 10),
            usageCount: 1,
          });
          imageCount++;
        }
      } catch (err: any) {
        console.error('Failed to process media file:', file.name, err);
        onShowToast('Upload Notice', `Could not upload "${file.name}": ${err.message || 'Error'}`);
      }
    }

    setIsUploading(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';

    const totalUploaded = imageCount + videoCount;
    if (totalUploaded > 0) {
      const summaryParts = [];
      if (imageCount > 0) summaryParts.push(`${imageCount} image${imageCount > 1 ? 's' : ''}`);
      if (videoCount > 0) summaryParts.push(`${videoCount} video${videoCount > 1 ? 's' : ''}`);
      onShowToast('Upload Successful', `${summaryParts.join(' and ')} added to media library.`);
    }
  };

  const handleAddMediaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const isVideo = newType === 'video' || newUrl.match(/\.(mp4|webm|mov|ogg)/i);
    const fileName =
      newName.trim() ||
      (isVideo ? `video_asset_${Date.now()}.mp4` : `asset_${Date.now()}.png`);

    addMedia({
      id: `media-${Date.now()}`,
      name: fileName,
      url: newUrl.trim(),
      size: isVideo ? '2.4 MB' : '640 KB',
      type: isVideo ? 'video/mp4' : 'image/png',
      uploadedAt: new Date().toISOString().slice(0, 10),
      usageCount: 1,
    });

    setNewName('');
    setNewUrl('');
    setShowUrlForm(false);
    onShowToast('Asset Added', `"${fileName}" is now available in the media library.`);
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onShowToast('URL Copied', 'Asset link / data copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isVideoAsset = (item: MediaAsset) => {
    return (
      item.type?.startsWith('video/') ||
      item.name?.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i) ||
      item.url?.startsWith('data:video') ||
      item.url?.match(/\.(mp4|webm|mov|ogg)/i)
    );
  };

  const videoAssetsCount = media.filter(isVideoAsset).length;
  const imageAssetsCount = media.length - videoAssetsCount;

  const filteredMedia = media.filter((item) => {
    if (activeFilter === 'images') return !isVideoAsset(item);
    if (activeFilter === 'videos') return isVideoAsset(item);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37]">Media Library ({media.length})</h2>
          <p className="text-xs text-[#6B7280]">
            Upload images, website screens, and video ad files directly from your computer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden Image Input */}
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFilesUpload(e.target.files)}
          />

          {/* Hidden Video Input */}
          <input
            type="file"
            ref={videoInputRef}
            multiple
            accept="video/mp4,video/webm,video/quicktime,video/ogg,video/*"
            className="hidden"
            onChange={(e) => handleFilesUpload(e.target.files)}
          />

          {/* Upload Image Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Images</span>
          </button>

          {/* Upload Video Button */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95"
          >
            <Film className="w-4 h-4" />
            <span>Upload Video</span>
          </button>

          {/* Add by URL */}
          <button
            type="button"
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-[#1F2A37] hover:bg-gray-50 text-xs font-medium px-3.5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
            <span>{showUrlForm ? 'Hide Form' : 'Add by URL'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#1F2A37] text-white'
              : 'text-[#6B7280] hover:text-[#1F2A37] bg-gray-100'
          }`}
        >
          All Assets ({media.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('images')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'images'
              ? 'bg-[#4CC9A7] text-white'
              : 'text-[#6B7280] hover:text-[#1F2A37] bg-gray-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images ({imageAssetsCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('videos')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'videos'
              ? 'bg-[#F2685F] text-white'
              : 'text-[#6B7280] hover:text-[#1F2A37] bg-gray-100'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Videos ({videoAssetsCount})</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-[#4CC9A7] bg-[#E8F7F2]/60 scale-[1.01]'
            : 'border-gray-200 bg-white hover:border-[#4CC9A7] hover:bg-[#F7FCFA]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F7F2] text-[#37B294] flex items-center justify-center shadow-xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FDECEA] text-[#F2685F] flex items-center justify-center shadow-xs">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-[#1F2A37]">
            {isUploading
              ? 'Uploading and processing selected media files...'
              : 'Drag & Drop Any Image or Video File Here'}
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
            Accepts PNG, JPG, WebP, SVG, GIF, MP4, WebM, MOV files from your device
          </p>
        </div>

        {/* Quick Click-to-Upload Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="text-xs font-semibold text-[#4CC9A7] hover:underline cursor-pointer"
          >
            Browse Images
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="text-xs font-semibold text-[#F2685F] hover:underline cursor-pointer"
          >
            Browse Videos
          </button>
        </div>
      </div>

      {/* Optional Manual URL Form */}
      {showUrlForm && (
        <form
          onSubmit={handleAddMediaUrl}
          className="bg-white p-5 rounded-3xl border border-[#E8F7F2] shadow-xs flex flex-col sm:flex-row items-center gap-3 text-xs animate-in fade-in duration-150"
        >
          <div className="w-full sm:w-1/4">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-semibold"
            >
              <option value="image">Image Asset</option>
              <option value="video">Video Asset (.mp4)</option>
            </select>
          </div>
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Asset title (e.g. promo_video.mp4)"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
            />
          </div>
          <div className="w-full sm:flex-1">
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL (https://... or data:...)"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white font-semibold px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Library</span>
          </button>
        </form>
      )}

      {/* Grid of Media Assets */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-sm font-semibold text-[#1F2A37]">No media found in this filter</p>
          <p className="text-xs text-[#6B7280] mt-1">
            Upload images or videos using the upload buttons above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => {
            const isVideo = isVideoAsset(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8F7F2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Preview Box */}
                <div
                  onClick={() => setPreviewAsset(item)}
                  className="h-44 bg-[#F7FCFA] flex items-center justify-center overflow-hidden border-b border-gray-100 relative cursor-pointer"
                >
                  {isVideo ? (
                    <div className="w-full h-full bg-black relative flex items-center justify-center">
                      <video
                        src={item.url}
                        preload="metadata"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <div className="w-11 h-11 rounded-full bg-[#F2685F] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        <Film className="w-3 h-3 text-[#F2685F]" />
                        <span>Video Asset</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full p-3 flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain rounded-xl transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Info and Actions */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2A37] truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-[#9CA3AF]">
                    <span>Added: {item.uploadedAt}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#4CC9A7] hover:bg-[#E8F7F2] transition-colors cursor-pointer"
                        title="View Asset Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.id, item.url)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#4CC9A7] hover:bg-[#E8F7F2] transition-colors cursor-pointer"
                        title="Copy Asset URL / Data"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmation({
                            isOpen: true,
                            id: item.id,
                            title: item.name,
                          });
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN ASSET PREVIEW MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 truncate">
                {isVideoAsset(previewAsset) ? (
                  <Film className="w-5 h-5 text-[#F2685F] flex-shrink-0" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#4CC9A7] flex-shrink-0" />
                )}
                <h3 className="text-sm font-bold text-[#1F2A37] truncate">{previewAsset.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 flex-1 flex items-center justify-center overflow-hidden bg-black rounded-2xl my-2">
              {isVideoAsset(previewAsset) ? (
                <video
                  src={previewAsset.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] max-w-full object-contain mx-auto"
                />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="max-h-[60vh] max-w-full object-contain mx-auto"
                />
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Size: {previewAsset.size}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset.id, previewAsset.url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1F2A37] font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="px-4 py-1.5 rounded-full bg-[#1F2A37] hover:bg-black text-white font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title={`Delete Media Asset "${deleteConfirmation.title}"?`}
        message="This will remove this asset from your Media Library. If any live projects or pages reference this media, ensure you replace their preview source."
        confirmLabel="Delete Asset"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
