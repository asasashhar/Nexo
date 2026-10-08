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
  Layers,
  Sparkles,
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
      onShowToast('Asset Removed', `"${deleteConfirmation.title}" deleted from media library.`);
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
      onShowToast('Upload Successful', `${summaryParts.join(' and ')} stored in media library.`);
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
      size: 'Remote URL',
      type: isVideo ? 'video/mp4' : 'image/png',
      uploadedAt: new Date().toISOString().slice(0, 10),
      usageCount: 1,
    });

    onShowToast('Media Registered', `"${fileName}" linked to media assets.`);
    setNewName('');
    setNewUrl('');
    setShowUrlForm(false);
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onShowToast('Copied to Clipboard', 'Asset URL ready to paste.');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const isVideoAsset = (item: MediaAsset) => {
    return (
      item.type?.startsWith('video/') ||
      item.name?.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i) ||
      item.url?.startsWith('data:video') ||
      item.url?.match(/\.(mp4|webm|mov|ogg)/i)
    );
  };

  // Filtered Assets
  const filteredMedia = media.filter((item) => {
    if (activeFilter === 'all') return true;
    const isVideo = isVideoAsset(item);
    if (activeFilter === 'videos') return isVideo;
    if (activeFilter === 'images') return !isVideo;
    return true;
  });

  const imageAssetsCount = media.filter((m) => !isVideoAsset(m)).length;
  const videoAssetsCount = media.filter((m) => isVideoAsset(m)).length;

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <span>Media Assets &amp; Vault</span>
            <span className="text-xs bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold px-3 py-0.5 rounded-full font-mono">
              {media.length} Total ({imageAssetsCount} Images · {videoAssetsCount} Videos)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store and manage posters, high-res mockups, motion video ads, and brand imagery.
          </p>
        </div>

        {/* Upload Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
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
            className="inline-flex items-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Images</span>
          </button>

          {/* Upload Video Button */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-[#FF5A36] hover:bg-[#E04B28] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Upload Video</span>
          </button>

          {/* Add by URL */}
          <button
            type="button"
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="inline-flex items-center gap-1.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlForm ? 'Hide URL Form' : 'Add by URL'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#00E599] text-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Assets ({media.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('images')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'images'
              ? 'bg-[#00E599] text-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images ({imageAssetsCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('videos')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'videos'
              ? 'bg-[#FF5A36] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            ? 'border-[#00E599] bg-[#00E599]/10 scale-[1.01]'
            : 'border-slate-800 bg-[#0F1522] hover:border-[#00E599]/60 hover:bg-[#0D121D]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 flex items-center justify-center shadow-xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 flex items-center justify-center shadow-xs">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-white">
            {isUploading
              ? 'Uploading and processing selected media files...'
              : 'Drag & Drop Any Image or Video Asset Here'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Accepts PNG, JPG, WebP, SVG, GIF, MP4, WebM, MOV files from your device
          </p>
        </div>

        {/* Quick Click-to-Upload Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="text-xs font-semibold text-[#00E599] hover:underline cursor-pointer"
          >
            Browse Images
          </button>
          <span className="text-slate-600">•</span>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="text-xs font-semibold text-[#FF5A36] hover:underline cursor-pointer"
          >
            Browse Videos
          </button>
        </div>
      </div>

      {/* Optional Manual URL Form */}
      {showUrlForm && (
        <form
          onSubmit={handleAddMediaUrl}
          className="bg-[#0F1522] p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-3 text-xs animate-in fade-in duration-150"
        >
          <div className="w-full sm:w-1/4">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
              className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
            >
              <option value="image">Image Format</option>
              <option value="video">Video Format</option>
            </select>
          </div>
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Asset Label (optional)"
              className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
            />
          </div>
          <div className="w-full sm:flex-1">
            <input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Direct URL (https://... or data:...)"
              className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold px-5 py-2 rounded-full transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Vault</span>
          </button>
        </form>
      )}

      {/* Grid of Media Assets */}
      {filteredMedia.length === 0 ? (
        <div className="bg-[#0F1522] rounded-3xl p-12 text-center border border-slate-800">
          <p className="text-sm font-semibold text-white">No media found in this filter</p>
          <p className="text-xs text-slate-400 mt-1">
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
                className="bg-[#0F1522] rounded-3xl overflow-hidden border border-slate-800 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                {/* Preview Box */}
                <div
                  onClick={() => setPreviewAsset(item)}
                  className="h-44 bg-[#080B11] flex items-center justify-center overflow-hidden border-b border-slate-800 relative cursor-pointer"
                >
                  {isVideo ? (
                    <div className="w-full h-full bg-black relative flex items-center justify-center">
                      <video
                        src={item.url}
                        preload="metadata"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <div className="w-11 h-11 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        <Film className="w-3 h-3 text-[#FF5A36]" />
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
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-[#080B11] px-2 py-0.5 rounded-full border border-slate-800 font-mono">
                      {item.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-mono">Added: {item.uploadedAt}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Asset Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.id, item.url)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#00E599] hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy Asset URL / Data"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-[#00E599]" />
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-700 flex flex-col max-h-[90vh] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 truncate">
                {isVideoAsset(previewAsset) ? (
                  <Film className="w-5 h-5 text-[#FF5A36] flex-shrink-0" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#00E599] flex-shrink-0" />
                )}
                <h3 className="text-sm font-bold text-white truncate">{previewAsset.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 flex-1 flex items-center justify-center overflow-hidden bg-black rounded-2xl my-2 border border-slate-800">
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

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Size: {previewAsset.size}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset.id, previewAsset.url)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 hover:bg-[#00E599]/25 font-bold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="px-5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
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
