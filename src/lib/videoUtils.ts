import { formatFileSize } from './imageUtils';

export interface ProcessedVideo {
  dataUrl: string;
  sizeFormatted: string;
  name: string;
  type: string;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Reads a video file from disk/device, calculates formatted size,
 * extracts duration/resolution if possible, and returns a playable data URL.
 */
export function processVideoFile(file: File): Promise<ProcessedVideo> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i)) {
      return reject(new Error('Invalid video format. Please select an MP4, WebM, MOV, or OGG video.'));
    }

    const sizeFormatted = formatFileSize(file.size);
    const fileName = file.name;
    const fileType = file.type || 'video/mp4';

    // 1. Read as data URL for persistence and immediate playback
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read video file from device.'));
    };

    reader.onload = () => {
      const dataUrl = reader.result as string;

      // 2. Extract metadata (duration, width, height) using temporary video element
      try {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        const objUrl = URL.createObjectURL(file);
        tempVideo.src = objUrl;

        let resolved = false;

        const cleanupAndResolve = (duration = 0, width = 0, height = 0) => {
          if (resolved) return;
          resolved = true;
          try {
            URL.revokeObjectURL(objUrl);
          } catch {
            // ignore
          }
          resolve({
            dataUrl,
            sizeFormatted,
            name: fileName,
            type: fileType,
            duration,
            width,
            height,
          });
        };

        tempVideo.onloadedmetadata = () => {
          cleanupAndResolve(
            Math.round(tempVideo.duration || 0),
            tempVideo.videoWidth || 0,
            tempVideo.videoHeight || 0
          );
        };

        tempVideo.onerror = () => {
          // If metadata fails (e.g. uncommon codec), still resolve with data URL
          cleanupAndResolve();
        };

        // Fallback timeout in case onloadedmetadata doesn't fire
        setTimeout(() => {
          cleanupAndResolve();
        }, 3000);
      } catch {
        resolve({
          dataUrl,
          sizeFormatted,
          name: fileName,
          type: fileType,
        });
      }
    };

    reader.readAsDataURL(file);
  });
}
