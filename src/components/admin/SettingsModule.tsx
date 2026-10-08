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
  Save,
  CheckCircle,
  X,
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

  const [activeTab, setActiveTab] = useState<
    'general' | 'availability' | 'security' | 'notifications' | 'visibility' | 'backup'
  >('general');
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
  const [currency, setCurrency] = useState('INR (₹)');

  // Availability State
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityBadge, setAvailabilityBadge] = useState('Available for Q2 & Q3 Projects');
  const [badgeColor, setBadgeColor] = useState<'teal' | 'coral' | 'amber'>('teal');
  const [nextSlot, setNextSlot] = useState('Immediate / Next Sprint');
  const [minBudget, setMinBudget] = useState('₹25,000');
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/nexo-studio');

  // Security State
  const [adminName, setAdminName] = useState(advancedSettings.adminName || 'NEXO Studio');
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
  const [autoReplySubject, setAutoReplySubject] = useState('Thank you for reaching out to NEXO Studio!');
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    'Hi there!\n\nThanks for your inquiry. We have received your project brief and will review your requirements within 24 hours.\n\nBest,\nThe NEXO Studio Team\nCreative Solutions For A Stronger Tomorrow'
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
        onShowToast('Password Mismatch', 'New password confirmation does not match.');
        return;
      }
      updatedPassword = newPassword.trim();
    }

    setAdvancedSettings({
      ...advancedSettings,
      adminEmail: adminEmail.trim(),
      adminName: adminName.trim(),
      adminPassword: updatedPassword,
      twoFactorEnabled,
      sessionTimeoutDays,
      honeypotStrict,
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addAuditLog('Security Credentials Updated', `Admin email set to ${adminEmail.trim()}`);
    onShowToast('Security Updated', 'Admin credentials and 2FA settings saved successfully.');
  };

  // Save Notifications
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvancedSettings({
      ...advancedSettings,
      emailNotifications,
      discordWebhookUrl: discordWebhook.trim(),
      slackWebhookUrl: slackWebhook.trim(),
    });
    addAuditLog('Notifications Updated', `Email alerts: ${emailNotifications ? 'On' : 'Off'}`);
    onShowToast('Notifications Saved', 'Webhook routing and alert preferences stored.');
  };

  // Save Maintenance
  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvancedSettings({
      ...advancedSettings,
      maintenanceMode,
      maintenanceNotice: maintenanceNotice.trim(),
    });
    addAuditLog('Maintenance Updated', `Maintenance Mode: ${maintenanceMode ? 'Enabled' : 'Disabled'}`);
    onShowToast('Visibility Saved', 'Maintenance mode and section display toggles updated.');
  };

  // Backup & Import Handlers
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleExportBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexo_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addAuditLog('Backup Exported', 'Full portfolio JSON archive generated and downloaded');
    onShowToast('Backup Downloaded', 'Portfolio database archive saved locally.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          addAuditLog('Backup Restored', `Restored from file ${file.name}`);
          onShowToast('Database Restored', 'All portfolio records loaded from JSON backup.');
        } else {
          onShowToast('Import Failed', 'Invalid JSON backup structure.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmResetDefaults = () => {
    resetAllDefaults();
    setResetModalOpen(false);
    addAuditLog('Factory Reset', 'Portfolio state restored to initial reference defaults');
    onShowToast('Defaults Restored', 'All settings and content restored to factory state.');
  };

  const handleTestDatabase = async () => {
    setTestingSupabase(true);
    setSupabaseTestMsg(null);
    try {
      const result = await testDatabaseConnection();
      if (result.ok) {
        setSupabaseTestMsg(`Connected to ${dbStatus.projectRef || 'Database'} · Latency: ${result.latencyMs ?? 0}ms`);
        onShowToast('Database Online', `Database connection verified (${result.latencyMs ?? 0}ms).`);
      } else {
        setSupabaseTestMsg(`Connection check: ${result.message || 'Unknown status'}`);
        onShowToast('Database Check', result.message || 'Could not verify database connection.');
      }
    } catch (e: any) {
      setSupabaseTestMsg(`Error: ${e.message}`);
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSyncDatabase = async () => {
    setSyncingSupabase(true);
    try {
      await refreshFromDatabase();
      onShowToast('Database Synced', 'Local cache refreshed from database.');
    } catch (e: any) {
      onShowToast('Sync Error', 'Failed to pull latest records.');
    } finally {
      setSyncingSupabase(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div>
        <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
          <span>Settings &amp; System Hub</span>
          <span className="text-xs bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold px-3 py-0.5 rounded-full font-mono">
            NEXO Admin Core
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure studio availability, security credentials, webhook notifications, maintenance mode, and database backups.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'general', label: 'General & Profile', icon: Globe },
          { id: 'availability', label: 'Availability & Booking', icon: Calendar },
          { id: 'security', label: 'Security & Access', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
          { id: 'visibility', label: 'Maintenance & Visibility', icon: Eye },
          { id: 'backup', label: 'Backup & Database', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#00E599] text-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL & PROFILE */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Studio Identity &amp; Profile Defaults</h3>
            <p className="text-slate-400">Core brand name, role headline, and regional localization preferences.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Brand / Studio Name *</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Wordmark Suffix</label>
              <input
                type="text"
                value={brandSuffix}
                onChange={(e) => setBrandSuffix(e.target.value)}
                placeholder="Studio"
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Role Subtitle *</label>
            <input
              type="text"
              required
              value={roleSubtitle}
              onChange={(e) => setRoleSubtitle(e.target.value)}
              placeholder="Web Design · Poster Making · Ads Creation · Product Poster"
              className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Primary Inquiry Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Direct Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Base Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Global / Remote Studio"
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Studio Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
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
              <label className="block font-semibold text-slate-300 mb-1">Currency Preference</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
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

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
            >
              Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: AVAILABILITY & BOOKING */}
      {activeTab === 'availability' && (
        <form onSubmit={handleSaveAvailability} className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Client Intake &amp; Booking Status</h3>
            <p className="text-slate-400">Control active availability badges, project intake slots, and call links.</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#080B11] rounded-2xl border border-slate-700">
            <div>
              <span className="font-bold text-white block">Currently Accepting Projects</span>
              <span className="text-slate-400 text-[11px]">When disabled, an intake waitlist notice is displayed.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E599]" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Availability Badge Text</label>
              <input
                type="text"
                value={availabilityBadge}
                onChange={(e) => setAvailabilityBadge(e.target.value)}
                placeholder="Available for Q2 & Q3 Projects"
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Badge Accent Color</label>
              <select
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              >
                <option value="teal">Cyber Emerald (Active / Green)</option>
                <option value="coral">Electric Coral (Urgent / Orange)</option>
                <option value="amber">Warm Amber (Selective / Yellow)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Earliest Sprint Slot</label>
              <input
                type="text"
                value={nextSlot}
                onChange={(e) => setNextSlot(e.target.value)}
                placeholder="Immediate / This Week"
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Minimum Project Scope</label>
              <input
                type="text"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="₹25,000"
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Calendly / Discovery Meeting URL</label>
            <input
              type="url"
              value={calendlyUrl}
              onChange={(e) => setCalendlyUrl(e.target.value)}
              placeholder="https://calendly.com/nexo-studio"
              className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
            >
              Save Availability Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SECURITY & ACCESS */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Admin Authentication &amp; Credentials</h3>
            <p className="text-slate-400">Set the master email and password for managing the NEXO Studio portfolio.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Admin Display Name *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Admin Login Email *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>
          </div>

          <div className="p-4 bg-[#080B11] rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#00E599]" />
              <span>Change Admin Master Password</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Leave blank if you do not want to alter your current password.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-medium text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 bg-[#080B11] rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-slate-400 text-[11px]">Require authenticator code on sign-in</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-full border border-[#00E599]/40 bg-[#00E599]/15 text-[#00E599] font-bold text-[11px] hover:bg-[#00E599]/25 cursor-pointer"
              >
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#080B11] rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Spam Bot Honeypot</span>
                <span className="text-slate-400 text-[11px]">Strict trap for malicious automated inquiries</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={honeypotStrict}
                  onChange={(e) => setHoneypotStrict(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E599]" />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
            >
              Update Security Credentials
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: NOTIFICATIONS & WEBHOOKS */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Inquiry Alerts &amp; Webhook Relays</h3>
            <p className="text-slate-400">Connect Discord, Slack, and email notifications for client project inquiries.</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#080B11] rounded-2xl border border-slate-800">
            <div>
              <span className="font-bold text-white block">Email Inquiry Dispatch</span>
              <span className="text-slate-400 text-[11px]">Receive direct email notifications when clients send a project brief</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E599]" />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Discord Webhook Channel URL</label>
              <input
                type="url"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Slack Webhook URL</label>
              <input
                type="url"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
            >
              Save Notification Webhooks
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: VISIBILITY & MAINTENANCE */}
      {activeTab === 'visibility' && (
        <form onSubmit={handleSaveMaintenance} className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-xs max-w-3xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-sans">Maintenance &amp; Section Visibility</h3>
            <p className="text-slate-400">Toggle site maintenance mode and manage public section displays.</p>
          </div>

          <div className="p-4 bg-[#080B11] rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Maintenance Mode</span>
                <span className="text-slate-400 text-[11px]">Displays maintenance banner for visitors</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]" />
              </label>
            </div>

            {maintenanceMode && (
              <div className="pt-2">
                <label className="block font-medium text-slate-300 mb-1">Maintenance Banner Copy</label>
                <textarea
                  rows={2}
                  value={maintenanceNotice}
                  onChange={(e) => setMaintenanceNotice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1522] border border-slate-700 text-white outline-none focus:border-[#FF5A36] resize-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 bg-[#080B11] rounded-2xl border border-slate-800">
              <span className="font-medium text-white">Show Client Testimonials Section</span>
              <input
                type="checkbox"
                checked={showTestimonials}
                onChange={(e) => setShowTestimonials(e.target.checked)}
                className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#080B11] rounded-2xl border border-slate-800">
              <span className="font-medium text-white">Show 4-Step Process Section</span>
              <input
                type="checkbox"
                checked={showProcess}
                onChange={(e) => setShowProcess(e.target.checked)}
                className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] cursor-pointer"
            >
              Update Section Display
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: BACKUP & DATABASE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 max-w-3xl">
          {/* Database Health Card */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00E599]" />
                  <span>Cloud Database Connectivity</span>
                </h3>
                <p className="text-slate-400">Live PostgreSQL connection status and cache sync.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestDatabase}
                  disabled={testingSupabase}
                  className="px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                  <span>{testingSupabase ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncDatabase}
                  disabled={syncingSupabase}
                  className="px-3.5 py-1.5 rounded-full bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 hover:bg-[#00E599]/25 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{syncingSupabase ? 'Syncing...' : 'Sync Latest'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-[#080B11] rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] animate-pulse" />
                <span className="font-mono text-slate-300">
                  Instance: {dbStatus.projectRef || 'Production Cloud SQL / Supabase'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-full border border-[#00E599]/20">
                Connected &amp; Active
              </span>
            </div>

            {supabaseTestMsg && (
              <div className="p-3 bg-[#080B11] rounded-xl border border-slate-700 text-slate-300 font-mono text-[11px]">
                {supabaseTestMsg}
              </div>
            )}
          </div>

          {/* Backup Archives Card */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-sans">Full JSON Portfolio Archive</h3>
              <p className="text-slate-400">Export or restore your full portfolio state across projects, services, and media.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Backup Archive</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 bg-[#080B11] text-slate-200 font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#00E599]" />
                <span>Restore from JSON File</span>
              </button>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-[#0F1522] p-6 rounded-3xl border border-red-900/60 shadow-xl space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-red-950/80 pb-3">
              <div className="w-8 h-8 rounded-xl bg-red-950/60 text-red-400 flex items-center justify-center border border-red-800/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans">Danger Zone</h3>
                <p className="text-slate-400">Restore factory reference defaults across all studio data.</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Resetting will clear custom modifications and re-populate the original pristine portfolio state.
            </p>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/80 font-bold transition-all cursor-pointer"
            >
              Reset to Studio Factory Defaults
            </button>
          </div>
        </div>
      )}

      {/* 2FA Authenticator Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-700 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Two-Factor Authentication</h3>
            <p className="text-xs text-slate-400 mb-4">
              Scan with Google Authenticator or 1Password to activate 2FA protection.
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block mb-4">
              <QrCode className="w-36 h-36 text-black" />
            </div>

            <p className="text-[11px] font-mono text-[#00E599] bg-[#080B11] p-2 rounded-xl border border-slate-800 mb-4">
              NEXO-STUDIO-AUTH-2024
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-full bg-[#00E599] hover:bg-[#00B377] text-black font-extrabold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={resetModalOpen}
        title="Reset Portfolio to Factory Defaults?"
        message="This will overwrite all current edits across projects, services, profile copy, testimonials, and settings with pristine reference defaults. This cannot be undone."
        confirmText="Yes, Reset Everything"
        onConfirm={handleConfirmResetDefaults}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
