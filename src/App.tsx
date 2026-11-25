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
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { MessagesInboxPage } from './components/MessagesInboxPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { getProjectBySlug } from './data/projects';
import { SITE_CONFIG } from './data/profile';
import { buildHomeProfileSchema } from './data/schema';
import { initAnalytics, trackPageView } from './lib/analytics';
import { LanguageProvider, UI_COPY, useLanguage } from './lib/i18n';
import { ResearchProvider, useArticleBySlug } from './lib/researchStore';
import { useRouter } from './lib/router';
import {
  getHomePath,
  getSectionId,
  SECTION_KEYS,
  type SectionKey,
} from './lib/routes';
import { useDocumentSEO } from './lib/seo';

function HomePage({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { lang } = useLanguage();
  const seo = UI_COPY[lang].seo;
  const homePath = getHomePath(lang);

  const homeJsonLd = useMemo(
    () =>
      buildHomeProfileSchema({
        siteUrl: SITE_CONFIG.siteUrl,
        lang,
        title: seo.homeTitle,
        description: seo.homeDesc,
        homePath,
        ogImage: SITE_CONFIG.ogImage,
        ogImageWidth: SITE_CONFIG.ogImageWidth,
        ogImageHeight: SITE_CONFIG.ogImageHeight,
      }),
    [lang, homePath, seo.homeDesc, seo.homeTitle],
  );

  useDocumentSEO({
    title: seo.homeTitle,
    description: seo.homeDesc,
    path: homePath,
    type: 'profile',
    lang,
    image: SITE_CONFIG.ogImage,
    imageAlt:
      lang === 'tr'
        ? 'Selman Utku – Dijital Dönüşüm, İnovasyon ve Spor Teknolojileri'
        : 'Selman Utku – Digital Transformation, Innovation & Sports Technology',
    alternatePaths: {
      en: '/',
      tr: '/tr',
    },
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
  const homePath = getHomePath(lang);

  useDocumentSEO({
    title: copy.seoTitle,
    description: copy.seoDesc,
    path: homePath,
    lang,
    noIndex: true,
  });

  return (
    <section className="mx-auto max-w-[720px] px-6 py-28 text-center lg:px-8">
      <p className="text-[13px] font-semibold tracking-wider text-[#145DA0] tabular-nums">404</p>
      <h1 className="mt-3 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F]">
        {copy.heading}
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
        {copy.text}
      </p>
      <button
        type="button"
        onClick={() => onNavigate(homePath)}
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
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const activeArticleSlug = route.type === 'article' ? route.slug : '';
  const { article: resolvedArticle, loading: loadingArticles } = useArticleBySlug(
    activeArticleSlug,
    lang,
  );

  useEffect(() => {
    initAnalytics();
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    if (route.type === 'project') {
      setActiveSection('projects');
      return;
    }
    if (route.type === 'article') {
      setActiveSection('research');
      return;
    }
    if (route.type === 'messages') {
      setActiveSection('contact');
      return;
    }

    const idToKey = new Map<string, SectionKey>();
    const elements: HTMLElement[] = [];
    for (const key of SECTION_KEYS) {
      const domId = getSectionId(key, lang);
      idToKey.set(domId, key);
      const el = document.getElementById(domId);
      if (el) elements.push(el);
    }
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topId = visible[0]?.target.id;
        if (topId) {
          const matchedKey = idToKey.get(topId);
          if (matchedKey) setActiveSection(matchedKey);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route, lang]);

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
      if (resolvedArticle) {
        return <ArticleDetailPage article={resolvedArticle} onNavigate={navigate} />;
      }
      if (loadingArticles) {
        return (
          <section className="mx-auto max-w-[720px] px-6 py-28 text-center lg:px-8">
            <p className="text-[14.5px] text-[#5B7086]">
              {lang === 'tr' ? 'İçerik yükleniyor...' : 'Loading research brief...'}
            </p>
          </section>
        );
      }
      return <NotFoundView onNavigate={navigate} />;
    }

    if (route.type === 'messages') {
      return (
        <ErrorBoundary>
          <MessagesInboxPage onNavigate={navigate} />
        </ErrorBoundary>
      );
    }

    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-[#0A192F] lg:pb-0">
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
      <MobileBottomNav onNavigate={navigate} activeSection={activeSection} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ResearchProvider>
        <AppShell />
      </ResearchProvider>
    </LanguageProvider>
  );
}
