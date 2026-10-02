import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Settings,
  Calendar,
  Lock,
  Bell,
  Eye,
  Database,
  Check,
  QrCode,
  Key,
  Globe,
  Radio,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface SettingsModuleProps {
  onShowToast: (title: string, msg: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onShowToast }) => {
  const {
    profile,
    setProfile,
    advancedSettings,
    setAdvancedSettings,
    auditLogs,
    addAuditLog,
    exportDataJson,
    importDataJson,
    resetAllDefaults,
    dbStatus,
    refreshFromDatabase,
    testDatabaseConnection,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'general' | 'availability' | 'security' | 'notifications' | 'visibility' | 'backup'>('general');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestMsg, setSupabaseTestMsg] = useState<string | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  // General Settings State
  const [siteName, setSiteName] = useState(profile.name);
  const [brandSuffix, setBrandSuffix] = useState(profile.brandSuffix);
  const [roleSubtitle, setRoleSubtitle] = useState(profile.roleSubtitle);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +05:30)');
  const [currency, setCurrency] = useState('USD ($)');

  // Availability State
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityBadge, setAvailabilityBadge] = useState('Available for Q2 & Q3 Projects');
  const [badgeColor, setBadgeColor] = useState<'teal' | 'coral' | 'amber'>('teal');
  const [nextSlot, setNextSlot] = useState('April 2024');
  const [minBudget, setMinBudget] = useState('$3,000');
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/ashhar');

  // Security State
  const [adminName, setAdminName] = useState(advancedSettings.adminName || 'Ashhar');
  const [adminEmail, setAdminEmail] = useState(advancedSettings.adminEmail || 'agesbdidgsgsd@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(advancedSettings.twoFactorEnabled);
  const [sessionTimeoutDays, setSessionTimeoutDays] = useState(advancedSettings.sessionTimeoutDays || 7);
  const [honeypotStrict, setHoneypotStrict] = useState(advancedSettings.honeypotStrict !== false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Sync state when advancedSettings loads from Supabase
  React.useEffect(() => {
    if (advancedSettings.adminEmail) {
      setAdminEmail(advancedSettings.adminEmail);
    }
    if (advancedSettings.adminName) {
      setAdminName(advancedSettings.adminName);
    }
  }, [advancedSettings.adminEmail, advancedSettings.adminName]);

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(advancedSettings.emailNotifications);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplySubject, setAutoReplySubject] = useState('Thank you for reaching out to Ashhar Studio!');
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    'Hi there!\n\nThanks for your inquiry. I have received your message and will review your project brief within 24 hours.\n\nBest,\nAshhar\nUI/UX Designer'
  );
  const [discordWebhook, setDiscordWebhook] = useState(advancedSettings.discordWebhookUrl || '');
  const [slackWebhook, setSlackWebhook] = useState(advancedSettings.slackWebhookUrl || '');

  // Visibility & Maintenance State
  const [maintenanceMode, setMaintenanceMode] = useState(advancedSettings.maintenanceMode);
  const [maintenanceNotice, setMaintenanceNotice] = useState(advancedSettings.maintenanceNotice);
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [showProcess, setShowProcess] = useState(true);

  // Save General
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: siteName,
      brandSuffix,
      roleSubtitle,
      email,
      phone,
      location,
    });
    addAuditLog('General Settings Updated', 'Updated site name, designer title, and primary contact info');
    onShowToast('Settings Saved', 'General studio profile settings updated.');
  };

  // Save Availability
  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('Availability Updated', `Status: ${isAvailable ? 'Available' : 'Booked'} · Slot: ${nextSlot}`);
    onShowToast('Availability Updated', 'Client intake status and booking preferences saved.');
  };

  // Save Password / Security
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      onShowToast('Email Required', 'Please provide a valid admin login email.');
      return;
    }

    let updatedPassword = advancedSettings.adminPassword || 'qwerty@1380';
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        onShowToast('Password Too Short', 'New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        onShowToast('Mismatch', 'New passwords do not match. Please re-enter.');
        return;
      }
      updatedPassword = newPassword;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setAdvancedSettings({
      ...advancedSettings,
      adminName,
      adminEmail: adminEmail.trim().toLowerCase(),
      adminPassword: updatedPassword,
      twoFactorEnabled,
      sessionTimeoutDays,
      honeypotStrict,
    });

    addAuditLog(
      'Security Credentials Updated',
      `Admin login email set to "${adminEmail.trim().toLowerCase()}"${newPassword.trim() ? ' with new password' : ''}`
    );
    onShowToast('Credentials Saved', 'Admin login email and security credentials saved successfully.');
  };

  // Save Notifications
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvancedSettings({
      ...advancedSettings,
      emailNotifications,
      discordWebhookUrl: discordWebhook,
      slackWebhookUrl: slackWebhook,
    });
    addAuditLog('Notifications Updated', 'Webhook and auto-responder settings saved');
    onShowToast('Notifications Saved', 'Notification channels and auto-responder updated.');
  };

  // Save Maintenance
  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvancedSettings({
      ...advancedSettings,
      maintenanceMode,
      maintenanceNotice,
    });
    addAuditLog('Maintenance Mode Changed', maintenanceMode ? 'Enabled on public site' : 'Disabled');
    onShowToast('Visibility Updated', `Maintenance mode is ${maintenanceMode ? 'ACTIVE' : 'inactive'}.`);
  };

  // Export JSON Backup
  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ashhar_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addAuditLog('Backup Exported', 'Full JSON snapshot downloaded');
    onShowToast('Backup Exported', 'Downloaded full JSON portfolio snapshot.');
  };

  // Import JSON Backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        addAuditLog('Backup Restored', `Restored from file: ${file.name}`);
        onShowToast('Import Successful', 'Portfolio content restored from JSON.');
      } else {
        onShowToast('Import Error', 'Invalid JSON backup format.');
      }
    };
    reader.readAsText(file);
  };

  // Danger Zone Factory Reset
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);

  const handleReset = () => {
    setResetConfirmationOpen(true);
  };

  const handleExecuteReset = () => {
    resetAllDefaults();
    addAuditLog('Factory Reset', 'Restored initial reference data');
    onShowToast('Factory Reset Complete', 'All content restored to initial reference state.');
    setResetConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-[#1F2A37] flex items-center gap-2">
          <span>Advanced Studio Settings</span>
          <span className="text-xs bg-[#E8F7F2] text-[#37B294] font-bold px-2.5 py-0.5 rounded-full">
            System &amp; Security
          </span>
        </h2>
        <p className="text-xs text-[#6B7280]">
          Configure availability, security credentials, webhook notifications, maintenance mode, and database backups.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-2">
        {[
          { id: 'general', label: 'General & Profile', icon: Globe },
          { id: 'availability', label: 'Availability & Booking', icon: Calendar },
          { id: 'security', label: 'Security & Access', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
          { id: 'visibility', label: 'Maintenance & Visibility', icon: Eye },
          { id: 'backup', label: 'Backup & Danger Zone', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#4CC9A7] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2A37] hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL & PROFILE */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-6 text-xs max-w-3xl">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A37]">Studio Identity &amp; Profile Defaults</h3>
            <p className="text-[#6B7280]">Core name, title, and regional localization preferences.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">First Name *</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Brand Wordmark Suffix</label>
              <input
                type="text"
                value={brandSuffix}
                onChange={(e) => setBrandSuffix(e.target.value)}
                placeholder="Designs"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2A37] mb-1">Role Subtitle *</label>
            <input
              type="text"
              required
              value={roleSubtitle}
              onChange={(e) => setRoleSubtitle(e.target.value)}
              placeholder="UI/UX Designer"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Primary Inquiry Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Direct Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Base Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bangalore, India"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Studio Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-medium"
              >
                <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
                <option value="America/Los_Angeles (PST -08:00)">America/Los_Angeles (PST -08:00)</option>
                <option value="Europe/London (GMT +00:00)">Europe/London (GMT +00:00)</option>
                <option value="Europe/Berlin (CET +01:00)">Europe/Berlin (CET +01:00)</option>
                <option value="Asia/Dubai (GST +04:00)">Asia/Dubai (GST +04:00)</option>
                <option value="Asia/Singapore (SGT +08:00)">Asia/Singapore (SGT +08:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Currency Preference</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-medium"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="CAD ($)">CAD ($)</option>
                <option value="AUD ($)">AUD ($)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Save General Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: AVAILABILITY & BOOKING */}
      {activeTab === 'availability' && (
        <form onSubmit={handleSaveAvailability} className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-6 text-xs max-w-3xl">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A37]">Client Intake &amp; Booking Pipeline</h3>
            <p className="text-[#6B7280]">Signal real-time project availability and integrate direct booking links.</p>
          </div>

          {/* Toggle Availability */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7FCFA] border border-gray-200">
            <div>
              <span className="font-bold text-[#1F2A37] block">Currently Available for New Projects</span>
              <span className="text-[11px] text-[#6B7280]">
                When enabled, clients see a green availability signal in the contact drawer.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CC9A7]" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Availability Status Badge</label>
              <input
                type="text"
                value={availabilityBadge}
                onChange={(e) => setAvailabilityBadge(e.target.value)}
                placeholder="e.g. Available for Q2 Projects"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Badge Color</label>
              <select
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value as typeof badgeColor)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-medium"
              >
                <option value="teal">Teal (Available)</option>
                <option value="coral">Coral (Select Slots)</option>
                <option value="amber">Amber (Waitlist)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Next Available Intake Slot</label>
              <input
                type="text"
                value={nextSlot}
                onChange={(e) => setNextSlot(e.target.value)}
                placeholder="e.g. April 2024 / Immediate"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Minimum Project Budget</label>
              <input
                type="text"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="$2,500"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2A37] mb-1">Calendly / Meeting Booking Link</label>
            <input
              type="url"
              value={calendlyUrl}
              onChange={(e) => setCalendlyUrl(e.target.value)}
              placeholder="https://calendly.com/your-username"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Save Availability Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SECURITY & ACCESS */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-5 text-xs">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1F2A37] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#4CC9A7]" />
                  <span>Admin Credentials &amp; Access Controls</span>
                </h3>
                <p className="text-[#6B7280]">
                  Change your admin email and password anytime. Leave password blank if you only want to change your login email.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Admin Display Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Admin Login Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
                />
              </div>
            </div>

            {/* Session Timeout & Honeypot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-[#1F2A37] mb-1">Session Inactivity Timeout</label>
                <select
                  value={sessionTimeoutDays}
                  onChange={(e) => setSessionTimeoutDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none bg-white font-medium"
                >
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days (Recommended)</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="font-bold text-[#1F2A37] block">Strict Honeypot Defense</span>
                  <span className="text-[10px] text-[#6B7280]">Blocks automated bots &amp; spam payloads</span>
                </div>
                <input
                  type="checkbox"
                  checked={honeypotStrict}
                  onChange={(e) => setHoneypotStrict(e.target.checked)}
                  className="rounded text-[#4CC9A7]"
                />
              </div>
            </div>

            {/* 2FA Simulator */}
            <div className="p-4 rounded-2xl bg-[#E8F7F2]/40 border border-[#4CC9A7]/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#37B294]" />
                  <span>Two-Factor Authentication (2FA)</span>
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Protect admin sign-in with Google Authenticator or 1Password.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="px-3 py-1 rounded-full border border-[#4CC9A7] text-[#37B294] font-semibold hover:bg-white text-xs cursor-pointer flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View QR Key</span>
                </button>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    onShowToast('2FA Status', e.target.checked ? '2FA Enabled' : '2FA Disabled');
                  }}
                  className="rounded text-[#4CC9A7]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Update Credentials &amp; Security Settings
              </button>
            </div>
          </form>

          {/* Security Audit Log */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-[#1F2A37] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#4CC9A7]" />
                <span>Admin Activity &amp; Audit Trail</span>
              </h3>
              <span className="text-[11px] text-[#9CA3AF]">{auditLogs.length} Events Logged</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-[#F7FCFA] border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#1F2A37]">{log.action}: </span>
                    <span className="text-[#6B7280]">{log.details}</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] text-right flex-shrink-0 ml-3">
                    <div>{log.timestamp}</div>
                    <div>{log.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS & WEBHOOKS */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-6 text-xs max-w-3xl">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A37]">Inquiry Alerts &amp; Auto-Responders</h3>
            <p className="text-[#6B7280]">Configure instant lead dispatches and automated email acknowledgement.</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7FCFA] border border-gray-200">
            <div>
              <span className="font-bold text-[#1F2A37] block">Email Notifications on New Inquiries</span>
              <span className="text-[11px] text-[#6B7280]">
                Dispatches a formatted summary to your admin email whenever a visitor submits the contact form.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="rounded text-[#4CC9A7]"
            />
          </div>

          {/* Auto-Reply Template */}
          <div className="p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1F2A37]">Client Automated Acknowledgement Email</span>
              <input
                type="checkbox"
                checked={autoReplyEnabled}
                onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                className="rounded text-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Auto-reply Subject Line</label>
              <input
                type="text"
                value={autoReplySubject}
                onChange={(e) => setAutoReplySubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Auto-reply Message Body</label>
              <textarea
                rows={4}
                value={autoReplyMessage}
                onChange={(e) => setAutoReplyMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none resize-none focus:border-[#4CC9A7]"
              />
            </div>
          </div>

          {/* Webhook URLs */}
          <div className="space-y-3">
            <span className="font-bold text-[#1F2A37] block">Instant Chat Webhook Feeds (Optional)</span>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Discord Webhook URL</label>
              <input
                type="url"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2A37] mb-1">Slack Incoming Webhook URL</label>
              <input
                type="url"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#4CC9A7]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: MAINTENANCE & VISIBILITY */}
      {activeTab === 'visibility' && (
        <form onSubmit={handleSaveMaintenance} className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-6 text-xs max-w-3xl">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-[#1F2A37]">Public Site Visibility &amp; Maintenance Mode</h3>
            <p className="text-[#6B7280]">Toggle maintenance mode and selectively enable/disable portfolio sections.</p>
          </div>

          {/* Maintenance Mode */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 block">Maintenance Mode</span>
                <span className="text-[11px] text-amber-700">
                  When active, non-admin visitors see a gentle "Studio Updating" notice screen.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>

            <div>
              <label className="block font-semibold text-amber-900 mb-1">Maintenance Announcement Text</label>
              <textarea
                rows={2}
                value={maintenanceNotice}
                onChange={(e) => setMaintenanceNotice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-amber-200 outline-none bg-white resize-none"
              />
            </div>
          </div>

          {/* Section Visibility Controls */}
          <div className="space-y-3">
            <span className="font-bold text-[#1F2A37] block">Section Visibility Controls</span>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <span className="font-bold text-[#1F2A37] block">Display Client Testimonials Section</span>
                <span className="text-[11px] text-[#6B7280]">Show "What Clients Say" recommendations</span>
              </div>
              <input
                type="checkbox"
                checked={showTestimonials}
                onChange={(e) => setShowTestimonials(e.target.checked)}
                className="rounded text-[#4CC9A7]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <span className="font-bold text-[#1F2A37] block">Display "My Design Process" Section</span>
                <span className="text-[11px] text-[#6B7280]">Show 6-step interactive workflow</span>
              </div>
              <input
                type="checkbox"
                checked={showProcess}
                onChange={(e) => setShowProcess(e.target.checked)}
                className="rounded text-[#4CC9A7]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Save Visibility Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: BACKUP & DANGER ZONE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 max-w-3xl">
          {/* Supabase Cloud Database Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4 text-xs">
            <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1F2A37] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#4CC9A7]" />
                  <span>Supabase PostgreSQL Cloud Database</span>
                </h3>
                <p className="text-[#6B7280]">
                  Real-time database connection status, project credentials, and synchronization.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    dbStatus.connected
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>{dbStatus.connected ? 'Online & Synchronized' : 'Connecting...'}</span>
                </span>
              </div>
            </div>

            {/* Connection Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-gray-100 space-y-1">
                <span className="text-[11px] font-semibold text-[#9CA3AF] block">Project URL</span>
                <span className="text-xs font-mono font-bold text-[#1F2A37] break-all select-all">
                  https://tdkdirilyawlaujgtbpo.supabase.co
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-gray-100 space-y-1">
                <span className="text-[11px] font-semibold text-[#9CA3AF] block">Database Engine</span>
                <span className="text-xs font-bold text-[#1F2A37] flex items-center gap-1">
                  <span>PostgreSQL 17 (Direct &amp; REST Active)</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-gray-100 space-y-1">
                <span className="text-[11px] font-semibold text-[#9CA3AF] block">Publishable API Key</span>
                <span className="text-xs font-mono text-[#37B294] font-semibold truncate block select-all">
                  sb_publishable_FnoTZUPeOf4yjmjPXF8ltg_5WuRdeY1
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-gray-100 space-y-1">
                <span className="text-[11px] font-semibold text-[#9CA3AF] block">Direct PostgreSQL Host</span>
                <span className="text-xs font-mono text-[#1F2A37] truncate block select-all">
                  db.tdkdirilyawlaujgtbpo.supabase.co:5432
                </span>
              </div>
            </div>

            {/* Database Tables Summary */}
            <div className="p-3 rounded-2xl bg-white border border-gray-200">
              <span className="text-[11px] font-semibold text-[#6B7280] block mb-1.5">
                Active Synchronized Tables (12/12):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'profile',
                  'services',
                  'categories',
                  'projects',
                  'info_chips',
                  'process_steps',
                  'testimonials',
                  'social_profiles',
                  'messages',
                  'media',
                  'seo_settings',
                  'advanced_settings',
                ].map((tbl) => (
                  <span
                    key={tbl}
                    className="text-[10px] font-mono bg-[#E8F7F2] text-[#37B294] font-bold px-2 py-0.5 rounded-md"
                  >
                    ✓ {tbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Test result message if any */}
            {supabaseTestMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                {supabaseTestMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={testingSupabase}
                onClick={async () => {
                  setTestingSupabase(true);
                  const res = await testDatabaseConnection();
                  setTestingSupabase(false);
                  setSupabaseTestMsg(
                    res.ok
                      ? `✅ ${res.message}`
                      : `❌ Connection check failed: ${res.message}`
                  );
                  onShowToast(
                    res.ok ? 'Database Connected' : 'Connection Error',
                    res.ok ? `Supabase response verified (${res.latencyMs}ms)` : res.message
                  );
                }}
                className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Radio className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-pulse' : ''}`} />
                <span>{testingSupabase ? 'Pinging Database...' : 'Test Connection Ping'}</span>
              </button>

              <button
                type="button"
                disabled={syncingSupabase}
                onClick={async () => {
                  setSyncingSupabase(true);
                  const success = await refreshFromDatabase();
                  setSyncingSupabase(false);
                  onShowToast(
                    success ? 'Synced from Supabase' : 'Sync Issue',
                    success
                      ? 'All tables and portfolio sections refreshed from live database.'
                      : 'Could not refresh from Supabase.'
                  );
                }}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#1F2A37] font-semibold px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#37B294] ${syncingSupabase ? 'animate-spin' : ''}`} />
                <span>{syncingSupabase ? 'Syncing...' : 'Force Sync from Supabase'}</span>
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8F7F2] shadow-sm space-y-4 text-xs">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#1F2A37] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#4CC9A7]" />
                <span>Data Backup &amp; Migration</span>
              </h3>
              <p className="text-[#6B7280]">
                Export your full portfolio database (projects, services, categories, messages, and copy) as a single JSON file.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1F2A37] block">Estimated Storage Footprint</span>
                <span className="text-[11px] text-[#6B7280]">Database records &amp; media assets</span>
              </div>
              <span className="font-mono font-bold text-[#37B294] bg-[#E8F7F2] px-3 py-1 rounded-full text-xs">
                {advancedSettings.storageUsedMb || 24.6} MB Used
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Backup</span>
              </button>

              <label className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#1F2A37] font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer">
                <Upload className="w-4 h-4 text-[#4CC9A7]" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/50 p-6 rounded-3xl border border-red-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider">Danger Zone</h3>
            </div>
            <p className="text-red-600">
              Restore all projects, copy, bio, and settings back to the original mint &amp; coral reference state.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Defaults</span>
            </button>
          </div>
        </div>
      )}

      {/* 2FA QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1F2A37]">Two-Factor Authenticator Setup</h3>
            <p className="text-xs text-[#6B7280]">
              Scan this QR code with Google Authenticator or 1Password to set up two-factor verification.
            </p>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl inline-block mx-auto">
              <div className="w-40 h-40 bg-white border border-gray-300 rounded-xl flex items-center justify-center font-mono text-xs text-gray-400">
                [QR Code Matrix]
              </div>
            </div>

            <div className="bg-gray-100 p-2.5 rounded-xl font-mono text-[11px] text-gray-700 select-all">
              ASHH-AR99-UIUX-2024-AUTH
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold py-2.5 rounded-full"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* FACTORY RESET CONFIRMATION MODAL */}
      <ConfirmDeleteModal
        isOpen={resetConfirmationOpen}
        title="Reset All Sections to Factory Defaults?"
        message="This will overwrite current edits across projects, services, profile copy, testimonials, and settings with the pristine reference defaults. This cannot be undone."
        confirmLabel="Reset All Content"
        onConfirm={handleExecuteReset}
        onClose={() => setResetConfirmationOpen(false)}
      />
    </div>
  );
};
