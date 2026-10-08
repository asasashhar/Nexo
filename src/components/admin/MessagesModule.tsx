import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { InquiryMessage } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Mail,
  Search,
  Star,
  Trash2,
  CheckCircle,
  Download,
  ExternalLink,
  Clock,
  User,
  Archive,
  ArchiveRestore,
  Send,
  Copy,
  Check,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Filter,
  ChevronRight,
  Tag,
  DollarSign,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from 'lucide-react';

interface MessagesModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const MessagesModule: React.FC<MessagesModuleProps> = ({ onShowToast }) => {
  const {
    messages,
    markMessageRead,
    toggleMessageStar,
    toggleArchiveMessage,
    updateMessageStatus,
    addMessageNote,
    addMessageReply,
    deleteMessage,
    batchMarkRead,
    batchDelete,
  } = usePortfolio();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred' | 'in_progress' | 'replied' | 'archived'>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );

  // Multi-select for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Internal note form state
  const [noteText, setNoteText] = useState('');

  // Quick reply form state
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const RESPONSE_TEMPLATES = [
    {
      title: 'Sprint Discovery & Scope',
      badge: 'Quick Launch',
      subject: 'Re: NEXO Studio Project Inquiry — Creative Sprint Discovery',
      body: `Hi there!\n\nThank you for reaching out to NEXO Studio. We've reviewed your brief and would love to partner with you on crafting an extraordinary visual experience.\n\nCould you share your preferred launch timeline and any reference decks you have? Alternatively, let's schedule a 20-minute creative discovery call this week.\n\nLooking forward to creating together,\nThe NEXO Studio Team\ncontact@nexostudio.com`,
    },
    {
      title: 'Web & UI/UX Engagement',
      badge: 'Web Design',
      subject: 'Re: Web Design & Digital Architecture — NEXO Studio',
      body: `Hello!\n\nThanks for your interest in our Web Design & UI/UX services. We specialize in high-converting, motion-driven digital products engineered to elevate your brand presence.\n\nOur sprint delivery includes responsive prototypes, design token systems, and production assets. Let's arrange a brief video call to review wireframes and milestones.\n\nBest regards,\nNEXO Studio Creative Team`,
    },
    {
      title: 'Poster & Visual Identity',
      badge: 'Posters / Branding',
      subject: 'Re: Poster Graphics & Brand Identity Campaign',
      body: `Hi!\n\nExcited to see your inquiry regarding high-impact poster artwork and brand assets! We craft museum-grade typography, kinetic graphics, and striking visual posters tailored for both print and high-res digital showcases.\n\nLet us know your deliverable formats and campaign deadlines.\n\nWarmly,\nNEXO Studio Team`,
    },
    {
      title: 'Motion Ads & Video Production',
      badge: 'Motion / Ads',
      subject: 'Re: Kinetic Video Ads & Motion Campaign Timeline',
      body: `Hi!\n\nThank you for considering NEXO for your motion advertising campaign. We engineer scroll-stopping video ads and kinetic promo creatives designed to drive measurable conversion.\n\nCould you share your target distribution platforms (e.g. TikTok, Reels, YouTube, DoOH) and any key copy/product assets?\n\nBest,\nNEXO Studio`,
    },
  ];

  // Filtering
  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(search.toLowerCase())) ||
      m.service.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'unread') return !m.read && !m.archived;
    if (activeTab === 'starred') return m.starred && !m.archived;
    if (activeTab === 'in_progress') return m.status === 'in_progress' && !m.archived;
    if (activeTab === 'replied') return m.status === 'replied' && !m.archived;
    if (activeTab === 'archived') return m.archived;
    return !m.archived;
  });

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || filtered[0] || null;

  const handleSelectMessage = (msg: InquiryMessage) => {
    setSelectedMessageId(msg.id);
    if (!msg.read) {
      markMessageRead(msg.id);
    }
  };

  const handleApplyTemplate = (tmpl: (typeof RESPONSE_TEMPLATES)[0]) => {
    setReplySubject(tmpl.subject);
    setReplyBody(tmpl.body);
    setShowReplyComposer(true);
    onShowToast('Template Loaded', `Applied "${tmpl.title}" into composer.`);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    if (!replySubject.trim() || !replyBody.trim()) {
      onShowToast('Validation Error', 'Subject and reply message are required.');
      return;
    }

    addMessageReply(selectedMessage.id, replySubject, replyBody);

    updateMessageStatus(selectedMessage.id, 'replied');

    // Trigger system mailto client so real reply can be dispatched if desired
    const mailtoUrl = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;
    window.open(mailtoUrl, '_blank');

    setReplySubject('');
    setReplyBody('');
    setShowReplyComposer(false);
    onShowToast('Reply Recorded', `Response saved to inquiry history and mail client opened.`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !noteText.trim()) return;

    addMessageNote(selectedMessage.id, noteText.trim());
    setNoteText('');
    onShowToast('Note Added', 'Internal admin note saved.');
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Copied', 'Message copied to clipboard.');
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
    onShowToast('Email Copied', `${email} copied to clipboard.`);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((m) => m.id));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'single' | 'batch';
    id?: string;
    title: string;
  }>({
    isOpen: false,
    type: 'single',
    title: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBatchMarkRead = () => {
    batchMarkRead(selectedIds);
    setSelectedIds([]);
    onShowToast('Batch Updated', 'Selected inquiries marked as read.');
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmation({
      isOpen: true,
      type: 'batch',
      title: `${selectedIds.length} Selected Inquiries`,
    });
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteConfirmation.type === 'batch') {
        await batchDelete(selectedIds);
        setSelectedIds([]);
        onShowToast('Batch Deleted', 'Inquiries removed successfully.');
      } else if (deleteConfirmation.id) {
        await deleteMessage(deleteConfirmation.id);
        if (selectedMessageId === deleteConfirmation.id) {
          setSelectedMessageId(null);
        }
        onShowToast('Deleted', 'Inquiry removed successfully.');
      }
    } catch (e) {
      console.error('Delete inquiry error:', e);
      onShowToast('Delete Error', 'Failed to delete inquiry.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleExportCsv = () => {
    if (messages.length === 0) {
      onShowToast('No Messages', 'Inbox is empty.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Service', 'Budget', 'Status', 'Timestamp', 'Message', 'NotesCount', 'RepliesCount'];
    const rows = messages.map((m) => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.service}"`,
      `"${m.budget || ''}"`,
      `"${m.status}"`,
      `"${m.timestamp}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      m.adminNotes ? m.adminNotes.length : 0,
      m.replyHistory ? m.replyHistory.length : 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexo_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported CSV', 'All inquiries saved to CSV file.');
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexo_messages_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('JSON Exported', 'Full message history exported as JSON.');
  };

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.read && !m.archived).length;
  const starredCount = messages.filter((m) => m.starred && !m.archived).length;
  const inProgressCount = messages.filter((m) => m.status === 'in_progress' && !m.archived).length;
  const repliedCount = messages.filter((m) => m.status === 'replied' && !m.archived).length;
  const archivedCount = messages.filter((m) => m.archived).length;

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300">
      {/* TOP HEADER & STATS SUMMARY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white font-sans tracking-tight">
                  Client Inquiries &amp; Leads
                </h2>
                <span className="text-xs bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30 font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {totalCount} Total
                </span>
                {unreadCount > 0 && (
                  <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-2.5 py-0.5 rounded-full animate-pulse font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time intake stream, responsive email replies, internal admin notes, and CSV data export.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 bg-[#080B11] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
            title="Download CSV report of inquiries"
          >
            <Download className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 bg-[#080B11] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
            title="Backup messages as JSON"
          >
            <FileText className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* METRIC CHIPS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#00E599]/15 border-[#00E599] text-white shadow-[0_0_15px_rgba(0,229,153,0.15)]'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">All Active</div>
          <div className="text-xl font-black text-white mt-0.5">{messages.filter((m) => !m.archived).length}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'unread'
              ? 'bg-red-500/15 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 animate-ping" />
          )}
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">Unread</div>
          <div className="text-xl font-black text-white mt-0.5">{unreadCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('starred')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'starred'
              ? 'bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Starred</div>
          <div className="text-xl font-black text-white mt-0.5">{starredCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('in_progress')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'in_progress'
              ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">In Progress</div>
          <div className="text-xl font-black text-white mt-0.5">{inProgressCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('replied')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'replied'
              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Replied</div>
          <div className="text-xl font-black text-white mt-0.5">{repliedCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('archived')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'archived'
              ? 'bg-slate-700/30 border-slate-500 text-white'
              : 'bg-[#0F1522] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Archived</div>
          <div className="text-xl font-black text-white mt-0.5">{archivedCount}</div>
        </button>
      </div>

      {/* SEARCH BAR & BATCH ACTIONS */}
      <div className="bg-[#0F1522] p-4 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, subject, service..."
            className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] transition-all text-xs placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end text-[11px] text-slate-400">
          <span>Showing <strong className="text-white">{filtered.length}</strong> of {totalCount} inquiries</span>
        </div>
      </div>

      {/* BATCH ACTION BAR (if items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#00E599]/10 border border-[#00E599]/40 p-3.5 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
            <span className="font-bold text-white">
              {selectedIds.length} {selectedIds.length === 1 ? 'inquiry' : 'inquiries'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchMarkRead}
              className="px-3.5 py-1.5 rounded-full bg-[#00E599] text-black font-extrabold hover:bg-[#00B377] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Mark Read
            </button>
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3.5 py-1.5 rounded-full bg-red-600/90 text-white font-bold hover:bg-red-500 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-slate-400 hover:text-white cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* SPLIT PANE: LEFT LIST (5 COLS) + RIGHT RICH DETAIL (7 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* LEFT INQUIRY LIST */}
        <div className="lg:col-span-5 bg-[#0F1522] rounded-3xl border border-slate-800 shadow-xl p-4 space-y-2 overflow-y-auto max-h-[760px]">
          {/* List Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 px-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtered.length > 0 && selectedIds.length === filtered.length}
                onChange={handleToggleSelectAll}
                className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select All ({filtered.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live stream</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#00E599]" />
              <p className="font-semibold text-slate-300">No client inquiries found</p>
              <p className="text-[11px] text-slate-500 mt-1">Try switching tabs or resetting your search filter.</p>
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isChecked = selectedIds.includes(msg.id);

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-[#080B11] border-[#00E599] shadow-[0_0_20px_rgba(0,229,153,0.15)] ring-1 ring-[#00E599]/30'
                      : 'bg-[#080B11]/60 border-slate-800 hover:border-slate-700 hover:bg-[#080B11]'
                  } ${!msg.read ? 'border-l-4 border-l-[#00E599]' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onClick={(e) => handleToggleSelectOne(msg.id, e)}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599] cursor-pointer"
                      />

                      {/* Avatar initials */}
                      <div className="w-7 h-7 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599] font-black text-xs flex items-center justify-center flex-shrink-0">
                        {msg.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${!msg.read ? 'text-white' : 'text-slate-200'}`}>
                            {msg.name}
                          </span>
                          {!msg.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] flex-shrink-0 shadow-[0_0_8px_#00E599]" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {msg.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStar(msg.id);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-amber-400 transition-colors"
                        title={msg.starred ? 'Starred' : 'Star message'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            msg.starred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {msg.subject && (
                    <p className="text-[11px] font-semibold text-slate-200 line-clamp-1 mb-1">
                      {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[#00E599] font-bold border border-slate-700">
                      {msg.service}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {msg.budget && (
                        <span className="text-amber-400 font-mono font-semibold">
                          {msg.budget}
                        </span>
                      )}

                      {msg.status === 'replied' && (
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                          Replied
                        </span>
                      )}
                      {msg.status === 'in_progress' && (
                        <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full font-bold">
                          In Progress
                        </span>
                      )}
                      {msg.adminNotes && msg.adminNotes.length > 0 && (
                        <span className="text-slate-400 flex items-center gap-0.5 font-mono">
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>{msg.adminNotes.length}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT RICH DETAIL VIEW */}
        <div className="lg:col-span-7 bg-[#0F1522] rounded-3xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between overflow-y-auto max-h-[760px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* CLIENT HEADER BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#00E599]/20 to-[#06B6D4]/20 border border-[#00E599]/40 text-[#00E599] font-black text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white font-sans tracking-tight">
                        {selectedMessage.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => toggleMessageStar(selectedMessage.id)}
                        className="text-slate-500 hover:text-amber-400 cursor-pointer transition-colors"
                        title="Star this inquiry"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            selectedMessage.starred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-0.5">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#00E599] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>{selectedMessage.email}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(selectedMessage.email)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <Check className="w-3 h-3 text-[#00E599]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span className="text-[10px]">{copiedEmail ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Dropdown & Control Icons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) =>
                      updateMessageStatus(
                        selectedMessage.id,
                        e.target.value as InquiryMessage['status']
                      )
                    }
                    className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-[#080B11] font-bold text-white outline-none focus:border-[#00E599]"
                  >
                    <option value="new">Status: New Lead</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="replied">Status: Replied</option>
                    <option value="archived">Status: Archived</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      toggleArchiveMessage(selectedMessage.id);
                      onShowToast(
                        selectedMessage.archived ? 'Restored' : 'Archived',
                        `Message ${selectedMessage.archived ? 'restored to inbox' : 'archived'}.`
                      );
                    }}
                    className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title={selectedMessage.archived ? 'Restore to Inbox' : 'Archive Inquiry'}
                  >
                    {selectedMessage.archived ? (
                      <ArchiveRestore className="w-4 h-4 text-[#00E599]" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmation({
                        isOpen: true,
                        type: 'single',
                        id: selectedMessage.id,
                        title: `Inquiry from ${selectedMessage.name}`,
                      });
                    }}
                    className="p-2 rounded-xl border border-red-900/50 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SERVICE & METADATA BADGES */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[#080B11] border border-[#00E599]/30 text-[#00E599] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Service: {selectedMessage.service}</span>
                </span>

                {selectedMessage.budget && (
                  <span className="bg-[#080B11] border border-amber-500/30 text-amber-400 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Budget: {selectedMessage.budget}</span>
                  </span>
                )}

                <span className="bg-[#080B11] border border-slate-800 text-slate-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Received: {selectedMessage.timestamp}</span>
                </span>

                <button
                  type="button"
                  onClick={() => markMessageRead(selectedMessage.id)}
                  className="bg-[#080B11] border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-[11px] transition-colors"
                >
                  {selectedMessage.read ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark as Unread</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#00E599]" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </button>
              </div>

              {/* SUBJECT LINE (if provided) */}
              {selectedMessage.subject && (
                <div className="bg-[#080B11] p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-0.5">
                    Subject Line
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedMessage.subject}
                  </span>
                </div>
              )}

              {/* CLIENT INQUIRY MESSAGE BODY */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Client Project Brief</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(selectedMessage.message, selectedMessage.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#00E599] font-bold hover:underline cursor-pointer transition-colors"
                  >
                    {copiedId === selectedMessage.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 bg-[#080B11] rounded-2xl border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-[#00E599]/30">
                  {selectedMessage.message}
                </div>
              </div>

              {/* QUICK RESPONSE TEMPLATES */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Quick Response Templates</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReplyComposer(!showReplyComposer)}
                    className="text-xs text-[#00E599] font-bold hover:underline cursor-pointer"
                  >
                    {showReplyComposer ? 'Hide Composer' : '+ Custom Reply'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RESPONSE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="p-3 rounded-2xl bg-[#080B11] border border-slate-800 hover:border-[#00E599] hover:bg-[#080B11]/80 text-left transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-[#00E599] transition-colors">
                          {tmpl.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:text-[#00E599]">
                          {tmpl.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1 block">
                        {tmpl.subject}
                      </span>
                    </button>
                  ))}
                </div>

                {/* REPLY COMPOSER FORM */}
                {showReplyComposer && (
                  <form
                    onSubmit={handleSendReply}
                    className="p-5 rounded-2xl bg-[#080B11] border border-[#00E599]/40 space-y-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#00E599]" />
                        <span>Compose Reply to {selectedMessage.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Dispatches to {selectedMessage.email}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Email Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder="Re: NEXO Studio Project Engagement..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none bg-[#0F1522] text-white focus:border-[#00E599]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Email Message Body *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full text-xs p-3.5 rounded-xl border border-slate-700 outline-none bg-[#0F1522] text-white focus:border-[#00E599] resize-none leading-relaxed font-sans"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReplyComposer(false)}
                        className="px-4 py-2 rounded-full border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(0,229,153,0.3)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send &amp; Record Reply</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* SENT REPLY HISTORY */}
                {selectedMessage.replyHistory && selectedMessage.replyHistory.length > 0 && (
                  <div className="space-y-2 pt-3">
                    <span className="text-xs font-bold text-white block">
                      Sent Reply History ({selectedMessage.replyHistory.length})
                    </span>
                    <div className="space-y-2">
                      {selectedMessage.replyHistory.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-2xl bg-[#080B11] border border-emerald-500/30 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#00E599]">
                            <span>{rep.subject}</span>
                            <span className="text-slate-500 font-mono text-[10px]">{rep.sentAt}</span>
                          </div>
                          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{rep.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PRIVATE INTERNAL ADMIN NOTES */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Private Internal Admin Notes</span>
                </span>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add private note (e.g. Budget discussed ₹75,000, sprint starts 15th)..."
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors border border-slate-700"
                  >
                    Add Note
                  </button>
                </form>

                {selectedMessage.adminNotes && selectedMessage.adminNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMessage.adminNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-[#080B11] border border-amber-500/30 text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-amber-100 font-medium">{note.text}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            By {note.author} · {note.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    No internal notes on this lead yet. Notes are private to the admin team.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-36 text-slate-500 text-xs">
              <Mail className="w-14 h-14 mx-auto mb-3 opacity-20 text-[#00E599]" />
              <span className="font-bold block text-sm text-white">
                No Inquiry Selected
              </span>
              <span className="text-slate-400 text-xs mt-1 block">
                Click on any inquiry from the left list to review complete details and dispatch replies.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmation.isOpen}
        title={`Delete ${deleteConfirmation.title}?`}
        message={
          deleteConfirmation.type === 'batch'
            ? 'Are you sure you want to permanently delete all selected inquiries? This action cannot be undone.'
            : 'Are you sure you want to permanently delete this client inquiry from your database?'
        }
        confirmLabel={deleteConfirmation.type === 'batch' ? 'Delete Selected' : 'Delete Inquiry'}
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmation((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};
