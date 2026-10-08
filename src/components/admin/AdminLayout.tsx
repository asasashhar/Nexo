import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  Sparkles,
  User,
  Briefcase,
  FolderGit2,
  GitCommit,
  Users,
  Mail,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { DashboardModule } from './DashboardModule';
import { HeroModule } from './HeroModule';
import { AboutModule } from './AboutModule';
import { ServicesModule } from './ServicesModule';
import { ProjectsModule } from './ProjectsModule';
import { ProcessModule } from './ProcessModule';
import { TestimonialsModule } from './TestimonialsModule';
import { ContactSocialModule } from './ContactSocialModule';
import { MessagesModule } from './MessagesModule';
import { MediaModule } from './MediaModule';
import { SettingsModule } from './SettingsModule';
import { Toast } from '../Toast';
import { NexoLogo } from '../NexoLogo';

interface AdminLayoutProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToSite, onLogout }) => {
  const { adminUser, logoutAdmin, messages } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    if (onLogout) {
      onLogout();
    } else {
      onBackToSite();
    }
  };

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section Visual', icon: Sparkles },
    { id: 'about', label: 'About Studio & Team', icon: Users },
    { id: 'services', label: 'Studio Services', icon: Briefcase },
    { id: 'projects', label: 'Selected Work', icon: FolderGit2 },
    { id: 'process', label: 'Creative Process', icon: GitCommit },
    { id: 'testimonials', label: 'Client Reviews', icon: ShieldCheck },
    { id: 'contact', label: 'Contact & Socials', icon: Mail },
    {
      id: 'messages',
      label: 'Client Inquiries',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardModule
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProject={() => setActiveTab('projects')}
            onOpenNewTestimonial={() => setActiveTab('testimonials')}
          />
        );
      case 'hero':
        return <HeroModule onShowToast={showToast} />;
      case 'about':
        return <AboutModule onShowToast={showToast} />;
      case 'services':
        return <ServicesModule onShowToast={showToast} />;
      case 'projects':
        return <ProjectsModule onShowToast={showToast} />;
      case 'process':
        return <ProcessModule onShowToast={showToast} />;
      case 'testimonials':
        return <TestimonialsModule onShowToast={showToast} />;
      case 'contact':
        return <ContactSocialModule onShowToast={showToast} />;
      case 'messages':
        return <MessagesModule onShowToast={showToast} />;
      case 'media':
        return <MediaModule onShowToast={showToast} />;
      case 'settings':
        return <SettingsModule onShowToast={showToast} />;
      default:
        return (
          <DashboardModule
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProject={() => setActiveTab('projects')}
            onOpenNewTestimonial={() => setActiveTab('testimonials')}
          />
        );
    }
  };

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-[#00E599]/30 selection:text-[#00E599]">
      <Toast show={toast.show} title={toast.title} message={toast.message} />

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0D121D] border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <NexoLogo size="sm" showTagline={false} />
            <span className="text-[10px] text-[#00E599] uppercase font-bold bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/30">
              Admin
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToSite}
          className="text-xs font-semibold text-[#00E599] flex items-center gap-1"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0D121D] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <NexoLogo size="sm" showText={true} showTagline={true} />

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00E599]/15 text-[#00E599] border-r-2 border-[#00E599] shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#00E599]' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-[#FF5A36] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer User Info & Exit */}
        <div className="p-4 border-t border-slate-800 bg-[#080B11] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00E599]/20 text-[#00E599] font-bold text-xs flex items-center justify-center border border-[#00E599]/40">
                NX
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block leading-tight">
                  {adminUser?.name || 'Nexo Studio'}
                </span>
                <span className="text-[10px] text-slate-400">Master Admin</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToSite}
            className="w-full bg-[#0D121D] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00E599]" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#080B11]">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 bg-[#0D121D]/90 backdrop-blur-md border-b border-slate-800 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white">{activeLabel}</h1>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-[#00E599] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio CMS</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 bg-[#00E599]/10 hover:bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30 text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 font-semibold px-3 py-2 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Module Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};
