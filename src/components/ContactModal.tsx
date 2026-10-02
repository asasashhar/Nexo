import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ArrowUpRight } from 'lucide-react';

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
  initialService = 'Grow Your Reach',
}) => {
  const { addMessage, services } = usePortfolio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [service, setService] = useState(initialService);
  const [budget, setBudget] = useState('$10,000 - $25,000');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.trim()) {
      onClose();
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || `Inquiry for ${service}`,
        service,
        budget,
        message: message.trim(),
      });

      setIsSubmitting(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      onClose();
      onSuccessToast(
        'Project Brief Dispatched 🚀',
        `Thank you ${name.trim()}, a NEXO founding partner will reach out within 24 business hours.`
      );
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#DCDAD2]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C9793] hover:text-[#111615] w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4CC9A7] block mb-1">
            PROJECT INTAKE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#111615]">Start a Project</h3>
          <p className="text-xs text-[#5A6561] mt-1">
            Tell our studio about your product vision, sprint timelines, or metrics goal.
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
            <label className="block text-xs font-bold text-[#111615] mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111615] mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@scaleup.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#111615] mb-1">
                Capability Scope
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#4CC9A7]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Full Product Sprints">Full Product Sprints</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111615] mb-1">Budget Target</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#4CC9A7]"
              >
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000+">$50,000+ (Enterprise)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111615] mb-1">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you are building, target delivery date, or links to existing specs..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F2685F] hover:bg-[#E0524A] text-white py-3 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Send Scoped Intake Brief'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
