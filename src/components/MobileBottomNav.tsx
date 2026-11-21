import { Briefcase, Compass, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { getSectionHref, type SectionKey } from '../lib/routes';

interface MobileBottomNavProps {
  onNavigate: (to: string) => void;
  activeSection?: SectionKey;
}

export function MobileBottomNav({
  onNavigate,
  activeSection,
}: MobileBottomNavProps) {
  const { lang } = useLanguage();

  const items: {
    key: Extract<SectionKey, 'expertise' | 'experience' | 'projects'>;
    label: string;
    href: string;
    Icon: typeof Compass;
  }[] = [
    {
      key: 'expertise',
      label: lang === 'tr' ? 'Uzmanlık' : 'Expertise',
      href: getSectionHref('expertise', lang),
      Icon: Compass,
    },
    {
      key: 'experience',
      label: lang === 'tr' ? 'Deneyim' : 'Experience',
      href: getSectionHref('experience', lang),
      Icon: Briefcase,
    },
    {
      key: 'projects',
      label: lang === 'tr' ? 'Projeler' : 'Projects',
      href: getSectionHref('projects', lang),
      Icon: LayoutGrid,
    },
  ];

  return (
    <nav
      aria-label={
        lang === 'tr' ? 'Hızlı kategori menüsü' : 'Quick category navigation'
      }
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DCE7F2]/95 bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid h-14 max-w-[480px] grid-cols-3 items-stretch px-2">
        {items.map(({ key, label, href, Icon }) => {
          const isActive = activeSection === key;
          return (
            <a
              key={key}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(href);
              }}
              aria-current={isActive ? 'location' : undefined}
              className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 whitespace-nowrap px-2 transition-colors duration-150 ${
                isActive
                  ? 'text-[#145DA0] before:absolute before:top-0 before:h-[2px] before:w-10 before:rounded-b-full before:bg-[#145DA0]'
                  : 'text-[#4B6075] hover:text-[#0A192F] active:text-[#145DA0]'
              }`}
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={isActive ? 2 : 1.75}
                aria-hidden="true"
              />
              <span
                className={`text-[11px] leading-none tracking-[-0.01em] ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
              >
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
