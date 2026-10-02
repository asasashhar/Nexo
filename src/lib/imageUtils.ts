export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface ProcessedImage {
  dataUrl: string;
  sizeFormatted: string;
  name: string;
  width: number;
  height: number;
  type: string;
}

/**
 * Reads any user-selected image file from device, resizes down if excessively large
 * to protect localStorage and performance, and returns dataUrl and metadata.
 */
export function processImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.86
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // Preserve animated GIFs and SVG vectors intact
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve({
          dataUrl: result,
          sizeFormatted: formatFileSize(file.size),
          name: file.name,
          width: 800,
          height: 600,
          type: file.type,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const origWidth = width;
        const origHeight = height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            sizeFormatted: formatFileSize(file.size),
            name: file.name,
            width: origWidth,
            height: origHeight,
            type: file.type || 'image/png',
          });
          return;
        }

        // Draw with high smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let finalDataUrl = rawDataUrl;
        let mimeType = file.type || 'image/jpeg';

        try {
          if (file.type === 'image/png' && file.size < 500 * 1024 && width === origWidth) {
            // Keep original PNG if already small and not resized
            finalDataUrl = rawDataUrl;
          } else {
            // Encode to webp or jpeg
            const testWebp = canvas.toDataURL('image/webp', quality);
            if (testWebp.startsWith('data:image/webp')) {
              finalDataUrl = testWebp;
              mimeType = 'image/webp';
            } else {
              finalDataUrl = canvas.toDataURL('image/jpeg', quality);
              mimeType = 'image/jpeg';
            }
          }
        } catch {
          finalDataUrl = rawDataUrl;
        }

        const approxBytes = Math.round((finalDataUrl.length * 3) / 4);
        resolve({
          dataUrl: finalDataUrl,
          sizeFormatted: formatFileSize(approxBytes),
          name: file.name,
          width,
          height,
          type: mimeType,
        });
      };

      img.onerror = () => {
        resolve({
          dataUrl: rawDataUrl,
          sizeFormatted: formatFileSize(file.size),
          name: file.name,
          width: 0,
          height: 0,
          type: file.type || 'image/png',
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
