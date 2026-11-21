import type { ArticleCategoryKey, ArticleItem } from '../data/articles';
import type { Language } from '../lib/i18n';

interface ArticleSportTechCoverProps {
  article: ArticleItem;
  index: number;
  lang: Language;
}

interface SportTechVisualMeta {
  disciplineTr: string;
  disciplineEn: string;
  focusTagTr: string;
  focusTagEn: string;
}

const CATEGORY_VISUAL_META: Record<ArticleCategoryKey, SportTechVisualMeta> = {
  'digital-transformation': {
    disciplineTr: 'SportTech · Operasyonel Dönüşüm',
    disciplineEn: 'SportTech · Operational Transformation',
    focusTagTr: 'Kulüp & Kurum Süreç Mimarisi',
    focusTagEn: 'Club & Enterprise Process Grid',
  },
  ai: {
    disciplineTr: 'SportTech · Yapay Zekâ & Veri',
    disciplineEn: 'SportTech · AI & Performance Data',
    focusTagTr: 'Akıllı İş Akışı & Karar Telemetrisi',
    focusTagEn: 'Intelligent Workflow Telemetry',
  },
  'sports-tech': {
    disciplineTr: 'SportTech · Platform Mimarisi',
    disciplineEn: 'SportTech · Platform Architecture',
    focusTagTr: 'Spor Kulübü & Tesis Ekosistemi',
    focusTagEn: 'Club & Facility Systems Model',
  },
  'tech-strategy': {
    disciplineTr: 'SportTech · Teknoloji Stratejisi',
    disciplineEn: 'SportTech · Technology Strategy',
    focusTagTr: 'Uzun Vadeli Değer Yol Haritası',
    focusTagEn: 'Long-Horizon Value Roadmap',
  },
  entrepreneurship: {
    disciplineTr: 'SportTech · Girişim & Ürün',
    disciplineEn: 'SportTech · Venture & Product',
    focusTagTr: 'Saha Odaklı Ürün Geliştirme',
    focusTagEn: 'Field-Driven Venture Trajectory',
  },
  innovation: {
    disciplineTr: 'SportTech · İnovasyon Kültürü',
    disciplineEn: 'SportTech · Innovation Culture',
    focusTagTr: 'Disiplinlerarası Spor Bilişimi',
    focusTagEn: 'Interdisciplinary Sports Informatics',
  },
};

function SportTechDiagram({ categoryKey }: { categoryKey: ArticleCategoryKey }) {
  switch (categoryKey) {
    case 'digital-transformation':
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Tactical Pitch Frame */}
          <rect
            x="16"
            y="18"
            width="208"
            height="144"
            rx="6"
            stroke="#2B5B8C"
            strokeWidth="1.25"
          />
          <line x1="120" y1="18" x2="120" y2="162" stroke="#1E446D" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="120" cy="90" r="24" stroke="#1E446D" strokeWidth="1" />
          {/* Process Transformation Nodes */}
          <path
            d="M44 122 L88 70 L146 98 L194 48"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44 122 H194"
            stroke="#234B75"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <circle cx="44" cy="122" r="5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="88" cy="70" r="5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="146" cy="98" r="5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="194" cy="48" r="6" fill="#38BDF8" />
          <circle cx="194" cy="48" r="11" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="1.25" />
        </svg>
      );

    case 'ai':
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Tactical Zone Grid */}
          <rect x="20" y="20" width="200" height="140" rx="6" stroke="#1E446D" strokeWidth="1" />
          <line x1="86" y1="20" x2="86" y2="160" stroke="#173558" strokeWidth="1" />
          <line x1="154" y1="20" x2="154" y2="160" stroke="#173558" strokeWidth="1" />
          <line x1="20" y1="66" x2="220" y2="66" stroke="#173558" strokeWidth="1" />
          <line x1="20" y1="114" x2="220" y2="114" stroke="#173558" strokeWidth="1" />
          {/* Telemetry & Inference Vectors */}
          <path
            d="M46 50 L114 44 L178 88 L120 134 L54 114 Z"
            fill="#38BDF8"
            fillOpacity="0.08"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          <line x1="114" y1="44" x2="120" y2="134" stroke="#7CB8EB" strokeOpacity="0.45" strokeWidth="1" />
          <line x1="46" y1="50" x2="178" y2="88" stroke="#7CB8EB" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="120" cy="90" r="14" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="46" cy="50" r="4.5" fill="#0A192F" stroke="#7CB8EB" strokeWidth="1.75" />
          <circle cx="114" cy="44" r="4.5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="178" cy="88" r="5.5" fill="#38BDF8" />
          <circle cx="120" cy="134" r="4.5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="54" cy="114" r="4.5" fill="#0A192F" stroke="#7CB8EB" strokeWidth="1.75" />
        </svg>
      );

    case 'sports-tech':
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Stadium & Facility Radar Architecture */}
          <rect x="20" y="22" width="200" height="136" rx="34" stroke="#244E7A" strokeWidth="1.25" />
          <rect x="40" y="38" width="160" height="104" rx="18" stroke="#1B3D63" strokeWidth="1" />
          <line x1="120" y1="22" x2="120" y2="158" stroke="#1E446D" strokeWidth="1" />
          <line x1="20" y1="90" x2="220" y2="90" stroke="#1E446D" strokeWidth="1" />
          <circle cx="120" cy="90" r="36" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="1.25" />
          <circle cx="120" cy="90" r="18" fill="#38BDF8" fillOpacity="0.12" stroke="#38BDF8" strokeWidth="1.75" />
          {/* Penalty / Court Zones */}
          <rect x="40" y="64" width="24" height="52" stroke="#2B5B8C" strokeWidth="1.25" />
          <rect x="176" y="64" width="24" height="52" stroke="#2B5B8C" strokeWidth="1.25" />
          {/* Synchronized Platform Endpoints */}
          <circle cx="64" cy="64" r="4" fill="#38BDF8" />
          <circle cx="176" cy="116" r="4" fill="#38BDF8" />
          <circle cx="120" cy="90" r="4.5" fill="#FFFFFF" />
        </svg>
      );

    case 'tech-strategy':
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Layered Architectural Planes */}
          <path
            d="M36 126 L120 154 L204 126 L120 98 Z"
            fill="#145DA0"
            fillOpacity="0.16"
            stroke="#2B5B8C"
            strokeWidth="1.25"
          />
          <path
            d="M36 94 L120 122 L204 94 L120 66 Z"
            fill="#145DA0"
            fillOpacity="0.24"
            stroke="#5BA4E5"
            strokeWidth="1.25"
          />
          <path
            d="M36 62 L120 90 L204 62 L120 34 Z"
            fill="#38BDF8"
            fillOpacity="0.14"
            stroke="#38BDF8"
            strokeWidth="1.75"
          />
          <line x1="120" y1="34" x2="120" y2="154" stroke="#7CB8EB" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="120" cy="62" r="4.5" fill="#38BDF8" />
        </svg>
      );

    case 'entrepreneurship':
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Field Coordinate Baseline */}
          <line x1="24" y1="146" x2="216" y2="146" stroke="#244E7A" strokeWidth="1.25" />
          <line x1="24" y1="34" x2="24" y2="146" stroke="#244E7A" strokeWidth="1.25" />
          <line x1="24" y1="108" x2="216" y2="108" stroke="#173558" strokeWidth="1" strokeDasharray="3 4" />
          <line x1="24" y1="70" x2="216" y2="70" stroke="#173558" strokeWidth="1" strokeDasharray="3 4" />
          {/* Scaling Venture Arc */}
          <path
            d="M34 136 C78 134, 102 104, 134 84 C162 66, 182 48, 206 38"
            stroke="#38BDF8"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d="M34 136 C78 134, 102 104, 134 84 C162 66, 182 48, 206 38 L206 146 L34 146 Z"
            fill="#38BDF8"
            fillOpacity="0.08"
          />
          <circle cx="72" cy="126" r="4" fill="#0A192F" stroke="#7CB8EB" strokeWidth="1.75" />
          <circle cx="134" cy="84" r="4.5" fill="#0A192F" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="206" cy="38" r="5.5" fill="#38BDF8" />
          <circle cx="206" cy="38" r="11" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="1.25" />
        </svg>
      );

    case 'innovation':
    default:
      return (
        <svg
          viewBox="0 0 240 180"
          fill="none"
          aria-hidden="true"
          className="h-full w-full max-w-[230px]"
        >
          {/* Interdisciplinary Concentric Rings */}
          <circle cx="120" cy="90" r="58" stroke="#1E446D" strokeWidth="1.25" strokeDasharray="4 4" />
          <circle cx="120" cy="90" r="38" stroke="#2B5B8C" strokeWidth="1.25" />
          <circle cx="120" cy="90" r="16" fill="#38BDF8" fillOpacity="0.14" stroke="#38BDF8" strokeWidth="1.75" />
          {/* Cross-Domain Intersections */}
          <line x1="48" y1="90" x2="192" y2="90" stroke="#234B75" strokeWidth="1" />
          <line x1="120" y1="22" x2="120" y2="158" stroke="#234B75" strokeWidth="1" />
          <circle cx="72" cy="58" r="4.5" fill="#0A192F" stroke="#38BDF8" strokeWidth="1.75" />
          <circle cx="168" cy="58" r="4.5" fill="#0A192F" stroke="#7CB8EB" strokeWidth="1.75" />
          <circle cx="168" cy="122" r="4.5" fill="#0A192F" stroke="#38BDF8" strokeWidth="1.75" />
          <circle cx="72" cy="122" r="4.5" fill="#0A192F" stroke="#7CB8EB" strokeWidth="1.75" />
          <circle cx="120" cy="90" r="4.5" fill="#FFFFFF" />
        </svg>
      );
  }
}

export function ArticleSportTechCover({
  article,
  index,
  lang,
}: ArticleSportTechCoverProps) {
  const visualMeta = CATEGORY_VISUAL_META[article.categoryKey];
  const disciplineLabel =
    lang === 'tr' ? visualMeta.disciplineTr : visualMeta.disciplineEn;
  const focusTag = lang === 'tr' ? visualMeta.focusTagTr : visualMeta.focusTagEn;
  const trackNum = String(index + 1).padStart(2, '0');
  const brandTrackLabel =
    lang === 'tr'
      ? 'Spor Teknolojileri & Strateji'
      : 'Sports Technology & Strategy';

  return (
    <figure
      className="relative overflow-hidden rounded-lg border border-[#193A61] bg-[#09192E] p-6 sm:p-8 lg:p-10"
      aria-label={article.coverAlt}
    >
      {/* Fixed Architectural Coordinate Grid Background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`sporttech-grid-${article.categoryKey}`}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#sporttech-grid-${article.categoryKey})`}
        />
      </svg>

      {/* Subtle Sapphire Radial Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#38BDF8]/[0.12] blur-3xl"
      />

      <div className="relative z-10 flex flex-col justify-between gap-7">
        {/* Top Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-[#193A61] pb-4 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#38BDF8] tabular-nums">
              {trackNum}
            </span>
            <span aria-hidden="true" className="text-[#4B6E91]">
              ·
            </span>
            <span className="font-medium text-[#DCEAF8]">{article.category}</span>
          </div>
          <span className="text-[11.5px] font-medium text-[#7CB8EB]">
            {disciplineLabel}
          </span>
        </div>

        {/* Main Title + SportTech Vector Panel */}
        <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-[1fr_220px] md:gap-8">
          <div className="space-y-3">
            <p className="text-[13px] font-medium text-[#7CB8EB]">{focusTag}</p>
            <p className="max-w-[500px] text-[clamp(1.3rem,2.4vw,1.85rem)] font-bold leading-[1.24] tracking-[-0.02em] text-white [text-wrap:balance]">
              {article.title}
            </p>
          </div>

          <div className="flex items-center justify-center py-1">
            <SportTechDiagram categoryKey={article.categoryKey} />
          </div>
        </div>

        {/* Bottom Signature Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#193A61] pt-4 text-[12px] text-[#8AA7C4]">
          <span className="font-medium text-[#C5DAEE]">Selman Utku · selmanutku.com</span>
          <span>{brandTrackLabel}</span>
        </div>
      </div>

      <figcaption className="sr-only">{article.coverAlt}</figcaption>
    </figure>
  );
}
