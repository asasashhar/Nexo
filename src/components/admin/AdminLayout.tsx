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
  Globe,
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
import { SeoModule } from './SeoModule';
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About & Mascot', icon: User },
    { id: 'services', label: 'What I Do (Services)', icon: Briefcase },
    { id: 'projects', label: 'Selected Work', icon: FolderGit2 },
    { id: 'process', label: 'Design Process', icon: GitCommit },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'contact', label: 'Contact & Social', icon: Mail },
    {
      id: 'messages',
      label: 'Messages Inbox',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
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
      case 'seo':
        return <SeoModule onShowToast={showToast} />;
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
    <div className="min-h-screen bg-[#F7FCFA] text-[#1F2A37] flex flex-col md:flex-row antialiased selection:bg-[#E8F7F2] selection:text-[#37B294]">
      <Toast show={toast.show} title={toast.title} message={toast.message} />

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#E8F7F2] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <NexoLogo size="sm" showTagline={false} />
            <span className="text-[10px] text-[#4CC9A7] uppercase font-bold bg-[#E8F7F2] px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToSite}
          className="text-xs font-semibold text-[#4CC9A7] flex items-center gap-1"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#E8F7F2] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <NexoLogo size="sm" showTagline={true} />

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-gray-400 hover:text-gray-700"
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E8F7F2] text-[#37B294] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2A37] hover:bg-[#F7FCFA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#4CC9A7]' : 'text-[#9CA3AF]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-[#F2685F] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer User Info & Exit */}
        <div className="p-4 border-t border-gray-100 bg-[#F7FCFA] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                AS
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#1F2A37] block leading-tight">
                  {adminUser?.name || 'Ashhar'}
                </span>
                <span className="text-[10px] text-[#9CA3AF]">Administrator</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToSite}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#1F2A37] text-xs font-semibold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#4CC9A7]" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E8F7F2] px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#1F2A37]">{activeLabel}</h1>
            <span className="text-xs text-[#9CA3AF]">·</span>
            <span className="text-xs text-[#4CC9A7] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Protected</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 bg-[#E8F7F2] hover:bg-[#D8F2E9] text-[#37B294] text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-red-500 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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
