import { ArrowUpRight } from 'lucide-react';
import { getProfileContent, SITE_CONFIG } from '../data/profile';
import { UI_COPY, useLanguage } from '../lib/i18n';

interface FooterProps {
  onNavigate: (to: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { lang } = useLanguage();
  const nav = UI_COPY[lang].nav;
  const footerCopy = UI_COPY[lang].footer;
  const profile = getProfileContent(lang);
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: nav.home, href: '/' },
    { label: nav.about, href: '#hakkimda' },
    { label: nav.expertise, href: '#uzmanlik' },
    { label: nav.experience, href: '#deneyim' },
    { label: nav.projects, href: '#projeler' },
    { label: nav.articles, href: '#yazilar' },
    { label: nav.academic, href: '#akademik' },
    { label: nav.contact, href: '#iletisim' },
  ];

  return (
    <footer className="border-t border-[#DCE7F2] bg-[#F3F8FC]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 text-center md:text-left lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand & Summary */}
          <div className="md:col-span-5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="text-[15px] font-bold tracking-[0.14em] text-[#0A192F]"
            >
              {SITE_CONFIG.brandName}
            </a>
            <p className="mx-auto mt-4 max-w-[40ch] text-[14px] leading-[1.7] text-[#465B71] md:mx-0">
              {profile.footerSummary}
            </p>
          </div>

          {/* Page Links */}
          <div className="md:col-span-4">
            <h2 className="text-[13px] font-semibold text-[#0A192F]">
              {footerCopy.pagesTitle}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.href);
                    }}
                    className="text-[13.5px] text-[#4B6075] transition-colors hover:text-[#145DA0]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-3">
            <h2 className="text-[13px] font-semibold text-[#0A192F]">
              {footerCopy.linksTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={SITE_CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-[#4B6075] transition-colors hover:text-[#145DA0]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-[#4B6075] transition-colors hover:text-[#145DA0]"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-[#4B6075] transition-colors hover:text-[#145DA0]"
                >
                  <span>{lang === 'tr' ? 'Google Akademik' : 'Google Scholar'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-[13.5px] text-[#4B6075] transition-colors hover:text-[#145DA0]"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#DCE7F2] pt-6 text-[13px] text-[#5B7086] sm:flex-row">
          <p className="tabular-nums">
            © {currentYear} {SITE_CONFIG.fullName}. {footerCopy.rights}
          </p>
          <p>{SITE_CONFIG.domain}</p>
        </div>
      </div>
    </footer>
  );
}
