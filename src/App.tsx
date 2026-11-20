import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ExpertiseSection } from './components/ExpertiseSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ArticlesSection } from './components/ArticlesSection';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { AcademicSection } from './components/AcademicSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { getProjectBySlug } from './data/projects';
import { getArticleBySlug } from './data/articles';
import { SITE_CONFIG } from './data/profile';
import { initAnalytics, trackPageView } from './lib/analytics';
import { LanguageProvider, UI_COPY, useLanguage } from './lib/i18n';
import { useRouter } from './lib/router';
import { useDocumentSEO } from './lib/seo';

const SECTION_IDS = [
  'ana-sayfa',
  'hakkimda',
  'uzmanlik',
  'deneyim',
  'projeler',
  'yazilar',
  'akademik',
  'iletisim',
];

function HomePage({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { lang } = useLanguage();
  const seo = UI_COPY[lang].seo;

  const homeJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: seo.homeTitle,
      url: SITE_CONFIG.siteUrl,
      inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
      description: seo.homeDesc,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.siteUrl}${SITE_CONFIG.ogImage}`,
        width: SITE_CONFIG.ogImageWidth,
        height: SITE_CONFIG.ogImageHeight,
      },
      mainEntity: {
        '@id': `${SITE_CONFIG.siteUrl}/#person`,
      },
    }),
    [lang, seo.homeDesc, seo.homeTitle],
  );

  useDocumentSEO({
    title: seo.homeTitle,
    description: seo.homeDesc,
    path: '/',
    type: 'profile',
    lang,
    image: SITE_CONFIG.ogImage,
    imageAlt:
      lang === 'tr'
        ? 'Selman Utku – Dijital Dönüşüm, İnovasyon ve Spor Teknolojileri'
        : 'Selman Utku – Digital Transformation, Innovation & Sports Technology',
    jsonLd: homeJsonLd,
  });

  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <AboutSection />
      <ExpertiseSection />
      <ExperienceSection />
      <ProjectsSection onNavigate={onNavigate} />
      <ArticlesSection onNavigate={onNavigate} />
      <AcademicSection />
      <ContactSection />
    </>
  );
}

function NotFoundView({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].notFound;

  useDocumentSEO({
    title: copy.seoTitle,
    description: copy.seoDesc,
    path: '/',
    lang,
    noIndex: true,
  });

  return (
    <section className="mx-auto max-w-[720px] px-6 py-28 text-center lg:px-8">
      <p className="font-mono text-[13px] text-[#145DA0] tabular-nums">404</p>
      <h1 className="mt-3 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F]">
        {copy.heading}
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
        {copy.text}
      </p>
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0C2340] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#143966]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        <span>{copy.cta}</span>
      </button>
    </section>
  );
}

function AppShell() {
  const { lang } = useLanguage();
  const { route, navigate } = useRouter();
  const [activeSection, setActiveSection] = useState<string>('ana-sayfa');

  useEffect(() => {
    initAnalytics();
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    if (route.type === 'project') {
      setActiveSection('projeler');
      return;
    }
    if (route.type === 'article') {
      setActiveSection('yazilar');
      return;
    }

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route]);

  const renderMainContent = () => {
    if (route.type === 'project') {
      const project = getProjectBySlug(route.slug, lang);
      return project ? (
        <ProjectDetailPage project={project} onNavigate={navigate} />
      ) : (
        <NotFoundView onNavigate={navigate} />
      );
    }

    if (route.type === 'article') {
      const article = getArticleBySlug(route.slug, lang);
      return article ? (
        <ArticleDetailPage article={article} onNavigate={navigate} />
      ) : (
        <NotFoundView onNavigate={navigate} />
      );
    }

    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0A192F]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#0C2340] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {UI_COPY[lang].skipToContent}
      </a>

      <Navbar onNavigate={navigate} activeSection={activeSection} />

      <main id="main-content" className="flex-1">
        {renderMainContent()}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
