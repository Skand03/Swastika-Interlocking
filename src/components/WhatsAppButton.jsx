import React, { useState, useEffect, useRef } from 'react';

const CONTACTS = [
  {
    id: 'dilip',
    emoji: '🧱',
    nameEn: 'Dilip bhai – Building Materials',
    nameHi: 'दिलीप भाई – निर्माण सामग्री',
    subtitleEn: 'Paver Blocks, Sand, Cement, Shuttering, RCC Roads',
    subtitleHi: 'पेवर ब्लॉक, रेत, सीमेंट, शटरिंग, RCC सड़क',
    phone: '8400936290',
    waLink: 'https://wa.me/918400936290',
    color: '#E8650A',
  },
  {
    id: 'alok',
    emoji: '🔧',
    nameEn: 'Alok bhai – Pipes & Drainage',
    nameHi: 'आलोक भाई – पाइप्स और ड्रेनेज',
    subtitleEn: 'Drainage Pipes, Water Supply, Pool Pipes',
    subtitleHi: 'ड्रेनेज पाइप, जल आपूर्ति, पूल पाइप',
    phone: '9722832661',
    waLink: 'https://wa.me/919722832661',
    color: '#1565C0',
  },
];

export default function WhatsAppButton({ language }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isHi = language === 'hi';

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start gap-3 select-none"
      style={{ fontFamily: 'inherit' }}
    >
      {/* ── Popup ── */}
      {open && (
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[290px] md:w-[320px]"
          style={{ animation: 'slideUp 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#25D366]">
            <div className="flex items-center gap-2 text-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.847L.057 23.882a.5.5 0 0 0 .612.612l6.035-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.369l-.36-.214-3.732.912.946-3.656-.235-.377A9.861 9.861 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/>
              </svg>
              <span className="font-bold text-sm">
                {isHi ? 'WhatsApp पर संपर्क करें' : 'Chat on WhatsApp'}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span className="text-white text-sm font-bold leading-none">×</span>
            </button>
          </div>

          {/* Contact cards */}
          <div className="p-3 space-y-2.5">
            <p className="text-xs text-gray-400 font-semibold px-1">
              {isHi ? 'विभाग चुनें' : 'Choose a department'}
            </p>
            {CONTACTS.map((c) => (
              <a
                key={c.id}
                href={c.waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group cursor-pointer no-underline"
              >
                {/* Avatar circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 text-lg font-bold shadow-sm"
                  style={{ background: c.color }}
                >
                  {c.emoji}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 leading-tight truncate">
                    {isHi ? c.nameHi : c.nameEn}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2">
                    {isHi ? c.subtitleHi : c.subtitleEn}
                  </p>
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">+91 {c.phone}</p>
                </div>

                {/* Arrow */}
                <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-4 pb-3 text-center">
            <p className="text-[10px] text-gray-300">
              {isHi ? 'सोम–शनि: सुबह 9 – शाम 7' : 'Mon–Sat: 9 AM – 7 PM'}
            </p>
          </div>
        </div>
      )}

      {/* ── Main WhatsApp button ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={isHi ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer relative"
        style={{ background: '#25D366' }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.847L.057 23.882a.5.5 0 0 0 .612.612l6.035-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.369l-.36-.214-3.732.912.946-3.656-.235-.377A9.861 9.861 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/>
        </svg>

        {/* Pulse ring animation */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: '#25D366' }}
          />
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}
