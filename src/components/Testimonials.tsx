import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Testimonial } from '../types';
import { Star, PlusCircle, Quote, X } from 'lucide-react';

interface TestimonialsProps {
  onShowToast: (title: string, msg: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onShowToast }) => {
  const { testimonials, addTestimonial } = usePortfolio();

  const [activeDot, setActiveDot] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formRating, setFormRating] = useState(5);

  const publishedTestimonials = testimonials.filter((t) => t.published);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim()) return;

    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const bgColors = [
      'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40',
      'bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40',
      'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40',
      'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40',
    ];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    addTestimonial({
      id: `test-${Date.now()}`,
      name: formName.trim(),
      role: formRole.trim() || 'Client',
      company: formCompany.trim() || 'Partner',
      initials: initials || 'CL',
      avatarBg: randomBg,
      quote: formQuote.trim(),
      rating: formRating,
      published: true,
      order: testimonials.length + 1,
    });

    setModalOpen(false);
    setFormName('');
    setFormRole('');
    setFormCompany('');
    setFormQuote('');
    onShowToast('Endorsement Added', 'Thank you! Your testimonial is now live.');
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#080B11] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E599]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00E599] mb-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00E599]" />
            <span>CLIENT REPUTATION</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00E599]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Trusted by Ambitious Brands
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Real feedback from founders, marketing directors, and creative leads who built with NEXO.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        {publishedTestimonials.length === 0 ? (
          <div className="bg-[#0F1522] rounded-3xl p-10 text-center border-2 border-dashed border-slate-800 max-w-lg mx-auto">
            <Quote className="w-10 h-10 text-[#00E599]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Endorsements Published Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Client reviews will appear here. Be the first to leave an endorsement!
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00E599] text-black text-xs font-bold hover:bg-[#00B377] transition-all shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Leave an Endorsement</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedTestimonials.map((item, idx) => (
              <div
                key={item.id}
                className={`bg-[#0F1522] border border-slate-800 rounded-3xl p-7 shadow-xl flex flex-col justify-between relative hover:border-slate-700 transition-all ${
                  idx === activeDot ? 'ring-1 ring-[#00E599]/40' : ''
                }`}
              >
                <Quote className="w-8 h-8 text-[#00E599]/20 absolute top-6 left-6" />

                <div className="pt-6 mb-6">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-[#00E599]/40 shadow-xs"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full ${item.avatarBg} flex items-center justify-center font-bold text-sm flex-shrink-0`}
                    >
                      {item.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {item.role}, {item.company}
                    </p>
                    {/* Rating Stars */}
                    <div className="flex text-[#FFB800] text-xs mt-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel Pagination Dots & Add Testimonial Trigger */}
        <div className="flex flex-col items-center gap-4 mt-10">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E599] hover:text-[#00B377] transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Leave a Client Endorsement</span>
          </button>
        </div>

        {/* Endorsement Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#0F1522] rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-700 text-white animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-1">Add an Endorsement</h3>
              <p className="text-xs text-slate-400 mb-4">
                Share your experience working with NEXO.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">Role / Title</label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Founder"
                      className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-300">Company Name</label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. Apex Labs"
                      className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Rating</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599]"
                  >
                    <option value={5}>★★★★★ (5/5 Stars)</option>
                    <option value={4}>★★★★☆ (4/5 Stars)</option>
                    <option value={3}>★★★☆☆ (3/5 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Your Endorsement *</label>
                  <textarea
                    rows={3}
                    required
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Describe how NEXO helped your project..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-slate-700 text-white outline-none focus:border-[#00E599] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#00E599] text-black font-bold hover:bg-[#00B377] shadow-sm cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
