import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle Radial Gradient */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#E8F7F2] to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A6561] hover:text-[#4CC9A7] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Website</span>
        </button>
        <span className="text-[10px] text-[#2D9A7A] font-semibold bg-[#E8F7F2] px-2.5 py-1 rounded-full border border-[#D8F2E9] shadow-2xs">
          Studio Admin v4.2
        </span>
      </div>

      {/* Centred White Card */}
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-[0_14px_40px_rgba(17,22,21,0.06)] border border-[#E8F7F2] relative">
        <div className="flex flex-col items-center text-center mb-6">
          <NexoLogo customLogoUrl={profile.logoUrl} size="md" showTagline={true} />
          <h2 className="text-xl font-black text-[#111615] mt-5">Studio Portal</h2>
          <p className="text-xs text-[#5A6561] mt-1">
            Sign in to manage projects, services, graphics, and partner inquiries.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111615] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agesbdidgsgsd@gmail.com"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
              />
              <Mail className="w-4 h-4 text-[#8C9793] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111615] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] focus:ring-1 focus:ring-[#4CC9A7] outline-none"
              />
              <Lock className="w-4 h-4 text-[#8C9793] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8C9793] hover:text-[#111615] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#5A6561]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#4CC9A7] focus:ring-[#4CC9A7]"
              />
              <span>Remember me (7 days)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4CC9A7] hover:bg-[#37B294] text-white py-3 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Sign In to Studio Admin
          </button>
        </form>
      </div>
    </div>
  );
};
