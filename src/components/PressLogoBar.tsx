import { useState } from 'react';
import type { Language } from '../lib/i18n';

interface PressOutlet {
  id: 'haberturk' | 'webrazzi' | 'sporttech-turkiye';
  name: string;
  logoSrc: string;
  sizeClass: string;
  url: string;
  articleTitle: Record<Language, string>;
}

const PRESS_OUTLETS: PressOutlet[] = [
  {
    id: 'haberturk',
    name: 'Habertürk',
    logoSrc: '/assets/press/haberturk.svg',
    sizeClass: 'h-[30px] sm:h-[34px] rounded-[2px]',
    url: 'https://yerel-haberler.haberturk.com/kocaeli-haberleri/dijitallesme-sporu-daha-adil-bir-zemine-tasiyor-115497136',
    articleTitle: {
      tr: 'Habertürk — Dijitalleşme sporu daha adil bir zemine taşıyor',
      en: 'Habertürk — Digitalization moves sports to a fairer ground',
    },
  },
  {
    id: 'webrazzi',
    name: 'Webrazzi',
    logoSrc: '/assets/press/webrazzi.svg',
    sizeClass: 'h-[23px] sm:h-[26px]',
    url: 'https://webrazzi.com/2025/08/12/spor-sektorunde-dijital-donusumu-hedefleyen-girisim-sporsepeti/',
    articleTitle: {
      tr: 'Webrazzi — Spor sektöründe dijital dönüşümü hedefleyen girişim: Sporsepeti',
      en: 'Webrazzi — Sporsepeti: Startup targeting digital transformation in sports',
    },
  },
  {
    id: 'sporttech-turkiye',
    name: 'SportTech Türkiye',
    logoSrc: '/assets/press/sporttech-turkiye.png',
    sizeClass: 'h-[40px] sm:h-[46px]',
    url: 'https://sporttech.com.tr',
    articleTitle: {
      tr: 'SportTech Türkiye — Spor Teknolojileri Ekosistemi',
      en: 'SportTech Türkiye — Sports Technology Ecosystem',
    },
  },
];

export function PressLogoBar({ lang }: { lang: Language }) {
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});
  const label = lang === 'tr' ? 'Basında' : 'Featured In';

  return (
    <div
      aria-label={label}
      className="mt-14 border-t border-[#DCE7F2] py-7 lg:mt-20 lg:py-8"
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14 md:justify-around">
        {PRESS_OUTLETS.map((outlet) => (
            <li key={outlet.id}>
              <a
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                title={outlet.articleTitle[lang]}
                aria-label={outlet.articleTitle[lang]}
                className="group inline-flex min-h-[44px] items-center justify-center bg-transparent px-1.5 py-2 opacity-55 grayscale transition-[filter,opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#145DA0]"
              >
                {failedIds[outlet.id] ? (
                  <span className="text-[15px] font-bold tracking-[-0.02em] text-[#0A192F]">
                    {outlet.name}
                  </span>
                ) : (
                  <img
                    src={outlet.logoSrc}
                    alt={outlet.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedIds((prev) => ({ ...prev, [outlet.id]: true }))
                    }
                    className={`w-auto object-contain ${outlet.sizeClass}`}
                  />
                )}
              </a>
            </li>
        ))}
      </ul>
    </div>
  );
}
