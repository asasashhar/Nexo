import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { ContactBanner } from './components/ContactBanner';
import { Footer } from './components/Footer';
import { ServiceWorksPage } from './components/ServiceWorksPage';
import { ContactModal } from './components/ContactModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { Toast } from './components/Toast';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Project } from './types';

function PortfolioAppContent() {
  const {
    isAdminLoggedIn,
    logoutAdmin,
    activeServiceId,
    setActiveServiceId,
  } = usePortfolio();

  // Top-level View Routing: 'public' | 'login' | 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'admin'>('public');

  // Modals
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactPresetService, setContactPresetService] = useState('Grow Your Reach');
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);

  // Global Toast
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

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  const handleOpenContactWithService = (service: string) => {
    setContactPresetService(service);
    setContactModalOpen(true);
  };

  const handleCaseStudyInquire = (projectTitle: string) => {
    setActiveCaseStudy(null);
    setContactPresetService(`Similar to ${projectTitle}`);
    setContactModalOpen(true);
  };

  // If in Admin Login View
  if (currentView === 'login') {
    return (
      <AdminLogin
        onBackToSite={() => setCurrentView('public')}
        onLoginSuccess={() => setCurrentView('admin')}
      />
    );
  }

  // If in Admin Dashboard View
  if (currentView === 'admin') {
    return (
      <AdminLayout
        onBackToSite={() => setCurrentView('public')}
        onLogout={() => {
          logoutAdmin();
          setCurrentView('public');
          showToast('Signed Out', 'You have been successfully logged out of the Admin panel.');
        }}
      />
    );
  }

  // Public Portfolio View
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#4B5552] font-sans selection:bg-[#E8F7F2] selection:text-[#2D9A7A]">
      {/* Toast Notification */}
      <Toast show={toast.show} title={toast.title} message={toast.message} />

      {/* Floating Sticky Navigation Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        onOpenContact={() => handleOpenContactWithService('Grow Your Reach')}
      />

      {/* Conditional: Dedicated Service Works Page or Main Sections */}
      {activeServiceId ? (
        <ServiceWorksPage
          serviceId={activeServiceId}
          onBack={() => setActiveServiceId(null)}
          onSelectProject={(p: Project) => setActiveCaseStudy(p)}
          onStartProjectWithService={(serviceName: string) => handleOpenContactWithService(serviceName)}
        />
      ) : (
        <main>
          {/* Hero Section */}
          <Hero
            onStartProject={() => handleOpenContactWithService('Grow Your Reach')}
            onSeeProcess={() => {
              const el = document.getElementById('process');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* About Us Section (Directly after Hero as requested) */}
          <About />

          {/* Services Section */}
          <Services onOpenServiceWorks={(serviceId: string) => setActiveServiceId(serviceId)} />

          {/* Selected Work Section */}
          <Work onSelectProject={(p: Project) => setActiveCaseStudy(p)} />

          {/* Our Design Process Section */}
          <Process />

          {/* Testimonials / What Clients Say Section */}
          <Testimonials onShowToast={showToast} />

          {/* Contact Banner Section (The design below what clients say) */}
          <ContactBanner
            onOpenContact={() => handleOpenContactWithService('Introductory Product Audit')}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenContact={() => handleOpenContactWithService('General Inquiry')}
        onSelectService={(serviceId: string) => setActiveServiceId(serviceId)}
      />

      {/* Quick Message / Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSuccessToast={showToast}
        initialService={contactPresetService}
      />

      {/* Case Study Detailed Modal */}
      <CaseStudyModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
        onSelectProject={(p) => setActiveCaseStudy(p)}
        onInquire={handleCaseStudyInquire}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioAppContent />
    </PortfolioProvider>
  );
}
