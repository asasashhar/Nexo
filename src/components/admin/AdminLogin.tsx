import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowLeft, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { NexoLogo } from '../NexoLogo';

interface AdminLoginProps {
  onBackToSite: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite, onLoginSuccess }) => {
  const { loginAdmin, profile } = usePortfolio();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError('Too many failed attempts. Rate limit active (wait 15 minutes).');
      return;
    }

    const success = loginAdmin(email, password);
    if (success) {
      setError(null);
      onLoginSuccess();
    } else {
      setAttempts((prev) => prev + 1);
      setError('Invalid email or password. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] flex flex-col justify-center items-center p-4 relative overflow-hidden text-white">
      {/* Background Subtle Radial Glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#00E599]/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#FF5A36]/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00E599] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Website</span>
        </button>
        <span className="text-[10px] text-[#00E599] font-mono font-bold bg-[#00E599]/10 px-3 py-1 rounded-full border border-[#00E599]/30">
          NEXO CMS v4.5
        </span>
      </div>

      {/* Centred Dark Card */}
      <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-700 relative">
        <div className="flex flex-col items-center text-center mb-6">
          <NexoLogo customLogoUrl={profile.logoUrl} size="md" showText={true} showTagline={true} />
          <h2 className="text-xl font-black text-white mt-4 font-sans">Studio Control Room</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage projects, services, graphics, and client leads.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agesbdidgsgsd@gmail.com"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-[#00E599] focus:ring-[#00E599]"
              />
              <span>Remember session</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setEmail('agesbdidgsgsd@gmail.com');
                setPassword('qwerty@1380');
              }}
              className="text-[11px] text-[#00E599] hover:underline font-mono cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#00E599] to-[#00B377] hover:from-[#00B377] hover:to-[#008A5B] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,153,0.3)] cursor-pointer active:scale-98"
          >
            Sign In to Studio CMS
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Protected by Supabase Row-Level Security &amp; Token Encryption
          </p>
        </div>
      </div>
    </div>
  );
};
