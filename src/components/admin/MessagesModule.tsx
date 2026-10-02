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

  const RESPONSE_TEMPLATES = [
    {
      title: 'Introduction & Next Steps',
      subject: 'Re: Ashhar Design Inquiry - Project Next Steps',
      body: `Hi there!\n\nThank you for reaching out through my portfolio. I'd love to learn more about your goals and how we can bring this design to life.\n\nCould you share a brief overview of your target launch timeline, or should we set up a quick 20-minute discovery call this week?\n\nWarm regards,\nAshhar\nLead UI/UX Designer\nhello@ashhar.com`,
    },
    {
      title: 'Discovery Call Invitation',
      subject: 'Re: Discovery Call - Ashhar UI/UX Design',
      body: `Hello!\n\nThanks for your inquiry. This sounds like an exciting project. I have a few immediate ideas around user flows and visual architecture.\n\nAre you available for a 30-min discovery call? Please feel free to pick a time slot that suits you best.\n\nLooking forward to speaking!\nAshhar`,
    },
    {
      title: 'Availability & Rate Card',
      subject: 'Re: Design Availability & Engagement Model',
      body: `Hi!\n\nThank you for considering my studio. I am currently taking on new client engagements. My typical project sprint runs 2-4 weeks with end-to-end deliverables (wireframes, interactive Figma prototypes, and complete design tokens).\n\nLet me know if you would like me to review your full brief and put together a tailored scope.\n\nBest,\nAshhar`,
    },
    {
      title: 'Video Ad & Poster Production',
      subject: 'Re: Creative Campaign Assets & Timeline',
      body: `Hi!\n\nExcited to see your inquiry around posters and high-conversion ads. I specialize in both static promotional graphics and 15s/30s kinetic motion video ads engineered for paid social performance.\n\nI have attached my creative reel for your review. Let's discuss your campaign deliverables!\n\nBest,\nAshhar`,
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

    // 'all' excludes archived unless requested
    return !m.archived;
  });

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    markMessageRead(id);
    setShowReplyComposer(false);
    setNoteText('');
  };

  const handleApplyTemplate = (template: { subject: string; body: string }) => {
    if (!selectedMessage) return;
    setReplySubject(template.subject.replace('Project Next Steps', `${selectedMessage.service} - Next Steps`));
    setReplyBody(template.body.replace('Hi there!', `Hi ${selectedMessage.name},`));
    setShowReplyComposer(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyBody.trim()) return;

    // Record reply in context
    addMessageReply(selectedMessage.id, replySubject.trim() || `Re: Inquiry from ${selectedMessage.name}`, replyBody.trim());
    updateMessageStatus(selectedMessage.id, 'replied');

    // Launch mailto client
    const mailto = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(
      replySubject.trim() || `Re: Inquiry - ${selectedMessage.service}`
    )}&body=${encodeURIComponent(replyBody.trim())}`;
    window.location.href = mailto;

    onShowToast('Reply Dispatched', `Reply recorded and opened in your email client.`);
    setShowReplyComposer(false);
    setReplyBody('');
    setReplySubject('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !noteText.trim()) return;
    addMessageNote(selectedMessage.id, noteText.trim());
    setNoteText('');
    onShowToast('Note Added', 'Internal admin note recorded.');
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Copied', 'Message copied to clipboard.');
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((m) => m.id));
    }
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
    link.setAttribute('download', `ashhar_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
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
    link.download = `ashhar_messages_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('JSON Exported', 'Full message history exported as JSON.');
  };

  const unreadCount = messages.filter((m) => !m.read && !m.archived).length;
  const starredCount = messages.filter((m) => m.starred && !m.archived).length;
  const inProgressCount = messages.filter((m) => m.status === 'in_progress' && !m.archived).length;
  const repliedCount = messages.filter((m) => m.status === 'replied' && !m.archived).length;
  const archivedCount = messages.filter((m) => m.archived).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
            <span>Inquiries &amp; Messages Inbox</span>
            <span className="text-xs bg-[#E8F7F2] text-[#37B294] font-bold px-2.5 py-0.5 rounded-full">
              {messages.length} Total
            </span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Advanced client inquiries manager, internal notes, quick email reply simulator, and CSV export.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-[#1F2A37] text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#4CC9A7]" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-[#1F2A37] text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#37B294]" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E8F7F2] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, subject, keyword..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            All ({messages.filter((m) => !m.archived).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'unread'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F2685F] text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('starred')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'starred'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            <span>Starred ({starredCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeTab === 'in_progress'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('replied')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeTab === 'replied'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            Replied ({repliedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeTab === 'archived'
                ? 'bg-[#4CC9A7] text-white font-semibold'
                : 'text-[#6B7280] hover:text-[#1F2A37]'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>
      </div>

      {/* Batch Actions Toolbar (if items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#E8F7F2] p-2.5 rounded-2xl border border-[#4CC9A7]/40 flex items-center justify-between text-xs animate-in fade-in">
          <span className="font-semibold text-[#1F2A37] pl-2">
            {selectedIds.length} {selectedIds.length === 1 ? 'inquiry' : 'inquiries'} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchMarkRead}
              className="px-3 py-1 rounded-full bg-white text-[#37B294] font-semibold border border-[#4CC9A7]/30 hover:bg-[#37B294] hover:text-white transition-colors cursor-pointer"
            >
              Mark Read
            </button>
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3 py-1 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Split Pane: Message List (Left 5 Cols) + Rich Detail View (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8F7F2] shadow-sm p-4 space-y-2 overflow-y-auto max-h-[700px]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtered.length > 0 && selectedIds.length === filtered.length}
                onChange={handleToggleSelectAll}
                className="rounded text-[#4CC9A7] cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-[#6B7280]">Select All</span>
            </div>
            <span className="text-[11px] text-[#9CA3AF]">{filtered.length} Inquiries</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#9CA3AF] text-xs">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#4CC9A7]" />
              <span>No inquiries match the current filter.</span>
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = selectedMessageId === msg.id;
              const isChecked = selectedIds.includes(msg.id);

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-[#4CC9A7] bg-[#E8F7F2]/40 shadow-xs ring-1 ring-[#4CC9A7]'
                      : msg.read
                      ? 'border-gray-100 hover:border-gray-200 bg-[#F7FCFA]'
                      : 'border-[#4CC9A7]/40 bg-white font-semibold shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, msg.id]);
                          } else {
                            setSelectedIds(selectedIds.filter((id) => id !== msg.id));
                          }
                        }}
                        className="rounded text-[#4CC9A7] cursor-pointer"
                      />
                      <span className="text-xs text-[#1F2A37] truncate">{msg.name}</span>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-[#F2685F] flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF] flex-shrink-0">
                      <span>{msg.timestamp}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStar(msg.id);
                        }}
                        className="p-0.5 hover:text-[#F5B301] cursor-pointer"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            msg.starred ? 'fill-[#F5B301] text-[#F5B301]' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {msg.subject && (
                    <p className="text-[11px] font-semibold text-[#1F2A37] line-clamp-1 mb-0.5">
                      {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-[#6B7280] line-clamp-2 font-normal leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 text-[10px]">
                    <span className="text-[#4CC9A7] font-semibold">{msg.service}</span>
                    <div className="flex items-center gap-1.5">
                      {msg.status === 'replied' && (
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-medium">
                          Replied
                        </span>
                      )}
                      {msg.status === 'in_progress' && (
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded-full font-medium">
                          In Progress
                        </span>
                      )}
                      {msg.adminNotes && msg.adminNotes.length > 0 && (
                        <span className="text-[#9CA3AF] flex items-center gap-0.5">
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

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8F7F2] shadow-sm p-6 flex flex-col justify-between overflow-y-auto max-h-[700px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F7F2] text-[#37B294] font-bold text-lg flex items-center justify-center flex-shrink-0">
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1F2A37]">{selectedMessage.name}</h3>
                      <button
                        type="button"
                        onClick={() => toggleMessageStar(selectedMessage.id)}
                        className="text-gray-300 hover:text-[#F5B301] cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            selectedMessage.starred ? 'fill-[#F5B301] text-[#F5B301]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#4CC9A7] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>{selectedMessage.email}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
                    className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 outline-none bg-white font-semibold text-[#1F2A37]"
                  >
                    <option value="new">Status: New</option>
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
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                    title={selectedMessage.archived ? 'Restore to Inbox' : 'Archive Inquiry'}
                  >
                    {selectedMessage.archived ? (
                      <ArchiveRestore className="w-4 h-4" />
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
                    className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service & Budget Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[#E8F7F2] text-[#37B294] font-semibold px-3 py-1 rounded-full">
                  Requested Service: {selectedMessage.service}
                </span>

                {selectedMessage.budget && (
                  <span className="bg-amber-50 text-amber-800 font-semibold px-3 py-1 rounded-full border border-amber-200">
                    Budget Range: {selectedMessage.budget}
                  </span>
                )}

                <span className="bg-gray-100 text-[#6B7280] px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Received: {selectedMessage.timestamp}
                </span>
              </div>

              {/* Inquiry Subject (if present) */}
              {selectedMessage.subject && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-semibold text-[#9CA3AF] block uppercase tracking-wider">
                    Subject Line:
                  </span>
                  <span className="text-xs font-bold text-[#1F2A37]">
                    {selectedMessage.subject}
                  </span>
                </div>
              )}

              {/* Inquiry Message Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2A37]">Client Inquiry Message</span>
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(selectedMessage.message, selectedMessage.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#4CC9A7] font-semibold hover:underline cursor-pointer"
                  >
                    {copiedId === selectedMessage.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-[#F7FCFA] rounded-2xl border border-gray-200 text-xs text-[#1F2A37] leading-relaxed whitespace-pre-wrap selection:bg-[#E8F7F2]">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Reply & Template Launcher */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1F2A37] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#4CC9A7]" />
                    <span>Quick Response Templates</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReplyComposer(!showReplyComposer)}
                    className="text-xs text-[#4CC9A7] font-semibold hover:underline cursor-pointer"
                  >
                    {showReplyComposer ? 'Hide Reply Box' : 'Compose Custom Reply'}
                  </button>
                </div>

                {/* Templates buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RESPONSE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="p-2.5 rounded-xl border border-gray-200 hover:border-[#4CC9A7] hover:bg-[#E8F7F2]/30 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-[#1F2A37] group-hover:text-[#37B294] block">
                        {tmpl.title}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] line-clamp-1 mt-0.5">
                        {tmpl.subject}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Reply Composer Form */}
                {showReplyComposer && (
                  <form
                    onSubmit={handleSendReply}
                    className="p-4 rounded-2xl bg-[#E8F7F2]/30 border border-[#4CC9A7]/40 space-y-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1F2A37]">
                        Compose Reply to {selectedMessage.name}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        Sends via email &amp; records in history
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#1F2A37] mb-1">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-xl border border-gray-200 outline-none bg-white focus:border-[#4CC9A7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#1F2A37] mb-1">
                        Email Message Body
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 outline-none bg-white focus:border-[#4CC9A7] resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReplyComposer(false)}
                        className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37] bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 rounded-full bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send &amp; Record Reply</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Sent Reply History */}
                {selectedMessage.replyHistory && selectedMessage.replyHistory.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-[#1F2A37] block">
                      Sent Reply History ({selectedMessage.replyHistory.length})
                    </span>
                    <div className="space-y-2">
                      {selectedMessage.replyHistory.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#37B294]">
                            <span>{rep.subject}</span>
                            <span className="text-[#9CA3AF] font-normal">{rep.sentAt}</span>
                          </div>
                          <p className="text-[#6B7280] whitespace-pre-wrap">{rep.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Admin Notes Section */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-[#1F2A37] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F2685F]" />
                  <span>Private Internal Admin Notes</span>
                </span>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add private note (e.g. quoted $6k, follow up on Friday)..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                {selectedMessage.adminNotes && selectedMessage.adminNotes.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedMessage.adminNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[#1F2A37] font-medium">{note.text}</span>
                          <span className="text-[10px] text-[#9CA3AF] block">
                            By {note.author} · {note.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#9CA3AF] italic">
                    No internal notes on this lead yet.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-32 text-[#9CA3AF] text-xs">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#4CC9A7]" />
              <span className="font-semibold block text-sm text-[#1F2A37]">
                No Message Selected
              </span>
              <span>Click on any inquiry from the left list to review complete details.</span>
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
