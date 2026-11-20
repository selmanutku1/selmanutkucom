import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../data/profile';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onNavigate: (to: string) => void;
  activeSection?: string;
}

export function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: copy.home, href: '#ana-sayfa', id: 'ana-sayfa' },
    { label: copy.about, href: '#hakkimda', id: 'hakkimda' },
    { label: copy.expertise, href: '#uzmanlik', id: 'uzmanlik' },
    { label: copy.experience, href: '#deneyim', id: 'deneyim' },
    { label: copy.projects, href: '#projeler', id: 'projeler' },
    { label: copy.articles, href: '#yazilar', id: 'yazilar' },
    { label: copy.academic, href: '#akademik', id: 'akademik' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === '#ana-sayfa') {
      onNavigate('/');
      return;
    }
    onNavigate(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCE7F2]/90 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-6 lg:h-[72px] lg:gap-8 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#ana-sayfa');
          }}
          className="whitespace-nowrap shrink-0 text-[17px] font-bold tracking-[-0.02em] text-[#0A192F] transition-opacity duration-150 hover:opacity-75"
        >
          {SITE_CONFIG.fullName}
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label={copy.mainMenuAria}
          className="hidden items-center gap-5 xl:gap-6 lg:flex"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`relative whitespace-nowrap shrink-0 py-1 text-[13.5px] font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-[#0A192F] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#145DA0]'
                    : 'text-[#4B6075] hover:text-[#0A192F]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action (İletişim) + Mobile Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher />

          <a
            href="#iletisim"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#iletisim');
            }}
            className="hidden h-10 items-center whitespace-nowrap shrink-0 rounded-lg bg-[#0C2340] px-4 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#143966] lg:inline-flex"
          >
            {copy.contact}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? copy.closeMenu : copy.openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4E2F0] text-[#0A192F] transition-colors duration-150 hover:bg-[#F3F8FC] lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label={copy.mobileMenuAria}
          className="border-t border-[#DCE7F2] bg-white/95 px-6 py-6 backdrop-blur-md lg:hidden"
        >
          <div className="flex flex-col divide-y divide-[#EAF1F8] text-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="py-3.5 text-[15px] font-medium text-[#1E3248] transition-colors hover:text-[#145DA0]"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4">
              <a
                href="#iletisim"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#iletisim');
                }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#0C2340] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#143966]"
              >
                {copy.contact}
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
