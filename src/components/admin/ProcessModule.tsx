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
  const [procTitle, setProcTitle] = useState(profile.processTitle || 'Our Design');
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
      processTitle: procTitle.trim() || 'Our Design',
      processHighlightedWord: procHighlight.trim() || 'Process',
      processSubtitle: procSubtitle.trim() || 'A clear and collaborative approach from idea to impact.',
    });
    onShowToast('Header Saved', 'Our Design Process section headline and subtitle updated.');
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
      onShowToast('Step Updated', `Step ${number} "${title}" was updated.`);
    } else {
      addProcessStep({
        id: `step-${Date.now()}`,
        number,
        title: title.trim(),
        desc: desc.trim(),
        icon,
        ringColor,
        order: processSteps.length + 1,
      });
      onShowToast('Step Added', `Step ${number} "${title}" added to process timeline.`);
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
      window.confirm('Reset the design process back to the original 6 standard methodology steps?')
    ) {
      setProcessSteps(INITIAL_PROCESS_STEPS);
      setProcTitle('Our Design');
      setProcHighlight('Process');
      setProcSubtitle('A clear and collaborative approach from idea to impact.');
      setProfile({
        ...profile,
        processTitle: 'Our Design',
        processHighlightedWord: 'Process',
        processSubtitle: 'A clear and collaborative approach from idea to impact.',
      });
      onShowToast('Restored Defaults', 'Reset to the standard 6 design process steps.');
    }
  };

  const renderIcon = (name: string, isCoral: boolean) => {
    const cls = `w-5 h-5 ${isCoral ? 'text-[#F2685F]' : 'text-[#4CC9A7]'}`;
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
    <div className="space-y-8">
      {/* 1. Header & Section Titles Customizer */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8F7F2] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F7F2] text-[#4CC9A7]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#1F2A37]">
                Design Process Section Header
              </h2>
              <p className="text-xs text-[#6B7280]">
                Customize the headline text, highlighted cursive word, and subtitle for this section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1F2A37] border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            title="Restore original 6 steps"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#4CC9A7]" />
            <span>Reset 6 Steps</span>
          </button>
        </div>

        <form onSubmit={handleSaveHeader} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Headline Base Text
              </label>
              <input
                type="text"
                value={procTitle}
                onChange={(e) => setProcTitle(e.target.value)}
                placeholder="My Design"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Highlighted Cursive Word (Teal Script)
              </label>
              <input
                type="text"
                value={procHighlight}
                onChange={(e) => setProcHighlight(e.target.value)}
                placeholder="Process"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={procSubtitle}
              onChange={(e) => setProcSubtitle(e.target.value)}
              placeholder="A clear and collaborative approach from idea to impact."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Header Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Interactive Live Preview */}
      <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E8E6DF] relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#4CC9A7]" />
            <span className="text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
              Live Timeline Preview
            </span>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            {sortedSteps.length} Steps Active
          </span>
        </div>

        {/* Section Header preview */}
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2A37]">
            {procTitle}{' '}
            <span className="font-script text-[#4CC9A7] text-3xl sm:text-4xl">
              {procHighlight}
            </span>{' '}
            <span className="text-[#F2685F] text-xl select-none inline-block animate-pulse">♡</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-md mx-auto">
            {procSubtitle}
          </p>
        </div>

        {/* Dashed connector timeline */}
        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 border-t-2 border-dashed border-[#A1E8D2] -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-3 relative z-10">
            {sortedSteps.map((step) => {
              const isCoral = step.ringColor === 'coral';
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center shadow-xs transition-transform hover:scale-105 ${
                      isCoral ? 'border-[#F2685F] text-[#F2685F]' : 'border-[#4CC9A7] text-[#4CC9A7]'
                    }`}
                  >
                    {renderIcon(step.icon, isCoral)}
                  </div>
                  <span className="text-xs font-bold text-[#F2685F] mt-2 tracking-wider">
                    {step.number}
                  </span>
                  <h4 className="text-xs font-bold text-[#1F2A37] mt-0.5">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-1 max-w-[150px]">
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1F2A37]">
              Manage Timeline Steps ({processSteps.length})
            </h3>
            <p className="text-xs text-[#6B7280]">
              Add new phases, edit descriptions, adjust icons, and alternate teal or coral rings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs hover:shadow cursor-pointer"
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
                className="bg-white rounded-3xl p-5 border border-[#E8F7F2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 ${
                        isCoral ? 'border-[#F2685F]' : 'border-[#4CC9A7]'
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
                        className="p-1 text-gray-400 hover:text-[#4CC9A7] disabled:opacity-30 rounded transition-colors"
                        title="Move Left / Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === sortedSteps.length - 1}
                        className="p-1 text-gray-400 hover:text-[#4CC9A7] disabled:opacity-30 rounded transition-colors"
                        title="Move Right / Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(step)}
                        className="p-1.5 text-gray-400 hover:text-[#4CC9A7] rounded-lg transition-colors cursor-pointer"
                        title="Edit Step"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(step.id, step.title)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isCoral ? 'text-[#F2685F]' : 'text-[#4CC9A7]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <h4 className="text-sm font-bold text-[#1F2A37]">{step.title}</h4>
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span className="capitalize">Ring: {step.ringColor}</span>
                  <span>Icon: {step.icon}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Step Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-[#1F2A37]">
                {editingStep ? `Edit Step ${editingStep.number}` : 'Add Process Step'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Step Number
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Ring Color
                  </label>
                  <select
                    value={ringColor}
                    onChange={(e) => setRingColor(e.target.value as 'teal' | 'coral')}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none bg-white"
                  >
                    <option value="teal">Teal (#4CC9A7)</option>
                    <option value="coral">Coral (#F2685F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Empathize, Wireframing"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short 1-2 sentence description of what happens in this stage."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setIcon(ic.name)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        icon === ic.name
                          ? 'border-[#4CC9A7] bg-[#E8F7F2] text-[#4CC9A7] font-bold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="mb-1">{renderIcon(ic.name, ringColor === 'coral')}</div>
                      <span className="text-[10px] truncate max-w-[80px]">{ic.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#1F2A37] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingStep ? 'Update Step' : 'Add Step'}
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
