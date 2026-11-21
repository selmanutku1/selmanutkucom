import { getExperiences } from '../data/experience';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { getSectionId } from '../lib/routes';

export function ExperienceSection() {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].experience;
  const experiences = getExperiences(lang);

  return (
    <section
      id={getSectionId('experience', lang)}
      aria-labelledby="experience-heading"
      className="border-t border-[#DCE7F2] bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
          <p className="text-[12px] font-semibold tracking-wider text-[#145DA0] tabular-nums">03</p>
          <h2
            id="experience-heading"
            className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
          >
            {copy.heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#465B71]">
            {copy.lead}
          </p>
        </div>

        {/* Chronological Vertical Timeline */}
        <div className="relative mt-14">
          {/* Subtle vertical hairline rail */}
          <div
            className="absolute bottom-0 left-[7px] top-2 w-px bg-[#D6E4F0] md:left-[188px]"
            aria-hidden="true"
          />

          <div className="space-y-14">
            {experiences.map((exp, idx) => (
              <article
                key={exp.id}
                className="relative grid grid-cols-1 gap-4 pl-8 md:grid-cols-[164px_1fr] md:gap-12 md:pl-0"
              >
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-[3px] top-[7px] h-[9px] w-[9px] rounded-full border md:left-[184px] ${
                    idx === 0
                      ? 'border-[#145DA0] bg-[#145DA0]'
                      : 'border-[#8FAAC4] bg-white'
                  }`}
                />

                {/* Left Date & Location Column */}
                <div className="md:pr-4 md:text-right">
                  <p className="text-[13px] font-semibold text-[#0A192F] tabular-nums">
                    {exp.period}
                  </p>
                  <p className="mt-1 text-[13px] text-[#5B7086]">{exp.location}</p>
                </div>

                {/* Right Structured Experience Content */}
                <div className="border-b border-[#E4EDF6] pb-12 last:border-b-0 md:pl-6">
                  <div className="flex flex-col gap-1">
                    {exp.organization && (
                      <p className="text-[14px] font-medium text-[#4B6075]">
                        {exp.organization}
                      </p>
                    )}
                    <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                      {exp.role}
                    </h3>
                  </div>

                  <p className="mt-4 max-w-[68ch] text-[15.5px] leading-[1.7] text-[#33485E]">
                    {exp.summary}
                  </p>

                  <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-[#0A192F]">
                        {copy.responsibilities}
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {exp.responsibilities.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-[#465B71]"
                          >
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7FA0BF]"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[13.5px] font-semibold text-[#0A192F]">
                          {copy.highlights}
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {exp.highlights.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-[#465B71]"
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#145DA0]"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-[#EAF1F8] pt-5">
                        <h4 className="text-[13.5px] font-semibold text-[#0A192F]">
                          {copy.deliverables}
                        </h4>
                        <ul className="mt-2.5 space-y-1.5">
                          {exp.deliverables.map((item, i) => (
                            <li
                              key={i}
                              className="text-[14px] leading-[1.6] text-[#2C4157]"
                            >
                              — {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
