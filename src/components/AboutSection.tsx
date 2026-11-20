import { ArrowUpRight } from 'lucide-react';
import { getProfileContent } from '../data/profile';
import { UI_COPY, useLanguage } from '../lib/i18n';
import { getSectionId } from '../lib/routes';

export function AboutSection() {
  const { lang } = useLanguage();
  const about = getProfileContent(lang).about;
  const copy = UI_COPY[lang].about;

  return (
    <section
      id={getSectionId('about', lang)}
      aria-labelledby="about-heading"
      className="border-t border-[#DCE7F2] bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Sticky Header Column */}
          <div className="text-center lg:col-span-4 lg:text-left">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[12px] text-[#145DA0] tabular-nums">01</p>
              <h2
                id="about-heading"
                className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#0A192F] lg:text-[38px]"
              >
                {about.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-[#465B71] lg:mx-0">
                {about.lead}
              </p>
            </div>
          </div>

          {/* Right Editorial Narrative Column */}
          <div className="space-y-14 text-center md:text-left lg:col-span-8">
            {/* 1. Profesyonel Profil */}
            <div className="space-y-4">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.profileTitle}
              </h3>
              <div className="space-y-4 text-[15.5px] leading-[1.75] text-[#33485E]">
                {about.professionalProfile.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 2. Kariyer Yolculuğum */}
            <div className="border-t border-[#DCE7F2] pt-10">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.careerTitle}
              </h3>
              <div className="mt-6 divide-y divide-[#E4EDF6]">
                {about.careerJourney.map((step, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-6"
                  >
                    <div className="md:col-span-5">
                      {step.organization ? (
                        <>
                          <p className="text-[15px] font-semibold text-[#0A192F]">
                            {step.organization}
                          </p>
                          <p className="mt-0.5 text-[13.5px] text-[#4B6075]">
                            {step.role}
                          </p>
                        </>
                      ) : (
                        <p className="text-[15px] font-semibold text-[#0A192F]">
                          {step.role}
                        </p>
                      )}
                      {step.websiteUrl && step.websiteLabel && (
                        <a
                          href={step.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-medium text-[#145DA0] transition-colors hover:text-[#0C2340]"
                        >
                          <span>{step.websiteLabel}</span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                    <p className="text-[14.5px] leading-[1.7] text-[#465B71] md:col-span-7">
                      {step.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Eğitim Geçmişim */}
            <div className="border-t border-[#DCE7F2] pt-10">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.educationTitle}
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {about.education.map((edu, idx) => (
                  <div key={idx} className="space-y-2 border-t border-[#DCE7F2] pt-5">
                    <p className="text-[13px] text-[#5B7086]">
                      {edu.institution} · {edu.degree}
                    </p>
                    <h4 className="text-[16.5px] font-semibold text-[#0A192F]">
                      {edu.program}
                    </h4>
                    <p className="text-[14.5px] leading-[1.65] text-[#465B71]">
                      {edu.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Üyelikler ve Profesyonel Ağlar */}
            <div className="border-t border-[#DCE7F2] pt-10">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.affiliationsTitle}
              </h3>
              <div className="mt-6 space-y-6">
                {about.affiliations.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-center gap-x-2 text-[15px] md:justify-start">
                      <span className="font-semibold text-[#0A192F]">
                        {item.organization}
                      </span>
                      <span className="text-[#8FA4BA]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[13.5px] text-[#4B6075]">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-[14.5px] leading-[1.65] text-[#465B71]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Vizyon ve Yaklaşım */}
            <div className="border-t border-[#DCE7F2] pt-10">
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#0A192F]">
                {copy.visionTitle}
              </h3>
              <p className="mt-4 rounded-lg border border-[#DDEAF6] bg-[#F3F8FC] p-6 text-[16px] leading-[1.75] text-[#1C3147] lg:p-8">
                {about.visionAndApproach}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
