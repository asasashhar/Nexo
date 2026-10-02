import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { InfoChip } from '../../types';
import {
  Save,
  Plus,
  Trash2,
  MapPin,
  GraduationCap,
  Heart,
  Coffee,
  Sparkles,
  Award,
  Star,
} from 'lucide-react';

interface AboutModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const AboutModule: React.FC<AboutModuleProps> = ({ onShowToast }) => {
  const { profile, setProfile, infoChips, setInfoChips } = usePortfolio();

  const [bio, setBio] = useState(profile.aboutBio);
  const [chips, setChips] = useState<InfoChip[]>(infoChips);

  React.useEffect(() => {
    setBio(profile.aboutBio);
    setChips(infoChips);
  }, [profile.aboutBio, infoChips]);

  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIcon, setNewIcon] = useState('MapPin');

  const availableIcons = ['MapPin', 'GraduationCap', 'Heart', 'Coffee', 'Star', 'Award', 'Sparkles'];

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, aboutBio: bio });
    setInfoChips(chips);
    onShowToast('About Section Saved', 'Bio paragraph and info chips have been updated.');
  };

  const handleAddChip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) return;

    const newChip: InfoChip = {
      id: `chip-${Date.now()}`,
      label: newLabel.trim(),
      value: newValue.trim(),
      icon: newIcon,
      order: chips.length + 1,
    };

    const updated = [...chips, newChip];
    setChips(updated);
    setInfoChips(updated);
    setNewLabel('');
    setNewValue('');
    onShowToast('Chip Added', 'New informational chip was added.');
  };

  const handleDeleteChip = (id: string) => {
    const updated = chips.filter((c) => c.id !== id);
    setChips(updated);
    setInfoChips(updated);
    onShowToast('Chip Deleted', 'Informational chip was removed.');
  };

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'MapPin':
        return <MapPin {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Star':
        return <Star {...props} />;
      case 'Award':
        return <Award {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37]">About Section & Info Chips</h2>
          <p className="text-xs text-[#6B7280]">
            Update your biographical statement, studio mascot settings, and highlight chips.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveBio}
          className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bio Text Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1F2A37] border-b border-gray-100 pb-2">
              Biographical Statement
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Bio Content (First Person) *
              </label>
              <textarea
                rows={5}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="bg-[#E8F7F2] p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs">
                🌱
              </div>
              <div>
                <strong className="text-xs font-bold text-[#1F2A37] block">Studio Mascot</strong>
                <span className="text-[11px] text-[#6B7280]">
                  The interactive smiling plant mascot is enabled and reacts with happy emotes on click.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Chips Management */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1F2A37] border-b border-gray-100 pb-2">
              Highlight Info Chips ({chips.length})
            </h3>

            {/* List of Chips */}
            <div className="space-y-2.5">
              {chips.map((chip) => (
                <div
                  key={chip.id}
                  className="bg-[#F7FCFA] border border-[#D8F2E9] rounded-2xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-[#D8F2E9] flex items-center justify-center text-[#4CC9A7]">
                      {renderIcon(chip.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] block font-medium">
                        {chip.label}
                      </span>
                      <strong className="text-xs text-[#1F2A37] font-semibold">{chip.value}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteChip(chip.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete chip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Chip Form */}
            <form
              onSubmit={handleAddChip}
              className="pt-3 border-t border-gray-100 space-y-3"
            >
              <h4 className="text-xs font-bold text-[#1F2A37]">Add Informational Chip</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1">
                    Label (e.g. Based in)
                  </label>
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Degree in"
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#9CA3AF] mb-1">
                    Value (e.g. Bangalore)
                  </label>
                  <input
                    type="text"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. Interaction Design"
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#9CA3AF]">Icon:</span>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 bg-white"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all shadow-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
