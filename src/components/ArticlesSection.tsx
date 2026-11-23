import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  getArticleCategories,
  type ArticleCategoryKey,
} from '../data/articles';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { useAllArticles } from '../lib/researchStore';
import { getArticlePath, getSectionId } from '../lib/routes';

interface ArticlesSectionProps {
  onNavigate: (to: string) => void;
}

type CategoryFilter = 'all' | ArticleCategoryKey;

export function ArticlesSection({ onNavigate }: ArticlesSectionProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].articles;
  const categories = getArticleCategories(lang);
  const { articles: researchItems } = useAllArticles(lang);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredItems =
    activeCategory === 'all'
      ? researchItems
      : researchItems.filter((item) => item.categoryKey === activeCategory);

  const filterTabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: copy.allFilter },
    ...categories,
  ];

  return (
    <section
      id={getSectionId('research', lang)}
      aria-labelledby="articles-heading"
      className="border-t border-[#DCE7F2] bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
          <p className="text-[12px] font-semibold tracking-wider text-[#145DA0] tabular-nums">05</p>
          <h2
            id="articles-heading"
            className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
          >
            {copy.heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
            {copy.lead}
          </p>
        </div>

        {/* Research Topic Filter Bar */}
        <div
          role="tablist"
          aria-label={copy.filterAria}
          className="mt-10 flex flex-wrap items-center justify-center gap-1.5 border-b border-[#DCE7F2] pb-4 md:justify-start"
        >
          {filterTabs.map((tab) => {
            const isSelected = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(tab.key)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-150 ${
                  isSelected
                    ? 'bg-[#0C2340] text-white'
                    : 'bg-transparent text-[#4B6075] hover:bg-[#F0F6FC] hover:text-[#0A192F]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Concise Research Topics & Briefs Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => {
            const orderNum = String(
              researchItems.findIndex((r) => r.slug === item.slug) + 1 || idx + 1,
            ).padStart(2, '0');

            return (
              <article
                key={item.slug}
                className="group flex flex-col justify-between rounded-lg border border-[#DCE7F2] bg-[#FAFDFE] p-6 transition-colors duration-150 hover:border-[#94BBE0] hover:bg-white lg:p-7"
              >
                <a
                  href={getArticlePath(item.slug, lang)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(getArticlePath(item.slug, lang));
                  }}
                  className="flex h-full flex-col justify-between text-center focus:outline-none sm:text-left"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-[12.5px] sm:justify-start">
                      <span className="font-semibold text-[#145DA0] tabular-nums">
                        {orderNum}
                      </span>
                      <span aria-hidden="true" className="text-[#9AB4CD]">
                        ·
                      </span>
                      <span className="font-medium text-[#145DA0]">{item.category}</span>
                    </div>

                    <h3 className="mt-3 text-[18px] font-semibold leading-[1.35] tracking-[-0.015em] text-[#0A192F] transition-colors group-hover:text-[#145DA0]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[14px] leading-[1.65] text-[#465B71]">
                      {item.excerpt}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-[#E6EFF7] pt-4 text-left">
                      {item.keyTakeaways.slice(0, 2).map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-[#33485E]"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#145DA0]"
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 inline-flex items-center justify-center gap-2 text-[13px] font-medium text-[#0C2340] transition-colors group-hover:text-[#145DA0] sm:justify-start">
                    <span>{copy.readMore}</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
