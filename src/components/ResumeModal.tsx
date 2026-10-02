import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Download, Printer, Briefcase, GraduationCap, Award, Layers } from 'lucide-react';
import { NexoLogo } from './NexoLogo';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadFeedback: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onDownloadFeedback,
}) => {
  const { profile } = usePortfolio();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    onDownloadFeedback();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative border border-[#DCDAD2] max-h-[92vh] overflow-y-auto">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2D9A7A] bg-[#E8F7F2] px-3 py-1 rounded-full uppercase tracking-wider">
              Studio Capabilities Deck
            </span>
            <span className="text-xs text-[#8C9793]">v4.2 • Updated {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="p-2 text-gray-500 hover:text-[#111615] rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Sheet */}
        <div className="space-y-6 text-[#111615]">
          {/* Header */}
          <div className="border-b border-gray-100 pb-5">
            <div className="mb-2">
              <NexoLogo size="md" showTagline={true} />
            </div>
            <p className="text-xs text-[#5A6561] mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span>📍 {profile.location}</span>
              <span>✉️ {profile.email}</span>
              <span>📞 {profile.phone}</span>
              <span>🌐 {profile.name.toLowerCase()}.design</span>
            </p>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold text-[#8C9793] uppercase tracking-wider mb-2">
              Studio Profile &amp; Mission
            </h4>
            <p className="text-xs text-[#5A6561] leading-relaxed">{profile.aboutBio}</p>
          </div>

          {/* Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-[#8C9793] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#4CC9A7]" />
              <span>Engineering &amp; Design Practice</span>
            </h4>

            <div className="space-y-4">
              <div className="border-l-2 border-[#4CC9A7] pl-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <h5 className="font-bold text-[#111615]">High-Velocity Product Sprints</h5>
                  <span className="text-[#8C9793] font-mono">2022 – Present</span>
                </div>
                <p className="text-[11px] font-semibold text-[#2D9A7A]">
                  Specialized in SaaS, Fintech &amp; AI Systems
                </p>
                <p className="text-xs text-[#5A6561] leading-relaxed">
                  Embedding with series-A through scale-up engineering teams to launch revenue-generating web platforms and tactile interfaces.
                </p>
              </div>

              <div className="border-l-2 border-[#D8F2E9] pl-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <h5 className="font-bold text-[#111615]">Design Token Pipeline Architecture</h5>
                  <span className="text-[#8C9793] font-mono">Continuous</span>
                </div>
                <p className="text-[11px] font-semibold text-[#5A6561]">Enterprise Systems</p>
                <p className="text-xs text-[#5A6561] leading-relaxed">
                  Automating multi-brand design tokens from Figma directly into React, Tailwind, and native mobile components.
                </p>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h4 className="text-xs font-bold text-[#8C9793] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#4CC9A7]" />
              <span>Technical &amp; Creative Tooling</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Figma & Token Pipeline',
                'React & TypeScript',
                'Tailwind CSS',
                'WebGL & Canvas Charts',
                'Design Systems',
                'Conversion Funnel Optimization',
                'A/B Testing Infrastructure',
                'Interactive Prototypes',
              ].map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#FAF9F6] border border-[#EAE8E1] text-[#111615] px-3 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
