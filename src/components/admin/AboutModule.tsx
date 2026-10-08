import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { InfoChip, WhyChooseItem } from '../../types';
import { ImageUploadField } from './ImageUploadField';
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
  Users,
  Camera,
  Check,
  RotateCcw,
  Zap,
  ShieldCheck,
  Lightbulb,
  Target,
  Clock,
  Rocket,
  TrendingUp,
  Palette,
  Compass,
  Boxes,
  Edit2,
  ArrowUp,
  ArrowDown,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AboutModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const AboutModule: React.FC<AboutModuleProps> = ({ onShowToast }) => {
  const {
    profile,
    setProfile,
    updateAboutImage,
    infoChips,
    setInfoChips,
    whyChooseItems,
    setWhyChooseItems,
    addWhyChooseItem,
    updateWhyChooseItem,
    deleteWhyChooseItem,
  } = usePortfolio();

  // Why Choose Headings State (Editable by Admin)
  const [whyBadge, setWhyBadge] = useState(profile.whyChooseBadge || 'WHY CHOOSE NEXO?');
  const [whyTitle, setWhyTitle] = useState(
    profile.whyChooseTitle || 'Precision Engineering Meets Artistic Excellence'
  );
  const [whySubtitle, setWhySubtitle] = useState(
    profile.whyChooseSubtitle ||
      'Everything your brand needs to command attention, outshine competitors, and drive measurable growth across digital platforms.'
  );

  // Studio Team Photo
  const [aboutImageUrl, setAboutImageUrl] = useState(
    profile.aboutImageUrl || '/nexo-studio-team.jpg'
  );

  // Highlights / Chips
  const [chips, setChips] = useState<InfoChip[]>(infoChips);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Chip Form State
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIcon, setNewIcon] = useState('MapPin');

  // Why Choose Item Modal / Form State
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [editingWhyItem, setEditingWhyItem] = useState<WhyChooseItem | null>(null);
  const [whyItemTitle, setWhyItemTitle] = useState('');
  const [whyItemDesc, setWhyItemDesc] = useState('');
  const [whyItemIcon, setWhyItemIcon] = useState('Lightbulb');
  const [whyItemColor, setWhyItemColor] = useState('#00E599');

  const availableWhyIcons = [
    { name: 'Lightbulb', label: 'Idea / Mindset', icon: Lightbulb },
    { name: 'Zap', label: 'Speed / Fast Delivery', icon: Zap },
    { name: 'ShieldCheck', label: 'Quality / Reliability', icon: ShieldCheck },
    { name: 'Users', label: 'Client / Community', icon: Users },
    { name: 'Target', label: 'Strategy / Accuracy', icon: Target },
    { name: 'Award', label: 'Excellence / Trophy', icon: Award },
    { name: 'Sparkles', label: 'Creativity / Polish', icon: Sparkles },
    { name: 'Clock', label: 'Sprint / Turnaround', icon: Clock },
    { name: 'Rocket', label: 'Launch / Velocity', icon: Rocket },
    { name: 'TrendingUp', label: 'Growth / Conversion', icon: TrendingUp },
    { name: 'Palette', label: 'Artistry / Design', icon: Palette },
    { name: 'Compass', label: 'Direction / Vision', icon: Compass },
    { name: 'Heart', label: 'Passion / Care', icon: Heart },
    { name: 'Boxes', label: 'Deliverables / Scope', icon: Boxes },
  ];

  const availableColors = [
    { label: 'Cyber Emerald', hex: '#00E599' },
    { label: 'Hyper Coral', hex: '#FF5A36' },
    { label: 'Electric Cyan', hex: '#06B6D4' },
    { label: 'Neon Purple', hex: '#A855F7' },
    { label: 'Amber Gold', hex: '#FFB800' },
    { label: 'Cobalt Blue', hex: '#3B82F6' },
    { label: 'Hot Pink', hex: '#EC4899' },
  ];

  const handleImageChange = (newUrl: string) => {
    setAboutImageUrl(newUrl);
    updateAboutImage(newUrl);
    onShowToast('Team Photo Updated', 'Studio team photo updated and active on live website.');
  };

  const handleResetDefaultTeamImage = () => {
    handleImageChange('/nexo-studio-team.jpg');
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfile({
      ...profile,
      whyChooseBadge: whyBadge.trim() || 'WHY CHOOSE NEXO?',
      whyChooseTitle: whyTitle.trim() || 'Precision Engineering Meets Artistic Excellence',
      whyChooseSubtitle: whySubtitle.trim(),
      aboutImageUrl: aboutImageUrl,
    });
    setInfoChips(chips);
    setSavedSuccess(true);
    onShowToast(
      'Changes Saved',
      'Why Choose NEXO section, team photo, and credentials updated in live database.'
    );
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Why Choose CRUD
  const handleOpenAddWhyItem = () => {
    setEditingWhyItem(null);
    setWhyItemTitle('');
    setWhyItemDesc('');
    setWhyItemIcon('Lightbulb');
    setWhyItemColor('#00E599');
    setWhyModalOpen(true);
  };

  const handleOpenEditWhyItem = (item: WhyChooseItem) => {
    setEditingWhyItem(item);
    setWhyItemTitle(item.title);
    setWhyItemDesc(item.desc);
    setWhyItemIcon(item.iconName || 'Lightbulb');
    setWhyItemColor(item.color || '#00E599');
    setWhyModalOpen(true);
  };

  const handleSubmitWhyItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whyItemTitle.trim()) return;

    if (editingWhyItem) {
      updateWhyChooseItem({
        ...editingWhyItem,
        title: whyItemTitle.trim(),
        desc: whyItemDesc.trim(),
        iconName: whyItemIcon,
        color: whyItemColor,
      });
      onShowToast('Pillar Updated', `"${whyItemTitle}" updated successfully.`);
    } else {
      addWhyChooseItem({
        id: `why-${Date.now()}`,
        title: whyItemTitle.trim(),
        desc: whyItemDesc.trim(),
        iconName: whyItemIcon,
        color: whyItemColor,
        order: whyChooseItems.length + 1,
      });
      onShowToast('Pillar Added', `"${whyItemTitle}" added to Why Choose NEXO.`);
    }

    setWhyModalOpen(false);
  };

  const handleDeleteWhyItem = (id: string, name: string) => {
    deleteWhyChooseItem(id);
    onShowToast('Pillar Removed', `"${name}" removed from Why Choose NEXO.`);
  };

  const handleMoveWhyItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= whyChooseItems.length) return;

    const copy = [...whyChooseItems];
    const item = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = item;
    // update order
    const updated = copy.map((it, idx) => ({ ...it, order: idx + 1 }));
    setWhyChooseItems(updated);
    onShowToast('Order Updated', 'Pillars sequence updated.');
  };

  // Highlights Chips CRUD
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
    onShowToast('Highlight Added', 'New studio credential added.');
  };

  const handleDeleteChip = (id: string) => {
    const updated = chips.filter((c) => c.id !== id);
    setChips(updated);
    setInfoChips(updated);
    onShowToast('Highlight Removed', 'Studio credential removed.');
  };

  const renderChipIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-[#00E599]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-[#06B6D4]" />;
      case 'Heart':
        return <Heart className="w-4 h-4 fill-current text-[#FF5A36]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#FFB800]" />;
      case 'Star':
        return <Star className="w-4 h-4 fill-current text-[#FFB800]" />;
      case 'Award':
        return <Award className="w-4 h-4 text-[#00E599]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#A855F7]" />;
    }
  };

  const renderWhyIcon = (iconName: string) => {
    const found = availableWhyIcons.find((i) => i.name.toLowerCase() === (iconName || '').toLowerCase());
    if (found) {
      const Icon = found.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-300">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-sans tracking-tight">
              About Studio, Team &amp; Why NEXO
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize the "Why Choose NEXO" value pillars, studio team photo, and credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSaveAll()}
          className="inline-flex items-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-black px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved to Database!' : 'Save All Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: EDITORS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: WHY CHOOSE NEXO SECTION EDITOR (ADMIN EDITABLE) */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E599]" />
                  <span>Why Choose NEXO Section Editor</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edit the value propositions, delivery promises, and pillars displayed in the "Why Choose NEXO" section.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddWhyItem}
                className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-black px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Value Pillar</span>
              </button>
            </div>

            {/* Section Headings */}
            <div className="p-4 rounded-2xl bg-[#080B11] border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Section Pre-Heading / Badge
                  </label>
                  <input
                    type="text"
                    value={whyBadge}
                    onChange={(e) => setWhyBadge(e.target.value)}
                    placeholder="WHY CHOOSE NEXO?"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Main Headline Statement *
                  </label>
                  <input
                    type="text"
                    required
                    value={whyTitle}
                    onChange={(e) => setWhyTitle(e.target.value)}
                    placeholder="Precision Engineering Meets Artistic Excellence"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tagline / Section Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={whySubtitle}
                  onChange={(e) => setWhySubtitle(e.target.value)}
                  placeholder="Everything your brand needs to command attention, outshine competitors, and drive measurable growth across digital platforms."
                  className="w-full text-xs px-3.5 py-2 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* List of Why Choose Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span>Value Pillars &amp; Reasons ({whyChooseItems.length})</span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time live sync</span>
              </div>

              {whyChooseItems.length === 0 ? (
                <div className="p-8 text-center bg-[#080B11] rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  <p>No Why Choose pillars configured yet.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddWhyItem}
                    className="mt-2 text-[#00E599] font-bold hover:underline"
                  >
                    + Add your first pillar
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {whyChooseItems.map((item, idx) => {
                    const color = item.color || '#00E599';
                    return (
                      <div
                        key={item.id || idx}
                        className="bg-[#080B11] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}40`,
                            }}
                          >
                            {renderWhyIcon(item.iconName)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-500 font-bold">
                                0{idx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-white truncate font-sans">
                                {item.title}
                              </h4>
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                                title={`Accent: ${color}`}
                              />
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => handleMoveWhyItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveWhyItem(idx, 'down')}
                            disabled={idx === whyChooseItems.length - 1}
                            className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditWhyItem(item)}
                            className="p-1.5 text-slate-400 hover:text-[#00E599] rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                            title="Edit Pillar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteWhyItem(item.id, item.title)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                            title="Delete Pillar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: STUDIO TEAM PHOTO */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00E599]/15 text-[#00E599] flex items-center justify-center border border-[#00E599]/30">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Studio Team &amp; Headquarters Photo
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    High-res landscape photograph of the creative team or studio workspace
                  </p>
                </div>
              </div>

              {aboutImageUrl && aboutImageUrl !== '/nexo-studio-team.jpg' && (
                <button
                  type="button"
                  onClick={handleResetDefaultTeamImage}
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#FF5A36] transition-colors cursor-pointer"
                >
                  Reset to Studio Default
                </button>
              )}
            </div>

            <ImageUploadField
              label="Studio Team Collaboration Photo"
              sublabel="(Displayed in the About section on homepage)"
              value={aboutImageUrl}
              onChange={handleImageChange}
              helperText="Upload any team portrait or studio environment photo (Recommended: 16:9 or 4:3 landscape, up to 15MB)"
              aspectRatio="video"
            />
          </div>

          {/* SECTION 3: STUDIO CREDENTIALS & STATS */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 font-sans flex items-center justify-between">
              <span>Studio Credentials &amp; Stats ({chips.length})</span>
            </h3>

            {/* List of Chips */}
            <div className="space-y-2.5">
              {chips.map((chip) => (
                <div
                  key={chip.id}
                  className="bg-[#080B11] border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F1522] border border-slate-700 flex items-center justify-center">
                      {renderChipIcon(chip.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {chip.label}
                      </span>
                      <strong className="text-xs text-white font-semibold">{chip.value}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteChip(chip.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete highlight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Chip Form */}
            <form onSubmit={handleAddChip} className="pt-3 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300">Add Studio Highlight Metric</h4>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Turnaround)"
                  className="text-xs px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value (e.g. 24/7 Global)"
                  className="text-xs px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none cursor-pointer"
                >
                  {['MapPin', 'GraduationCap', 'Heart', 'Coffee', 'Star', 'Award', 'Sparkles'].map(
                    (ic) => (
                      <option key={ic} value={ic}>
                        {ic} Icon
                      </option>
                    )
                  )}
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
                <span>Live Staging Preview</span>
              </h3>
              <span className="text-[10px] font-mono text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/30">
                Auto Synced
              </span>
            </div>

            {/* Why Choose NEXO Live Cards Preview */}
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-mono font-bold text-[#00E599] uppercase tracking-[0.2em] block mb-1">
                  {whyBadge}
                </span>
                <h4 className="text-sm font-black text-white font-sans leading-tight">
                  {whyTitle}
                </h4>
                {whySubtitle && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{whySubtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {whyChooseItems.slice(0, 4).map((item, idx) => {
                  const color = item.color || '#00E599';
                  return (
                    <div
                      key={item.id || idx}
                      className="p-3 rounded-2xl bg-[#080B11] border border-slate-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {renderWhyIcon(item.iconName)}
                        </div>
                        <span className="font-mono text-[9px] text-slate-500 font-bold">
                          0{idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Photo Preview */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Studio Team Visual
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-[#080B11] shadow-md relative aspect-video">
                <img
                  src={aboutImageUrl || '/nexo-studio-team.jpg'}
                  alt="NEXO Studio Team"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/nexo-studio-team.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/90 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-[#00E599]">
                  CREATIVE HEADQUARTERS
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#00E599]/10 rounded-2xl text-xs text-[#00E599] font-medium flex items-center gap-2 border border-[#00E599]/20">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Updates apply immediately on the homepage.</span>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT WHY CHOOSE PILLAR MODAL */}
      {whyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0F1522] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E599]" />
                <span>{editingWhyItem ? 'Edit Value Pillar' : 'Add New Value Pillar'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWhyItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Pillar Title * (e.g. Creative Mindset, Fast Delivery)
                </label>
                <input
                  type="text"
                  required
                  value={whyItemTitle}
                  onChange={(e) => setWhyItemTitle(e.target.value)}
                  placeholder="e.g. High Conversion Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Value Promise / Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={whyItemDesc}
                  onChange={(e) => setWhyItemDesc(e.target.value)}
                  placeholder="e.g. Engineered to turn passive visitors into loyal paying customers."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none leading-relaxed"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-bold text-slate-200 mb-2">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableWhyIcons.map((ic) => {
                    const Icon = ic.icon;
                    const isSelected = whyItemIcon === ic.name;
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setWhyItemIcon(ic.name)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00E599] text-black border-[#00E599] shadow-sm font-bold'
                            : 'bg-[#080B11] text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                        }`}
                        title={ic.label}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] truncate w-full text-center">
                          {ic.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block font-bold text-slate-200 mb-2">
                  Thematic Accent Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((col) => {
                    const isSelected = whyItemColor === col.hex;
                    return (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setWhyItemColor(col.hex)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white border-white ring-1 ring-white'
                            : 'bg-[#080B11] text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setWhyModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-700 font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer active:scale-95"
                >
                  {editingWhyItem ? 'Save Changes' : 'Add Value Pillar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
