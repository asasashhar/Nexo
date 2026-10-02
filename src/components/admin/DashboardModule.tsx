import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  FolderGit2,
  CheckCircle,
  MessageSquare,
  Users,
  TrendingUp,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Mail,
  Calendar,
  Database,
  RefreshCw,
  Palette,
  Check,
} from 'lucide-react';

interface DashboardModuleProps {
  onNavigateTab: (tabId: string) => void;
  onOpenNewProject: () => void;
  onOpenNewTestimonial: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigateTab,
  onOpenNewProject,
  onOpenNewTestimonial,
}) => {
  const {
    projects,
    testimonials,
    messages,
    visitsThisWeek,
    dbStatus,
    refreshFromDatabase,
    testDatabaseConnection,
  } = usePortfolio();

  const [testingDb, setTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<string | null>(null);

  const handleTestDb = async () => {
    setTestingDb(true);
    const res = await testDatabaseConnection();
    setDbTestResult(res.ok ? `Connected (${res.latencyMs}ms)` : `Error: ${res.message}`);
    setTestingDb(false);
    setTimeout(() => setDbTestResult(null), 4000);
  };

  const publishedProjects = projects.filter((p) => p.published).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const statCards = [
    {
      title: 'Total Selected Works',
      value: projects.length,
      sub: `${publishedProjects} published systems`,
      icon: FolderGit2,
      color: 'text-[#4CC9A7]',
      bg: 'bg-[#E8F7F2]',
    },
    {
      title: 'Client Endorsements',
      value: testimonials.length,
      sub: '100% 5-star verified',
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Unread Inquiries',
      value: unreadMessages,
      sub: `${messages.length} total received`,
      icon: MessageSquare,
      color: 'text-[#EE6E50]',
      bg: 'bg-[#FDF1EE]',
    },
    {
      title: 'Sprint Velocity',
      value: visitsThisWeek.toLocaleString(),
      sub: '+24% MoM engagement',
      icon: TrendingUp,
      color: 'text-[#1B4D3E]',
      bg: 'bg-[#E8F5F0]',
    },
  ];

  const weeklyVisits = [
    { day: 'Mon', visits: 180 },
    { day: 'Tue', visits: 230 },
    { day: 'Wed', visits: 290 },
    { day: 'Thu', visits: 240 },
    { day: 'Fri', visits: 310 },
    { day: 'Sat', visits: 140 },
    { day: 'Sun', visits: 190 },
  ];
  const maxVisit = Math.max(...weeklyVisits.map((v) => v.visits));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#E8F7F2] to-white p-6 sm:p-8 rounded-3xl border border-[#D8F2E9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#111615]">Studio CMS Hub</h2>
            <span className="bg-[#4CC9A7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Live Production
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5A6561] mt-1">
            Your portfolio website is live and receiving client inquiries. Here is your operational telemetry.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Work</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('site-images')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-[#DCDAD2] text-[#111615] text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-2xs cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-[#4CC9A7]" />
            <span>Website Images</span>
          </button>
        </div>
      </div>

      {/* Supabase Live DB Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCDAD2] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E8F7F2] text-[#4CC9A7] flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111615]">Supabase PostgreSQL Database</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  dbStatus.connected
                    ? 'bg-[#E8F5F0] text-[#1B4D3E]'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dbStatus.connected ? 'bg-[#3FB98B] animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{dbStatus.connected ? 'Connected & Synced' : 'Connecting...'}</span>
              </span>
            </div>
            <div className="text-[11px] text-[#5A6561] font-mono mt-0.5">
              <span>{dbStatus.projectRef}.supabase.co</span>
              <span className="mx-1.5 text-gray-300">|</span>
              <span>Checked: {dbStatus.lastChecked}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {dbTestResult && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {dbTestResult}
            </span>
          )}
          <button
            type="button"
            onClick={handleTestDb}
            disabled={testingDb}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#DCDAD2] hover:border-[#4CC9A7] text-[#111615] text-xs font-semibold bg-white hover:bg-[#FAF9F5] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-[#4CC9A7] ${testingDb ? 'animate-spin' : ''}`} />
            <span>{testingDb ? 'Testing...' : 'Test DB Ping'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#DCDAD2] shadow-soft-card flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-[#8C9793] font-medium block">{card.title}</span>
                <strong className="text-2xl font-black text-[#111615] block mt-0.5">
                  {card.value}
                </strong>
                <span className="text-[11px] text-[#5A6561] mt-1 block font-medium">{card.sub}</span>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Recent Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#DCDAD2] shadow-soft-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#111615]">Weekly Velocity</h3>
              <p className="text-xs text-[#8C9793]">Daily unique impressions across client touchpoints</p>
            </div>
            <span className="text-xs font-bold text-[#2D9A7A] bg-[#E8F7F2] px-2.5 py-1 rounded-full">
              Avg 211 / day
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {weeklyVisits.map((item, idx) => {
              const heightPercent = Math.round((item.visits / maxVisit) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-semibold text-[#8C9793] group-hover:text-[#4CC9A7] transition-colors">
                    {item.visits}
                  </span>
                  <div className="w-full bg-[#FAF9F6] rounded-t-xl overflow-hidden h-32 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-[#4CC9A7] group-hover:bg-[#37B294] transition-all rounded-t-xl"
                    />
                  </div>
                  <span className="text-xs font-medium text-[#5A6561]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#DCDAD2] shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111615] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#F2685F]" />
                <span>Recent Partner Inquiries</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('messages')}
                className="text-xs font-bold text-[#4CC9A7] hover:underline cursor-pointer"
              >
                View all ({messages.length})
              </button>
            </div>

            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigateTab('messages')}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer hover:border-[#4CC9A7] transition-all ${
                    msg.read ? 'bg-[#FAF9F5] border-gray-100' : 'bg-white border-[#4CC9A7]/40 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111615] font-bold">{msg.name}</strong>
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-[#F2685F]" />}
                    </div>
                    <span className="text-[10px] text-[#8C9793]">{msg.timestamp}</span>
                  </div>
                  <p className="text-[#5A6561] line-clamp-1">{msg.message}</p>
                  <span className="text-[10px] text-[#2D9A7A] font-bold mt-1 block">
                    {msg.service}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-[#8C9793]">Filtered by Honeypot</span>
            <button
              type="button"
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-bold text-[#111615] hover:text-[#4CC9A7] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Inbox details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
