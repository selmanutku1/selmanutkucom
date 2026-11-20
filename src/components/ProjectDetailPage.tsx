import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from 'lucide-react';
import { getProjects, type ProjectItem, type ProjectScreenshot } from '../data/projects';
import { SITE_CONFIG } from '../data/profile';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { useDocumentSEO } from '../lib/seo';
import { MediaFrame } from './MediaFrame';

interface ProjectDetailPageProps {
  project: ProjectItem;
  onNavigate: (to: string) => void;
}

export function ProjectDetailPage({ project, onNavigate }: ProjectDetailPageProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].projects;
  const allProjects = getProjects(lang);
  const [lightboxImage, setLightboxImage] = useState<ProjectScreenshot | null>(null);

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.seoDescription,
          inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
          genre: project.category,
          keywords: project.technologies.join(', '),
          image: project.coverImage.startsWith('http')
            ? project.coverImage
            : `${SITE_CONFIG.siteUrl}${project.coverImage.startsWith('/') ? '' : '/'}${project.coverImage}`,
          author: {
            '@id': `${SITE_CONFIG.siteUrl}/#person`,
          },
          url: `${SITE_CONFIG.siteUrl}/projeler/${project.slug}`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: lang === 'tr' ? 'Ana Sayfa' : 'Home',
              item: `${SITE_CONFIG.siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: lang === 'tr' ? 'Projeler' : 'Projects',
              item: `${SITE_CONFIG.siteUrl}/#projeler`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: project.title,
              item: `${SITE_CONFIG.siteUrl}/projeler/${project.slug}`,
            },
          ],
        },
      ],
    }),
    [project, lang],
  );

  useDocumentSEO({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/projeler/${project.slug}`,
    type: 'website',
    lang,
    image: project.coverImage,
    imageAlt: project.coverAlt,
    jsonLd,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <article className="relative overflow-hidden bg-white pb-24 pt-10 lg:pb-32 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#38BDF8]/[0.1] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1040px] px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate('#projeler')}
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#4B6075] transition-colors hover:text-[#145DA0]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span>{copy.backToAll}</span>
        </button>

        {/* Header */}
        <header className="mt-8 border-b border-[#DCE7F2] pb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#5B7086]">
            <span className="font-mono text-[#145DA0] tabular-nums">
              {copy.projectLabel} {project.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{project.year}</span>
          </div>

          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#0A192F]">
            {project.title}
          </h1>

          <p className="mt-5 max-w-[68ch] text-[18px] leading-[1.7] text-[#465B71]">
            {project.shortDescription}
          </p>
        </header>

        {/* Monochrome Brand Logo Stage */}
        <div className="mt-10 flex h-56 items-center justify-center rounded-lg border border-[#DCE7F2] bg-white px-8 py-10 sm:h-64">
          <img
            src={project.coverImage}
            alt={project.coverAlt}
            className="max-h-36 w-auto max-w-[75%] object-contain grayscale contrast-125 sm:max-h-40"
          />
        </div>

        {/* Structured Case Study Content */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-8">
            <section aria-labelledby="project-overview">
              <h2
                id="project-overview"
                className="text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]"
              >
                {copy.overview}
              </h2>
              <p className="mt-4 text-[16px] leading-[1.8] text-[#33485E]">
                {project.overview}
              </p>
            </section>

            <section
              aria-labelledby="project-problem"
              className="border-t border-[#DCE7F2] pt-10"
            >
              <h2
                id="project-problem"
                className="text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]"
              >
                {copy.problem}
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] leading-[1.75] text-[#33485E]">
                {project.problemAndNeed.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="project-solution"
              className="border-t border-[#DCE7F2] pt-10"
            >
              <h2
                id="project-solution"
                className="text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]"
              >
                {copy.solution}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {project.solutionDeveloped.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15.5px] leading-[1.7] text-[#33485E]"
                  >
                    <span className="mt-1 font-mono text-[12px] text-[#145DA0] tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="project-outcomes"
              className="border-t border-[#DCE7F2] pt-10"
            >
              <h2
                id="project-outcomes"
                className="text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]"
              >
                {copy.outcomes}
              </h2>
              <ul className="mt-5 space-y-3">
                {project.outcomes.map((outcome, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15.5px] leading-[1.7] text-[#1E3248]"
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#145DA0]"
                      aria-hidden="true"
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Metadata Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-lg border border-[#DCE7F2] bg-[#F3F8FC] p-7">
              <h2 className="text-[14px] font-semibold text-[#0A192F]">
                {copy.technologies}
              </h2>
              <ul className="mt-4 divide-y divide-[#DFEAF5]">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="py-2.5 text-[14px] text-[#33485E] first:pt-0 last:pb-0"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {project.projectUrl && (
                <div className="mt-7 border-t border-[#DCE7F2] pt-6">
                  {project.projectUrl.startsWith('http') ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0C2340] px-5 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-[#143966]"
                    >
                      <span>{project.projectUrlLabel || copy.projectLinkFallback}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate(project.projectUrl || '#iletisim')}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0C2340] px-5 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-[#143966]"
                    >
                      <span>{project.projectUrlLabel || copy.projectLinkFallback}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Screenshots (shown only when available) */}
        {project.screenshots.length > 0 && (
          <section
            aria-labelledby="project-screenshots"
            className="mt-16 border-t border-[#DCE7F2] pt-12"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2
                id="project-screenshots"
                className="text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]"
              >
                {copy.screenshots}
              </h2>
              <span className="text-[13px] text-[#5B7086]">{copy.zoomHint}</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {project.screenshots.map((shot, idx) => (
                <figure key={idx} className="group">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(shot)}
                    className="relative block w-full overflow-hidden rounded-lg border border-[#DCE7F2] text-left focus:outline-none"
                  >
                    <MediaFrame
                      src={shot.src}
                      alt={shot.alt}
                      aspectClass="aspect-[4/3]"
                      imgClassName="group-hover:scale-[1.02]"
                      fallbackTitle={shot.caption}
                    />
                    <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/95 text-[#0A192F] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </button>
                  <figcaption className="mt-3 text-[13.5px] leading-[1.55] text-[#465B71]">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Next Project Navigation */}
        {nextProject && (
          <div className="mt-16 border-t border-[#DCE7F2] pt-10">
            <button
              type="button"
              onClick={() => onNavigate(`/projeler/${nextProject.slug}`)}
              className="group flex w-full items-center justify-between gap-4 rounded-lg border border-[#DCE7F2] bg-[#F3F8FC] p-6 text-left transition-colors hover:border-[#94BBE0] hover:bg-white lg:p-8"
            >
              <div>
                <span className="text-[12.5px] text-[#5B7086]">{copy.nextProject}</span>
                <p className="mt-1 text-[20px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight
                className="h-5 w-5 text-[#145DA0] transition-transform duration-150 group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071324]/92 p-6 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label={copy.closeImage}
              className="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <div className="overflow-hidden rounded-lg bg-[#0A192F]">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <p className="mt-4 text-center text-[14px] text-[#C8DAEC]">
              {lightboxImage.caption}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
