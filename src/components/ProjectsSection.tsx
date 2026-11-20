import { ArrowUpRight } from 'lucide-react';
import { getProjects } from '../data/projects';
import { UI_COPY, useLanguage } from '../lib/i18n';

interface ProjectsSectionProps {
  onNavigate: (to: string) => void;
}

export function ProjectsSection({ onNavigate }: ProjectsSectionProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].projects;
  const projects = getProjects(lang);

  return (
    <section
      id="projeler"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden border-t border-[#DCE7F2] bg-[#F3F8FC] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#38BDF8]/[0.09] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:items-end md:text-left">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] text-[#145DA0] tabular-nums">04</p>
            <h2
              id="projects-heading"
              className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
            >
              {copy.heading}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
              {copy.lead}
            </p>
          </div>
          <p className="font-mono text-[12.5px] text-[#5B7086] tabular-nums">
            {projects.length} {copy.countSuffix}
          </p>
        </div>

        {/* 3-Column Monochrome Logo Portfolio Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#DCE7F2] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#94BBE0]"
            >
              <a
                href={`/projeler/${project.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/projeler/${project.slug}`);
                }}
                className="flex h-full flex-col focus:outline-none"
              >
                {/* Clean Monochrome Brand Logo Stage */}
                <div className="flex h-48 items-center justify-center border-b border-[#EAF1F8] bg-white px-8 py-7 lg:h-52">
                  <img
                    src={project.coverImage}
                    alt={project.coverAlt}
                    loading="lazy"
                    decoding="async"
                    className="max-h-28 w-auto max-w-[74%] object-contain grayscale contrast-125 transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-7 text-center sm:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12.5px] text-[#5B7086] sm:justify-between">
                      <span className="font-mono text-[#145DA0] tabular-nums">
                        {project.index}
                      </span>
                      <span className="font-mono tabular-nums">{project.year}</span>
                    </div>

                    <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#0A192F]">
                      {project.title}
                    </h3>

                    <p className="mt-1.5 text-[12.5px] font-medium text-[#145DA0]">
                      {project.category}
                    </p>

                    <p className="mt-3.5 text-[14.5px] leading-[1.7] text-[#465B71]">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#EAF1F8] pt-5 sm:justify-between">
                    <span className="text-[13.5px] font-medium text-[#0C2340] transition-colors group-hover:text-[#145DA0]">
                      {copy.viewDetail}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-[#4B6075] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#145DA0]"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
