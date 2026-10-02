import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message = 'Are you sure you want to delete this item? This action cannot be undone and will permanently remove it from your portfolio and database.',
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 text-[#1F2A37] relative scale-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
              Confirm Deletion
            </span>
            <h3 className="text-base font-bold text-[#1F2A37] leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Explanation Message */}
        <div className="bg-red-50/60 rounded-2xl p-3.5 border border-red-100/80 mb-5 text-xs text-gray-700 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-bounce' : ''}`} />
            <span>{isDeleting ? 'Deleting...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
