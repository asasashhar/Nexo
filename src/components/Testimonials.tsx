import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Testimonial } from '../types';
import { Star, PlusCircle, Quote } from 'lucide-react';

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
      'bg-emerald-100 text-teal-800',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-amber-100 text-amber-800',
      'bg-purple-100 text-purple-700',
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
    onShowToast('Endorsement Added', 'Thank you! Your testimonial is now live on the portfolio.');
  };

  return (
    <section id="testimonials" className="py-20 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Two-tone with Caveat teal and tiny coral heart */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2A37]">
            What Clients <span className="font-script text-[#4CC9A7] text-4xl sm:text-5xl">Say</span>{' '}
            <span className="text-[#F2685F] text-2xl select-none inline-block animate-pulse">♡</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2">
            Client feedback from founders, product managers, and design leads.
          </p>
        </div>

        {/* Testimonials Cards Grid / Empty State */}
        {publishedTestimonials.length === 0 ? (
          <div className="bg-[#F7FCFA] rounded-3xl p-10 text-center border-2 border-dashed border-[#D8F2E9] max-w-lg mx-auto">
            <Quote className="w-10 h-10 text-[#4CC9A7]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1F2A37] mb-1">No Testimonials Yet</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-5">
              Client reviews and endorsements will appear here. Be the first to leave feedback!
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4CC9A7] text-white text-xs font-bold hover:bg-[#37B294] transition-all shadow-sm cursor-pointer"
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
                className={`bg-[#F7FCFA] border border-[#E8F7F2] rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(76,201,167,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between relative hover:shadow-md transition-shadow ${
                  idx === activeDot ? 'ring-1 ring-[#4CC9A7]/40' : ''
                }`}
              >
              <Quote className="w-8 h-8 text-[#F2685F]/30 absolute top-5 left-5" />

              <div className="pt-6 mb-6">
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-[#D8F2E9]/60 pt-4">
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-[#4CC9A7]/30 shadow-xs"
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
                  <h4 className="text-xs font-bold text-[#1F2A37]">{item.name}</h4>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {item.role}, {item.company}
                  </p>
                  {/* Rating Stars */}
                  <div className="flex text-[#F5B301] text-xs mt-0.5">
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
        <div className="flex flex-col items-center gap-4 mt-8">
          {publishedTestimonials.length > 0 && (
            <div className="flex items-center gap-2">
              {publishedTestimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveDot(i)}
                  className={`transition-all cursor-pointer ${
                    activeDot === i
                      ? 'w-6 h-2 rounded-full bg-[#4CC9A7]'
                      : 'w-2 h-2 rounded-full bg-[#D8F2E9] hover:bg-[#4CC9A7]/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4CC9A7] hover:text-[#37B294] transition-colors cursor-pointer pt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Leave a Client Endorsement</span>
          </button>
        </div>

        {/* Endorsement Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#D8F2E9]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold text-[#1F2A37] mb-1">Add Endorsement</h3>
              <p className="text-xs text-[#9CA3AF] mb-4">
                Share your experience working with Ashhar on design projects.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2A37] mb-1">Role</label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Product Lead"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. FinTech Labs"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Rating (Stars)
                  </label>
                  <div className="flex gap-1 text-lg text-[#F5B301]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="cursor-pointer hover:scale-125 transition-transform"
                      >
                        {star <= formRating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                    Feedback / Quote *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="He delivered an exceptional user experience with great attention to detail..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4CC9A7] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-[#1F2A37] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4CC9A7] hover:bg-[#37B294] text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    Post Testimonial
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
