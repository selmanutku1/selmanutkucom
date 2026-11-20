import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { UI_COPY, useLanguage, type Language } from '../lib/i18n';

function FlagIcon({ lang }: { lang: Language }) {
  if (lang === 'tr') {
    return (
      <svg
        viewBox="0 0 24 16"
        className="h-[14px] w-[20px] shrink-0 rounded-[2.5px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]"
        aria-hidden="true"
      >
        <rect width="24" height="16" fill="#E30A17" />
        <circle cx="9.6" cy="8" r="4.1" fill="#FFFFFF" />
        <circle cx="10.7" cy="8" r="3.25" fill="#E30A17" />
        <polygon
          fill="#FFFFFF"
          points="14.3,8 15.85,8.5 14.9,7.15 14.9,8.85 15.85,7.5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 16"
      className="h-[14px] w-[20px] shrink-0 rounded-[2.5px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)]"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" strokeWidth="4.6" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="2.6" />
    </svg>
  );
}

const LANGUAGE_OPTIONS: { code: Language; shortLabel: string; nativeLabel: string }[] = [
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English' },
  { code: 'tr', shortLabel: 'TR', nativeLabel: 'Türkçe' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentOption =
    LANGUAGE_OPTIONS.find((item) => item.code === lang) || LANGUAGE_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={UI_COPY[lang].nav.languageAria}
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[#DCE7F2] bg-white px-3 text-[13px] font-medium text-[#0A192F] transition-colors duration-150 hover:border-[#94BBE0] hover:bg-[#F7FAFD]"
      >
        <FlagIcon lang={currentOption.code} />
        <span>{currentOption.shortLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#5B7086] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={UI_COPY[lang].nav.languageAria}
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-[#DCE7F2] bg-white py-1 shadow-[0_12px_32px_-12px_rgba(10,25,47,0.16)]"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = option.code === lang;
            return (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLang(option.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors ${
                  selected
                    ? 'bg-[#F3F8FC] font-semibold text-[#0A192F]'
                    : 'font-medium text-[#33485E] hover:bg-[#F7FAFD] hover:text-[#0A192F]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FlagIcon lang={option.code} />
                  <span>{option.nativeLabel}</span>
                </span>
                {selected && (
                  <Check className="h-3.5 w-3.5 text-[#145DA0]" strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
