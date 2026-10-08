import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProcessStep } from '../../types';
import { INITIAL_PROCESS_STEPS } from '../../data/initialData';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Heart,
  Zap,
  Lightbulb,
  Edit3,
  Monitor,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  X,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  Sparkles,
} from 'lucide-react';

interface ProcessModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const ProcessModule: React.FC<ProcessModuleProps> = ({ onShowToast }) => {
  const {
    profile,
    setProfile,
    processSteps,
    addProcessStep,
    updateProcessStep,
    deleteProcessStep,
    setProcessSteps,
  } = usePortfolio();

  // Header settings state
  const [procTitle, setProcTitle] = useState(profile.processTitle || 'Our Creative');
  const [procHighlight, setProcHighlight] = useState(profile.processHighlightedWord || 'Process');
  const [procSubtitle, setProcSubtitle] = useState(
    profile.processSubtitle || 'A clear and collaborative approach from idea to impact.'
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);

  const [number, setNumber] = useState('07');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('Heart');
  const [ringColor, setRingColor] = useState<'teal' | 'coral'>('teal');

  const availableIcons = [
    { name: 'Heart', label: 'Heart (Empathize)' },
    { name: 'Zap', label: 'Lightning (Define)' },
    { name: 'Lightbulb', label: 'Lightbulb (Ideate)' },
    { name: 'Edit3', label: 'Pencil (Design)' },
    { name: 'Monitor', label: 'Screen (Prototype)' },
    { name: 'CheckCircle2', label: 'Check Circle (Test & Refine)' },
  ];

  const sortedSteps = [...processSteps].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      processTitle: procTitle.trim() || 'Our Creative',
      processHighlightedWord: procHighlight.trim() || 'Process',
      processSubtitle: procSubtitle.trim() || 'A clear and collaborative approach from idea to impact.',
    });
    onShowToast('Header Saved', 'Creative Process section headline and subtitle updated.');
  };

  const handleOpenAdd = () => {
    setEditingStep(null);
    const nextNum = (processSteps.length + 1).toString().padStart(2, '0');
    setNumber(nextNum);
    setTitle('');
    setDesc('');
    setIcon('Heart');
    setRingColor(processSteps.length % 2 === 0 ? 'teal' : 'coral');
    setModalOpen(true);
  };

  const handleOpenEdit = (step: ProcessStep) => {
    setEditingStep(step);
    setNumber(step.number);
    setTitle(step.title);
    setDesc(step.desc);
    setIcon(step.icon);
    setRingColor(step.ringColor);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    if (editingStep) {
      updateProcessStep({
        ...editingStep,
        number,
        title: title.trim(),
        desc: desc.trim(),
        icon,
        ringColor,
      });
      onShowToast('Step Updated', `Phase ${number} (${title}) updated.`);
    } else {
      addProcessStep({
        id: `proc-${Date.now()}`,
        number,
        title: title.trim(),
        desc: desc.trim(),
        icon,
        ringColor,
        order: processSteps.length + 1,
      });
      onShowToast('Step Added', `New phase ${number} (${title}) added.`);
    }
    setModalOpen(false);
  };

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

  const handleDelete = (id: string, stepTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      title: `Step "${stepTitle}"`,
    });
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProcessStep(deleteConfirmation.id);
      onShowToast('Step Deleted', `${deleteConfirmation.title} was removed.`);
      if (editingStep && editingStep.id === deleteConfirmation.id) {
        setModalOpen(false);
        setEditingStep(null);
      }
    } catch (e) {
      console.error('Delete step error:', e);
      onShowToast('Delete Error', 'Failed to delete step.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSteps.length) return;

    const reordered = [...sortedSteps];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setProcessSteps(updatedWithOrder);
    onShowToast('Order Updated', 'Process step order adjusted.');
  };

  const handleRestoreDefaults = () => {
    if (
      window.confirm('Reset the creative process back to standard methodology steps?')
    ) {
      setProcessSteps(INITIAL_PROCESS_STEPS);
      setProcTitle('Our Creative');
      setProcHighlight('Process');
      setProcSubtitle('A clear and collaborative approach from idea to impact.');
      setProfile({
        ...profile,
        processTitle: 'Our Creative',
        processHighlightedWord: 'Process',
        processSubtitle: 'A clear and collaborative approach from idea to impact.',
      });
      onShowToast('Restored Defaults', 'Reset to the standard design process steps.');
    }
  };

  const renderIcon = (name: string, isCoral: boolean) => {
    const cls = `w-5 h-5 ${isCoral ? 'text-[#FF5A36]' : 'text-[#00E599]'}`;
    switch (name) {
      case 'Zap':
        return <Zap className={cls} />;
      case 'Lightbulb':
        return <Lightbulb className={cls} />;
      case 'Edit3':
      case 'Pen':
        return <Edit3 className={cls} />;
      case 'Monitor':
        return <Monitor className={cls} />;
      case 'CheckCircle2':
      case 'Check':
        return <CheckCircle2 className={cls} />;
      default:
        return <Heart className={cls} />;
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* 1. Header & Section Titles Customizer */}
      <div className="bg-[#0F1522] rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center border border-[#00E599]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Creative Process Section Header
              </h2>
              <p className="text-xs text-slate-400">
                Customize the headline text, highlighted script word, and subtitle for this section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 px-3.5 py-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
            title="Restore original steps"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Reset 6 Steps</span>
          </button>
        </div>

        <form onSubmit={handleSaveHeader} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Headline Base Text
              </label>
              <input
                type="text"
                value={procTitle}
                onChange={(e) => setProcTitle(e.target.value)}
                placeholder="Our Creative"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Highlighted Word (Emerald Accent)
              </label>
              <input
                type="text"
                value={procHighlight}
                onChange={(e) => setProcHighlight(e.target.value)}
                placeholder="Process"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={procSubtitle}
              onChange={(e) => setProcSubtitle(e.target.value)}
              placeholder="A clear and collaborative approach from idea to impact."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Header Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Interactive Live Preview */}
      <div className="bg-[#0F1522] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#00E599]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live Timeline Preview
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {sortedSteps.length} Active Steps
          </span>
        </div>

        {/* Section Header preview */}
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            {procTitle}{' '}
            <span className="text-[#00E599] underline decoration-[#00E599]/40 underline-offset-8">
              {procHighlight}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            {procSubtitle}
          </p>
        </div>

        {/* Dashed connector timeline */}
        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 border-t-2 border-dashed border-slate-700 -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-3 relative z-10">
            {sortedSteps.map((step) => {
              const isCoral = step.ringColor === 'coral';
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-[#080B11] border-2 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                      isCoral
                        ? 'border-[#FF5A36] text-[#FF5A36] shadow-[0_0_15px_rgba(255,90,54,0.2)]'
                        : 'border-[#00E599] text-[#00E599] shadow-[0_0_15px_rgba(0,229,153,0.2)]'
                    }`}
                  >
                    {renderIcon(step.icon, isCoral)}
                  </div>
                  <span
                    className={`text-xs font-mono font-bold mt-2.5 tracking-wider ${
                      isCoral ? 'text-[#FF5A36]' : 'text-[#00E599]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5 font-sans">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 max-w-[150px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Steps List & Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">
              Manage Timeline Steps ({processSteps.length})
            </h3>
            <p className="text-xs text-slate-400">
              Add new phases, edit descriptions, adjust icons, and alternate emerald or coral rings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Step</span>
          </button>
        </div>

        {/* Grid of Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSteps.map((step, idx) => {
            const isCoral = step.ringColor === 'coral';
            return (
              <div
                key={step.id}
                className="bg-[#0F1522] rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-[#080B11] flex items-center justify-center border-2 ${
                        isCoral ? 'border-[#FF5A36]' : 'border-[#00E599]'
                      }`}
                    >
                      {renderIcon(step.icon, isCoral)}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-[#00E599] disabled:opacity-20 rounded transition-colors cursor-pointer"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === sortedSteps.length - 1}
                        className="p-1 text-slate-400 hover:text-[#00E599] disabled:opacity-20 rounded transition-colors cursor-pointer"
                        title="Move Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(step)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Edit Step"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(step.id, step.title)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isCoral
                          ? 'bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30'
                          : 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
                      }`}
                    >
                      Phase {step.number}
                    </span>
                    <h4 className="text-sm font-bold text-white font-sans">{step.title}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="capitalize">Theme: {step.ringColor}</span>
                  <span>Icon: {step.icon}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Step Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-700 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white font-sans">
                {editingStep ? `Edit Phase ${editingStep.number}` : 'Add Process Phase'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phase Number
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ring Accent
                  </label>
                  <select
                    value={ringColor}
                    onChange={(e) => setRingColor(e.target.value as 'teal' | 'coral')}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                  >
                    <option value="teal">Emerald Glow (#00E599)</option>
                    <option value="coral">Fiery Coral (#FF5A36)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phase Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Discovery &amp; Strategy"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short description of what happens in this stage."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Icon Visual
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setIcon(ic.name)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        icon === ic.name
                          ? 'border-[#00E599] bg-[#00E599]/15 text-[#00E599] font-bold'
                          : 'border-slate-800 bg-[#080B11] text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="mb-1">{renderIcon(ic.name, ringColor === 'coral')}</div>
                      <span className="text-[10px] truncate max-w-[80px]">{ic.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-5 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingStep ? 'Update Phase' : 'Add Phase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title={`Delete ${deleteConfirmation.title}?`}
        message="Are you sure you want to remove this process phase? You can restore default steps at any time."
        onClose={() => setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleExecuteDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
