import { Activity, Compass, Cpu, Workflow } from 'lucide-react';
import { getExpertiseAreas, type ExpertiseIconKey } from '../data/expertise';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { getSectionId } from '../lib/routes';

function ExpertiseIcon({ icon }: { icon: ExpertiseIconKey }) {
  const props = { className: 'h-5 w-5 text-[#0C2340]', strokeWidth: 1.6, 'aria-hidden': true as const };
  switch (icon) {
    case 'workflow':
      return <Workflow {...props} />;
    case 'cpu':
      return <Cpu {...props} />;
    case 'activity':
      return <Activity {...props} />;
    case 'compass':
      return <Compass {...props} />;
  }
}

export function ExpertiseSection() {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].expertise;
  const areas = getExpertiseAreas(lang);

  return (
    <section
      id={getSectionId('expertise', lang)}
      aria-labelledby="expertise-heading"
      className="relative overflow-hidden border-t border-[#DCE7F2] bg-[#F3F8FC] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#38BDF8]/[0.09] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
          <p className="font-mono text-[12px] text-[#145DA0] tabular-nums">02</p>
          <h2
            id="expertise-heading"
            className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
          >
            {copy.heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
            {copy.lead}
          </p>
        </div>

        {/* 2x2 Architectural Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {areas.map((area) => (
            <article
              key={area.id}
              className="group flex flex-col justify-between rounded-lg border border-[#DCE7F2] bg-white/90 p-8 text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#94BBE0] sm:text-left"
            >
              <div>
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#D8E6F3] bg-[#F3F8FC] transition-colors duration-200 group-hover:border-[#0C2340] group-hover:bg-[#0C2340] group-hover:[&_svg]:text-white">
                    <ExpertiseIcon icon={area.icon} />
                  </div>
                  <span className="font-mono text-[12px] text-[#7D95AE] tabular-nums">
                    {area.index}
                  </span>
                </div>

                <h3 className="mt-7 text-[21px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                  {area.title}
                </h3>

                <p className="mt-3 text-[15px] leading-[1.7] text-[#465B71]">
                  {area.description}
                </p>
              </div>

              <ul className="mt-7 grid grid-cols-1 gap-2.5 border-t border-[#EAF1F8] pt-6 sm:grid-cols-2">
                {area.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-center justify-center gap-2.5 text-[14px] text-[#1E3248] sm:justify-start"
                  >
                    <span
                      className="h-1 w-1 shrink-0 rounded-full bg-[#145DA0]/60"
                      aria-hidden="true"
                    />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
