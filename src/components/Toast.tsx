import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message }) => {
  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-all duration-300 pointer-events-none flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-[0_12px_24px_-4px_rgba(31,42,55,0.08)] border border-[#D8F2E9] ${
        show
          ? 'translate-y-0 opacity-100'
          : '-translate-y-24 opacity-0'
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center font-bold text-sm">
        <Check className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#1F2A37]">{title}</h4>
        <p className="text-xs text-[#6B7280]">{message}</p>
      </div>
    </div>
  );
};
