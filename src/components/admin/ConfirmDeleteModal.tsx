import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message = 'Are you sure you want to delete this item? This action cannot be undone and will permanently remove it from your portfolio and database.',
  confirmText,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  };

  const actionText = confirmText || confirmLabel;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) handleClose();
      }}
    >
      <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-900/60 text-white relative scale-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 border border-red-800/60 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider block">
              Confirm Deletion
            </span>
            <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Descriptive Body Copy */}
        <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-[#080B11] p-3.5 rounded-xl border border-slate-800">
          {message}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleClose}
            className="px-4 py-2 rounded-full border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-60 cursor-pointer active:scale-95"
          >
            {isDeleting && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isDeleting ? 'Removing...' : actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
