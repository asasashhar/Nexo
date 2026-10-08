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
  Database,
  RefreshCw,
  Palette,
  Zap,
  Globe,
  Megaphone,
  Box,
  Camera,
  ExternalLink,
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

  // Breakdown by the 4 poster pillars
  const webProjects = projects.filter(
    (p) => p.workType === 'web' || p.category.toLowerCase().includes('web')
  ).length;
  const posterProjects = projects.filter(
    (p) => p.workType === 'poster' || p.category.toLowerCase().includes('poster')
  ).length;
  const adProjects = projects.filter(
    (p) => p.workType === 'ad' || p.category.toLowerCase().includes('ad')
  ).length;
  const productPosterProjects = projects.filter(
    (p) => p.workType === 'product_poster' || p.category.toLowerCase().includes('product')
  ).length;

  const statCards = [
    {
      title: 'Selected Works',
      value: projects.length,
      sub: `${publishedProjects} live systems`,
      icon: FolderGit2,
      color: 'text-[#00E599]',
      bg: 'bg-[#00E599]/15 border border-[#00E599]/30',
    },
    {
      title: 'Client Reviews',
      value: testimonials.length,
      sub: 'Verified 5-star ratings',
      icon: Users,
      color: 'text-[#FFB800]',
      bg: 'bg-[#FFB800]/15 border border-[#FFB800]/30',
    },
    {
      title: 'Client Inquiries',
      value: unreadMessages,
      sub: `${messages.length} total briefs`,
      icon: MessageSquare,
      color: 'text-[#FF5A36]',
      bg: 'bg-[#FF5A36]/15 border border-[#FF5A36]/30',
    },
    {
      title: 'Weekly Velocity',
      value: visitsThisWeek.toLocaleString(),
      sub: '+32% MoM reach',
      icon: TrendingUp,
      color: 'text-[#06B6D4]',
      bg: 'bg-[#06B6D4]/15 border border-[#06B6D4]/30',
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

  const posterPillars = [
    {
      title: 'Web Design',
      category: 'User-Friendly Websites',
      count: webProjects,
      color: '#00E599',
      border: 'border-[#00E599]/30',
      bg: 'bg-[#00E599]/10',
      icon: Globe,
      description: 'Modern, high-conversion responsive web architectures.',
    },
    {
      title: 'Poster Making',
      category: 'Visual Graphic Art',
      count: posterProjects,
      color: '#FF5A36',
      border: 'border-[#FF5A36]/30',
      bg: 'bg-[#FF5A36]/10',
      icon: Palette,
      description: 'Eye-catching promotional, event, and brand posters.',
    },
    {
      title: 'Ads Creation',
      category: 'Motion & Video Campaigns',
      count: adProjects,
      color: '#06B6D4',
      border: 'border-[#06B6D4]/30',
      bg: 'bg-[#06B6D4]/10',
      icon: Megaphone,
      description: 'Dynamic kinetic motion ads and social reels.',
    },
    {
      title: 'Product Poster',
      category: 'Commercial 3D Renders',
      count: productPosterProjects,
      color: '#A855F7',
      border: 'border-[#A855F7]/30',
      bg: 'bg-[#A855F7]/10',
      icon: Box,
      description: '3D packaging highlights and e-commerce display graphics.',
    },
  ];

  return (
    <div className="space-y-6 text-white">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F1522] via-[#141C2E] to-[#0F1522] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              NEXO Studio Command Hub
            </h2>
            <span className="bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Live &amp; Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time control center for Web Design, Poster Graphics, Video Ads, and Client Briefs.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-1.5 bg-[#00E599] hover:bg-[#00B377] text-black text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Work / Poster</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('hero')}
            className="inline-flex items-center gap-1.5 bg-[#080B11] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#00E599]" />
            <span>Hero Visual</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('about')}
            className="inline-flex items-center gap-1.5 bg-[#080B11] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Team &amp; Story</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('services')}
            className="inline-flex items-center gap-1.5 bg-[#080B11] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Core Services</span>
          </button>
        </div>
      </div>

      {/* Supabase Live DB Banner */}
      <div className="bg-[#0F1522] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-sans">Supabase PostgreSQL Engine</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  dbStatus.connected
                    ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dbStatus.connected ? 'bg-[#00E599] animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{dbStatus.connected ? 'Connected & Synced' : 'Syncing...'}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              <span>{dbStatus.projectRef}.supabase.co</span>
              <span className="mx-1.5 text-slate-600">|</span>
              <span>Last Checked: {dbStatus.lastChecked}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {dbTestResult && (
            <span className="text-[11px] font-semibold text-[#00E599] bg-[#00E599]/10 px-2.5 py-1 rounded-lg border border-[#00E599]/30 font-mono">
              {dbTestResult}
            </span>
          )}
          <button
            type="button"
            onClick={handleTestDb}
            disabled={testingDb}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-700 hover:border-[#00E599] text-white text-xs font-semibold bg-[#080B11] hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-[#00E599] ${testingDb ? 'animate-spin' : ''}`} />
            <span>{testingDb ? 'Testing...' : 'Test DB Ping'}</span>
          </button>
        </div>
      </div>

      {/* 4 Poster Offerings Matrix (Directly matches the poster) */}
      <div className="bg-[#0F1522] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E599]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Core Studio Capabilities (Poster Pillars)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              The 4 signature disciplines featured in the NEXO brand poster.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('services')}
            className="text-xs font-semibold text-[#00E599] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {posterPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab('projects')}
                className={`p-4 rounded-2xl bg-[#080B11] border ${pillar.border} hover:bg-[#0D121D] transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${pillar.bg} flex items-center justify-center`}
                      style={{ color: pillar.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{
                        backgroundColor: `${pillar.color}20`,
                        color: pillar.color,
                        border: `1px solid ${pillar.color}40`,
                      }}
                    >
                      {pillar.count} {pillar.count === 1 ? 'Work' : 'Works'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans group-hover:text-[#00E599] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{pillar.category}</span>
                  <span className="text-[#00E599] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-[#0F1522] rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-slate-400 font-medium block">{card.title}</span>
                <strong className="text-2xl font-black text-white block mt-0.5 font-sans">
                  {card.value}
                </strong>
                <span className="text-[11px] text-slate-400 mt-1 block font-medium">{card.sub}</span>
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
        <div className="lg:col-span-7 bg-[#0F1522] rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Weekly Traffic Velocity</h3>
              <p className="text-xs text-slate-400">Daily unique impressions across client touchpoints</p>
            </div>
            <span className="text-xs font-bold text-[#00E599] bg-[#00E599]/15 px-3 py-1 rounded-full border border-[#00E599]/30">
              Avg 211 / day
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {weeklyVisits.map((item, idx) => {
              const heightPercent = Math.round((item.visits / maxVisit) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-[#00E599] transition-colors">
                    {item.visits}
                  </span>
                  <div className="w-full bg-[#080B11] rounded-t-xl overflow-hidden h-32 flex items-end border border-slate-800">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#00E599]/50 to-[#00E599] group-hover:from-[#00E599] group-hover:to-[#2DD4BF] transition-all rounded-t-xl"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-5 bg-[#0F1522] rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-sans">Recent Client Inquiries</h3>
              <button
                type="button"
                onClick={() => onNavigateTab('messages')}
                className="text-xs text-[#00E599] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No inquiries received yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onNavigateTab('messages')}
                    className="p-3 rounded-xl bg-[#080B11] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-white block truncate">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {msg.service} · {msg.budget || '₹35k-₹75k'}
                      </span>
                    </div>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A36] shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-500 flex justify-between">
            <span>Client briefs auto-synced</span>
            <span className="text-[#00E599] font-mono">Realtime Push</span>
          </div>
        </div>
      </div>
    </div>
  );
};
