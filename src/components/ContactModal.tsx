import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ArrowRight, Sparkles, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, msg: string) => void;
  initialService?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  initialService = 'Web Design',
}) => {
  const { addMessage, services } = usePortfolio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [service, setService] = useState(initialService);
  const [budget, setBudget] = useState('₹35,000 - ₹75,000');
  const [customBudget, setCustomBudget] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.trim()) {
      onClose();
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const finalBudget =
      budget === 'custom'
        ? (customBudget.trim() ? `₹${customBudget.replace(/^[₹\s]+/, '')}` : 'Flexible / Discuss on Call')
        : budget;

    setTimeout(() => {
      addMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || `Inquiry for ${service}`,
        service,
        budget: finalBudget,
        message: message.trim(),
      });

      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      setCustomBudget('');
      onClose();

      onSuccessToast(
        'Project Brief Received 🚀',
        `Thank you ${name.trim()}! The NEXO studio team will review and reply within 24 business hours.`
      );
    }, 450);
  };

  // Get active published services from context if available
  const availableServices =
    services && services.length > 0
      ? services.filter((s) => s.published !== false)
      : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-700 text-white animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#00E599] block mb-1">
            PROJECT INTAKE
          </span>
          <h3 className="text-2xl font-black text-white font-sans">Start a Project</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tell our studio about your product vision, sprint timelines, or deliverables.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Honeypot hidden input */}
          <input
            type="text"
            name="website_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Service Type</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
              >
                {availableServices.length > 0 ? (
                  availableServices.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Web Design">Web Design</option>
                    <option value="Poster Making">Poster Making</option>
                    <option value="Ads Creation">Ads Creation (Video/Static)</option>
                    <option value="Product Poster">Product Poster</option>
                    <option value="Full Brand Suite">Full Studio Suite</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Budget (INR ₹)</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
              >
                <option value="Flexible / Discuss on Call">Flexible / Discuss on Call</option>
                <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000</option>
                <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000</option>
                <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000</option>
                <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                <option value="₹3,00,000+">₹3,00,000+</option>
                <option value="custom">Custom INR Amount (₹)</option>
              </select>
            </div>
          </div>

          {budget === 'custom' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-150">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Budget (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#00E599] font-bold">₹</span>
                <input
                  type="text"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="e.g. 50,000 or 1,20,000"
                  className="w-full text-xs pl-7 pr-3 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Details *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about what you want to build or launch..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-slate-700 text-white focus:border-[#00E599] outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#00E599] to-[#00B377] hover:from-[#00B377] hover:to-[#008A5B] text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{isSubmitting ? 'Transmitting Brief...' : 'Send Project Brief'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
